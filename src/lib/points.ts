import type { SupabaseClient } from '@supabase/supabase-js'

type PointsRow = { points: number | null; bonus_points: number | null; bonus_points_expires_at: string | null }

const MAX_RETRY = 3

export function usablePoints(p: PointsRow | null) {
  const bonusValid = !!p?.bonus_points_expires_at && new Date(p.bonus_points_expires_at) > new Date()
  const bonus = bonusValid ? (p?.bonus_points ?? 0) : 0
  return { bonus, total: (p?.points ?? 0) + bonus }
}

export type Spend =
  | { ok: true; deducted: number; bonusDeducted: number; points: number; bonus_points: number }
  | { ok: false; status: number; body: Record<string, unknown> }

/**
 * ボーナス（有効期限内）→ 通常ポイントの順で cost を消費し、point_transactions に 'spend' を記録する。
 * 読み取った値を条件にした compare-and-swap 更新で二重押し時の競合を防ぐ。
 */
export async function spendPoints(db: SupabaseClient, userId: string, cost: number, description: string): Promise<Spend> {
  for (let i = 0; i < MAX_RETRY; i++) {
    const { data: p } = await db
      .from('profiles')
      .select('points, bonus_points, bonus_points_expires_at')
      .eq('id', userId)
      .single()
    if (!p) return { ok: false, status: 404, body: { error: 'Profile not found' } }

    const usable = usablePoints(p)
    if (usable.total < cost) {
      return { ok: false, status: 402, body: { error: 'insufficient_points', current: usable.total, required: cost } }
    }

    const bonusDeducted = Math.min(usable.bonus, cost)
    const newPoints = (p.points ?? 0) - (cost - bonusDeducted)
    // 期限切れボーナスは 0 に落とす
    const newBonus = usable.bonus - bonusDeducted

    let q = db.from('profiles')
      .update({ points: newPoints, bonus_points: newBonus })
      .eq('id', userId)
      .eq('points', p.points ?? 0)
    q = p.bonus_points == null ? q.is('bonus_points', null) : q.eq('bonus_points', p.bonus_points)
    const { data: updated } = await q.select('id')
    if (!updated || updated.length === 0) continue // 競合 → 再読込してやり直し

    await db.from('point_transactions').insert({ user_id: userId, amount: -cost, type: 'spend', description })

    return { ok: true, deducted: cost, bonusDeducted, points: newPoints, bonus_points: newBonus }
  }
  return { ok: false, status: 409, body: { error: 'conflict' } }
}

/** spendPoints で消費した分を戻す（後続処理が失敗したとき用） */
export async function refundPoints(db: SupabaseClient, userId: string, spend: { deducted: number; bonusDeducted: number }, description: string) {
  if (spend.deducted === 0) return
  // 通常分は add_points でアトミックに戻す。ボーナス分は直後なので現在値に加算。
  const regular = spend.deducted - spend.bonusDeducted
  if (regular > 0) await db.rpc('add_points', { p_user_id: userId, p_amount: regular })
  if (spend.bonusDeducted > 0) {
    const { data: p } = await db.from('profiles').select('bonus_points').eq('id', userId).single()
    await db.from('profiles').update({ bonus_points: (p?.bonus_points ?? 0) + spend.bonusDeducted }).eq('id', userId)
  }
  await db.from('point_transactions').insert({ user_id: userId, amount: spend.deducted, type: 'admin_adjust', description })
}
