'use client'

import { useEffect } from 'react'
import { getAffectionLevel } from '@/lib/affection'

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
        background: 'linear-gradient(135deg, rgba(253,246,249,0.98), rgba(255,255,255,0.98))',
        border: `1.5px solid ${levelData.color}`,
        borderRadius: 16,
        padding: '14px 20px',
        boxShadow: `0 8px 32px ${levelData.color}44`,
        textAlign: 'center',
        minWidth: 240,
        animation: 'levelUpIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        cursor: 'pointer',
      }}
    >
      <p style={{ fontSize: 28, marginBottom: 4 }}>{levelData.emoji}</p>
      <p style={{ fontSize: 11, color: 'var(--color-text-muted)', marginBottom: 2 }}>好感度アップ！</p>
      <p style={{ fontSize: 15, fontWeight: 800, color: levelData.color }}>
        {characterName} との関係が
      </p>
      <p style={{ fontSize: 17, fontWeight: 900, color: levelData.color }}>
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
