import type { SupabaseClient } from '@supabase/supabase-js'

/** 初回限定パックを見せてから買えるまでの時間 */
export const FIRST_OFFER_HOURS = 24

/**
 * 初回限定パック（FIRST_PACKAGE）を今この人に出せるか。課金したことがない人だけ・オファーを見せてから24時間（100）。
 * start: まだ見せていなければ、今から24時間の期限を始める（ポイント不足のダイアログ・決済ページを開いたとき）
 */
export async function getFirstOffer(db: SupabaseClient, userId: string, opts: { start?: boolean } = {}) {
  const [{ data: profile }, { count }] = await Promise.all([
    db.from('profiles').select('first_offer_expires_at').eq('id', userId).single(),
    db.from('point_transactions').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('type', 'purchase').gt('price_yen', 0),
  ])
  if ((count ?? 0) > 0) return { eligible: false, expiresAt: null as string | null }
  let expiresAt = (profile?.first_offer_expires_at as string | null) ?? null
  if (!expiresAt && opts.start) {
    const next = new Date(Date.now() + FIRST_OFFER_HOURS * 3600_000).toISOString()
    // 同時に開いても期限は1回だけ決まる
    const { data } = await db.from('profiles').update({ first_offer_expires_at: next }).eq('id', userId).is('first_offer_expires_at', null).select('first_offer_expires_at')
    expiresAt = (data?.[0]?.first_offer_expires_at as string | undefined) ?? next
  }
  const eligible = !!expiresAt && new Date(expiresAt) > new Date()
  return { eligible, expiresAt }
}
