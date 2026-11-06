/**
 * メールの種類。送るときに Resend のタグ（kind）として付け、Webhook で受け取って種類別に集計する（管理画面「メール」）
 */
export const EMAIL_KIND_LABEL: Record<string, string> = {
  auto_broadcast: '新着通知（自動同報）',
  follow_up: '追いLINE（呼び戻し）',
  staff_reply: '新着通知（スタッフ返信）',
  individual: '新着通知（個別送信）',
  campaign_launch: 'キャンペーン開始',
  campaign_reminder: 'キャンペーンの追いメール',
  auth: '登録・ログイン（Supabase）',
  feedback: 'フィードバック（管理者あて）',
  other: 'その他',
}

export type EmailKind = keyof typeof EMAIL_KIND_LABEL

/** Resend の send / batch.send に渡す tags */
export function kindTags(kind: EmailKind): { name: string; value: string }[] {
  return [{ name: 'kind', value: kind }]
}

/** タグが無いメール（Supabase が送る登録確認メールなど）を件名から推定する */
export function guessKind(subject: string | null | undefined): EmailKind {
  const s = subject ?? ''
  if (s.includes('メールアドレスの確認') || s.includes('パスワード') || s.includes('Confirm') || s.includes('Magic Link')) return 'auth'
  if (s.includes('フィードバック')) return 'feedback'
  if (s.includes('キャンペーン')) return 'campaign_launch'
  if (s.includes('メッセージが届きました')) return 'auto_broadcast'
  return 'other'
}
