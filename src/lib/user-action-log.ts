import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * サーバー側で確定したユーザー行動を user_action_logs に記録する（管理画面のアクションログ用）。
 * クライアントの logAction と違い、課金・送信など「実際に起きたこと」を確実に残す。
 * 記録時点のポイント残高（有効なボーナス込み）も保存し、管理画面で増減を表示する。
 * 失敗しても本処理には影響させない。
 */
export type ServerActionType =
  | 'signup_complete'
  | 'message_sent'
  | 'points_shortage'
  | 'checkout_start'
  | 'point_purchase_complete'
  | 'subscription_checkout_start'
  | 'subscription_start'
  | 'subscription_renew'
  | 'subscription_cancel'
  | 'subscription_payment_failed'
  | 'subscription_bonus'
  | 'login_bonus'
  | 'level_up'
  | 'video_purchase'
  | 'media_unlock'
  | 'gacha_draw'
  | 'item_purchase'
  | 'item_use'
  | 'character_block'
  | 'admin_points_adjust'
  | 'admin_ban'

export async function logUserAction(
  db: SupabaseClient,
  userId: string,
  actionType: ServerActionType,
  metadata?: Record<string, unknown>,
) {
  try {
    const { data: p } = await db
      .from('profiles')
      .select('points, bonus_points, bonus_points_expires_at')
      .eq('id', userId)
      .single()
    const bonus = p?.bonus_points_expires_at && new Date(p.bonus_points_expires_at) > new Date() ? (p.bonus_points ?? 0) : 0
    await db.from('user_action_logs').insert({
      user_id: userId,
      action_type: actionType,
      metadata: metadata ?? null,
      points_balance: p ? (p.points ?? 0) + bonus : null,
    })
  } catch (e) {
    console.error('[user-action-log]', actionType, e instanceof Error ? e.message : e)
  }
}
