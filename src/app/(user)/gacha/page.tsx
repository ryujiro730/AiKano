export const dynamic = 'force-dynamic'

import { redirect } from 'next/navigation'
import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getActivePlan } from '@/lib/plans'
import { getGachaPool } from '@/lib/gacha'
import { localizedCharacter } from '@/lib/character-i18n'
import { getLocale } from '@/i18n/server'
import { canUseGacha } from '@/lib/features'
import { GachaClient, type GachaCharacter } from './GachaClient'

// 写真ガチャ：全キャラの写真からひとつのガチャ（キャラは選べない）。下にキャラごとの集め具合と提供割合を出す
export default async function GachaPage() {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')
  const admin = createAdminClientStatic()
  const { data: me } = await admin.from('profiles').select('role, subscription_status, subscription_plan, subscription_period_end').eq('id', user.id).single()
  if (!canUseGacha(me?.role)) redirect('/characters')
  const locale = getLocale()

  const [{ pool, remaining }, { data: characters }, { count: membersOnly }] = await Promise.all([
    getGachaPool(admin, user.id),
    admin.from('characters').select('id, name, avatar_url, i18n').eq('is_active', true).order('sort_order', { ascending: true }),
    admin.from('character_photos').select('id', { count: 'exact', head: true }).eq('members_only', true),
  ])
  const left = new Set(remaining.map(p => p.id))
  const stats = new Map<string, { total: number; owned: number }>()
  for (const p of pool) {
    const s = stats.get(p.character_id) ?? { total: 0, owned: 0 }
    s.total++
    if (!left.has(p.id)) s.owned++
    stats.set(p.character_id, s)
  }
  const list: GachaCharacter[] = (characters ?? [])
    .filter(c => stats.has(c.id))
    .map(c => {
      const l = localizedCharacter(c, locale)
      return { id: c.id, name: l.name, avatarUrl: c.avatar_url, ...stats.get(c.id)! }
    })
  const isMember = !!getActivePlan(me) || me?.role === 'admin'

  return <GachaClient characters={list} showMembersOnlyNote={!isMember && (membersOnly ?? 0) > 0} />
}
