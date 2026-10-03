export const PLANS = {
  standard: {
    id: 'standard' as const,
    name: 'スタンダード',
    price_yen: 2980,
    model: 'gpt-6-luna',
    monthly_messages: 300,
    overage_points: 5,
    monthly_bonus_points: 300,
    affection_multiplier: 2,
    stripe_price_id: process.env.STRIPE_PRICE_STANDARD ?? '',
    features: [
      '毎月300通のメッセージ',
      '毎月300ボーナスpt（動画・ショップに使える）',
      '好感度の上がり方が2倍',
      '会員限定フォトが見放題',
      '上限超過後も1通5pt（通常の半額）',
      'スタンダードAIモデル',
    ],
  },
  premium: {
    id: 'premium' as const,
    name: 'プレミアム',
    price_yen: 4980,
    model: 'gpt-6-sol',
    monthly_messages: 500,
    overage_points: 5,
    monthly_bonus_points: 1000,
    affection_multiplier: 3,
    stripe_price_id: process.env.STRIPE_PRICE_PREMIUM ?? '',
    features: [
      '毎月500通のメッセージ',
      '毎月1,000ボーナスpt（動画・ショップに使える）',
      '好感度の上がり方が3倍',
      '会員限定フォトが見放題',
      '上限超過後も1通5pt（通常の半額）',
      '高性能AIモデル（より自然な返答）',
    ],
  },
} as const

export type PlanId = keyof typeof PLANS

export function getPlan(id: PlanId | null | undefined) {
  if (!id) return null
  return PLANS[id] ?? null
}

type SubscriptionFields = {
  subscription_status?: string | null
  subscription_plan?: string | null
  subscription_period_end?: string | null
}

/** 有効なサブスク会員ならそのプランを返す（期限切れのパスは非会員扱い） */
export function getActivePlan(profile: SubscriptionFields | null | undefined) {
  if (!profile) return null
  if (profile.subscription_status !== 'active' && profile.subscription_status !== 'trialing') return null
  if (profile.subscription_period_end && new Date(profile.subscription_period_end) < new Date()) return null
  return getPlan(profile.subscription_plan as PlanId | null)
}
