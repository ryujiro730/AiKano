'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Lock, Sparkles, Crown } from 'lucide-react'
import Lightbox from '@/components/Lightbox'
import { LevelLockedCover, UnownedPhotoCover } from '@/components/PaidMedia'
import { GachaTabs } from '@/components/gacha/GachaTabs'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

export type AlbumCharacter = {
  id: string
  name: string
  avatarUrl: string
  /** 持っている写真 */
  owned: { id: string; url: string }[]
  /** まだ持っていない写真（ガチャで手に入る） */
  unowned: string[]
  /** 好感度レベルが足りない写真 */
  levelLocked: { id: string; level: number }[]
  /** 会員限定（非会員には中身を出さない） */
  membersOnly: number
}

const GOLD = 'linear-gradient(90deg, #ff8fb3, #f7d27a)'

export function AlbumClient({ characters }: { characters: AlbumCharacter[] }) {
  const { m } = useI18n()
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null)

  const totalOwned = characters.reduce((n, c) => n + c.owned.length, 0)
  const total = characters.reduce((n, c) => n + c.owned.length + c.unowned.length + c.levelLocked.length, 0)
  const pct = total > 0 ? Math.floor((totalOwned / total) * 100) : 0

  return (
    <div className="pt-2 pb-6">
      <GachaTabs active="collection" />
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>{m.album.lead}</p>

      {/* 全体の達成率 */}
      {total > 0 && (
        <div className="p-4 mb-6" style={{ background: 'linear-gradient(160deg, #3a1630 0%, #1a0b16 100%)', borderRadius: 'var(--radius-card)', boxShadow: '0 0 0 1.5px rgba(242,193,78,0.5)' }}>
          <div className="flex items-end justify-between mb-2">
            <span className="text-[11px] font-bold text-white/70">{m.album.totalLabel}</span>
            <span className="font-black text-white tabular-nums"><span className="text-2xl">{pct}</span><span className="text-sm">%</span></span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.14)' }}>
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: GOLD, boxShadow: '0 0 8px rgba(247,210,122,0.8)' }} />
          </div>
          <p className="text-[11px] text-white/70 mt-1.5 tabular-nums">{fmt(m.album.total, { owned: totalOwned, total })}</p>
        </div>
      )}

      {characters.length === 0 && (
        <p className="text-sm text-center py-16" style={{ color: 'var(--color-text-muted)' }}>{m.album.empty}</p>
      )}

      <div className="space-y-7">
        {characters.map(c => {
          const count = c.owned.length + c.unowned.length + c.levelLocked.length
          const left = count - c.owned.length
          const viewable = [c.avatarUrl, ...c.owned.map(p => p.url)]
          return (
            <section key={c.id}>
              <div className="flex items-center gap-2.5 mb-2">
                <Link href={`/characters/${c.id}`} className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0"
                  style={left === 0 && count > 0 ? { boxShadow: '0 0 0 2px #f2c14e' } : undefined}>
                  <Image src={c.avatarUrl} alt="" fill className="object-cover" sizes="36px" />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm truncate">{c.name}</span>
                    {count > 0 && left === 0 ? (
                      <span className="text-[10px] font-black px-1.5 py-px rounded-md flex items-center gap-0.5" style={{ background: '#fdf3d7', color: '#9a6b0c' }}>
                        <Crown size={10} />{m.album.complete}
                      </span>
                    ) : count > 0 && (
                      <span className="text-[10px] font-bold" style={{ color: 'var(--color-text-muted)' }}>{fmt(m.album.remaining, { n: left })}</span>
                    )}
                  </div>
                  {count > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                        <div className="h-full rounded-full" style={{ width: `${(c.owned.length / count) * 100}%`, background: GOLD }} />
                      </div>
                      <span className="text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{fmt(m.album.total, { owned: c.owned.length, total: count })}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {c.owned.map(p => (
                  <button key={p.id} onClick={() => setLightbox({ photos: viewable, index: viewable.indexOf(p.url) })}
                    className="relative overflow-hidden rounded-[10px]" style={{ aspectRatio: '1' }}>
                    <Image src={p.url} alt="" fill className="object-cover" sizes="33vw" />
                  </button>
                ))}
                {c.unowned.map(id => (
                  <Link key={id} href={`/gacha/${c.id}`} prefetch={false} className="relative overflow-hidden rounded-[10px]" style={{ aspectRatio: '1' }}>
                    <UnownedPhotoCover previewSrc={`/api/media/preview?p=${id}`} />
                  </Link>
                ))}
                {c.levelLocked.map(p => (
                  <div key={p.id} className="relative overflow-hidden rounded-[10px]" style={{ aspectRatio: '1' }}>
                    <LevelLockedCover previewSrc={`/api/media/preview?p=${p.id}`} level={p.level} />
                  </div>
                ))}
                {Array.from({ length: c.membersOnly }).map((_, i) => (
                  <Link key={`m-${i}`} href="/payment"
                    className="relative overflow-hidden rounded-[10px] flex flex-col items-center justify-center gap-1 text-white"
                    style={{ aspectRatio: '1', background: 'linear-gradient(160deg, #3a2a33 0%, #17131a 100%)' }}>
                    <Lock size={15} strokeWidth={2.2} />
                    <span className="text-[10px] font-bold">{m.membersOnly}</span>
                  </Link>
                ))}
              </div>

              {c.unowned.length > 0 && (
                <Link href={`/gacha/${c.id}`} prefetch={false}
                  className="w-full mt-2 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white"
                  style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-card)' }}>
                  <Sparkles size={14} />{m.album.collect}
                </Link>
              )}
            </section>
          )
        })}
      </div>

      {lightbox && (
        <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={() => setLightbox(null)} onChange={i => setLightbox(l => l && { ...l, index: i })} />
      )}
    </div>
  )
}
