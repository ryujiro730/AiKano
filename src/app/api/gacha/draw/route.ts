export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { GACHA_PLANS, getGachaPool, grantRandomPhotos, type GachaCount } from '@/lib/gacha'
import { spendPoints, refundPoints } from '@/lib/points'
import { logUserAction } from '@/lib/user-action-log'
import { canUseGacha } from '@/lib/features'

/**
 * POST /api/gacha/draw { characterId, count: 1 | 10 }
 * まだ持っていない写真から count 枚を引く。残りが count 枚未満なら引けない（10連は残り10枚以上のとき）。
 */
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { characterId, count } = await req.json().catch(() => ({}))
  if (typeof characterId !== 'string' || !(count in GACHA_PLANS)) {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }
  const n = count as GachaCount
  const price = GACHA_PLANS[n]
  const db = createAdminClient()
  const { data: me } = await db.from('profiles').select('role').eq('id', user.id).single()
  if (!canUseGacha(me?.role)) return NextResponse.json({ error: 'not_available' }, { status: 403 })

  const { remaining } = await getGachaPool(db, user.id, characterId)
  if (remaining.length < n) return NextResponse.json({ error: 'not_enough_left', remaining: remaining.length }, { status: 409 })

  const spend = await spendPoints(db, user.id, price, `写真ガチャ ${n}回`)
  if (!spend.ok) {
    if (spend.status === 402) {
      await logUserAction(db, user.id, 'points_shortage', { context: 'gacha', current: spend.body.current, required: spend.body.required })
    }
    return NextResponse.json(spend.body, { status: spend.status })
  }

  const got = await grantRandomPhotos(db, user.id, remaining, n, Math.floor(price / n))
  // 同時に引いて取り合いになった分（入らなかった枚数）はポイントを戻す
  const missing = n - got.length
  let points = spend.points + spend.bonus_points
  if (missing > 0) {
    const back = got.length === 0 ? price : Math.floor((price / n) * missing)
    const bonusBack = Math.min(spend.bonusDeducted, back)
    await refundPoints(db, user.id, { deducted: back, bonusDeducted: bonusBack }, `写真ガチャの返却（${missing}枚分）`)
    points += back
  }
  if (got.length === 0) return NextResponse.json({ error: 'conflict' }, { status: 409 })

  await logUserAction(db, user.id, 'gacha_draw', { count: n, got: got.length, cost: price - (missing > 0 ? Math.floor((price / n) * missing) : 0) })
  return NextResponse.json({ photos: got, points, remaining: remaining.length - got.length })
}
