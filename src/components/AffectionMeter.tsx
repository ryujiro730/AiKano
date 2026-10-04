'use client'

import { getAffectionLevel, getAffectionProgress, AFFECTION_LEVELS } from '@/lib/affection'
import { AffectionIcon } from './AffectionIcon'
import { MessageCircle } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

export function AffectionMeter({
  points = 0,
  messageCount = 0,
  compact = false,
}: {
  points?: number
  messageCount?: number
  compact?: boolean
}) {
  const { m } = useI18n()
  const current = getAffectionLevel(points)
  const progress = getAffectionProgress(points)
  const nextLevel = AFFECTION_LEVELS.find(l => l.level === current.level + 1)

  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold"
        style={{ background: `${current.color}1a`, color: current.color }}
      >
        <AffectionIcon level={current.level} size={11} /> {m.affection.levels[current.level - 1]}
      </span>
    )
  }

  return (
    <div>
      {/* レベルバッジ + タイトル */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-9 h-9 rounded-[10px]" style={{ background: `${current.color}1a`, color: current.color }}>
            <AffectionIcon level={current.level} size={18} />
          </span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700 }}>{m.affection.levels[current.level - 1]}</p>
            <p style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Lv.{current.level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="tabular-nums" style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-text)' }}>{points.toLocaleString()}</p>
          <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{m.meter.affectionPt}</p>
        </div>
      </div>

      {/* プログレスバー */}
      {nextLevel && (
        <div className="mb-1.5">
          <div
            style={{
              height: 4, borderRadius: 2, overflow: 'hidden',
              background: 'var(--color-surface-2)',
            }}
          >
            <div
              style={{
                height: '100%', borderRadius: 2,
                width: `${progress}%`,
                background: current.color,
                transition: 'width 0.8s ease',
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>{progress}%</p>
            <p style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
              {fmt(m.affection.nextFrom, { title: m.affection.levels[nextLevel.level - 1], pt: nextLevel.threshold.toLocaleString() })}
            </p>
          </div>
        </div>
      )}

      {/* メッセージ数 */}
      {messageCount > 0 && (
        <p className="flex items-center gap-1" style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>
          <MessageCircle size={12} /> {fmt(m.meter.messages, { n: messageCount.toLocaleString() })}
        </p>
      )}
    </div>
  )
}
