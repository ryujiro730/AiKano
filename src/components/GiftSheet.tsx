'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Loader2, Heart, Camera } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

type OwnedItem = { item_id: string; quantity: number; item: { id: string; name: string; image_url: string | null; affection_points: number } }

export type GiftResult = {
  message: unknown
  conversationId: string
  affectionGained: number
  affection: { affection_points: number; affection_level: number; message_count: number; leveled_up?: boolean } | null
  itemName: string
}

/** 持ち物からキャラにプレゼントを贈るシート */
export function GiftSheet({ characterId, characterName, onClose, onGifted }: {
  characterId: string
  characterName: string
  onClose: () => void
  onGifted: (r: GiftResult) => void
}) {
  const { m } = useI18n()
  const [owned, setOwned] = useState<OwnedItem[] | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [teaser, setTeaser] = useState<{ total: number; photos: { itemName: string; itemIcon: string | null; preview: string }[] } | null>(null)

  useEffect(() => {
    fetch('/api/items').then(r => r.json()).then(d => setOwned(d.inventory ?? [])).catch(() => setOwned([]))
    fetch(`/api/items/teaser?characterId=${encodeURIComponent(characterId)}`).then(r => r.ok ? r.json() : null).then(setTeaser).catch(() => {})
  }, [characterId])

  const send = async () => {
    const target = owned?.find(o => o.item_id === selected)
    if (!target || sending) return
    setSending(true)
    setError('')
    const res = await fetch('/api/items/gift', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: target.item_id, characterId }),
    })
    const data = await res.json().catch(() => ({}))
    setSending(false)
    if (!res.ok) { setError(data.error ?? m.common.error); return }
    onGifted({ ...data, itemName: target.item.name })
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-lg rounded-t-2xl pb-safe" style={{ background: 'var(--color-surface)', maxHeight: '80vh', overflowY: 'auto' }}>
        <div className="flex items-start justify-between px-5 pt-5 pb-3">
          <div>
            <p className="font-bold text-base">{fmt(m.gift.title, { name: characterName })}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{fmt(m.gift.lead, { name: characterName })}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--color-text-muted)' }} aria-label={m.common.close}>
            <X size={18} />
          </button>
        </div>

        <div className="px-4 pb-5">
          {/* 贈るとそのアイテムを持った写真が届く（character_item_photos）。実物をぼかして数枚ちら見せする */}
          <div className="mb-4 p-3 rounded-[var(--radius-card,12px)]"
            style={{ background: 'linear-gradient(160deg, #fff1f6 0%, #ffe3ee 100%)', border: '1px solid var(--color-primary-border)' }}>
            <p className="flex items-center gap-1.5 text-sm font-black" style={{ color: 'var(--color-primary)' }}>
              <Camera size={16} className="flex-shrink-0" />{fmt(m.gift.teaserTitle, { name: characterName })}
            </p>
            <p className="text-[11px] mt-0.5 mb-2.5" style={{ color: 'var(--color-text-muted)' }}>
              {teaser?.total ? fmt(m.gift.teaserSub, { name: characterName, n: teaser.total }) : fmt(m.gift.photoHint, { name: characterName })}
            </p>
            {teaser && teaser.photos.length > 0 && (
              <div className="grid grid-cols-4 gap-1.5">
                {teaser.photos.map((p, i) => (
                  <div key={i} className="relative overflow-hidden rounded-[10px]" style={{ aspectRatio: '2 / 3', background: 'var(--color-surface-2)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.preview} alt="" className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: 'blur(5px) saturate(1.1)', transform: 'scale(1.15)' }} />
                    {p.itemIcon && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.itemIcon} alt={p.itemName} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 object-cover rounded-lg"
                        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {owned === null ? (
            <div className="flex justify-center py-10"><Loader2 className="animate-spin" size={20} style={{ color: 'var(--color-primary)' }} /></div>
          ) : owned.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>{m.gift.empty}</p>
              <Link href="/shop" className="btn-primary px-5 py-2.5 text-sm inline-block">{m.gift.goShop}</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2.5">
                {owned.map(o => {
                  const active = selected === o.item_id
                  return (
                    <button key={o.item_id} onClick={() => setSelected(o.item_id)}
                      className="relative rounded-[var(--radius-card,12px)] p-2 flex flex-col items-center text-center transition-transform active:scale-95"
                      style={{ background: active ? 'var(--color-primary-soft)' : 'var(--color-surface-2)', border: `2px solid ${active ? 'var(--color-primary)' : 'transparent'}` }}>
                      <span className="absolute top-1.5 right-1.5 text-[10px] font-bold px-1.5 rounded-md tabular-nums"
                        style={{ background: 'var(--color-primary)', color: '#fff' }}>{fmt(m.gift.owned, { n: o.quantity })}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {o.item.image_url && <img src={o.item.image_url} alt="" className="w-16 h-16 object-contain" />}
                      <span className="text-[11px] font-semibold mt-1 leading-tight line-clamp-2">{o.item.name}</span>
                      <span className="flex items-center gap-0.5 text-[10px] mt-0.5" style={{ color: 'var(--color-primary)' }}>
                        <Heart size={9} fill="currentColor" />{fmt(m.gift.affectionValue, { n: o.item.affection_points })}
                      </span>
                    </button>
                  )
                })}
              </div>
              {error && <p className="text-xs mt-3 text-center" style={{ color: '#ef4444' }}>{error}</p>}
              <button onClick={send} disabled={!selected || sending}
                className="btn-primary w-full mt-4 py-3 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40">
                {sending ? <><Loader2 size={15} className="animate-spin" />{m.gift.sending}</> : m.gift.send}
              </button>
              <Link href="/shop" className="block text-center text-xs mt-3 font-semibold" style={{ color: 'var(--color-primary)' }}>{m.gift.goShop} →</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
