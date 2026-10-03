import { createClient } from '@supabase/supabase-js'

export type BadgeCounts = { unread: number; support: number }

/**
 * フッターのバッジ数（メッセージ未読・サポート未読）。
 * 定義は DB の get_badge_counts / get_conversation_unread に一本化（メッセージ一覧と同じ条件）。
 */
export async function getBadgeCounts(userId: string): Promise<BadgeCounts> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) } },
  )
  const { data, error } = await admin.rpc('get_badge_counts', { p_user_id: userId })
  if (error || !data) return { unread: 0, support: 0 }
  return { unread: Number(data.unread) || 0, support: Number(data.support) || 0 }
}
