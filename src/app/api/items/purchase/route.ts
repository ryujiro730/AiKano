export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { logUserAction } from '@/lib/user-action-log'

// POST /api/items/purchase - アイテム購入（ポイント消費）
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  // 書き込みはサーバー権限で行う（ユーザー権限ではポイント・所持品を書き換えられない）
  const supabase = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

  const { itemId } = await req.json().catch(() => ({}))
  if (!itemId) return NextResponse.json({ error: 'itemId required' }, { status: 400 })

  // アイテム情報取得
  const { data: item } = await supabase
    .from('items').select('*').eq('id', itemId).eq('is_active', true).single()
  if (!item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

  // ユーザーのポイント確認
  const { data: profile } = await supabase
    .from('profiles').select('points, bonus_points, bonus_points_expires_at').eq('id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'ポイントが不足しています' }, { status: 400 })

  const now = new Date()
  const bonusAvailable =
    profile.bonus_points_expires_at && new Date(profile.bonus_points_expires_at) > now
      ? (profile.bonus_points ?? 0)
      : 0
  const totalPoints = profile.points + bonusAvailable
  if (totalPoints < item.price_points) {
    await logUserAction(supabase, user.id, 'points_shortage', { context: 'item', title: item.name, current: totalPoints, required: item.price_points })
    return NextResponse.json({ error: 'insufficient_points', current: totalPoints, required: item.price_points }, { status: 402 })
  }

  // ボーナスptから先に消費
  const bonusDeduct = Math.min(bonusAvailable, item.price_points)
  const regularDeduct = item.price_points - bonusDeduct
  const newBonusPoints = bonusAvailable - bonusDeduct
  const newPoints = profile.points - regularDeduct
  const updatePayload: Record<string, number> = { points: newPoints }
  if (bonusDeduct > 0) updatePayload.bonus_points = newBonusPoints

  // 読み取った残高を条件にした更新で、同時購入による二重消費を防ぐ
  const { data: updated, error: pointsError } = await supabase
    .from('profiles')
    .update(updatePayload)
    .eq('id', user.id)
    .eq('points', profile.points)
    .select('id')
  if (pointsError) return NextResponse.json({ error: 'ポイント更新失敗' }, { status: 500 })
  if (!updated?.length) return NextResponse.json({ error: 'もう一度お試しください' }, { status: 409 })

  // インベントリ追加 or 数量+1
  const { data: existing } = await supabase
    .from('user_items').select('*').eq('user_id', user.id).eq('item_id', itemId).single()

  if (existing) {
    await supabase
      .from('user_items')
      .update({ quantity: existing.quantity + 1 })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('user_items')
      .insert({ user_id: user.id, item_id: itemId, quantity: 1 })
  }

  // ポイント取引履歴
  await supabase.from('point_transactions').insert({
    user_id: user.id,
    amount: -item.price_points,
    type: 'spend',
    description: `アイテム購入: ${item.name}`,
  })

  await logUserAction(supabase, user.id, 'item_purchase', { title: item.name, cost: item.price_points })

  return NextResponse.json({ success: true, remainingPoints: newPoints + newBonusPoints })
}
