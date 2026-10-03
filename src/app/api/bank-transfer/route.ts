export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { PLANS, type PlanId } from '@/lib/plans'

function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { plan_id, receipt_url } = body as { plan_id: PlanId; receipt_url?: string }

  const plan = PLANS[plan_id]
  if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const admin = adminDb()
  const { data, error } = await admin.from('bank_transfer_requests').insert({
    user_id: user.id,
    plan_id,
    amount_yen: plan.price_yen,
    receipt_url: receipt_url ?? null,
    status: 'pending',
  }).select('id').single()

  if (error) {
    console.error('[bank-transfer] insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, id: data.id })
}
