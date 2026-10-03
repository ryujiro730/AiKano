export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { PLANS, type PlanId } from '@/lib/plans'
import { grantSubscriptionBonus } from '@/lib/subscription-bonus'

function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = adminDb()
  const { data: caller } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (caller?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { admin_note } = await req.json().catch(() => ({}))

  const { data: request } = await admin
    .from('bank_transfer_requests')
    .select('id, user_id, plan_id, amount_yen, status')
    .eq('id', params.id)
    .single()

  if (!request) return NextResponse.json({ error: '申請が見つかりません' }, { status: 404 })
  if (request.status !== 'pending') return NextResponse.json({ error: '既に処理済みです' }, { status: 400 })

  const plan = PLANS[request.plan_id as PlanId]
  if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  // サブスク有効化（30日間）
  const { error: profileErr } = await admin.from('profiles').update({
    subscription_plan: request.plan_id,
    subscription_status: 'active',
    subscription_period_end: periodEnd,
    monthly_messages_used: 0,
    monthly_messages_limit: plan.monthly_messages,
    monthly_reset_at: periodEnd,
  }).eq('id', request.user_id)

  if (profileErr) {
    console.error('[bank-transfer confirm] profile update error:', profileErr)
    return NextResponse.json({ error: profileErr.message }, { status: 500 })
  }

  const { error: updateErr } = await admin.from('bank_transfer_requests').update({
    status: 'confirmed',
    confirmed_at: new Date().toISOString(),
    admin_note: admin_note ?? null,
  }).eq('id', params.id)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  await grantSubscriptionBonus(admin, request.user_id, request.plan_id, `bank:${request.id}`)

  return NextResponse.json({ ok: true })
}
