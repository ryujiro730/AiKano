'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GiftSheet, type GiftResult } from './GiftSheet'
import { getAffectionLevel, getAffectionProgress } from '@/lib/affection'
import { UnlockModal } from './UnlockModal'
import { AffectionIcon } from './AffectionIcon'
import { Lock, MessageCircle, ChevronRight, CalendarCheck } from 'lucide-react'
import { LOGIN_BONUS, FREE_MESSAGES_PER_LOGIN } from '@/lib/pricing'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

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
  hasVideos,
  showAlbum,
}: {
  partnerChar: CharData | null
  allChars: CharData[]
  affectionMap: Record<string, AffData>
  unreadByChar: Record<string, number>
  unlockedCharIds: string[]
  hasVideos: boolean
  /** アルバム（写真ガチャ）を出すか。公開前は管理者だけ */
  showAlbum: boolean
}) {
  const { m } = useI18n()
  const defaultChar = partnerChar ?? allChars[0] ?? null
  const [activeChar, setActiveChar] = useState<CharData | null>(defaultChar)
  const [unlockTarget, setUnlockTarget] = useState<CharData | null>(null)
  const [localUnlocked, setLocalUnlocked] = useState<Set<string>>(new Set(unlockedCharIds))
  const [showPicker, setShowPicker] = useState(false)
  const [giftOpen, setGiftOpen] = useState(false)
  const [affOverride, setAffOverride] = useState<Record<string, AffData>>({})
  const [giftToast, setGiftToast] = useState<{ charId: string; charName: string; itemName: string; gained: number; replied: boolean } | null>(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  if (!activeChar || allChars.length === 0) return null

  const isCharLocked = (char: CharData) =>
    char.requires_unlock && !localUnlocked.has(char.id)

  const aff = affOverride[activeChar.id] ?? affectionMap[activeChar.id]
  const affLevel = aff ? getAffectionLevel(aff.points) : null
  const affProgress = aff ? getAffectionProgress(aff.points) : 0
  const unread = unreadByChar[activeChar.id] ?? 0
  const isLocked = isCharLocked(activeChar)
  const otherChars = allChars.filter(c => c.id !== activeChar.id)

  // 贈ったら好感度をその場で反映し、キャラの返事はバックグラウンドで取得して知らせる
  const handleGifted = (r: GiftResult) => {
    const char = activeChar
    setGiftOpen(false)
    if (r.affection) setAffOverride(prev => ({ ...prev, [char.id]: { points: r.affection!.affection_points, level: r.affection!.affection_level } }))
    setGiftToast({ charId: char.id, charName: char.name, itemName: r.itemName, gained: r.affectionGained, replied: false })
    fetch('/api/chat/ai-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ conversationId: r.conversationId, characterId: char.id }),
    }).then(res => res.ok && setGiftToast(t => (t && t.charId === char.id ? { ...t, replied: true } : t))).catch(() => {})
  }

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
          background: '#0d0a0e',
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
          background: 'linear-gradient(to top, rgba(13,10,14,0.96) 0%, rgba(13,10,14,0.8) 24%, rgba(13,10,14,0.35) 48%, transparent 68%)',
          pointerEvents: 'none',
        }} />

        {/* ログインボーナス案内 */}
        <div
          style={{
            position: 'absolute', top: 14, left: 14,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(13,10,14,0.55)', color: '#fff',
            border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
            borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 600,
          }}
        >
          <CalendarCheck size={13} strokeWidth={2.4} style={{ color: '#f9a8d4' }} />
          {fmt(m.home.loginBonus, { pt: LOGIN_BONUS, n: FREE_MESSAGES_PER_LOGIN })}
        </div>

        {/* 未読バッジ */}
        {unread > 0 && (
          <a
            href={`/chat?character=${activeChar.id}`}
            style={{
              position: 'absolute', top: 14, right: 14,
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'var(--color-primary)', color: '#fff',
              borderRadius: 8, padding: '5px 10px', fontSize: 12, fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <MessageCircle size={13} strokeWidth={2.5} />
            {unread > 99 ? '99+' : unread}
          </a>
        )}

        {/* ゲーム風メニュー（右側） */}
        {!isLocked && (
          <div style={{ position: 'absolute', right: 10, top: 58, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 3 }}>
            <HudButton href="/shop" icon="/game-icons/shop.png" label={m.hud.shop} from="#f472b6" to="#db2777" />
            <HudButton onClick={() => setGiftOpen(true)} icon="/items/present.webp" label={m.hud.gift} from="#fde68a" to="#f59e0b" big />
            {showAlbum && <HudButton href="/album" icon="/game-icons/album.png" label={m.hud.album} from="#a5b4fc" to="#6366f1" />}
            {hasVideos && <HudButton href="/videos" icon="/game-icons/video.png" label={m.hud.videos} from="#67e8f9" to="#0891b2" />}
          </div>
        )}

        {/* プレゼント後の演出 */}
        {giftToast && (
          <div className="animate-fade-in" style={{
            position: 'absolute', left: 14, right: 84, top: 58, zIndex: 4,
            background: 'rgba(13,10,14,0.72)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)',
            borderRadius: 12, padding: '10px 12px', color: '#fff',
          }}>
            <p style={{ fontSize: 13, fontWeight: 700 }}>{fmt(m.gift.sent, { item: giftToast.itemName })}</p>
            <p style={{ fontSize: 12, color: '#f9a8d4', fontWeight: 700, marginTop: 2 }}>♥ {fmt(m.gift.affectionUp, { n: giftToast.gained })}</p>
            {giftToast.replied && (
              <a href={`/chat?character=${giftToast.charId}`} style={{ display: 'inline-block', marginTop: 6, fontSize: 12, fontWeight: 700, color: '#fff', textDecoration: 'underline' }}>
                {fmt(m.gift.replyArrived, { name: giftToast.charName })} · {m.gift.openChat} →
              </a>
            )}
          </div>
        )}

        {/* ボトムパネル */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 18px' }}>

          {/* 好感度 */}
          {affLevel && !isLocked && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 7 }}>
                <AffectionIcon level={affLevel.level} size={13} style={{ color: affLevel.color }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                  {m.affection.levels[affLevel.level - 1]}
                </span>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontVariantNumeric: 'tabular-nums' }}>
                  Lv.{aff!.level}
                </span>
              </div>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.14)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${affProgress}%`, background: affLevel.color, borderRadius: 2 }} />
              </div>
            </div>
          )}

          {/* 名前 */}
          <p style={{
            color: '#fff', fontSize: 30, fontWeight: 700,
            letterSpacing: '-0.01em', lineHeight: 1.1, marginBottom: 16,
          }}>
            {isLocked ? '???' : activeChar.name}
            {!isLocked && activeChar.age > 0 && (
              <span style={{ fontSize: 15, fontWeight: 400, opacity: 0.6, marginLeft: 10 }}>
                {fmt(m.common.ageSuffix, { age: activeChar.age })}
              </span>
            )}
          </p>

          {/* アクションボタン */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            {isLocked ? (
              <button
                onClick={() => setUnlockTarget(activeChar)}
                style={{
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  height: 50, borderRadius: 12, fontWeight: 700, fontSize: 15,
                  background: 'rgba(255,255,255,0.16)', color: '#fff',
                  border: '1px solid rgba(255,255,255,0.22)', cursor: 'pointer',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <Lock size={16} strokeWidth={2.2} />
                {m.home.unlockBySns}
              </button>
            ) : (
              <>
                <a
                  href={`/chat?character=${activeChar.id}`}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    height: 50, borderRadius: 12, fontWeight: 700, fontSize: 15,
                    background: 'var(--color-primary)', color: '#fff', textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={17} strokeWidth={2.2} />
                  {m.home.talk}
                </a>
                <a
                  href={`/characters/${activeChar.id}`}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    height: 50, padding: '0 18px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                    background: 'rgba(255,255,255,0.14)', color: '#fff',
                    border: '1px solid rgba(255,255,255,0.2)', textDecoration: 'none',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  {m.home.profile}
                </a>
              </>
            )}
          </div>

          {/* 他のキャラクター（顔写真を重ねて表示） */}
          {otherChars.length > 0 && (
            <button
              onClick={() => setShowPicker(true)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                height: 50, padding: '0 12px 0 10px', borderRadius: 12,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', cursor: 'pointer', backdropFilter: 'blur(12px)',
              }}
            >
              <span style={{ display: 'flex' }}>
                {otherChars.slice(0, 4).map((c, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={c.id}
                    src={c.avatar_url}
                    alt=""
                    style={{
                      width: 30, height: 30, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top center',
                      border: '2px solid #1a1218', marginLeft: i === 0 ? 0 : -9,
                      filter: isCharLocked(c) ? 'blur(2px) brightness(0.6)' : 'none',
                    }}
                  />
                ))}
              </span>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 600 }}>
                {m.home.otherCharacters}
                <span style={{ fontWeight: 400, opacity: 0.55, marginLeft: 6 }}>{fmt(m.home.count, { n: otherChars.length })}</span>
              </span>
              <ChevronRight size={18} style={{ opacity: 0.6 }} />
            </button>
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
            background: '#141015',
            borderRadius: '16px 16px 0 0',
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
              {m.home.pickCharacter}
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
                        borderRadius: 10,
                        overflow: 'hidden',
                        aspectRatio: '3/4',
                        border: 'none', padding: 0,
                        outline: isActive ? '2px solid var(--color-primary)' : '1px solid rgba(255,255,255,0.1)',
                        outlineOffset: isActive ? '2px' : '0',
                        cursor: 'pointer',
                        background: '#0d0a0e',
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
                          display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        }}>
                          <Lock size={18} strokeWidth={2.2} />
                        </div>
                      )}

                      {charUnread > 0 && !charLocked && (
                        <div style={{
                          position: 'absolute', top: 6, right: 6,
                          background: 'var(--color-primary)', color: '#fff', borderRadius: 6,
                          minWidth: 18, height: 18, padding: '0 5px', fontSize: 10,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700,
                        }}>
                          {charUnread > 99 ? '99+' : charUnread}
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
      {giftOpen && activeChar && (
        <GiftSheet characterId={activeChar.id} characterName={activeChar.name} onClose={() => setGiftOpen(false)} onGifted={handleGifted} />
      )}

      {unlockTarget && (
        <UnlockModal
          characterId={unlockTarget.id}
          characterName={unlockTarget.name}
          onClose={() => setUnlockTarget(null)}
          onSuccess={() => {
            setLocalUnlocked(prev => { const s = new Set(Array.from(prev)); s.add(unlockTarget.id); return s })
            setUnlockTarget(null)
            alert(fmt(m.home.unlockRequested, { name: unlockTarget.name }))
          }}
        />
      )}
    </>
  )
}

/** スマホゲーム風の丸いメニューボタン */
function HudButton({ href, onClick, icon, label, from, to, big }: {
  href?: string; onClick?: () => void; icon: string; label: string; from: string; to: string; big?: boolean
}) {
  const inner = (
    <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <span className="hud-bob" style={{
        width: 54, height: 54, borderRadius: '50%',
        background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), transparent 42%), linear-gradient(160deg, ${from}, ${to})`,
        border: '3px solid #fff', boxShadow: '0 4px 0 rgba(0,0,0,0.18), 0 6px 14px rgba(0,0,0,0.35)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={icon} alt="" style={{ width: big ? 44 : 30, height: big ? 44 : 30, objectFit: 'contain', filter: big ? 'drop-shadow(0 2px 2px rgba(0,0,0,0.25))' : 'none' }} />
      </span>
      <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '0.02em', textShadow: '0 1px 3px rgba(0,0,0,0.8), 0 0 2px rgba(0,0,0,0.6)' }}>{label}</span>
    </span>
  )
  const style: React.CSSProperties = { background: 'none', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'none' }
  return href
    ? <Link href={href} style={style} aria-label={label}>{inner}</Link>
    : <button type="button" onClick={onClick} style={style} aria-label={label}>{inner}</button>
}
