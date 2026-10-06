import type { SupabaseClient } from '@supabase/supabase-js'
import { getActivePlan } from '@/lib/plans'
import { getUnlockedUrls } from '@/lib/paid-media'
import type { CharacterPhoto } from '@/types'

/**
 * キャラのフォト一覧を閲覧ユーザー向けに返す。URL を渡してよいものだけ url を入れる（クライアントで隠すだけにしない）。
 * - 会員限定フォト：非会員には locked: true
 * - 好感度レベル限定フォト（required_level）：レベル不足なら levelLocked: true、達していれば無料で見られる
 * - それ以外は1枚ずつ有料（会員も）。未解錠なら paywalled: true
 */
export async function getCharacterPhotosForUser(
  admin: SupabaseClient,
  characterId: string,
  userId: string | null | undefined,
): Promise<CharacterPhoto[]> {
  const [{ data: photos }, { data: profile }, { data: uc }] = await Promise.all([
    admin.from('character_photos').select('*').eq('character_id', characterId).order('order_index'),
    userId
      ? admin.from('profiles').select('subscription_status, subscription_plan, subscription_period_end, role').eq('id', userId).single()
      : Promise.resolve({ data: null }),
    userId
      ? admin.from('user_characters').select('affection_level').eq('user_id', userId).eq('character_id', characterId).maybeSingle()
      : Promise.resolve({ data: null }),
  ])
  const isAdmin = profile?.role === 'admin'
  const canSeeAll = !!getActivePlan(profile) || isAdmin
  const level: number = (uc as { affection_level?: number } | null)?.affection_level ?? 1
  const list = (photos ?? []) as CharacterPhoto[]
  // 管理者もユーザー画面では一般ユーザーと同じ見え方にする（ガチャ・レベルの確認ができるように）
  const unlocked = userId ? await getUnlockedUrls(admin, userId, list.map(p => p.url)) : new Set<string>()
  return list.map(p => {
    if (p.members_only && !canSeeAll) return { ...p, url: '', locked: true, paywalled: true }
    if (p.required_level) {
      return level >= p.required_level
        ? { ...p, locked: false, paywalled: false, levelLocked: false }
        : { ...p, url: '', locked: false, paywalled: false, levelLocked: true }
    }
    if (!unlocked.has(p.url)) return { ...p, url: '', locked: false, paywalled: true }
    return { ...p, locked: false, paywalled: false }
  })
}

/** ユーザーのそのキャラへの好感度レベル */
export async function getAffectionLevel(admin: SupabaseClient, userId: string, characterId: string) {
  const { data } = await admin.from('user_characters').select('affection_level').eq('user_id', userId).eq('character_id', characterId).maybeSingle()
  return (data?.affection_level as number | undefined) ?? 1
}
