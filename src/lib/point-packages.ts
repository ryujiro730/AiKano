import { TOKEN_PACKAGES, type TokenPackage } from '@/types'

/** 高額パックの倍率（price_yen が min_yen 以上のパックは rate 倍） */
export type RateTier = { min_yen: number; rate: number }

/** 購入時に適用されるキャンペーン（倍率と対象価格帯） */
export type PurchaseCampaign = {
  id: string
  bonus_rate: number
  min_price_yen: number | null
  max_price_yen: number | null
  rate_tiers?: RateTier[] | null
}

/** DB の campaigns 行（または API の返却値）から購入用のキャンペーン情報を作る */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPurchaseCampaign(row: any): PurchaseCampaign | null {
  if (!row) return null
  const tiers = Array.isArray(row.rate_tiers)
    ? (row.rate_tiers as RateTier[]).map(t => ({ min_yen: Number(t.min_yen), rate: Number(t.rate) })).filter(t => t.min_yen > 0 && t.rate > 0)
    : []
  return {
    id: row.id,
    bonus_rate: Number(row.bonus_rate ?? 1) || 1,
    min_price_yen: row.min_price_yen ?? null,
    max_price_yen: row.max_price_yen ?? null,
    rate_tiers: tiers,
  }
}

/** このパックに掛かるキャンペーン倍率（高額パックの段階倍率があればそちらを優先） */
export function campaignRateFor(pkg: TokenPackage, campaign: PurchaseCampaign | null): number {
  if (!campaign) return 1
  const tier = (campaign.rate_tiers ?? []).filter(t => pkg.price_yen >= t.min_yen).sort((a, b) => b.rate - a.rate)[0]
  return Math.max(campaign.bonus_rate, tier?.rate ?? 0)
}

/** キャンペーンの最大倍率（「最大×3倍」表示用） */
export function campaignMaxRate(campaign: PurchaseCampaign | null): number {
  if (!campaign) return 1
  return Math.max(campaign.bonus_rate, ...(campaign.rate_tiers ?? []).map(t => t.rate))
}

export function findPackage(packageId: string): TokenPackage | null {
  return TOKEN_PACKAGES.find(p => p.id === packageId) ?? null
}

/** キャンペーン対象のパックか */
export function isCampaignTarget(pkg: TokenPackage, campaign: PurchaseCampaign | null): boolean {
  if (!campaign || campaignRateFor(pkg, campaign) <= 1) return false
  return (campaign.min_price_yen == null || pkg.price_yen >= campaign.min_price_yen)
    && (campaign.max_price_yen == null || pkg.price_yen <= campaign.max_price_yen)
}

/**
 * 実際に付与されるポイント。画面表示とサーバーの付与で同じ関数を使う。
 * キャンペーン対象: 基本pt（価格÷10）× 倍率（パック固有ボーナスと比べて多い方）
 */
export function pointsForPackage(pkg: TokenPackage, campaign: PurchaseCampaign | null): number {
  if (!isCampaignTarget(pkg, campaign)) return pkg.tokens
  return Math.max(pkg.tokens, Math.floor(Math.floor(pkg.price_yen / 10) * campaignRateFor(pkg, campaign)))
}
