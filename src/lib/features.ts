/**
 * 写真ガチャ・アルバムを全員に公開するか。
 * 写真がそろうまでは false のまま運用し、その間は管理者（admin / owner）だけが見られる。
 * 公開するときは true にしてデプロイする。
 */
export const GACHA_PUBLIC = false

export function canUseGacha(role: string | null | undefined) {
  return GACHA_PUBLIC || role === 'admin' || role === 'owner'
}
