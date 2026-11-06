'use client'

import { useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Lock, Sparkles } from 'lucide-react'
import Lightbox from '@/components/Lightbox'
import { PointsShortageDialog } from '@/components/PointsShortageDialog'
import { GachaStage, type GachaStageHandle } from '@/components/gacha/GachaStage'
import { GachaTabs } from '@/components/gacha/GachaTabs'
import { GACHA_SINGLE_POINTS, GACHA_TEN_POINTS } from '@/lib/pricing'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

/** キャラごとの、ガチャで出る写真の数と持っている数 */
export type GachaCharacter = { id: string; name: string; avatarUrl: string; total: number; owned: number }
type Result = { id: string; url: string; character_id: string }

const GOLD_TEXT = 'linear-gradient(180deg, #fff6d6 0%, #f7d27a 45%, #c98a1c 100%)'
const GOLD_FRAME = 'linear-gradient(135deg, #fff3c4 0%, #e9b949 30%, #fff8dc 50%, #c98a1c 75%, #f6d27f 100%)'

/** 写真ガチャ（全キャラの写真からひとつ。キャラは選べない） */
export function GachaClient({ characters: initial, showMembersOnlyNote }: { characters: GachaCharacter[]; showMembersOnlyNote: boolean }) {
  const { m } = useI18n()
  const stageRef = useRef<GachaStageHandle>(null)
  const [characters, setCharacters] = useState(initial)
  const [busy, setBusy] = useState<null | 1 | 10>(null)
  const [playing, setPlaying] = useState(false)
  const [results, setResults] = useState<Result[] | null>(null)
  const [shortage, setShortage] = useState<{ current: number; required: number } | null>(null)
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number } | null>(null)

  const total = characters.reduce((a, c) => a + c.total, 0)
  const owned = characters.reduce((a, c) => a + c.owned, 0)
  const remaining = total - owned
  const pct = remaining > 0 ? Math.round((100 / remaining) * 100) / 100 : 0
  const byId = new Map(characters.map(c => [c.id, c]))

  const draw = async (count: 1 | 10) => {
    if (busy || playing) return
    setBusy(count)
    const res = await fetch('/api/gacha/draw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count }),
    }).catch(() => null)
    const data = await res?.json().catch(() => ({})) ?? {}
    setBusy(null)
    if (!res?.ok) {
      if (res?.status === 402) setShortage({ current: data.current ?? 0, required: data.required ?? 0 })
      else if (data.error === 'not_enough_left') window.location.reload()
      else alert(m.chat.unlockFailed)
      return
    }
    if (typeof data.points === 'number') {
      window.dispatchEvent(new CustomEvent('pointsUpdated', { detail: { points: data.points } }))
    }
    const got = data.photos as Result[]
    // 演出のあいだに写真を読み込んでおく（結果カードがすぐ出るように）
    got.forEach(g => { const img = new window.Image(); img.src = g.url })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setPlaying(true)
    await stageRef.current?.play({ gold: count === 10 })
    setPlaying(false)
    const gotPer = new Map<string, number>()
    got.forEach(g => gotPer.set(g.character_id, (gotPer.get(g.character_id) ?? 0) + 1))
    setCharacters(prev => prev.map(c => gotPer.has(c.id) ? { ...c, owned: c.owned + gotPer.get(c.id)! } : c))
    setResults(got)
  }

  const closeResults = () => {
    setResults(null)
    stageRef.current?.reset()
  }

  const openPhoto = (url: string) => {
    const urls = (results ?? []).map(r => r.url)
    setLightbox({ photos: urls, index: Math.max(0, urls.indexOf(url)) })
  }

  // 結果画面の紙吹雪（表示のたびに位置を変える）
  const confetti = useMemo(() => Array.from({ length: 46 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    dur: 2.4 + Math.random() * 2,
    size: 6 + Math.random() * 6,
    rot: Math.random() * 360,
    color: ['#f7d27a', '#ff8fb8', '#ffffff', '#c9a8ff', '#ffb36b'][i % 5],
  // eslint-disable-next-line react-hooks/exhaustive-deps
  })), [results])

  return (
    <div className="pb-10">
      <div className="pt-2">
        <GachaTabs active="gacha" />
      </div>

      {/* 3D 演出 */}
      <div className="relative overflow-hidden mb-4 select-none"
        style={{ borderRadius: 16, boxShadow: '0 0 0 1.5px rgba(242,193,78,0.55), 0 18px 50px rgba(120,30,80,0.35)' }}
        onClick={() => playing && stageRef.current?.skip()}>
        <div style={{ aspectRatio: '1 / 0.95', background: '#1a0b16' }} />
        <GachaStage ref={stageRef} className="absolute inset-0" />
        {/* 上：タイトルと収集率 */}
        <div className="absolute top-0 inset-x-0 px-4 pt-3 pb-6 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(10,4,9,0.65), rgba(10,4,9,0))' }}>
          <p className="text-center text-[11px] font-black tracking-[0.35em]"
            style={{ background: GOLD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            PHOTO GACHA
          </p>
          {total > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.14)' }}>
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(owned / total) * 100}%`, background: 'linear-gradient(90deg, #ff8fb3, #f7d27a)', boxShadow: '0 0 8px rgba(247,210,122,0.8)' }} />
              </div>
              <span className="text-[11px] font-bold text-white/90 tabular-nums">{fmt(m.gacha.progress, { owned, total })}</span>
            </div>
          )}
        </div>
        {playing && (
          <p className="absolute bottom-3 inset-x-0 text-center text-[11px] text-white/70 animate-pulse">{m.gacha.tapToSkip}</p>
        )}
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>{m.gacha.indexLead}</p>

      {/* ボタン */}
      {total === 0 ? (
        <p className="text-sm text-center py-6" style={{ color: 'var(--color-text-muted)' }}>{m.gacha.empty}</p>
      ) : remaining === 0 ? (
        <div className="text-center py-4 px-4 mb-2 font-black text-sm"
          style={{ background: '#1d0f19', borderRadius: 14, boxShadow: '0 0 0 1.5px #e9b949' }}>
          <span style={{ background: GOLD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
            <Sparkles size={16} className="inline -mt-0.5 mr-1" style={{ color: '#f7d27a' }} />{m.gacha.complete}
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 mb-2">
          <button onClick={() => draw(1)} disabled={!!busy || playing}
            className="gacha-btn relative overflow-hidden flex flex-col items-center justify-center py-3.5 font-black text-white disabled:opacity-60"
            style={{ background: 'linear-gradient(160deg, #ff7aa8 0%, #d93a72 55%, #a3214f 100%)', borderRadius: 14, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45), 0 6px 18px rgba(217,58,114,0.4)' }}>
            <span className="text-sm flex items-center gap-1">{busy === 1 && <Loader2 size={14} className="animate-spin" />}{m.gacha.drawOne}</span>
            <span className="text-xs mt-0.5 opacity-95">{GACHA_SINGLE_POINTS}pt</span>
          </button>
          <button onClick={() => draw(10)} disabled={!!busy || playing || remaining < 10}
            className="gacha-btn relative overflow-hidden flex flex-col items-center justify-center py-3.5 font-black disabled:opacity-50"
            style={{ background: 'linear-gradient(160deg, #fff1bf 0%, #f2c14e 40%, #c98a1c 100%)', color: '#4a2a05', borderRadius: 14, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7), 0 6px 20px rgba(201,138,28,0.45)' }}>
            <span className="absolute top-1 right-1.5 text-[9px] font-black px-1.5 py-px rounded-md text-white" style={{ background: '#d93a72' }}>{m.gacha.tenBonus}</span>
            <span className="text-sm flex items-center gap-1">{busy === 10 && <Loader2 size={14} className="animate-spin" />}{m.gacha.drawTen}</span>
            <span className="text-xs mt-0.5">{GACHA_TEN_POINTS}pt</span>
          </button>
        </div>
      )}
      {remaining > 0 && remaining < 10 && (
        <p className="text-[11px] mb-1" style={{ color: 'var(--color-text-muted)' }}>{m.gacha.tenNeeds}</p>
      )}
      {remaining > 0 && (
        <p className="text-[11px] mb-5" style={{ color: 'var(--color-text-muted)' }}>{fmt(m.gacha.odds, { n: remaining, pct })}</p>
      )}

      {/* キャラごとの集め具合と提供割合（出る確率は持っていない写真すべてで均等。キャラごとの割合＝そのキャラの残り枚数÷全体の残り枚数） */}
      {characters.length > 0 && (
        <>
          <p className="text-[11px] font-bold mb-2 mt-4" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.04em' }}>{m.gacha.lineup}</p>
          <div className="flex flex-col gap-2">
            {characters.map(c => {
              const left = c.total - c.owned
              return (
                <div key={c.id} className="flex items-center gap-3 px-3 py-2.5"
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-card)' }}>
                  <span className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={c.avatarUrl} alt="" fill className="object-cover" sizes="40px" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{c.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(c.owned / c.total) * 100}%`, background: 'linear-gradient(90deg, #ff8fb3, #f2c14e)' }} />
                      </div>
                      <span className="text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{fmt(m.gacha.progress, { owned: c.owned, total: c.total })}</span>
                    </div>
                  </div>
                  <span className="text-[11px] tabular-nums flex-shrink-0 text-right" style={{ color: 'var(--color-text-muted)', minWidth: 44 }}>
                    {left > 0 ? `${Math.round((left / remaining) * 1000) / 10}%` : m.gacha.completeShort}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-muted)' }}>{m.gacha.oddsByChar}</p>
          <Link href="/album" prefetch={false} className="block text-center text-xs font-bold mt-3" style={{ color: 'var(--color-primary)' }}>{m.album.title} →</Link>
          {showMembersOnlyNote && (
            <p className="text-[11px] mt-2 flex items-center gap-1" style={{ color: 'var(--color-text-muted)' }}><Lock size={11} />{m.gacha.membersOnlyNote}</p>
          )}
        </>
      )}

      {/* 結果 */}
      {results && (
        <div className="fixed inset-0 z-[70] flex flex-col items-center justify-center px-5 overflow-hidden"
          style={{ background: 'radial-gradient(120% 80% at 50% 40%, #4a1a3a 0%, #1a0a16 55%, #07030a 100%)' }}>
          {/* 回る後光 */}
          <div className="gacha-rays absolute left-1/2 top-[42%] pointer-events-none" />
          {/* 紙吹雪 */}
          {confetti.map((c, i) => (
            <span key={i} className="gacha-confetti absolute top-[-20px] pointer-events-none"
              style={{ left: `${c.left}%`, width: c.size, height: c.size * 0.45, background: c.color, animationDelay: `${c.delay}s`, animationDuration: `${c.dur}s`, transform: `rotate(${c.rot}deg)` }} />
          ))}

          <p className="gacha-get relative text-4xl font-black italic mb-5 tracking-wider"
            style={{ background: GOLD_TEXT, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', filter: 'drop-shadow(0 0 14px rgba(247,210,122,0.7))' }}>
            GET!
          </p>

          <div className={results.length === 1 ? 'relative w-full max-w-[280px]' : 'relative grid grid-cols-3 sm:grid-cols-5 gap-2 w-full max-w-lg'}>
            {results.map((r, i) => (
              <button key={r.id} onClick={() => openPhoto(r.url)}
                className="gacha-card relative block w-full p-[3px] rounded-2xl"
                style={{ background: GOLD_FRAME, animationDelay: `${0.15 + i * 0.09}s`, boxShadow: '0 0 28px rgba(247,210,122,0.55), 0 14px 40px rgba(0,0,0,0.5)' }}>
                <span className="relative block w-full overflow-hidden rounded-[13px]" style={{ aspectRatio: '3 / 4' }}>
                  <Image src={r.url} alt="" fill className="object-cover" sizes={results.length === 1 ? '280px' : '33vw'} />
                  <span className="gacha-shine absolute inset-0" style={{ animationDelay: `${0.8 + i * 0.09}s` }} />
                  <span className="absolute top-1.5 left-1.5 text-[10px] font-black px-1.5 py-px rounded-md"
                    style={{ background: GOLD_FRAME, color: '#4a2a05' }}>{m.gacha.newPhoto}</span>
                  {/* どのキャラの写真か */}
                  {byId.get(r.character_id) && (
                    <span className="absolute bottom-1.5 inset-x-1.5 text-[10px] font-bold text-white text-center truncate px-1 py-0.5 rounded-md"
                      style={{ background: 'rgba(0,0,0,0.55)' }}>{byId.get(r.character_id)!.name}</span>
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="relative flex gap-2.5 mt-7 w-full max-w-[300px]">
            <button onClick={closeResults} className="flex-1 py-3 rounded-full text-sm font-bold text-white/90"
              style={{ border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)' }}>{m.common.close}</button>
            {remaining > 0 && (
              <button onClick={() => { const n = results.length === 10 && remaining >= 10 ? 10 : 1; closeResults(); draw(n) }}
                className="gacha-btn relative overflow-hidden flex-1 py-3 rounded-full text-sm font-black"
                style={{ background: 'linear-gradient(160deg, #fff1bf 0%, #f2c14e 40%, #c98a1c 100%)', color: '#4a2a05' }}>
                {m.gacha.again}
              </button>
            )}
          </div>
        </div>
      )}

      {lightbox && (
        <Lightbox photos={lightbox.photos} index={lightbox.index} onClose={() => setLightbox(null)} onChange={i => setLightbox(l => l && { ...l, index: i })} />
      )}
      {shortage && (
        <PointsShortageDialog currentPoints={shortage.current} requiredPoints={shortage.required} title={m.gacha.shortageTitle} onClose={() => setShortage(null)} />
      )}

      <style>{`
        .gacha-btn::after {
          content: ''; position: absolute; top: 0; bottom: 0; left: -60%; width: 40%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent);
          transform: skewX(-20deg); animation: gachaSweep 2.8s ease-in-out infinite;
        }
        @keyframes gachaSweep { 0%, 55% { left: -60%; } 100% { left: 130%; } }

        .gacha-rays {
          width: 160vmax; height: 160vmax; margin-left: -80vmax; margin-top: -80vmax;
          background: repeating-conic-gradient(from 0deg, rgba(255,214,140,0.16) 0deg 7deg, rgba(255,214,140,0) 7deg 18deg);
          -webkit-mask-image: radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 25%, transparent 55%);
          mask-image: radial-gradient(circle, #000 0%, rgba(0,0,0,0.6) 25%, transparent 55%);
          animation: gachaSpin 18s linear infinite;
        }
        @keyframes gachaSpin { to { transform: rotate(360deg); } }

        .gacha-confetti { border-radius: 2px; animation-name: gachaFall; animation-timing-function: linear; animation-iteration-count: infinite; opacity: 0.9; }
        @keyframes gachaFall {
          0% { transform: translateY(0) rotate(0deg) rotateX(0deg); }
          100% { transform: translateY(110vh) rotate(540deg) rotateX(720deg); }
        }

        .gacha-get { animation: gachaGet 700ms cubic-bezier(.2,1.4,.4,1) both; }
        @keyframes gachaGet { 0% { transform: scale(2.4); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

        .gacha-card { animation: gachaCardIn 700ms cubic-bezier(.2,.9,.25,1.15) both; }
        @keyframes gachaCardIn {
          0%   { transform: perspective(800px) rotateY(100deg) translateY(30px) scale(.6); opacity: 0; filter: brightness(2.6); }
          60%  { transform: perspective(800px) rotateY(-10deg) scale(1.05); opacity: 1; filter: brightness(1.3); }
          100% { transform: perspective(800px) rotateY(0) scale(1); filter: brightness(1); }
        }
        .gacha-shine {
          background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.65) 48%, transparent 66%);
          background-size: 250% 100%; background-position: 150% 0; animation: gachaShine 1.1s ease-out both;
        }
        @keyframes gachaShine { to { background-position: -60% 0; } }

        @media (prefers-reduced-motion: reduce) {
          .gacha-card, .gacha-get, .gacha-shine, .gacha-rays, .gacha-confetti, .gacha-btn::after { animation: none; }
          .gacha-confetti { display: none; }
        }
      `}</style>
    </div>
  )
}
