export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { PLANS, type PlanId } from '@/lib/plans'
import { grantSubscriptionBonus } from '@/lib/subscription-bonus'
import { logUserAction } from '@/lib/user-action-log'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-09-30.endive' as any })

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const admin = createAdminClient()

  // ── 一回払い決済（ポイント購入）────────────────────────────────
  // NOTE: サブスク checkout の場合は mode==='subscription' なので以下はスキップされ、
  //       下の「サブスク開始」ブロックに流れる
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.mode === 'payment') {
      if (session.payment_status !== 'unpaid') {
        const { userId, tokens, priceYen, type: payType, planId } = session.metadata ?? {}

        // ── 月額パス（コンビニ払い等）────────────────────────────────
        if (payType === 'monthly_pass' && userId && planId) {
          const { data: existing } = await admin
            .from('point_transactions')
            .select('id')
            .eq('stripe_session_id', session.id)
            .single()
          if (!existing) {
            const plan = PLANS[planId as PlanId]
            if (plan) {
              const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              await admin.from('profiles').update({
                stripe_customer_id: session.customer as string,
                subscription_plan: planId,
                subscription_status: 'active',
                subscription_period_end: periodEnd,
                monthly_messages_used: 0,
                monthly_messages_limit: plan.monthly_messages,
                monthly_reset_at: periodEnd,
              }).eq('id', userId)
              // 冪等チェック用に point_transactions へ記録
              await admin.from('point_transactions').insert({
                user_id: userId,
                amount: 0,
                type: 'purchase',
                description: `${plan.name}パス購入（1ヶ月）`,
                price_yen: session.amount_total ?? plan.price_yen,
                stripe_session_id: session.id,
              })
              await logUserAction(admin, userId, 'subscription_start', { plan: plan.name, method: 'コンビニ・PayPay', price_yen: session.amount_total ?? plan.price_yen })
              await grantSubscriptionBonus(admin, userId, planId, `pass:${session.id}`)
            }
          }
        }

        // ── ポイント購入（一回払い）────────────────────────────────
        if (!payType && userId && tokens) {
          const { data: existing } = await admin
            .from('point_transactions')
            .select('id')
            .eq('stripe_session_id', session.id)
            .single()
          if (!existing) {
            const tokenCount = parseInt(tokens)
            await admin.rpc('add_points', { p_user_id: userId, p_amount: tokenCount })
            await admin.from('point_transactions').insert({
              user_id: userId,
              amount: tokenCount,
              type: 'purchase',
              description: `${tokenCount}ポイント購入`,
              price_yen: priceYen ? parseInt(priceYen) : (session.amount_total ?? null),
              stripe_session_id: session.id,
            })
            await logUserAction(admin, userId, 'point_purchase_complete', { tokens: tokenCount, price_yen: priceYen ? parseInt(priceYen) : session.amount_total })
          }
        }
      }
    }
  }

  // ── サブスク開始（checkout完了）────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.mode !== 'subscription') return NextResponse.json({ received: true })

    const { userId, planId } = session.metadata ?? {}
    if (!userId || !planId) return NextResponse.json({ received: true })

    const plan = PLANS[planId as PlanId]
    if (!plan) return NextResponse.json({ received: true })

    // subscription_id から period_end を取得
    const subscriptionId = session.subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any
    const periodEnd = new Date(subscription.current_period_end * 1000).toISOString()

    await admin.from('profiles').update({
      stripe_customer_id: session.customer as string,
      subscription_plan: planId,
      subscription_status: 'active',
      subscription_period_end: periodEnd,
      monthly_messages_used: 0,
      monthly_messages_limit: plan.monthly_messages,
      monthly_reset_at: periodEnd,
    }).eq('id', userId)

    await logUserAction(admin, userId, 'subscription_start', { plan: plan.name, method: 'クレジットカード', price_yen: plan.price_yen })
    await grantSubscriptionBonus(admin, userId, planId, `stripe:${subscriptionId}:${subscription.current_period_start}`)
  }

  // ── サブスク更新（プラン変更・更新）────────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as any
    const customerId = subscription.customer as string

    const { data: profile } = await admin
      .from('profiles')
      .select('id, subscription_plan')
      .eq('stripe_customer_id', customerId)
      .single()
    if (!profile) return NextResponse.json({ received: true })

    // Price IDからプランを特定
    const priceId = subscription.items.data[0]?.price?.id
    const newPlanId = (Object.entries(PLANS).find(([, p]) => p.stripe_price_id === priceId)?.[0] ?? profile.subscription_plan) as PlanId | null
    const plan = newPlanId ? PLANS[newPlanId] : null
    const periodEnd = new Date(subscription.current_period_end * 1000).toISOString()

    await admin.from('profiles').update({
      subscription_plan: newPlanId,
      subscription_status: subscription.status as any,
      subscription_period_end: periodEnd,
      monthly_messages_limit: plan?.monthly_messages ?? 0,
      monthly_reset_at: periodEnd,
    }).eq('id', profile.id)
  }

  // ── サブスクキャンセル ──────────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    const customerId = subscription.customer as string

    const { data: canceled } = await admin.from('profiles').select('id, subscription_plan').eq('stripe_customer_id', customerId).single()
    await admin.from('profiles').update({
      subscription_status: 'canceled',
      subscription_plan: null,
      monthly_messages_limit: 0,
    }).eq('stripe_customer_id', customerId)
    if (canceled) await logUserAction(admin, canceled.id, 'subscription_cancel', { plan: canceled.subscription_plan })
  }

  // ── 請求成功（毎月の自動更新）──────────────────────────────────
  if (event.type === 'invoice.payment_succeeded') {
    const invoice = event.data.object as Stripe.Invoice
    if ((invoice as any).billing_reason !== 'subscription_cycle') return NextResponse.json({ received: true })

    const customerId = invoice.customer as string
    const subscriptionId = (invoice as any).subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any
    const periodEnd = new Date(subscription.current_period_end * 1000).toISOString()

    await admin.from('profiles').update({
      subscription_status: 'active',
      subscription_period_end: periodEnd,
      monthly_messages_used: 0,
      monthly_reset_at: periodEnd,
    }).eq('stripe_customer_id', customerId)

    const { data: renewed } = await admin
      .from('profiles').select('id, subscription_plan').eq('stripe_customer_id', customerId).single()
    if (renewed) {
      await logUserAction(admin, renewed.id, 'subscription_renew', { plan: renewed.subscription_plan })
      await grantSubscriptionBonus(admin, renewed.id, renewed.subscription_plan, `stripe:${subscriptionId}:${subscription.current_period_start}`)
    }
  }

  // ── 支払い失敗 ─────────────────────────────────────────────────
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = invoice.customer as string
    const { data: failed } = await admin.from('profiles').update({ subscription_status: 'past_due' }).eq('stripe_customer_id', customerId).select('id').maybeSingle()
    if (failed) await logUserAction(admin, failed.id, 'subscription_payment_failed')
  }

  return NextResponse.json({ received: true })
}
