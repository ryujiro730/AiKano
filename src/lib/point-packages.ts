import { TOKEN_PACKAGES, type TokenPackage } from '@/types'

/** 購入時に適用されるキャンペーン（倍率と対象価格帯） */
export type PurchaseCampaign = {
  id: string
  bonus_rate: number
  min_price_yen: number | null
  max_price_yen: number | null
}

export function findPackage(packageId: string): TokenPackage | null {
  return TOKEN_PACKAGES.find(p => p.id === packageId) ?? null
}

/** キャンペーン対象のパックか */
export function isCampaignTarget(pkg: TokenPackage, campaign: PurchaseCampaign | null): boolean {
  if (!campaign || campaign.bonus_rate <= 1) return false
  return (campaign.min_price_yen == null || pkg.price_yen >= campaign.min_price_yen)
    && (campaign.max_price_yen == null || pkg.price_yen <= campaign.max_price_yen)
}

/**
 * 実際に付与されるポイント。画面表示とサーバーの付与で同じ関数を使う。
 * キャンペーン対象: 基本pt（価格÷10）× 倍率（パック固有ボーナスと比べて多い方）
 */
export function pointsForPackage(pkg: TokenPackage, campaign: PurchaseCampaign | null): number {
  if (!isCampaignTarget(pkg, campaign)) return pkg.tokens
  return Math.max(pkg.tokens, Math.floor(Math.floor(pkg.price_yen / 10) * campaign!.bonus_rate))
}
