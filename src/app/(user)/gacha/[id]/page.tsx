export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getCharacterPhotosForUser } from '@/lib/character-photos'
import { localizedCharacter } from '@/lib/character-i18n'
import { getLocale } from '@/i18n/server'
import { GachaClient } from './GachaClient'
import { canUseGacha } from '@/lib/features'

export default async function GachaPage({ params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')
  const admin = createAdminClientStatic()
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!canUseGacha(me?.role)) redirect('/characters')

  const [{ data: character }, photos] = await Promise.all([
    admin.from('characters').select('id, name, avatar_url, i18n').eq('id', params.id).eq('is_active', true).maybeSingle(),
    getCharacterPhotosForUser(admin, params.id, user.id),
  ])
  if (!character) redirect('/album')
  const c = localizedCharacter(character, getLocale())

  return <GachaClient character={{ id: c.id, name: c.name, avatarUrl: c.avatar_url }} photos={photos} />
}
