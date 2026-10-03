export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'

// POST /api/items/use - アイテムをチャットで使用（1回消費 + メッセージ送信）
// 書き込みはサーバー権限で行う（ユーザー権限では user_items / ユーザーメッセージを書けない）
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId, conversationId } = await req.json().catch(() => ({}))
  if (!itemId || !conversationId) {
    return NextResponse.json({ error: 'itemId and conversationId required' }, { status: 400 })
  }

  const db = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { data: conv } = await db.from('conversations').select('user_id').eq('id', conversationId).single()
  if (!conv || conv.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // インベントリ確認
  const { data: userItem } = await db
    .from('user_items')
    .select('*, item:items(*)')
    .eq('user_id', user.id)
    .eq('item_id', itemId)
    .single()

  if (!userItem || userItem.quantity <= 0) {
    return NextResponse.json({ error: 'アイテムが見つかりません' }, { status: 404 })
  }

  // 数量を減らす（読み取った数量を条件にして二重使用を防ぐ）
  const { data: dec } = await db
    .from('user_items')
    .update({ quantity: userItem.quantity - 1 })
    .eq('id', userItem.id)
    .eq('quantity', userItem.quantity)
    .select('id')
  if (!dec?.length) return NextResponse.json({ error: 'もう一度お試しください' }, { status: 409 })

  const item = userItem.item

  // チャットにメッセージとして送信（アイテム使用）
  const { data: msg } = await db
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_role: 'user',
      content: `${item.name}を贈りました`,
      points_used: 0,
      metadata: {
        item_id: item.id,
        item_name: item.name,
        item_image_url: item.image_url,
      },
    })
    .select()
    .single()

  if (!msg) {
    await db.from('user_items').update({ quantity: userItem.quantity }).eq('id', userItem.id)
    return NextResponse.json({ error: 'メッセージ送信失敗' }, { status: 500 })
  }

  await db
    .from('conversations')
    .update({ last_message_at: new Date().toISOString(), is_unread_staff: true })
    .eq('id', conversationId)

  return NextResponse.json({ success: true, message: msg, remainingQuantity: userItem.quantity - 1 })
}
