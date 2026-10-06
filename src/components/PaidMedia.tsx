'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Lock, Play, Heart, Sparkles } from 'lucide-react'
import { GACHA_SINGLE_POINTS } from '@/lib/pricing'
import { PointsShortageDialog } from './PointsShortageDialog'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

type UnlockTarget = { messageId: string } | { photoId: string }

/**
 * 有料メディアの解錠。成功すると URL を返し、ヘッダーのポイント表示も更新する。
 * ポイント不足なら購入ダイアログ（dialog を描画しておくこと）、会員限定なら /payment へ。
 */
export function useMediaUnlock() {
  const { m } = useI18n()
  const [shortage, setShortage] = useState<{ current: number; required: number } | null>(null)

  const unlock = async (target: UnlockTarget): Promise<string | null> => {
    const res = await fetch('/api/media/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(target),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok && data.url) {
      if (typeof data.points === 'number') {
        window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: data.points } }))
      }
      return data.url as string
    }
    handleError(res.status, data)
    return null
  }

  const handleError = (status: number, data: { error?: string; current?: number; required?: number }) => {
    if (status === 402) setShortage({ current: data.current ?? 0, required: data.required ?? 0 })
    else if (status === 403 && data.error === 'members_only') window.location.href = '/payment'
    else if (data.error !== 'level_locked') alert(m.chat.unlockFailed)
  }

  const dialog: ReactNode = shortage ? (
    <PointsShortageDialog
      currentPoints={shortage.current}
      requiredPoints={shortage.required}
      title={m.media.shortageTitle}
      onClose={() => setShortage(null)}
    />
  ) : null

  return { unlock, dialog }
}

/**
 * 未解錠メディアのモザイク表示。previewSrc は /api/media/preview の極小画像（最大6×6px。拡大してドット状に見せる）。
 * 親要素いっぱいに広がるので、親に position: relative と大きさを付けること。
 */
export function MosaicCover({ previewSrc, kind, price, onUnlock, compact }: {
  previewSrc?: string | null
  kind: 'image' | 'video'
  price: number
  onUnlock: () => Promise<unknown>
  compact?: boolean
}) {
  const { m } = useI18n()
  const [busy, setBusy] = useState(false)
  const [previewOk, setPreviewOk] = useState(true)

  const handle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (busy) return
    setBusy(true)
    try { await onUnlock() } finally { setBusy(false) }
  }

  return (
    <button type="button" onClick={handle} disabled={busy}
      className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-white overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #3a2a33 0%, #17131a 100%)' }}>
      {previewSrc && previewOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc} alt="" onError={() => setPreviewOk(false)}
          ref={el => { if (el?.complete && el.naturalWidth === 0) setPreviewOk(false) }}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ imageRendering: 'pixelated' }} />
      )}
      <span className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.28)' }} />
      <span className="relative flex flex-col items-center gap-1.5">
        {kind === 'video'
          ? <Play size={compact ? 16 : 22} strokeWidth={2.2} fill="currentColor" />
          : <Lock size={compact ? 14 : 18} strokeWidth={2.2} />}
        <span className={`font-bold rounded-full ${compact ? 'text-[10px] px-2 py-0.5' : 'text-xs px-3.5 py-1.5'}`}
          style={{ background: 'var(--color-primary)', opacity: busy ? 0.6 : 1 }}>
          {busy ? m.chat.processing : fmt(kind === 'video' ? m.media.watchFor : m.media.viewFor, { pt: price })}
        </span>
      </span>
    </button>
  )
}

/** 好感度レベルが足りないフォト（モザイク＋「Lv.N で見られる」） */
export function LevelLockedCover({ previewSrc, level }: { previewSrc?: string | null; level: number }) {
  const { m } = useI18n()
  const [previewOk, setPreviewOk] = useState(true)
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-white overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #3a2a33 0%, #17131a 100%)' }}>
      {previewSrc && previewOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc} alt="" onError={() => setPreviewOk(false)}
          ref={el => { if (el?.complete && el.naturalWidth === 0) setPreviewOk(false) }}
          className="absolute inset-0 w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
      )}
      <span className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
      <span className="relative flex flex-col items-center gap-1 px-1 text-center">
        <Heart size={15} strokeWidth={2.2} fill="currentColor" />
        <span className="text-[10px] font-bold leading-tight">{fmt(m.media.levelLocked, { level })}</span>
      </span>
    </div>
  )
}

/** まだ持っていないアルバム写真（モザイクのシルエット。ガチャで手に入る） */
export function UnownedPhotoCover({ previewSrc }: { previewSrc?: string | null }) {
  const [previewOk, setPreviewOk] = useState(true)
  return (
    <div className="absolute inset-0 flex items-center justify-center text-white overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #3a2a33 0%, #17131a 100%)' }}>
      {previewSrc && previewOk && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={previewSrc} alt="" onError={() => setPreviewOk(false)}
          ref={el => { if (el?.complete && el.naturalWidth === 0) setPreviewOk(false) }}
          className="absolute inset-0 w-full h-full object-cover" style={{ imageRendering: 'pixelated' }} />
      )}
      <span className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} />
      <span className="relative text-lg font-black opacity-90">?</span>
    </div>
  )
}

/** キャラの写真ガチャへのボタン（まだ持っていない写真があるときだけ出す） */
export function GachaButton({ characterId, remaining }: { characterId: string; remaining: number }) {
  const { m } = useI18n()
  if (remaining <= 0) return null
  return (
    <Link href={`/gacha/${characterId}`} prefetch={false}
      className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white"
      style={{ background: 'var(--color-primary)', borderRadius: 'var(--radius-card, 12px)' }}>
      <Sparkles size={14} />
      {fmt(m.gacha.entry, { pt: GACHA_SINGLE_POINTS, n: remaining })}
    </Link>
  )
}
