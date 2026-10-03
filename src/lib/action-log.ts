export type ActionType =
  | 'page_view'
  | 'chat_open'
  | 'message_sent'
  | 'image_view'
  | 'image_sent'
  | 'video_sent'
  | 'points_shortage'
  | 'payment_page'
  | 'point_purchase'
  | 'character_search'
  | 'shop_open'
  | 'conversations_view'
  | 'settings_view'
  | 'support_view'
  | 'videos_view'
  | 'points_view'
  | 'crosspromo_view'
  | 'purchase_dialog_open'
  | 'crosspromo_click'

export async function logAction(
  actionType: ActionType,
  options?: { pagePath?: string; metadata?: Record<string, unknown> }
) {
  try {
    await fetch('/api/log-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action_type: actionType,
        page_path: options?.pagePath ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
        metadata: options?.metadata,
      }),
    })
  } catch {
    // ログ失敗は無視
  }
}
