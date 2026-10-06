export const dynamic = 'force-dynamic'

import Link from 'next/link'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { ChevronRight, Sparkles } from 'lucide-react'
import { createAdminClientStatic } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getActivePlan } from '@/lib/plans'
import { localizedCharacter } from '@/lib/character-i18n'
import { getLocale, getMessages } from '@/i18n/server'
import { fmt } from '@/i18n/fmt'
import { GACHA_SINGLE_POINTS } from '@/lib/pricing'
import { canUseGacha } from '@/lib/features'
import { GachaTabs } from '@/components/gacha/GachaTabs'

// 写真ガチャの入口：キャラごとの集め具合を並べ、選ぶとそのキャラのガチャへ
export default async function GachaIndexPage() {
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')
  const admin = createAdminClientStatic()
  const m = getMessages()
  const { data: me } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (!canUseGacha(me?.role)) redirect('/characters')
  const locale = getLocale()

  const [{ data: characters }, { data: photos }, { data: owned }, { data: blocks }, { data: profile }] = await Promise.all([
    admin.from('characters').select('id, name, avatar_url, i18n').eq('is_active', true).order('sort_order', { ascending: true }),
    admin.from('character_photos').select('character_id, url, members_only, required_level').limit(10000),
    admin.from('media_unlocks').select('url').eq('user_id', user.id).limit(5000),
    admin.from('blocks').select('character_id').eq('user_id', user.id),
    admin.from('profiles').select('subscription_status, subscription_plan, subscription_period_end, role').eq('id', user.id).single(),
  ])
  const canSeeMembers = !!getActivePlan(profile) || profile?.role === 'admin'
  const ownedUrls = new Set((owned ?? []).map(r => r.url as string))
  const blocked = new Set((blocks ?? []).map(b => b.character_id as string))

  // キャラごとの ガチャの中身 / 持っている枚数（ガチャの判定と同じ条件）
  const stats = new Map<string, { total: number; owned: number }>()
  for (const p of photos ?? []) {
    if (p.required_level || (p.members_only && !canSeeMembers)) continue
    const s = stats.get(p.character_id) ?? { total: 0, owned: 0 }
    s.total++
    if (ownedUrls.has(p.url)) s.owned++
    stats.set(p.character_id, s)
  }
  const list = (characters ?? [])
    .filter(c => !blocked.has(c.id) && (stats.get(c.id)?.total ?? 0) > 0)
    .map(c => ({ ...localizedCharacter(c, locale), ...stats.get(c.id)! }))

  return (
    <div className="pt-2 pb-6">
      <GachaTabs active="gacha" />
      <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>{m.gacha.indexLead}</p>

      {list.length === 0 && (
        <p className="text-sm text-center py-16" style={{ color: 'var(--color-text-muted)' }}>{m.gacha.empty}</p>
      )}

      <div className="flex flex-col gap-2.5">
        {list.map(c => {
          const left = c.total - c.owned
          return (
            <Link key={c.id} href={`/gacha/${c.id}`} prefetch={false}
              className="flex items-center gap-3 p-3"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
              <span className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                <Image src={c.avatar_url} alt="" fill className="object-cover" sizes="56px" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{c.name}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(c.owned / c.total) * 100}%`, background: 'linear-gradient(90deg, #ff8fb3, #f2c14e)' }} />
                  </div>
                  <span className="text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
                    {fmt(m.gacha.progress, { owned: c.owned, total: c.total })}
                  </span>
                </div>
              </div>
              {left > 0 ? (
                <span className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-full text-white flex items-center gap-1"
                  style={{ background: 'var(--color-primary)' }}>
                  <Sparkles size={12} />{GACHA_SINGLE_POINTS}pt
                </span>
              ) : (
                <span className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-full"
                  style={{ background: '#fdf3d7', color: '#9a6b0c' }}>{m.gacha.completeShort}</span>
              )}
              <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
