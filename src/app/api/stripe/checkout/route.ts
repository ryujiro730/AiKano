export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAuthUser } from '@/lib/supabase/get-auth-user'

export async function POST(request: Request) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-09-30.endive' as any,
    })
    const { packageId, tokens, priceYen } = await request.json()

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: `AiKano ${tokens}ポイント`,
            },
            unit_amount: priceYen,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?success=true&points=${tokens}&price=${priceYen}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment?canceled=true`,
      metadata: {
        userId: user.id,
        packageId,
        tokens: String(tokens),
        priceYen: String(priceYen),
      },
      managed_payments: { enabled: false },
    } as any)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
