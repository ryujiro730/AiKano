export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { INTERNAL_EMAILS } from '@/lib/internal-accounts'
import { findEligibleCampaign } from '@/lib/campaigns'
import { findPackage, pointsForPackage, isCampaignTarget, type PurchaseCampaign } from '@/lib/point-packages'

// ポイント購入（一回払い）。価格・付与ポイントはサーバー側で決める（クライアントからはパックIDのみ受け取る）
export async function POST(request: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { packageId } = await request.json().catch(() => ({}))
  const pkg = typeof packageId === 'string' ? findPackage(packageId) : null
  if (!pkg) return NextResponse.json({ error: 'Invalid package' }, { status: 400 })

  try {
    const isInternal = !!user.email && (INTERNAL_EMAILS as readonly string[]).includes(user.email)
    const db = createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
    const row = isInternal ? null : await findEligibleCampaign(db, user.id, { purchaseContext: true })
    const campaign: PurchaseCampaign | null = row
      ? { id: row.id, bonus_rate: Number(row.bonus_rate ?? 1), min_price_yen: row.min_price_yen ?? null, max_price_yen: row.max_price_yen ?? null }
      : null
    const tokens = pointsForPackage(pkg, campaign)
    const appliedCampaignId = isCampaignTarget(pkg, campaign) ? campaign!.id : ''

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-09-30.endive' as any,
    })
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: { name: `AiKano ${tokens.toLocaleString()}ポイント` },
            unit_amount: pkg.price_yen,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?success=true&points=${tokens}&price=${pkg.price_yen}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?canceled=true`,
      metadata: {
        userId: user.id,
        packageId: pkg.id,
        tokens: String(tokens),
        priceYen: String(pkg.price_yen),
        campaignId: appliedCampaignId,
      },
      managed_payments: { enabled: false },
    } as any)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
