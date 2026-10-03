export const dynamic = 'force-dynamic'

import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { ActionLogger } from '@/components/ActionLogger'
import { GameHome } from '@/components/GameHome'

export default async function CharactersPage() {
  const user = await getAuthUser()
  const userId = user?.id

  const admin = createAdminClientStatic()

  const [{ data: characters }, convData, blocksData, affectionData, unlockData] = await Promise.all([
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

  // 解放済みキャラID
  const unlockedCharIds: string[] = ((unlockData as any)?.data ?? []).map((r: any) => r.character_id as string)

  // 好感度マップ
  const affectionMap: Record<string, { points: number; level: number }> = {}
  for (const row of (affectionData as any)?.data ?? []) {
    affectionMap[row.character_id] = { points: row.affection_points ?? 0, level: row.affection_level ?? 1 }
  }

  // パートナー（最近会話したキャラ）
  const convDataArr = (convData as any)?.data ?? []
  const partnerConv = convDataArr.find((c: any) => visibleChars.some(ch => ch.id === c.character_id))
  const partnerChar = partnerConv ? visibleChars.find(c => c.id === partnerConv.character_id) ?? null : null

  // 未読カウント
  const unreadByChar: Record<string, number> = {}
  if (userId && convDataArr.length > 0) {
    const convIds = convDataArr.map((c: any) => c.id as string)
    const { data: unreadMsgs } = await admin
      .from('messages')
      .select('conversation_id')
      .in('conversation_id', convIds)
      .eq('sender_role', 'character')
      .eq('is_read', false)

    const unreadConvIds = Array.from(new Set((unreadMsgs ?? []).map((m: any) => m.conversation_id as string)))
    if (unreadConvIds.length > 0) {
      const { data: latestMsgs } = await admin
        .from('messages')
        .select('conversation_id, sender_role')
        .in('conversation_id', unreadConvIds)
        .order('created_at', { ascending: false })

      const latestByConv = new Map<string, string>()
      for (const msg of latestMsgs ?? []) {
        const m = msg as { conversation_id: string; sender_role: string }
        if (!latestByConv.has(m.conversation_id)) latestByConv.set(m.conversation_id, m.sender_role)
      }
      latestByConv.forEach((role, convId) => {
        if (role === 'character') {
          const conv = convDataArr.find((c: any) => c.id === convId)
          if (conv) unreadByChar[conv.character_id] = (unreadByChar[conv.character_id] ?? 0) + 1
        }
      })
    }
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
