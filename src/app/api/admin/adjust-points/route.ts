export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { logUserAction } from '@/lib/user-action-log'

export const fetchCache = 'force-no-store'

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  const admin = auth.db

  const { userId, amount, description } = await request.json()
  if (!userId || typeof amount !== 'number' || amount === 0) {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  }

  // 残高の更新と取引の記録を DB で1回に（読んでから書くと、同時のポイント消費を上書きしてしまう）
  const { data: newPoints, error } = await admin.rpc('admin_adjust_points', {
    p_user_id: userId,
    p_amount: amount,
    p_description: description || (amount > 0 ? '管理者による付与' : '管理者による減算'),
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (newPoints == null) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await logUserAction(admin, userId, 'admin_points_adjust', { amount, reason: description || undefined })

  return NextResponse.json({ ok: true, newPoints })
}
