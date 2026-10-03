'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Loader2, Brain, Heart, User } from 'lucide-react'
import { ActionLogTimeline } from '@/components/admin/ActionLogTimeline'
import { getAffectionLevel } from '@/lib/affection'

type Msg = { id: string; sender_role: 'user' | 'character'; content: string; metadata: Record<string, string> | null; points_used: number; is_deleted: boolean; created_at: string }
type View = {
  conversation: {
    id: string; user_id: string; last_message_at: string | null
    characters: { id: string; name: string; age: number | null; avatar_url: string } | null
    profiles: { id: string; display_name: string | null; user_code: string; age: number | null; points: number; subscription_status: string | null; subscription_plan: string | null } | null
  }
  messages: Msg[]
  hasMore: boolean
  affection: { affection_points: number; affection_level: number; message_count: number; last_chat_at: string | null } | null
  memory: { memory_text: string; updated_at: string } | null
}

const time = (d: string) => new Date(d).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const day = (d: string) => new Date(d).toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' })

// 管理画面: ユーザーとキャラの会話を閲覧（読み取り専用。AIが返信するので送信UIはなし）
export default function AdminConversationViewPage() {
  const { id } = useParams<{ id: string }>()
  const [view, setView] = useState<View | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [olderLoading, setOlderLoading] = useState(false)
  const [panel, setPanel] = useState<'chat' | 'info'>('chat')
  const bottomRef = useRef<HTMLDivElement>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/conversation-view/${id}`)
    const data = await res.json()
    if (!res.ok) { setError(data.error ?? 'エラー'); return }
    setView(data)
    setTimeout(() => bottomRef.current?.scrollIntoView(), 50)
  }, [id])

  useEffect(() => { load() }, [load])

  const loadOlder = async () => {
    if (!view?.messages.length) return
    setOlderLoading(true)
    const res = await fetch(`/api/admin/conversation-view/${id}?before=${encodeURIComponent(view.messages[0].created_at)}`)
    const data = await res.json()
    setOlderLoading(false)
    if (res.ok) setView(v => v ? { ...v, messages: [...data.messages, ...v.messages], hasMore: data.hasMore } : v)
  }

  if (error) return <p className="text-sm text-red-500 py-10 text-center">エラー: {error}</p>
  if (!view) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={22} /></div>

  const { conversation: c, affection, memory } = view
  const ch = c.characters
  const u = c.profiles
  const lv = affection ? getAffectionLevel(affection.affection_points) : null

  return (
    <div className="max-w-6xl">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 mb-3">
        <Link href="/admin/conversations" style={{ color: 'var(--color-text-muted)' }}><ChevronLeft size={20} /></Link>
        {ch && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ch.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" style={{ objectPosition: 'top center' }} />
        )}
        <div className="flex-1 min-w-0">
          <p className="font-bold truncate">
            <Link href={`/admin/users/${c.user_id}`} className="hover:underline">{u?.display_name ?? '未設定'}</Link>
            <span className="font-normal mx-1.5" style={{ color: 'var(--color-text-muted)' }}>×</span>
            {ch?.name}
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{c.last_message_at ? `最終メッセージ ${time(c.last_message_at)}` : ''}</p>
        </div>
      </div>

      {/* モバイル: 切り替え */}
      <div className="lg:hidden flex gap-1 p-1 rounded-lg mb-3" style={{ background: 'var(--color-surface-2)' }}>
        {([['chat', '会話'], ['info', 'ユーザー・記憶・ログ']] as const).map(([k, label]) => (
          <button key={k} onClick={() => setPanel(k)} className="flex-1 py-1.5 text-sm font-semibold rounded-md"
            style={panel === k ? { background: 'var(--color-surface)' } : { color: 'var(--color-text-muted)' }}>{label}</button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-4 items-start">
        {/* 会話 */}
        <div className={`card p-4 ${panel === 'chat' ? '' : 'hidden lg:block'}`} style={{ maxHeight: 'calc(100vh - 150px)', overflowY: 'auto' }}>
          {view.hasMore && (
            <button onClick={loadOlder} disabled={olderLoading} className="w-full mb-3 py-2 text-xs font-semibold rounded-md"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
              {olderLoading ? '読み込み中…' : 'さらに前のメッセージ'}
            </button>
          )}
          {view.messages.length === 0 && <p className="text-sm text-center py-10" style={{ color: 'var(--color-text-muted)' }}>メッセージはありません</p>}
          <div className="flex flex-col gap-2">
            {view.messages.map((m, i) => {
              const prev = view.messages[i - 1]
              const showDay = !prev || day(prev.created_at) !== day(m.created_at)
              const isUser = m.sender_role === 'user'
              const media = m.metadata?.image_url || m.metadata?.video_url || m.metadata?.item_image_url
              return (
                <div key={m.id}>
                  {showDay && <p className="text-[11px] text-center font-semibold py-2" style={{ color: 'var(--color-text-muted)' }}>{day(m.created_at)}</p>}
                  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`} style={{ opacity: m.is_deleted ? 0.45 : 1 }}>
                    <div className="max-w-[78%]">
                      <div className={`${isUser ? 'bubble-user' : 'bubble-operator'} px-3 py-2 text-sm whitespace-pre-wrap break-words`}>
                        {m.content}
                        {media && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={m.metadata!.image_url || m.metadata!.item_image_url} alt="" className="mt-1.5 rounded-md max-h-48" />
                        )}
                      </div>
                      <p className={`text-[10px] mt-0.5 tabular-nums ${isUser ? 'text-right' : ''}`} style={{ color: 'var(--color-text-muted)' }}>
                        {time(m.created_at)}{isUser && m.points_used ? ` · ${m.points_used}pt` : ''}{m.is_deleted ? ' · 削除済み' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div ref={bottomRef} />
        </div>

        {/* サイドパネル */}
        <div className={`space-y-3 ${panel === 'info' ? '' : 'hidden lg:block'}`}>
          <div className="card p-4">
            <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}><User size={13} />ユーザー</p>
            <Link href={`/admin/users/${c.user_id}`} className="text-sm font-semibold hover:underline">{u?.display_name ?? '未設定'}</Link>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {u?.user_code}{u?.age ? ` · ${u.age}歳` : ''} · 残高 {u?.points?.toLocaleString() ?? 0}pt
              {(u?.subscription_status === 'active' || u?.subscription_status === 'trialing') ? ` · ${u.subscription_plan}会員` : ''}
            </p>
          </div>

          <div className="card p-4">
            <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}><Heart size={13} />好感度</p>
            {affection && lv ? (
              <p className="text-sm"><span className="font-bold" style={{ color: lv.color }}>Lv.{lv.level} {lv.title}</span>
                <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>{affection.affection_points}pt · {affection.message_count}回</span></p>
            ) : <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>—</p>}
          </div>

          <div className="card p-4">
            <p className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}><Brain size={13} />AIの記憶（このユーザーについて）</p>
            {memory?.memory_text ? (
              <>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{memory.memory_text}</p>
                <p className="text-[10px] mt-2" style={{ color: 'var(--color-text-muted)' }}>更新 {time(memory.updated_at)}</p>
              </>
            ) : <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>まだ記憶はありません</p>}
          </div>

          <div className="card p-4">
            <p className="text-xs font-bold mb-2" style={{ color: 'var(--color-text-muted)' }}>このユーザーのアクションログ</p>
            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              <ActionLogTimeline userId={c.user_id} compact />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
