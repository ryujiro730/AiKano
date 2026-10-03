export const dynamic = 'force-dynamic'

import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { ActionLogger } from '@/components/ActionLogger'
import { GameHome } from '@/components/GameHome'

export default async function CharactersPage() {
  const user = await getAuthUser()
  const userId = user?.id

  const admin = createAdminClientStatic()

  // 全クエリを1ウォーターフォールで並列実行（未読チェックも含む）
  const [{ data: characters }, convData, blocksData, affectionData, unlockData, unreadData, profileData] = await Promise.all([
    admin.from('characters').select('id, name, age, avatar_url, requires_unlock').eq('is_active', true).order('sort_order', { ascending: true }),
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
      ? admin.rpc('get_unread_char_ids', { p_user_id: userId })
      : Promise.resolve({ data: [] }),
    userId
      ? admin.from('profiles').select('partner_character_id').eq('id', userId).single()
      : Promise.resolve({ data: null }),
  ])

  const blockedIds = new Set(((blocksData as any)?.data ?? []).map((b: any) => b.character_id as string))
  const visibleChars = (characters ?? [])
    .filter((c: any) => !blockedIds.has(c.id))
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

  // 未読: RPC が返す UUID[] からそのまま構築（直列2クエリ不要）
  const unreadByChar: Record<string, number> = {}
  for (const charId of ((unreadData as any)?.data ?? []) as string[]) {
    unreadByChar[charId] = 1
  }

  return (
    <>
      <GameHome
        partnerChar={partnerChar}
        allChars={visibleChars}
        affectionMap={affectionMap}
        unreadByChar={unreadByChar}
        unlockedCharIds={unlockedCharIds}
      />
      <ActionLogger actionType="character_search" />
    </>
  )
}
