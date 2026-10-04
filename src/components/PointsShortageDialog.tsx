'use client'

import { useEffect } from 'react'
import { X, CalendarCheck } from 'lucide-react'
import { LOGIN_BONUS, FREE_MESSAGES_PER_LOGIN } from '@/lib/pricing'
import { logAction } from '@/lib/action-log'
import { PointPackageList } from './PointPackageList'

interface Props {
  currentPoints: number
  requiredPoints: number
  onClose: () => void
  /** 見出し（既定はチャット向けの文言） */
  title?: string
}

export function PointsShortageDialog({ currentPoints, requiredPoints, onClose, title = '続けて話すにはポイントが必要です' }: Props) {
  const shortage = Math.max(0, requiredPoints - currentPoints)

  useEffect(() => {
    logAction('purchase_dialog_open', { metadata: { title, current: currentPoints, required: requiredPoints } })
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
              残高 <strong>{currentPoints.toLocaleString()}pt</strong>
              　 必要 <strong style={{ color: 'var(--color-primary)' }}>{requiredPoints.toLocaleString()}pt</strong>
              　 不足 <strong style={{ color: '#ef4444' }}>{shortage.toLocaleString()}pt</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--color-text-muted)' }} aria-label="閉じる">
            <X size={18} />
          </button>
        </div>

        <div className="h-px mx-5" style={{ background: 'var(--color-border)' }} />

        <div className="mx-5 mt-3 rounded-[var(--radius-card,12px)] px-4 py-2.5 flex items-center gap-2.5"
          style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
          <CalendarCheck size={18} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
            <strong>毎日ログインで{LOGIN_BONUS}pt（{FREE_MESSAGES_PER_LOGIN}通分）無料</strong><br />
            <span style={{ color: 'var(--color-text-muted)' }}>明日また会いに来れば、{FREE_MESSAGES_PER_LOGIN}通分話せます</span>
          </p>
        </div>

        <div className="px-4 pt-3 pb-6">
          <PointPackageList shortage={shortage} />
        </div>
      </div>
    </div>
  )
}
