import type { SupabaseClient } from '@supabase/supabase-js'
import { resolveCampaignForUser, type CampaignRow } from './campaign-eligibility'

/**
 * ユーザーに適用されるキャンペーンを1件返す（倍率の高い順）。
 * 表示（/api/campaigns/active・バナー）と購入時の付与（/api/stripe/checkout）で同じ判定を使う。
 * 判定の中身は campaign-eligibility.ts（期間・一人一回限り・対象性別・条件）
 */
export async function findEligibleCampaign(
  db: SupabaseClient,
  userId: string,
  opts: { purchaseContext: boolean; requireImage?: boolean },
): Promise<CampaignRow | null> {
  // 「1回のみ表示」の既表示は、表示のときだけ見る（購入時の倍率判定では見ない）
  const displayedIds = opts.purchaseContext
    ? undefined
    : new Set(((await db.from('campaign_displays').select('campaign_id').eq('user_id', userId).limit(500)).data ?? []).map(d => d.campaign_id as string))
  return resolveCampaignForUser(db, userId, { purchaseContext: opts.purchaseContext, displayedIds, requireImage: opts.requireImage })
}
