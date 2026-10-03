export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single()

  if (!profile?.stripe_customer_id) {
    return NextResponse.json({ error: 'No subscription found' }, { status: 404 })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-09-30.endive' as any })

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment`,
  })

  return NextResponse.json({ url: session.url })
}
