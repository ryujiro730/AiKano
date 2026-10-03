'use client'

import { useState, useEffect } from 'react'
import { getAffectionLevel, getAffectionProgress } from '@/lib/affection'
import { UnlockModal } from './UnlockModal'

type CharData = {
  id: string
  name: string
  age: number
  avatar_url: string
  requires_unlock: boolean
}

type AffData = { points: number; level: number }

export function GameHome({
  partnerChar,
  allChars,
  affectionMap,
  unreadByChar,
  unlockedCharIds,
}: {
  partnerChar: CharData | null
  allChars: CharData[]
  affectionMap: Record<string, AffData>
  unreadByChar: Record<string, number>
  unlockedCharIds: string[]
}) {
  const unlockedSet = new Set(unlockedCharIds)
  const defaultChar = partnerChar ?? allChars[0] ?? null
  const [activeChar, setActiveChar] = useState<CharData | null>(defaultChar)
  const [unlockTarget, setUnlockTarget] = useState<CharData | null>(null)
  const [localUnlocked, setLocalUnlocked] = useState<Set<string>>(new Set(unlockedCharIds))

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!activeChar || allChars.length === 0) return null

  const isCharLocked = (char: CharData) =>
    char.requires_unlock && !localUnlocked.has(char.id)

  const aff = affectionMap[activeChar.id]
  const affLevel = aff ? getAffectionLevel(aff.points) : null
  const affProgress = aff ? getAffectionProgress(aff.points) : 0
  const unread = unreadByChar[activeChar.id] ?? 0
  const isLocked = isCharLocked(activeChar)

  const handleCharClick = (char: CharData) => {
    if (isCharLocked(char)) {
      setUnlockTarget(char)
    } else {
      setActiveChar(char)
    }
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: '52px', bottom: '56px',
          left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: '480px',
          zIndex: 5, overflow: 'hidden',
          background: '#0a0005',
        }}
      >
        {/* キャラ全画面写真 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={activeChar.id}
          src={activeChar.avatar_url}
          alt={activeChar.name}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'top center',
          }}
        />

        {/* ロックブラー */}
        {isLocked && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }} />
        )}

        {/* 上部グラデーション */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '100px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), transparent)',
          pointerEvents: 'none',
        }} />

        {/* 下部グラデーション */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%',
          background: 'linear-gradient(to top, rgba(8,0,4,1) 0%, rgba(8,0,4,0.85) 22%, rgba(8,0,4,0.5) 45%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* オンラインバッジ */}
        {!isLocked && (
          <div style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(82,163,68,0.92)', borderRadius: 99,
            padding: '5px 12px', fontSize: 11, fontWeight: 600, color: '#fff',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', flexShrink: 0 }} />
            オンライン
          </div>
        )}

        {/* 未読バッジ */}
        {unread > 0 && (
          <div style={{
            position: 'absolute', top: 14, right: 14,
            background: 'var(--color-primary)', color: '#fff',
            borderRadius: 99, padding: '5px 13px', fontSize: 11, fontWeight: 700,
          }}>
            ♡ {unread > 99 ? '99+' : unread}
          </div>
        )}

        {/* ボトムパネル */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 18px' }}>

          {/* 好感度 */}
          {affLevel && !isLocked && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)' }}>
                  {affLevel.emoji} {affLevel.title}
                </span>
                <span style={{
                  fontSize: 10, color: 'rgba(255,255,255,0.45)',
                  background: 'rgba(255,255,255,0.1)', borderRadius: 99, padding: '2px 8px',
                }}>
                  Lv.{aff!.level}
                </span>
              </div>
              <div style={{ marginBottom: 11, height: 2.5, background: 'rgba(255,255,255,0.12)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${affProgress}%`,
                  background: `linear-gradient(to right, ${affLevel.color}99, ${affLevel.color})`,
                  borderRadius: 99,
                }} />
              </div>
            </>
          )}

          {/* 名前 */}
          <p style={{
            color: '#fff', fontSize: 28, fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 16,
          }}>
            {isLocked ? '???' : activeChar.name}
            {!isLocked && activeChar.age && (
              <span style={{ fontSize: 14, fontWeight: 400, opacity: 0.55, marginLeft: 10 }}>
                {activeChar.age}歳
              </span>
            )}
          </p>

          {/* アクションボタン */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
            {isLocked ? (
              <button
                onClick={() => setUnlockTarget(activeChar)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  padding: '14px', borderRadius: 18, fontWeight: 700, fontSize: 15,
                  background: 'rgba(255,255,255,0.18)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.28)', cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                }}
              >
                🔓 SNSで宣伝して解放
              </button>
            ) : (
              <>
                <a
                  href={`/chat?character=${activeChar.id}`}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '14px', borderRadius: 18, fontWeight: 700, fontSize: 15,
                    background: 'linear-gradient(135deg, #E94C8B, #c73578)',
                    color: '#fff', textDecoration: 'none',
                    boxShadow: '0 4px 24px rgba(233,76,139,0.45)',
                  }}
                >
                  話しかける ♡
                </a>
                <a
                  href={`/characters/${activeChar.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '14px 18px', borderRadius: 18, fontSize: 13, fontWeight: 600,
                    background: 'rgba(255,255,255,0.12)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.18)', textDecoration: 'none',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  詳細 →
                </a>
              </>
            )}
          </div>

          {/* キャラ切り替えサークル */}
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {allChars.map(char => {
              const isActive = char.id === activeChar.id
              const charLocked = isCharLocked(char)
              const charAff = affectionMap[char.id]
              const charAffLevel = charAff ? getAffectionLevel(charAff.points) : null
              const charUnread = unreadByChar[char.id] ?? 0

              return (
                <button
                  key={char.id}
                  onClick={() => handleCharClick(char)}
                  style={{
                    position: 'relative', flexShrink: 0,
                    width: 52, height: 52, borderRadius: '50%',
                    overflow: 'hidden', border: 'none', padding: 0,
                    outline: isActive ? '2.5px solid #E94C8B' : '2px solid rgba(255,255,255,0.22)',
                    outlineOffset: '2px',
                    cursor: 'pointer',
                    opacity: isActive ? 1 : 0.72,
                    transition: 'opacity 0.2s ease, outline 0.2s ease',
                    background: 'transparent',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={char.avatar_url}
                    alt={char.name}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', objectPosition: 'top center',
                      filter: charLocked ? 'blur(2px) brightness(0.65)' : 'none',
                    }}
                  />

                  {charLocked && (
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                    }}>
                      🔒
                    </div>
                  )}

                  {!charLocked && charUnread > 0 && (
                    <div style={{
                      position: 'absolute', top: 1, right: 1,
                      background: '#E94C8B', color: '#fff', borderRadius: '50%',
                      width: 15, height: 15, fontSize: 8,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, border: '1.5px solid #0a0005',
                    }}>
                      {charUnread > 9 ? '9+' : charUnread}
                    </div>
                  )}

                  {!charLocked && charAffLevel && charAff && charAff.level >= 2 && (
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
                      background: `${charAffLevel.color}cc`,
                    }} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* 解放モーダル */}
      {unlockTarget && (
        <UnlockModal
          characterId={unlockTarget.id}
          characterName={unlockTarget.name}
          onClose={() => setUnlockTarget(null)}
          onSuccess={() => {
            setLocalUnlocked(prev => { const s = new Set(Array.from(prev)); s.add(unlockTarget.id); return s })
            setUnlockTarget(null)
            // 申請完了トースト的な表示のため一時的にアクティブにしない
            alert(`${unlockTarget.name}の申請が完了しました！\nスタッフが確認後、解放されます。`)
          }}
        />
      )}
    </>
  )
}
