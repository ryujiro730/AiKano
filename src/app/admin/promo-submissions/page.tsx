export const dynamic = 'force-dynamic'

import { createAdminClient } from '@/lib/supabase/server'
import { PromoReviewList } from './PromoReviewList'

export default async function PromoSubmissionsPage() {
  const admin = createAdminClient()

  const { data: submissions } = await admin
    .from('promo_submissions')
    .select(`
      id, post_url, screenshot_url, status, notes, created_at,
      user_id,
      character_id
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  if (!submissions || submissions.length === 0) {
    const pending: any[] = []
    const reviewed: any[] = []
    return <PromoReviewList pending={pending} reviewed={reviewed} />
  }

  // ユーザー・キャラ情報を補完
  const userIds = Array.from(new Set(submissions.map(s => s.user_id)))
  const charIds = Array.from(new Set(submissions.map(s => s.character_id)))

  const [{ data: profiles }, { data: characters }] = await Promise.all([
    admin.from('profiles').select('id, display_name').in('id', userIds),
    admin.from('characters').select('id, name').in('id', charIds),
  ])

  const profileMap = new Map((profiles ?? []).map(p => [p.id, p]))
  const charMap = new Map((characters ?? []).map(c => [c.id, c]))

  const enriched = submissions.map(s => ({
    ...s,
    user_name: profileMap.get(s.user_id)?.display_name ?? s.user_id.slice(0, 8),
    character_name: charMap.get(s.character_id)?.name ?? '不明',
  }))

  const pending = enriched.filter(s => s.status === 'pending')
  const reviewed = enriched.filter(s => s.status !== 'pending')

  return <PromoReviewList pending={pending} reviewed={reviewed} />
}
