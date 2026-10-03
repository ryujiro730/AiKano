import type { SupabaseClient } from '@supabase/supabase-js'
import { PLANS, type PlanId } from '@/lib/plans'

/**
 * サブスク会員の毎月ボーナスptを付与する（period_key ごとに1回だけ。DB関数側で冪等）
 * period_key 例: `stripe:<subscriptionId>:<periodStart>` / `pass:<checkoutSessionId>` / `bank:<requestId>`
 */
export async function grantSubscriptionBonus(
  admin: SupabaseClient,
  userId: string,
  planId: string | null | undefined,
  periodKey: string,
) {
  const plan = planId ? PLANS[planId as PlanId] : null
  if (!plan) return
  const { error } = await admin.rpc('grant_subscription_bonus', {
    p_user_id: userId,
    p_period_key: periodKey,
    p_plan_id: plan.id,
    p_amount: plan.monthly_bonus_points,
  })
  if (error) console.error('[subscription-bonus] grant error:', error.message)
}
