export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createAdminClient } from '@/lib/supabase/server'
import { PLANS, type PlanId } from '@/lib/plans'

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { planId } = body as { planId: PlanId }
    const plan = PLANS[planId]
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    if (!plan.stripe_price_id) return NextResponse.json({ error: 'Plan not configured' }, { status: 503 })

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-09-30.endive' as any })
    const admin = createAdminClient()

    const { data: profile } = await admin
      .from('profiles')
      .select('stripe_customer_id, email')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id ?? null

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email ?? undefined,
        metadata: { userId: user.id },
      })
      customerId = customer.id
      await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3001'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${appUrl}/payment?subscribed=true&plan=${planId}`,
      cancel_url: `${appUrl}/payment`,
      metadata: { userId: user.id, planId },
      managed_payments: { enabled: false },
    } as any)

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[stripe/subscribe] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
