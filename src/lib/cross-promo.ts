/**
 * マチコイ（自社回し）への送客設定。
 * 送客先・画像・UTM はここだけで管理する。計測は送客先側の utm_source=aikano で行う。
 */
export const SISTER_SITE = {
  name: 'マチコイ',
  tagline: '気になる人と、メッセージから始まる出会い',
  url: 'https://matchkoi.com/lp/1',
  image: '/banners/matchkoi-wide.webp',
  imageAlt: 'マチコイ — 無料登録で始める',
} as const

export type CrossPromoPlacement = 'conversations'

export function crossPromoHref(placement: CrossPromoPlacement) {
  const p = new URLSearchParams({
    utm_source: 'aikano',
    utm_medium: 'banner',
    utm_campaign: 'crosspromo',
    utm_content: `普通_${placement}`,
  })
  return `${SISTER_SITE.url}?${p.toString()}`
}
