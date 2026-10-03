export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

// 管理画面: ユーザー詳細（プロフィール＋DB集計＋直近の取引）
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  const { db } = auth

  const [{ data: profile, error }, { data: stats }, { data: transactions }] = await Promise.all([
    db.from('profiles').select(
      'id, user_code, email, display_name, age, gender, role, points, bonus_points, bonus_points_expires_at, admin_note, ' +
      'last_login_at, created_at, referral_source, referral_article, registration_ip, registration_ua, ' +
      'utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, gclid, ' +
      'subscription_status, subscription_plan, subscription_period_end, monthly_messages_used, monthly_messages_limit, partner_character_id',
    ).eq('id', params.id).single(),
    db.rpc('admin_user_stats', { p_user_id: params.id }),
    db.from('point_transactions').select('id, amount, type, description, price_yen, created_at')
      .eq('user_id', params.id).order('created_at', { ascending: false }).limit(200),
  ])
  if (error || !profile) return NextResponse.json({ error: error?.message ?? 'Not found' }, { status: 404 })

  return NextResponse.json({ profile, stats, transactions: transactions ?? [] })
}
