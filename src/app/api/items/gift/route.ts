export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { logUserAction } from '@/lib/user-action-log'
import { getActivePlan } from '@/lib/plans'
import { getLocale, getMessages } from '@/i18n/server'
import { fmt } from '@/i18n/fmt'
import { localizedText } from '@/lib/content-i18n'
import { spendPoints, refundPoints, type Spend } from '@/lib/points'
import { getOrCreateConversation } from '@/lib/conversations'

// POST /api/items/gift - 持ち物のアイテムをキャラに贈る（1個消費・会話に記録・好感度アップ）
// buy: true なら、持っていないときはその場でポイントで買って贈る（キャラのおねだりから1タップで贈る用）
// キャラの返事は呼び出し側が /api/chat/ai-reply で取得する
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { itemId, characterId, buy } = await req.json().catch(() => ({}))
  if (!itemId || !characterId) return NextResponse.json({ error: 'itemId and characterId required' }, { status: 400 })

  const m = getMessages()
  const db = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const [{ data: userItem }, { data: profile }, { data: existingConv }] = await Promise.all([
    db.from('user_items').select('id, quantity, item:items(*)').eq('user_id', user.id).eq('item_id', itemId).maybeSingle(),
    db.from('profiles').select('subscription_status, subscription_plan, subscription_period_end').eq('id', user.id).single(),
    db.from('conversations').select('id').eq('user_id', user.id).eq('character_id', characterId).maybeSingle(),
  ])
  const owned = !!userItem && userItem.quantity > 0
  let item = (userItem as any)?.item
  let spent: Extract<Spend, { ok: true }> | null = null

  if (owned) {
    if (!item?.is_active) return NextResponse.json({ error: m.api.itemNotFound }, { status: 404 })
    // 読み取った数量を条件に減らして二重使用を防ぐ
    const { data: dec } = await db.from('user_items')
      .update({ quantity: userItem.quantity - 1 })
      .eq('id', userItem.id).eq('quantity', userItem.quantity)
      .select('id')
    if (!dec?.length) return NextResponse.json({ error: m.api.tryAgain }, { status: 409 })
  } else if (buy) {
    const { data: it } = await db.from('items').select('*').eq('id', itemId).eq('is_active', true).maybeSingle()
    if (!it) return NextResponse.json({ error: m.api.itemNotFound }, { status: 404 })
    item = it
    const spend = await spendPoints(db, user.id, it.price_points, `アイテム購入: ${it.name}`)
    if (!spend.ok) {
      if (spend.status === 402) {
        await logUserAction(db, user.id, 'points_shortage', { context: 'gift', title: it.name, current: spend.body.current, required: spend.body.required })
      }
      return NextResponse.json(spend.body, { status: spend.status })
    }
    spent = spend
    await logUserAction(db, user.id, 'item_purchase', { title: it.name, cost: it.price_points, via: 'wish' })
  } else {
    return NextResponse.json({ error: m.api.itemNotFound }, { status: 404 })
  }

  let conversationId = existingConv?.id as string | undefined
  if (!conversationId) {
    const conv = await getOrCreateConversation(db, user.id, characterId, { last_message_at: new Date().toISOString() })
    conversationId = conv?.id
  }

  const itemName = localizedText(item, getLocale(), ['name']).name as string
  const { data: msg } = conversationId ? await db.from('messages').insert({
    conversation_id: conversationId,
    sender_role: 'user',
    content: fmt(m.gift.sentMessage, { item: itemName }),
    points_used: 0,
    metadata: { item_id: item.id, item_name: itemName, item_image_url: item.image_url },
  }).select().single() : { data: null }

  if (!msg) {
    if (owned) await db.from('user_items').update({ quantity: userItem!.quantity }).eq('id', userItem!.id)
    if (spent) await refundPoints(db, user.id, spent, `プレゼント送信失敗による返却: ${item.name}`)
    return NextResponse.json({ error: m.api.sendFailed }, { status: 500 })
  }

  const multiplier = getActivePlan(profile)?.affection_multiplier ?? 1
  const gained = (item.affection_points ?? 0) * multiplier
  const { data: affection } = await db.rpc('add_affection', { p_user_id: user.id, p_character_id: characterId, p_points: gained })
  await db.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversationId)
  await logUserAction(db, user.id, 'item_use', { title: item.name, affection: gained })

  return NextResponse.json({
    message: msg, conversationId, affectionGained: gained, affection,
    remainingQuantity: owned ? userItem!.quantity - 1 : 0,
    points: spent ? spent.points + spent.bonus_points : undefined,
  })
}
