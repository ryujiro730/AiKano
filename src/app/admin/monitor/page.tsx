'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { Bell, BellOff, ExternalLink, RefreshCw } from 'lucide-react'

type Conv = {
  id: string
  last_message_at: string
  last_message_content: string | null
  is_unread_staff: boolean
  characters: { id: string; name: string; avatar_url: string } | null
  profiles: { id: string; user_code: string | null; display_name: string | null; points: number; bonus_points: number } | null
}

export default function AdminMonitorPage() {
  const [convs, setConvs] = useState<Conv[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [volume, setVolume] = useState(2)
  const [newIds, setNewIds] = useState<Set<string>>(new Set())
  const prevIdsRef = useRef<Set<string>>(new Set())
  const audioCtxRef = useRef<AudioContext | null>(null)
  const supabase = createClient()

  const playBeep = useCallback(() => {
    if (!soundEnabled) return
    try {
      const ctx = audioCtxRef.current
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = 880
      osc.type = 'sine'
      gain.gain.setValueAtTime(volume, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.5)
    } catch {}
  }, [soundEnabled, volume])

  const fetchConvs = useCallback(async () => {
    const { data } = await supabase
      .from('conversations')
      .select(`
        id,
        last_message_at,
        last_message_content,
        is_unread_staff,
        characters ( id, name, avatar_url ),
        profiles!conversations_user_id_fkey ( id, user_code, display_name, points, bonus_points )
      `)
      .not('character_id', 'is', null)
      .eq('has_user_reply', true)
      .eq('is_unread_staff', true)
      .order('last_message_at', { ascending: true })

    const list = (data ?? []) as unknown as Conv[]
    const newIdSet = new Set(list.map(c => c.id))

    const added = list.filter(c => !prevIdsRef.current.has(c.id))
    if (added.length > 0 && prevIdsRef.current.size > 0) {
      setNewIds(prev => {
        const s = new Set(prev)
        added.forEach(c => s.add(c.id))
        return s
      })
      playBeep()
      setTimeout(() => {
        setNewIds(prev => {
          const s = new Set(prev)
          added.forEach(c => s.delete(c.id))
          return s
        })
      }, 3000)
    }

    prevIdsRef.current = newIdSet
    setConvs(list)
    setLastUpdated(new Date())
    setLoading(false)
  }, [playBeep])

  useEffect(() => {
    fetchConvs()

    const channel = supabase
      .channel('monitor:conversations')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'conversations',
      }, () => {
        fetchConvs()
      })
      .subscribe()

    const interval = setInterval(fetchConvs, 5_000)

    const onVisibility = () => { if (!document.hidden) fetchConvs() }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [fetchConvs])

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)', fontFamily: 'inherit' }}>
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
        <div className="flex items-center gap-3">
          <h1 className="font-bold text-base">受信モニター</h1>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{
              background: convs.length > 0 ? 'var(--color-primary)' : 'var(--color-surface-2)',
              color: convs.length > 0 ? '#fff' : 'var(--color-text-muted)',
            }}
          >
            {convs.length} 件
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--color-text-muted)]">
            {formatDistanceToNow(lastUpdated, { addSuffix: true, locale: ja })} 更新
          </span>
          <button
            onClick={() => { setLoading(true); fetchConvs() }}
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors text-[var(--color-text-muted)]"
            title="手動更新"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => {
              const next = !soundEnabled
              setSoundEnabled(next)
              if (next && !audioCtxRef.current) {
                try { audioCtxRef.current = new AudioContext() } catch {}
              }
            }}
            className={`p-1.5 rounded-lg transition-colors ${soundEnabled ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]'} hover:bg-[var(--color-surface-2)]`}
            title={soundEnabled ? '音をオフ' : '音をオン'}
          >
            {soundEnabled ? <Bell size={14} /> : <BellOff size={14} />}
          </button>
          {soundEnabled && (
            <input
              type="range"
              min={0.1}
              max={2}
              step={0.1}
              value={volume}
              onChange={e => setVolume(parseFloat(e.target.value))}
              title={`音量: ${Math.round(volume * 100)}%`}
              style={{ width: '72px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
            />
          )}
          <a
            href="/admin/conversations"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] flex items-center gap-1 transition-colors"
          >
            <ExternalLink size={13} />
            受信トレイ
          </a>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading && convs.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-[var(--color-text-muted)] text-sm">読み込み中…</div>
        ) : convs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3 text-[var(--color-text-muted)]">
            <div className="text-4xl">✓</div>
            <p className="text-sm font-medium">未返信のメッセージはありません</p>
          </div>
        ) : (
          <div>
            {convs.map((conv) => {
              const totalPts = (conv.profiles?.points ?? 0) + (conv.profiles?.bonus_points ?? 0)
              const isNew = newIds.has(conv.id)
              const isLowPts = totalPts < 10

              const rowStyle: React.CSSProperties = isNew
                ? { borderColor: 'var(--color-border)', background: 'rgba(232,67,143,0.08)', transition: 'background 0.5s' }
                : isLowPts
                  ? { borderColor: 'rgba(220,38,38,0.35)', background: 'rgba(220,38,38,0.08)', transition: 'background 0.5s' }
                  : { borderColor: 'var(--color-border)', transition: 'background 0.5s' }

              return (
                <a
                  key={conv.id}
                  href={`/admin/conversations/${conv.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 px-5 py-4 border-b transition-colors hover:bg-[var(--color-surface-2)]"
                  style={rowStyle}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full overflow-hidden border" style={{ borderColor: 'var(--color-border)' }}>
                      {conv.characters?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={conv.characters.avatar_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full" style={{ background: 'var(--color-surface-2)' }} />
                      )}
                    </div>
                    {isNew && (
                      <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-400 border-2 border-[var(--color-bg)] animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-sm font-semibold truncate">
                          {conv.profiles?.display_name ?? '不明'}
                        </span>
                        {conv.profiles?.user_code && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded flex-shrink-0"
                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                            {conv.profiles.user_code}
                          </span>
                        )}
                        <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">→ {conv.characters?.name}</span>
                        {isLowPts && (
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0" style={{ background: 'rgba(220,38,38,0.2)', color: '#f87171' }}>PT限界</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-[11px] font-mono" style={{ color: isLowPts ? '#f87171' : 'var(--color-text-muted)' }}>
                          {totalPts}pt
                        </span>
                        <span className="text-[11px] text-[var(--color-text-muted)]">
                          {formatDistanceToNow(new Date(conv.last_message_at), { addSuffix: true, locale: ja })}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--color-text-muted)] truncate">
                      {conv.last_message_content ?? '（メディア）'}
                    </p>
                  </div>

                  <ExternalLink size={13} className="flex-shrink-0 mt-1 text-[var(--color-text-muted)] opacity-40" />
                </a>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
