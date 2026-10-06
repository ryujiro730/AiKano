export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getCharacterPhotosForUser } from '@/lib/character-photos'
import { getLocale } from '@/i18n/server'
import { localizedCharacter } from '@/lib/character-i18n'
import { canUseGacha } from '@/lib/features'
import { AlbumClient, type AlbumCharacter } from './AlbumClient'

// コレクション：キャラごとに集めた写真と、まだ持っていない写真（モザイク）を並べる
export default async function AlbumPage() {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')
  const admin = createAdminClientStatic()
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!canUseGacha(me?.role)) redirect('/characters')
  const locale = getLocale()

  const [{ data: characters }, { data: blocks }] = await Promise.all([
    admin.from('characters').select('id, name, avatar_url, i18n').eq('is_active', true).order('sort_order', { ascending: true }),
    admin.from('blocks').select('character_id').eq('user_id', user.id),
  ])
  const blocked = new Set((blocks ?? []).map((b: { character_id: string }) => b.character_id))
  const visible = (characters ?? []).filter(c => !blocked.has(c.id)).map(c => localizedCharacter(c, locale))

  const album: AlbumCharacter[] = await Promise.all(visible.map(async c => {
    const photos = await getCharacterPhotosForUser(admin, c.id, user.id)
    const collectible = photos.filter(p => !p.locked) // 会員限定（非会員）は集める対象に数えない
    return {
      id: c.id,
      name: c.name,
      avatarUrl: c.avatar_url,
      owned: collectible.filter(p => !p.paywalled && !p.levelLocked).map(p => ({ id: p.id, url: p.url })),
      unowned: collectible.filter(p => p.paywalled).map(p => p.id),
      levelLocked: collectible.filter(p => p.levelLocked).map(p => ({ id: p.id, level: p.required_level ?? 0 })),
      membersOnly: photos.filter(p => p.locked).length,
    }
  }))

  return <AlbumClient characters={album.filter(c => c.owned.length + c.unowned.length + c.levelLocked.length + c.membersOnly > 0)} />
}
