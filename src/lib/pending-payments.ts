import type Stripe from 'stripe'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * コンビニ払いなど「あとで払う」決済の払い待ち（pending_payments、092）。
 * webhook が払込番号の発行時に入れ、入金で paid・期限切れで expired にする。決済ページの「お支払い待ち」に出す
 */

export type PendingPayment = {
  session_id: string
  kind: 'points' | 'pass'
  amount_yen: number
  points: number | null
  plan_id: string | null
  method: string | null
  voucher_url: string | null
  expires_at: string | null
}

/** 払込票の URL・期限・支払い方法（PaymentIntent の next_action から） */
export async function voucherOf(stripe: Stripe, session: Stripe.Checkout.Session) {
  const piId = typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id
  if (!piId) return { method: null, voucherUrl: null, expiresAt: null }
  const pi = await stripe.paymentIntents.retrieve(piId)
  const konbini = pi.next_action?.konbini_display_details
  return {
    method: konbini ? 'konbini' : (pi.next_action?.type ?? null),
    voucherUrl: konbini?.hosted_voucher_url ?? null,
    expiresAt: konbini?.expires_at ? new Date(konbini.expires_at * 1000).toISOString() : null,
  }
}

/** Checkout は終わったがまだ払われていない（払込番号を発行した）とき */
export async function recordPendingPayment(stripe: Stripe, db: SupabaseClient, session: Stripe.Checkout.Session) {
  const { userId, tokens, planId, type } = session.metadata ?? {}
  if (!userId) return
  const v = await voucherOf(stripe, session).catch(e => {
    console.error('[pending-payments] voucher lookup failed:', e instanceof Error ? e.message : e)
    return { method: null, voucherUrl: null, expiresAt: null }
  })
  const { error } = await db.from('pending_payments').upsert({
    session_id: session.id,
    user_id: userId,
    kind: type === 'monthly_pass' ? 'pass' : 'points',
    amount_yen: session.amount_total ?? 0,
    points: tokens ? parseInt(tokens) : null,
    plan_id: planId ?? null,
    method: v.method,
    voucher_url: v.voucherUrl,
    expires_at: v.expiresAt,
  }, { onConflict: 'session_id', ignoreDuplicates: true })
  if (error) console.error('[pending-payments] record failed:', error.message)
}

export async function setPendingStatus(db: SupabaseClient, sessionId: string, status: 'paid' | 'expired') {
  await db.from('pending_payments').update({ status, updated_at: new Date().toISOString() }).eq('session_id', sessionId).eq('status', 'pending')
}

/** 本人の払い待ち（期限内のもの） */
export async function listPendingPayments(db: SupabaseClient, userId: string): Promise<PendingPayment[]> {
  const { data } = await db.from('pending_payments')
    .select('session_id, kind, amount_yen, points, plan_id, method, voucher_url, expires_at')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order('created_at', { ascending: false })
    .limit(10)
  return (data ?? []) as PendingPayment[]
}
