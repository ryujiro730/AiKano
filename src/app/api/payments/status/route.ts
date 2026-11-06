export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createAdminClient } from '@/lib/supabase/server'
import { listPendingPayments, voucherOf } from '@/lib/pending-payments'

export const fetchCache = 'force-no-store'

/**
 * GET /api/payments/status?session_id=cs_...
 * 決済ページ用: Checkout から戻ってきたときの実際の支払い状態（払い済みか・払込票待ちか）と、本人の払い待ち一覧。
 * webhook より先に戻ってくることがあるので、状態は Stripe に直接聞く
 */
export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const pending = await listPendingPayments(createAdminClient(), user.id)
  const sessionId = req.nextUrl.searchParams.get('session_id')
  if (!sessionId?.startsWith('cs_')) return NextResponse.json({ pending, session: null })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-09-30.endive' as any })
  const s = await stripe.checkout.sessions.retrieve(sessionId).catch(() => null)
  if (!s || s.metadata?.userId !== user.id) return NextResponse.json({ pending, session: null })

  const paid = s.payment_status !== 'unpaid'
  const v = paid ? null : await voucherOf(stripe, s).catch(() => null)
  return NextResponse.json({
    pending,
    session: {
      paid,
      kind: s.metadata?.type === 'monthly_pass' ? 'pass' : 'points',
      points: s.metadata?.tokens ? parseInt(s.metadata.tokens) : null,
      planId: s.metadata?.planId ?? null,
      voucherUrl: v?.voucherUrl ?? null,
      expiresAt: v?.expiresAt ?? null,
    },
  })
}
