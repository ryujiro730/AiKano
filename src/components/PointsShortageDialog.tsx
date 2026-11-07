'use client'

import { useEffect } from 'react'
import { X, CalendarCheck } from 'lucide-react'
import { LOGIN_BONUS, FREE_MESSAGES_PER_LOGIN } from '@/lib/pricing'
import { logAction } from '@/lib/action-log'
import { trackViewCheckout } from '@/lib/meta'
import { PointPackageList } from './PointPackageList'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

interface Props {
  currentPoints: number
  requiredPoints: number
  onClose: () => void
  /** 見出し（既定はチャット向けの文言） */
  title?: string
  /** チャットから開いたとき: キャラの顔と「もっと話したいな…」を出す（気持ちが乗っているところで止まる） */
  characterName?: string
  characterAvatar?: string | null
}

export function PointsShortageDialog({ currentPoints, requiredPoints, onClose, title: titleProp, characterName, characterAvatar }: Props) {
  const { m } = useI18n()
  const title = titleProp ?? m.shortage.defaultTitle
  const shortage = Math.max(0, requiredPoints - currentPoints)

  useEffect(() => {
    logAction('purchase_dialog_open', { metadata: { title, current: currentPoints, required: requiredPoints } })
    trackViewCheckout()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl pb-safe"
        style={{ background: 'var(--color-surface)', maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="font-bold text-base">{title}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {m.shortage.balance} <strong>{currentPoints.toLocaleString()}pt</strong>
              　 {m.shortage.required} <strong style={{ color: 'var(--color-primary)' }}>{requiredPoints.toLocaleString()}pt</strong>
              　 {m.shortage.short} <strong style={{ color: '#ef4444' }}>{shortage.toLocaleString()}pt</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--color-text-muted)' }} aria-label={m.common.close}>
            <X size={18} />
          </button>
        </div>

        <div className="h-px mx-5" style={{ background: 'var(--color-border)' }} />

        {characterName && (
          <div className="mx-5 mt-3 flex items-center gap-3">
            {characterAvatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={characterAvatar} alt="" className="w-11 h-11 rounded-full object-cover flex-shrink-0" />
            )}
            <p className="text-sm font-semibold px-3 py-2 rounded-2xl rounded-tl-sm" style={{ background: 'var(--color-surface-2)' }}>
              {fmt(m.shortage.characterLine, { name: characterName })}
            </p>
          </div>
        )}

        <div className="mx-5 mt-3 rounded-[var(--radius-card,12px)] px-4 py-2.5 flex items-center gap-2.5"
          style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
          <CalendarCheck size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
            <strong>{fmt(m.shortage.dailyFree, { pt: LOGIN_BONUS, n: FREE_MESSAGES_PER_LOGIN })}</strong><br />
            <span style={{ color: 'var(--color-text-muted)' }}>{fmt(m.shortage.comeBack, { n: FREE_MESSAGES_PER_LOGIN })}</span>
          </p>
        </div>

        <div className="px-4 pt-3 pb-6">
          <PointPackageList shortage={shortage} />
        </div>
      </div>
    </div>
  )
}
