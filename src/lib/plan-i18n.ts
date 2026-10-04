import { PLANS, type PlanId } from './plans'
import type { Messages } from '@/i18n/messages/ja'
import { fmt } from '@/i18n/fmt'

export function planName(id: PlanId, m: Messages) {
  return m.plans[id]
}

/** プランの特典一覧（数字は plans.ts の定義から差し込む） */
export function planFeatures(id: PlanId, m: Messages): string[] {
  const p = PLANS[id]
  const f = m.plans.features
  return [
    fmt(f.messages, { n: p.monthly_messages.toLocaleString() }),
    fmt(f.bonus, { n: p.monthly_bonus_points.toLocaleString() }),
    fmt(f.affection, { n: p.affection_multiplier }),
    f.photos,
    ...(id === 'premium' ? [f.premiumVideos] : []),
    fmt(f.overage, { n: p.overage_points }),
    id === 'premium' ? f.premiumModel : f.standardModel,
  ]
}
