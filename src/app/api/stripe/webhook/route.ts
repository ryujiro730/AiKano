export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { PLANS, type PlanId } from '@/lib/plans'
import { grantSubscriptionBonus } from '@/lib/subscription-bonus'
import { logUserAction } from '@/lib/user-action-log'
import { sendTJPurchase } from '@/lib/trafficjunky'
import { findPackage } from '@/lib/point-packages'
import { recordPendingPayment, setPendingStatus } from '@/lib/pending-payments'
import { metaPurchase } from '@/lib/meta-capi'

export const fetchCache = 'force-no-store'

// 現行APIでは請求期間はサブスク本体ではなく items に入っている
function subscriptionPeriod(sub: any) {
  const item = sub.items?.data?.[0]
  const start: number = item?.current_period_start ?? sub.current_period_start
  const end: number = item?.current_period_end ?? sub.current_period_end
  return { start, endIso: new Date(end * 1000).toISOString() }
}

// 現行APIでは請求書のサブスクIDは parent.subscription_details に入っている
function invoiceSubscriptionId(invoice: any): string | null {
  return invoice.parent?.subscription_details?.subscription ?? invoice.subscription ?? null
}

/**
 * Stripe の顧客IDからユーザーを探す。見つからなければ、Stripe の顧客情報の metadata.userId（getOrCreateCustomer が入れる）か
 * メールアドレスで探して、顧客IDを結びつける（申し込み時の通知を取りこぼすと、以後の更新がどのユーザーにも結びつかなかった）
 */
async function profileForCustomer(stripe: Stripe, admin: ReturnType<typeof createAdminClient>, customerId: string | null) {
  if (!customerId) return null
  const { data: found } = await admin.from('profiles').select('id, subscription_plan').eq('stripe_customer_id', customerId).maybeSingle()
  if (found) return found
  const customer = await stripe.customers.retrieve(customerId).catch(() => null)
  if (!customer || customer.deleted) return null
  const metaUserId = (customer as Stripe.Customer).metadata?.userId
  const email = (customer as Stripe.Customer).email
  const { data: linked } = metaUserId
    ? await admin.from('profiles').select('id, subscription_plan').eq('id', metaUserId).maybeSingle()
    : email
      ? await admin.from('profiles').select('id, subscription_plan').ilike('email', email).maybeSingle()
      : { data: null }
  if (!linked) return null
  await admin.from('profiles').update({ stripe_customer_id: customerId }).eq('id', linked.id)
  return linked
}

/**
 * ポイント購入を記録してから付与する。記録（stripe_session_id の一意制約）が通ったときだけ add_points するので、
 * 同じ通知が重なってもポイントは1回しか付かない。
 * キャンペーン倍率で買ったときは campaign_id を、一人一回限りなら once_campaign_id も入れる。
 * 一人一回限りの制約にかかった（もう受け取り済み）ら、倍率なしの通常ポイントで記録し直す。
 * 返り値: 付与したポイント数 / 'duplicate'（処理済みの通知）/ 'error'
 */
async function recordPointPurchase(
  admin: ReturnType<typeof createAdminClient>,
  session: Stripe.Checkout.Session,
  userId: string,
  tokens: number,
  priceYen: number | null,
  campaignId: string | null,
  packageId: string | null,
): Promise<number | 'duplicate' | 'error'> {
  let once = false
  if (campaignId) {
    const { data: c } = await admin.from('campaigns').select('one_time_per_user').eq('id', campaignId).maybeSingle()
    once = !!c?.one_time_per_user
  }
  const row = (amount: number, cid: string | null) => ({
    user_id: userId,
    amount,
    type: 'purchase',
    description: `${amount}ポイント購入`,
    price_yen: priceYen,
    stripe_session_id: session.id,
    campaign_id: cid,
    once_campaign_id: cid && once ? cid : null,
  })

  let amount = tokens
  let { error } = await admin.from('point_transactions').insert(row(amount, campaignId))
  if (error?.code === '23505' && error.message.includes('once_campaign')) {
    // このキャンペーンの倍率はもう受け取っている → 通常のポイントで記録し直す
    amount = findPackage(packageId ?? '')?.tokens ?? Math.floor((priceYen ?? 0) / 10)
    ;({ error } = await admin.from('point_transactions').insert(row(amount, null)))
  }
  if (error?.code === '23505') return 'duplicate'
  if (error) {
    console.error('[stripe webhook] purchase record failed:', error.message)
    return 'error'
  }
  await admin.rpc('add_points', { p_user_id: userId, p_amount: amount })
  return amount
}

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
  // 何をしたかを stripe_webhook_log に残す（094）。各処理で上書きする
  const log: { userId?: string | null; outcome: string; detail?: Record<string, unknown> } = { outcome: 'ignored' }
  const res = await handle(event, stripe, admin, log).catch(async (e) => {
    log.outcome = 'error'
    log.detail = { ...(log.detail ?? {}), error: e instanceof Error ? e.message : String(e) }
    return NextResponse.json({ error: 'handler failed' }, { status: 500 })
  })
  await admin.from('stripe_webhook_log').upsert({
    event_id: event.id, type: event.type, user_id: log.userId ?? null, outcome: log.outcome, detail: log.detail ?? null,
  }, { onConflict: 'event_id' })
  return res
}

async function handle(
  event: Stripe.Event,
  stripe: Stripe,
  admin: ReturnType<typeof createAdminClient>,
  log: { userId?: string | null; outcome: string; detail?: Record<string, unknown> },
): Promise<NextResponse> {

  // ── 一回払い決済（ポイント購入）────────────────────────────────
  // NOTE: サブスク checkout の場合は mode==='subscription' なので以下はスキップされ、
  //       下の「サブスク開始」ブロックに流れる
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.mode === 'payment') {
      log.userId = session.metadata?.userId ?? null
      log.detail = { session: session.id, amount: session.amount_total, payment_status: session.payment_status }
      if (session.payment_status !== 'unpaid') {
        log.outcome = 'ok'
        const { userId, tokens, priceYen, type: payType, planId, campaignId, packageId } = session.metadata ?? {}

        // ── 月額パス（コンビニ払い等）────────────────────────────────
        if (payType === 'monthly_pass' && userId && planId) {
          const plan = PLANS[planId as PlanId]
          if (plan) {
            // 先に取引を記録する（stripe_session_id の一意制約で、同じ通知が重なっても1回だけ通る）
            const { error: insErr } = await admin.from('point_transactions').insert({
              user_id: userId,
              amount: 0,
              type: 'purchase',
              description: `${plan.name}パス購入（1ヶ月）`,
              price_yen: session.amount_total ?? plan.price_yen,
              stripe_session_id: session.id,
            })
            if (!insErr) {
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
              await logUserAction(admin, userId, 'subscription_start', { plan: plan.name, method: 'コンビニ払い', price_yen: session.amount_total ?? plan.price_yen })
              await sendTJPurchase(admin, userId, session.id, session.amount_total ?? plan.price_yen, `pass_${planId}`)
              await metaPurchase(admin, userId, session.id, session.amount_total ?? plan.price_yen, `pass_${planId}`)
              await grantSubscriptionBonus(admin, userId, planId, `pass:${session.id}`)
            } else if (insErr.code !== '23505') {
              console.error('[stripe webhook] pass record failed:', insErr.message)
              return NextResponse.json({ error: 'record failed' }, { status: 500 })
            }
          }
        }

        // ── ポイント購入（一回払い）────────────────────────────────
        if (!payType && userId && tokens) {
          const granted = await recordPointPurchase(admin, session, userId, parseInt(tokens), priceYen ? parseInt(priceYen) : (session.amount_total ?? null), campaignId || null, packageId ?? null)
          if (granted === 'error') return NextResponse.json({ error: 'record failed' }, { status: 500 })
          if (granted !== 'duplicate') {
            await logUserAction(admin, userId, 'point_purchase_complete', { tokens: granted, price_yen: priceYen ? parseInt(priceYen) : session.amount_total })
            await sendTJPurchase(admin, userId, session.id, priceYen ? parseInt(priceYen) : (session.amount_total ?? 0), `points_${granted}`)
            await metaPurchase(admin, userId, session.id, priceYen ? parseInt(priceYen) : (session.amount_total ?? 0), `points_${granted}`)
          }
        }
        await setPendingStatus(admin, session.id, 'paid')
      } else if (event.type === 'checkout.session.completed') {
        // コンビニ払いなど: 払込番号を出しただけでまだ払われていない。入金で async_payment_succeeded が来る
        log.outcome = 'pending'
        await recordPendingPayment(stripe, admin, session)
        if (session.metadata?.userId) await logUserAction(admin, session.metadata.userId, 'payment_pending', { price_yen: session.amount_total })
      }
    }
  }

  // ── コンビニ払いなどの期限切れ・失敗 ────────────────────────────
  if (event.type === 'checkout.session.async_payment_failed') {
    const session = event.data.object as Stripe.Checkout.Session
    await setPendingStatus(admin, session.id, 'expired')
    const userId = session.metadata?.userId
    log.userId = userId ?? null
    log.outcome = 'ok'
    if (userId) await logUserAction(admin, userId, 'payment_expired', { price_yen: session.amount_total })
  }

  // ── サブスク開始（checkout完了）────────────────────────────────
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.mode !== 'subscription') return NextResponse.json({ received: true })

    const { userId, planId } = session.metadata ?? {}
    log.userId = userId ?? null
    log.detail = { session: session.id, customer: session.customer, planId }
    if (!userId || !planId) return NextResponse.json({ received: true })

    const plan = PLANS[planId as PlanId]
    if (!plan) return NextResponse.json({ received: true })

    // subscription_id から period_end を取得
    const subscriptionId = session.subscription as string
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const { start: periodStart, endIso: periodEnd } = subscriptionPeriod(subscription)

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
    await grantSubscriptionBonus(admin, userId, planId, `stripe:${subscriptionId}:${periodStart}`)
    log.outcome = 'ok'
  }

  // ── サブスク更新（プラン変更・更新）────────────────────────────
  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as any
    const customerId = subscription.customer as string

    const profile = await profileForCustomer(stripe, admin, customerId)
    log.userId = profile?.id ?? null
    log.detail = { customer: customerId, subscription: subscription.id, status: subscription.status, price: subscription.items?.data?.[0]?.price?.id }
    if (!profile) { log.outcome = 'no_profile'; return NextResponse.json({ received: true }) }

    // Price IDからプランを特定
    const priceId = subscription.items.data[0]?.price?.id
    const newPlanId = (Object.entries(PLANS).find(([, p]) => p.stripe_price_id === priceId)?.[0] ?? profile.subscription_plan) as PlanId | null
    const plan = newPlanId ? PLANS[newPlanId] : null
    const { endIso: periodEnd } = subscriptionPeriod(subscription)

    await admin.from('profiles').update({
      subscription_plan: newPlanId,
      subscription_status: subscription.status as any,
      subscription_period_end: periodEnd,
      monthly_messages_limit: plan?.monthly_messages ?? 0,
      monthly_reset_at: periodEnd,
    }).eq('id', profile.id)
    log.outcome = 'ok'
  }

  // ── サブスクキャンセル ──────────────────────────────────────────
  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as any
    const customerId = subscription.customer as string

    const canceled = await profileForCustomer(stripe, admin, customerId)
    log.userId = canceled?.id ?? null
    log.outcome = canceled ? 'ok' : 'no_profile'
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
    const customerId = invoice.customer as string
    const subscriptionId = invoiceSubscriptionId(invoice)
    const payer = await profileForCustomer(stripe, admin, customerId)
    log.userId = payer?.id ?? null
    log.detail = { customer: customerId, invoice: invoice.id, subscription: subscriptionId, amount_paid: invoice.amount_paid, billing_reason: (invoice as any).billing_reason }
    log.outcome = payer ? 'ok' : 'no_profile'
    if (!subscriptionId) { log.outcome = 'no_subscription'; return NextResponse.json({ received: true }) }

    // サブスク代金を売上として記録（初回・更新とも。stripe_session_id の一意制約で二重記録を防ぐ）
    if ((invoice.amount_paid ?? 0) > 0) {
      if (payer) {
        const { error: dupErr } = await admin.from('point_transactions').insert({
          user_id: payer.id,
          amount: 0,
          type: 'purchase',
          description: '月額プラン（クレジットカード）',
          price_yen: invoice.amount_paid,
          stripe_session_id: invoice.id,
        })
        if (!dupErr) {
          await sendTJPurchase(admin, payer.id, invoice.id!, invoice.amount_paid, 'subscription')
          // サブスクは初回・毎月の更新とも請求書ごとに Purchase（Checkout 完了では送らない＝二重にしない）
          await metaPurchase(admin, payer.id, invoice.id!, invoice.amount_paid, `subscription_${(invoice as any).billing_reason ?? ''}`)
        }
      }
    }

    if ((invoice as any).billing_reason !== 'subscription_cycle') return NextResponse.json({ received: true })
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const { start: periodStart, endIso: periodEnd } = subscriptionPeriod(subscription)

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
      await grantSubscriptionBonus(admin, renewed.id, renewed.subscription_plan, `stripe:${subscriptionId}:${periodStart}`)
    }
  }

  // ── 支払い失敗 ─────────────────────────────────────────────────
  if (event.type === 'invoice.payment_failed') {
    const invoice = event.data.object as Stripe.Invoice
    const customerId = invoice.customer as string
    await profileForCustomer(stripe, admin, customerId)
    const { data: failed } = await admin.from('profiles').update({ subscription_status: 'past_due' }).eq('stripe_customer_id', customerId).select('id').maybeSingle()
    log.userId = failed?.id ?? null
    log.outcome = failed ? 'ok' : 'no_profile'
    if (failed) await logUserAction(admin, failed.id, 'subscription_payment_failed')
  }

  return NextResponse.json({ received: true })
}
