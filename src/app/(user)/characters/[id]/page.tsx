import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { redirect } from 'next/navigation'
import { CharacterDetailClient } from './CharacterDetailClient'
import { getLocale } from '@/i18n/server'
import { localizedCharacter } from '@/lib/character-i18n'
import { getCharacterPhotosForUser } from '@/lib/character-photos'

export default async function CharacterDetailPage({ params }: { params: { id: string } }) {
  const [user, admin] = [await getAuthUser(), createAdminClientStatic()]
  const userId = user?.id

  // 全クエリ並列（キャラ情報 + ユーザー固有データ 1ウォーターフォール）
  const [charRes, photosRes, ucRes, achRes] = await Promise.all([
    admin.from('characters').select('*').eq('id', params.id).single(),
    getCharacterPhotosForUser(admin, params.id, userId),
    userId
      ? admin.from('user_characters')
          .select('affection_points, affection_level, message_count, last_chat_at')
          .eq('user_id', userId).eq('character_id', params.id).single()
      : Promise.resolve({ data: null }),
    userId
      ? admin.from('user_achievements')
          .select('achievement_key, unlocked_at')
          .eq('user_id', userId).eq('character_id', params.id)
          .order('unlocked_at', { ascending: true })
      : Promise.resolve({ data: [] }),
  ])

  if (!charRes.data) redirect('/characters')

  return (
    <CharacterDetailClient
      character={localizedCharacter(charRes.data, getLocale()) as any}
      photos={photosRes}
      userChar={(ucRes.data ?? null) as any}
      achievements={(achRes.data ?? []) as any}
    />
  )
}
