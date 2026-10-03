'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Images, User, Award, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Lightbox from '@/components/Lightbox'
import { SpiderChart } from '@/components/SpiderChart'
import { AffectionMeter } from '@/components/AffectionMeter'
import { AffectionIcon } from '@/components/AffectionIcon'
import { LockedPhotoTile } from '@/components/LockedPhotoTile'
import { ACHIEVEMENTS } from '@/lib/affection'
import type { Character, CharacterPhoto } from '@/types'

interface UserCharData {
  affection_points: number
  affection_level: number
  message_count: number
  last_chat_at: string | null
}

interface Achievement {
  achievement_key: string
  unlocked_at: string
}

interface Props {
  character: Character
  photos: CharacterPhoto[]
  userChar: UserCharData | null
  achievements: Achievement[]
}

export function CharacterDetailClient({ character, photos, userChar, achievements }: Props) {
  const router = useRouter()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const unlockedPhotos = photos.filter(p => !p.locked)
  const lockedPhotos = photos.filter(p => p.locked)
  const allPhotos = [character.avatar_url, ...unlockedPhotos.map(p => p.url)]
  const stats = (character as any).stats ?? null
  const age = (character as any).age
  const personality = (character as any).personality
  const description = (character as any).description

  return (
    <div className="pb-36">
      <div className="flex items-center pt-1 pb-3">
        <button onClick={() => router.back()} className="p-1.5 -ml-1 text-[var(--color-text-muted)]">
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* メインビジュアル */}
      <div
        className="relative rounded-2xl overflow-hidden mb-5 cursor-pointer"
        style={{ aspectRatio: '3/4', maxHeight: '72vh' }}
        onClick={() => setLightboxIndex(0)}
      >
        <Image src={character.avatar_url} alt={character.name} fill className="object-cover object-top" sizes="100vw" priority />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,10,14,0.88) 0%, rgba(13,10,14,0.15) 42%, transparent 65%)' }} />

        {photos.length > 0 && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.45)', borderRadius: 8,
            padding: '5px 10px', fontSize: 12, fontWeight: 600, color: '#fff',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <Images size={13} />
            {photos.length}枚
          </div>
        )}

        <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          {userChar && (
            <div style={{ marginBottom: 8 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 700,
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                <AffectionIcon level={userChar.affection_level} size={12} />
                Lv.{userChar.affection_level}
              </span>
            </div>
          )}
          <p style={{ color: '#fff', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            {character.name}
            {age && <span style={{ fontSize: 16, fontWeight: 400, opacity: 0.72, marginLeft: 8 }}>{age}歳</span>}
          </p>
          {personality && (
            <p style={{ color: 'rgba(255,255,255,0.62)', fontSize: 13, marginTop: 5 }}>{personality}</p>
          )}
        </div>
      </div>

      {/* 好感度 */}
      <div className="card p-4 mb-4" >
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 12, letterSpacing: '0.04em' }}>好感度</p>
        {userChar ? (
          <AffectionMeter points={userChar.affection_points} messageCount={userChar.message_count} />
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <User size={22} style={{ margin: '0 auto 6px', color: 'var(--color-text-muted)' }} />
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              まだ話したことがない<br />
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>メッセージを送って好感度を上げよう！</span>
            </p>
          </div>
        )}
      </div>

      {/* ステータス */}
      <div className="card p-4 mb-4" >
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4, letterSpacing: '0.04em' }}>ステータス</p>
        <SpiderChart stats={stats} />
      </div>

      {/* プロフィール */}
      <div className="card p-4 mb-4" >
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, letterSpacing: '0.04em' }}>プロフィール</p>
        <p style={{ fontSize: 14, lineHeight: 1.85 }}>{description}</p>
      </div>

      {/* 実績 */}
      {achievements.length > 0 && (
        <div className="card p-4 mb-4" >
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 12, letterSpacing: '0.04em' }}>実績</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {achievements.map(ach => {
              const def = ACHIEVEMENTS[ach.achievement_key]
              if (!def) return null
              return (
                <div
                  key={ach.achievement_key}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '10px 12px', borderRadius: 10,
                    background: 'var(--color-surface-2)',
                    minWidth: 70, maxWidth: 88,
                  }}
                  title={def.desc}
                >
                  <Award size={20} style={{ color: 'var(--color-primary)' }} />
                  <span style={{ fontSize: 10, fontWeight: 600, textAlign: 'center', color: 'var(--color-text-muted)', lineHeight: 1.3 }}>
                    {def.title}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* フォト */}
      {photos.length > 0 && (
        <div className="mb-5">
          <div className="flex items-baseline justify-between" style={{ marginBottom: 10 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>フォト</p>
            {lockedPhotos.length > 0 && (
              <Link href="/payment" style={{ fontSize: 11, fontWeight: 600, color: 'var(--color-primary)' }}>
                会員限定 {lockedPhotos.length}枚を見る
              </Link>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {unlockedPhotos.map((photo, i) => (
              <div key={photo.id} className="relative overflow-hidden rounded-xl cursor-pointer" style={{ aspectRatio: '1' }} onClick={() => setLightboxIndex(i + 1)}>
                <Image src={photo.url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="33vw" />
              </div>
            ))}
            {lockedPhotos.map(photo => (
              <LockedPhotoTile key={photo.id} className="rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* 固定CTA */}
      <div className="fixed left-0 right-0 px-4 pb-4" style={{ bottom: '56px', background: 'linear-gradient(to top, var(--color-bg) 65%, transparent)', paddingTop: 20 }}>
        <Link href={`/chat?character=${character.id}`} className="btn-primary flex items-center justify-center gap-2 font-bold max-w-2xl mx-auto" style={{ fontSize: 15, height: 52, borderRadius: 12 }}>
          <MessageCircle size={18} strokeWidth={2.2} />
          {character.name}にメッセージを送る
        </Link>
      </div>

      {lightboxIndex !== null && (
        <Lightbox photos={allPhotos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />
      )}
    </div>
  )
}
