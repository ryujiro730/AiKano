'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Images } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Lightbox from '@/components/Lightbox'
import { SpiderChart } from '@/components/SpiderChart'
import { AffectionMeter } from '@/components/AffectionMeter'
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

export default function CharacterDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [character, setCharacter] = useState<Character | null>(null)
  const [photos, setPhotos] = useState<CharacterPhoto[]>([])
  const [userChar, setUserChar] = useState<UserCharData | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      const [charRes, photosRes] = await Promise.all([
        supabase.from('characters').select('*').eq('id', params.id).single(),
        supabase.from('character_photos').select('*').eq('character_id', params.id).order('order_index'),
      ])
      if (!charRes.data) { router.push('/characters'); return }
      setCharacter(charRes.data)
      setPhotos(photosRes.data || [])

      if (userId) {
        const [ucRes, achRes] = await Promise.all([
          supabase
            .from('user_characters')
            .select('affection_points, affection_level, message_count, last_chat_at')
            .eq('user_id', userId)
            .eq('character_id', params.id)
            .single(),
          supabase
            .from('user_achievements')
            .select('achievement_key, unlocked_at')
            .eq('user_id', userId)
            .eq('character_id', params.id)
            .order('unlocked_at', { ascending: true }),
        ])
        if (ucRes.data) setUserChar(ucRes.data as UserCharData)
        if (achRes.data) setAchievements(achRes.data as Achievement[])
      }
    }
    load()
  }, [params.id])

  if (!character) return null

  const allPhotos = [character.avatar_url, ...photos.map(p => p.url)]
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
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,4,12,0.9) 0%, rgba(20,4,12,0.15) 42%, transparent 65%)' }} />

        <div style={{
          position: 'absolute', top: 12, left: 12,
          background: 'rgba(90,179,77,0.88)', borderRadius: 99,
          padding: '4px 10px', fontSize: 11, fontWeight: 600, color: '#fff',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', display: 'inline-block' }} />
          オンライン
        </div>

        {photos.length > 0 && (
          <div style={{
            position: 'absolute', top: 12, right: 12,
            background: 'rgba(0,0,0,0.45)', borderRadius: 99,
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
                padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
                background: 'rgba(255,255,255,0.15)', color: '#fff',
                border: '1px solid rgba(255,255,255,0.2)',
              }}>
                ❤️ Lv.{userChar.affection_level}
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
      <div className="card p-4 mb-4" style={{ border: '1px solid var(--color-border-warm)' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>好感度</p>
        {userChar ? (
          <AffectionMeter points={userChar.affection_points} messageCount={userChar.message_count} />
        ) : (
          <div style={{ textAlign: 'center', padding: '8px 0' }}>
            <p style={{ fontSize: 20, marginBottom: 6 }}>👤</p>
            <p style={{ fontSize: 13, color: 'var(--color-text-muted)' }}>
              まだ話したことがない<br />
              <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>メッセージを送って好感度を上げよう！</span>
            </p>
          </div>
        )}
      </div>

      {/* ステータス */}
      <div className="card p-4 mb-4" style={{ border: '1px solid var(--color-border-warm)' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>ステータス</p>
        <SpiderChart stats={stats} />
      </div>

      {/* プロフィール */}
      <div className="card p-4 mb-4" style={{ border: '1px solid var(--color-border-warm)' }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>プロフィール</p>
        <p style={{ fontSize: 14, lineHeight: 1.85 }}>{description}</p>
      </div>

      {/* 実績 */}
      {achievements.length > 0 && (
        <div className="card p-4 mb-4" style={{ border: '1px solid var(--color-border-warm)' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>実績</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {achievements.map(ach => {
              const def = ACHIEVEMENTS[ach.achievement_key]
              if (!def) return null
              return (
                <div
                  key={ach.achievement_key}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    padding: '10px 12px', borderRadius: 12,
                    background: 'var(--color-surface-2)',
                    minWidth: 70, maxWidth: 88,
                  }}
                  title={def.desc}
                >
                  <span style={{ fontSize: 22 }}>{def.emoji}</span>
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
          <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: 10, letterSpacing: '0.08em', textTransform: 'uppercase' }}>フォト</p>
          <div className="grid grid-cols-3 gap-1.5">
            {photos.map((photo, i) => (
              <div key={photo.id} className="relative overflow-hidden rounded-xl cursor-pointer" style={{ aspectRatio: '1' }} onClick={() => setLightboxIndex(i + 1)}>
                <Image src={photo.url} alt="" fill className="object-cover hover:scale-105 transition-transform duration-300" sizes="33vw" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 固定CTA */}
      <div className="fixed left-0 right-0 px-4 pb-4" style={{ bottom: '56px', background: 'linear-gradient(to top, var(--color-bg) 65%, transparent)', paddingTop: 20 }}>
        <Link href={`/chat?character=${character.id}`} className="btn-cta block text-center py-4 rounded-2xl font-bold" style={{ fontSize: 16, letterSpacing: '0.03em' }}>
          {character.name}にメッセージを送る ♡
        </Link>
      </div>

      {lightboxIndex !== null && (
        <Lightbox photos={allPhotos} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onChange={setLightboxIndex} />
      )}
    </div>
  )
}
