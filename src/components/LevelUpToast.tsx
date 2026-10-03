'use client'

import { useEffect } from 'react'
import { getAffectionLevel } from '@/lib/affection'
import { AffectionIcon } from './AffectionIcon'

interface Props {
  level: number
  characterName: string
  onClose: () => void
}

export function LevelUpToast({ level, characterName, onClose }: Props) {
  const levelData = getAffectionLevel(
    [0, 50, 200, 500, 1000, 2500, 5000][level - 1] ?? 0
  )

  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
        zIndex: 9999,
        background: '#fff',
        border: '1px solid rgba(23,19,26,0.08)',
        borderRadius: 14,
        padding: '16px 22px',
        boxShadow: '0 12px 32px rgba(23,19,26,0.14)',
        textAlign: 'center',
        minWidth: 240,
        animation: 'levelUpIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        cursor: 'pointer',
      }}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 12, marginBottom: 6, background: `${levelData.color}1a`, color: levelData.color }}>
        <AffectionIcon level={levelData.level} size={20} />
      </span>
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>好感度アップ！</p>
      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text, #17131a)' }}>
        {characterName} との関係が
      </p>
      <p style={{ fontSize: 17, fontWeight: 800, color: levelData.color }}>
        「{levelData.title}」になった！
      </p>
      <style>{`
        @keyframes levelUpIn {
          from { opacity: 0; transform: translateX(-50%) scale(0.7) translateY(-20px); }
          to   { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}
