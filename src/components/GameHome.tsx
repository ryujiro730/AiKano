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
  const defaultChar = partnerChar ?? allChars[0] ?? null
  const [activeChar, setActiveChar] = useState<CharData | null>(defaultChar)
  const [unlockTarget, setUnlockTarget] = useState<CharData | null>(null)
  const [localUnlocked, setLocalUnlocked] = useState<Set<string>>(new Set(unlockedCharIds))
  const [showPicker, setShowPicker] = useState(false)

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

  const handlePickerSelect = (char: CharData) => {
    if (isCharLocked(char)) {
      setUnlockTarget(char)
    } else {
      setActiveChar(char)
    }
    setShowPicker(false)
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
          <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
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

          {/* 他のキャラを見るボタン */}
          {allChars.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={() => setShowPicker(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '7px 16px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.65)', fontSize: 12, fontWeight: 600,
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <span style={{ fontSize: 13 }}>👥</span>
                他のキャラクターを見る ({allChars.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* キャラ選択シート */}
      {showPicker && (
        <>
          {/* オーバーレイ */}
          <div
            onClick={() => setShowPicker(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 20,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
            }}
          />
          {/* シート */}
          <div style={{
            position: 'fixed', bottom: '56px', left: '50%',
            transform: 'translateX(-50%)',
            width: '100%', maxWidth: '480px',
            zIndex: 21,
            background: '#160010',
            borderRadius: '20px 20px 0 0',
            padding: '0 0 20px',
            maxHeight: '70vh',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            {/* ハンドル */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
              <div style={{ width: 36, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.2)' }} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 14, letterSpacing: '0.06em' }}>
              キャラクターを選ぶ
            </p>

            {/* キャラグリッド */}
            <div style={{ overflowY: 'auto', padding: '0 16px', scrollbarWidth: 'none' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {allChars.map(char => {
                  const isActive = char.id === activeChar.id
                  const charLocked = isCharLocked(char)
                  const charUnread = unreadByChar[char.id] ?? 0
                  const charAff = affectionMap[char.id]

                  return (
                    <button
                      key={char.id}
                      onClick={() => handlePickerSelect(char)}
                      style={{
                        position: 'relative',
                        borderRadius: 14,
                        overflow: 'hidden',
                        aspectRatio: '3/4',
                        border: 'none', padding: 0,
                        outline: isActive ? '2.5px solid #E94C8B' : '1.5px solid rgba(255,255,255,0.1)',
                        outlineOffset: isActive ? '2px' : '0',
                        cursor: 'pointer',
                        background: '#0a0005',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={char.avatar_url}
                        alt={char.name}
                        style={{
                          width: '100%', height: '100%',
                          objectFit: 'cover', objectPosition: 'top center',
                          filter: charLocked ? 'blur(3px) brightness(0.5)' : 'none',
                        }}
                      />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 50%)',
                      }} />

                      {charLocked && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
                        }}>
                          🔒
                        </div>
                      )}

                      {charUnread > 0 && !charLocked && (
                        <div style={{
                          position: 'absolute', top: 6, right: 6,
                          background: '#E94C8B', color: '#fff', borderRadius: '50%',
                          width: 16, height: 16, fontSize: 9,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700,
                        }}>
                          ♡
                        </div>
                      )}

                      <div style={{ position: 'absolute', bottom: 7, left: 0, right: 0, textAlign: 'center' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>
                          {charLocked ? '???' : char.name}
                        </p>
                        {charAff && !charLocked && (
                          <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>
                            Lv.{charAff.level}
                          </p>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {/* 解放モーダル */}
      {unlockTarget && (
        <UnlockModal
          characterId={unlockTarget.id}
          characterName={unlockTarget.name}
          onClose={() => setUnlockTarget(null)}
          onSuccess={() => {
            setLocalUnlocked(prev => { const s = new Set(Array.from(prev)); s.add(unlockTarget.id); return s })
            setUnlockTarget(null)
            alert(`${unlockTarget.name}の申請が完了しました！\nスタッフが確認後、解放されます。`)
          }}
        />
      )}
    </>
  )
}
