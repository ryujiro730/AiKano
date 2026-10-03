export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getActivePlan } from '@/lib/plans'

/**
 * 姉妹サービスのバナーを出してよいか。
 * 課金ユーザー（購入履歴あり or 有効なサブスク）には出さない（自サービスの売上を食わないため）。
 */
export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ show: false })

  const db = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const [{ data: profile }, { count }] = await Promise.all([
    db.from('profiles').select('role, subscription_status, subscription_plan, subscription_period_end').eq('id', user.id).single(),
    db.from('point_transactions').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('type', 'purchase'),
  ])
  const isPayer = (count ?? 0) > 0 || !!getActivePlan(profile)
  const isStaff = profile?.role === 'admin' || profile?.role === 'staff'
  return NextResponse.json({ show: !isPayer && !isStaff })
}
