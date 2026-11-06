/**
 * 写真ガチャ・アルバムを全員に公開するか。
 * false の間は管理者（admin / owner）だけが見られる。2026-11-06 にコンビニ払いの承認後、全員に公開した。
 */
export const GACHA_PUBLIC = true

export function canUseGacha(role: string | null | undefined) {
  return GACHA_PUBLIC || role === 'admin' || role === 'owner'
}
