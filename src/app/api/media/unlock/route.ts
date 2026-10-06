export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getActivePlan } from '@/lib/plans'
import type { MediaKind } from '@/lib/paid-media'
import { spendPoints, refundPoints, usablePoints } from '@/lib/points'
import { logUserAction } from '@/lib/user-action-log'
import { getAffectionLevel } from '@/lib/character-photos'

/**
 * POST /api/media/unlock { messageId } | { photoId }
 * キャラがチャットで送った画像・動画をポイントで解錠する（会員も有料）。
 * アルバムのフォトは写真ガチャでしか手に入らない。photoId で開けられるのは、到達済みの好感度レベル限定フォト（無料）だけ。
 * 解錠は URL 単位なので、同じ写真をチャットとアルバムで二重に払うことはない。
 */
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { messageId, photoId } = await req.json().catch(() => ({}))
  const db = createAdminClient()

  let target: { url: string; kind: MediaKind; price: number; context: string } | null = null
  if (typeof messageId === 'string') {
    const { data } = await db
      .from('message_media')
      .select('url, kind, price, messages!inner(conversations!inner(user_id))')
      .eq('message_id', messageId)
      .limit(1)
      .maybeSingle()
    const owner = (data as unknown as { messages?: { conversations?: { user_id?: string } } } | null)?.messages?.conversations?.user_id
    if (data && owner === user.id) target = { url: data.url, kind: data.kind as MediaKind, price: data.price, context: 'chat' }
  } else if (typeof photoId === 'string') {
    const { data } = await db.from('character_photos').select('url, members_only, required_level, character_id').eq('id', photoId).maybeSingle()
    if (data?.members_only) {
      const { data: profile } = await db.from('profiles')
        .select('subscription_status, subscription_plan, subscription_period_end, role').eq('id', user.id).single()
      if (!getActivePlan(profile) && profile?.role !== 'admin') {
        return NextResponse.json({ error: 'members_only' }, { status: 403 })
      }
    }
    // 好感度レベル限定フォト：達していれば無料、足りなければ開けない
    if (data?.required_level) {
      const level = await getAffectionLevel(db, user.id, data.character_id)
      if (level < data.required_level) return NextResponse.json({ error: 'level_locked', required: data.required_level }, { status: 403 })
      target = { url: data.url, kind: 'image', price: 0, context: 'album' }
    }
    if (data && !target) return NextResponse.json({ error: 'gacha_only' }, { status: 403 })
  }
  if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const balance = async () => {
    const { data: p } = await db.from('profiles').select('points, bonus_points, bonus_points_expires_at').eq('id', user.id).single()
    return usablePoints(p).total
  }

  // 無料（アイコン写真）・解錠済みならそのまま返す
  if (target.price === 0) return NextResponse.json({ url: target.url, kind: target.kind, points: await balance() })
  const { data: existing } = await db.from('media_unlocks').select('url').eq('user_id', user.id).eq('url', target.url).maybeSingle()
  if (existing) return NextResponse.json({ url: target.url, kind: target.kind, points: await balance() })

  const label = target.kind === 'video' ? '動画の解錠' : '写真の解錠'
  const spend = await spendPoints(db, user.id, target.price, label)
  if (!spend.ok) {
    if (spend.status === 402) {
      await logUserAction(db, user.id, 'points_shortage', { context: `media_${target.kind}`, current: spend.body.current, required: spend.body.required })
    }
    return NextResponse.json(spend.body, { status: spend.status })
  }

  const { error } = await db.from('media_unlocks').insert({ user_id: user.id, url: target.url, kind: target.kind, price: target.price })
  if (error) {
    // 二重押しで先に解錠済みになった場合も含め、消費分は戻す
    await refundPoints(db, user.id, spend, `${label}（重複・失敗）の返却`)
    const { data: again } = await db.from('media_unlocks').select('url').eq('user_id', user.id).eq('url', target.url).maybeSingle()
    if (again) return NextResponse.json({ url: target.url, kind: target.kind, points: await balance() })
    return NextResponse.json({ error: 'Failed to unlock' }, { status: 500 })
  }

  await logUserAction(db, user.id, 'media_unlock', { kind: target.kind, context: target.context, cost: target.price })
  return NextResponse.json({ url: target.url, kind: target.kind, points: spend.points + spend.bonus_points })
}

