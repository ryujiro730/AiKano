export const dynamic = 'force-dynamic'

import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { ActionLogger } from '@/components/ActionLogger'
import { GameHome } from '@/components/GameHome'
import { canUseGacha } from '@/lib/features'
import { getLocale } from '@/i18n/server'
import { localizedCharacter } from '@/lib/character-i18n'

export default async function CharactersPage() {
  const user = await getAuthUser()
  const userId = user?.id

  const admin = createAdminClientStatic()

  // 全クエリを1ウォーターフォールで並列実行（未読チェックも含む）
  const [{ data: characters }, convData, blocksData, affectionData, unlockData, unreadData, profileData, videoCount] = await Promise.all([
    admin.from('characters').select('id, name, age, avatar_url, requires_unlock, i18n').eq('is_active', true).order('sort_order', { ascending: true }),
    userId
      ? admin.from('conversations').select('id, character_id, last_message_at').eq('user_id', userId).order('last_message_at', { ascending: false })
      : Promise.resolve({ data: [] }),
    userId
      ? admin.from('blocks').select('character_id').eq('user_id', userId)
      : Promise.resolve({ data: [] }),
    userId
      ? admin.from('user_characters').select('character_id, affection_points, affection_level').eq('user_id', userId).limit(200)
      : Promise.resolve({ data: null }),
    userId
      ? admin.from('character_unlocks').select('character_id').eq('user_id', userId)
      : Promise.resolve({ data: [] }),
    userId
      ? admin.rpc('get_conversation_unread', { p_user_id: userId })
      : Promise.resolve({ data: [] }),
    userId
      ? admin.from('profiles').select('partner_character_id, role').eq('id', userId).single()
      : Promise.resolve({ data: null }),
    admin.from('video_items').select('id', { count: 'exact', head: true }).eq('is_active', true),
  ])

  const blockedIds = new Set(((blocksData as any)?.data ?? []).map((b: any) => b.character_id as string))
  const locale = getLocale()
  const visibleChars = (characters ?? [])
    .filter((c: any) => !blockedIds.has(c.id))
    .map((c: any) => localizedCharacter(c, locale))
    .map((c: any) => ({
      id: c.id as string,
      name: c.name as string,
      age: (c.age ?? 0) as number,
      avatar_url: c.avatar_url as string,
      requires_unlock: (c.requires_unlock ?? false) as boolean,
    }))

  const unlockedCharIds: string[] = ((unlockData as any)?.data ?? []).map((r: any) => r.character_id as string)

  const affectionMap: Record<string, { points: number; level: number }> = {}
  for (const row of (affectionData as any)?.data ?? []) {
    affectionMap[row.character_id] = { points: row.affection_points ?? 0, level: row.affection_level ?? 1 }
  }

  const convDataArr = (convData as any)?.data ?? []
  // 優先度: オンボーディング選択 → 最終チャット → allChars[0]
  const partnerCharId: string | null = (profileData as any)?.data?.partner_character_id ?? null
  const partnerChar = partnerCharId
    ? (visibleChars.find(c => c.id === partnerCharId) ?? null)
    : (convDataArr.find((c: any) => visibleChars.some(ch => ch.id === c.character_id))
        ? visibleChars.find(c => c.id === convDataArr.find((cv: any) => visibleChars.some(ch => ch.id === cv.character_id))?.character_id) ?? null
        : null)

  // 未読: メッセージ一覧・フッターと同じ DB 関数（キャラごとの未読件数）
  const unreadByChar: Record<string, number> = {}
  for (const row of ((unreadData as any)?.data ?? []) as { character_id: string; unread: number }[]) {
    unreadByChar[row.character_id] = row.unread
  }

  return (
    <>
      <GameHome
        partnerChar={partnerChar}
        allChars={visibleChars}
        affectionMap={affectionMap}
        unreadByChar={unreadByChar}
        unlockedCharIds={unlockedCharIds}
        hasVideos={((videoCount as any)?.count ?? 0) > 0}
        showAlbum={canUseGacha((profileData as any)?.data?.role)}
      />
      <ActionLogger actionType="character_search" />
    </>
  )
}
