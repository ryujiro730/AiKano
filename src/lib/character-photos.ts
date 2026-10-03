import type { SupabaseClient } from '@supabase/supabase-js'
import { getActivePlan } from '@/lib/plans'
import type { CharacterPhoto } from '@/types'

/**
 * キャラのフォト一覧を閲覧ユーザー向けに返す。
 * 会員限定フォトは非会員には URL を渡さず locked: true にする（クライアントで隠すだけにしない）。
 */
export async function getCharacterPhotosForUser(
  admin: SupabaseClient,
  characterId: string,
  userId: string | null | undefined,
): Promise<CharacterPhoto[]> {
  const [{ data: photos }, { data: profile }] = await Promise.all([
    admin.from('character_photos').select('*').eq('character_id', characterId).order('order_index'),
    userId
      ? admin.from('profiles').select('subscription_status, subscription_plan, subscription_period_end, role').eq('id', userId).single()
      : Promise.resolve({ data: null }),
  ])
  const canSeeAll = !!getActivePlan(profile) || profile?.role === 'admin'
  return ((photos ?? []) as CharacterPhoto[]).map(p =>
    p.members_only && !canSeeAll ? { ...p, url: '', locked: true } : { ...p, locked: false },
  )
}
