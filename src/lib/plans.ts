export const PLANS = {
  standard: {
    id: 'standard' as const,
    name: 'スタンダード',
    price_yen: 2980,
    model: 'gpt-6-luna',
    monthly_messages: 300,
    overage_points: 25,
    stripe_price_id: process.env.STRIPE_PRICE_STANDARD ?? '',
    features: [
      '毎月300通のメッセージ',
      '超過分は25pt/通',
      'スタンダードAIモデル',
    ],
  },
  premium: {
    id: 'premium' as const,
    name: 'プレミアム',
    price_yen: 4980,
    model: 'gpt-6-sol',
    monthly_messages: 500,
    overage_points: 20,
    stripe_price_id: process.env.STRIPE_PRICE_PREMIUM ?? '',
    features: [
      '毎月500通のメッセージ',
      '超過分は20pt/通',
      '高性能AIモデル（より自然な返答）',
    ],
  },
} as const

export type PlanId = keyof typeof PLANS

export function getPlan(id: PlanId | null | undefined) {
  if (!id) return null
  return PLANS[id] ?? null
}
