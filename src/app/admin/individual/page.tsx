'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Search, Send, Loader2, MessageCircle, ExternalLink } from 'lucide-react'

type User = {
  id: string
  display_name: string | null
  user_code: string | null
  points: number | null
  bonus_points: number | null
  created_at: string
  last_login_at: string | null
}

type Character = { id: string; name: string }

type Conversation = {
  id: string
  character_id: string
  last_message_at: string | null
  last_message_content: string | null
  characters: { name: string } | null
}

function toJST(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })
}

export default function IndividualPage() {
  const supabase = createClient()
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [charId, setCharId] = useState('')
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [lastSent, setLastSent] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    supabase.from('characters').select('id, name').order('name').then(({ data }) => {
      setCharacters(data ?? [])
      if (data?.[0]) setCharId(data[0].id)
    })
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!query.trim()) { setUsers([]); return }
    debounceRef.current = setTimeout(() => searchUsers(query.trim()), 300)
  }, [query])

  async function searchUsers(q: string) {
    setSearching(true)
    const { data } = await supabase
      .from('profiles')
      .select('id, display_name, user_code, points, bonus_points, created_at, last_login_at')
      .or(`display_name.ilike.%${q}%,user_code.ilike.%${q}%`)
      .not('role', 'in', '("admin","staff","owner")')
      .order('last_login_at', { ascending: false })
      .limit(30)
    setUsers(data ?? [])
    setSearching(false)
  }

  async function selectUser(u: User) {
    setSelectedUser(u)
    setLastSent(null)
    const { data } = await supabase
      .from('conversations')
      .select('id, character_id, last_message_at, last_message_content, characters(name)')
      .eq('user_id', u.id)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .limit(20)
    setConversations((data ?? []) as unknown as Conversation[])
  }

  async function send() {
    if (!selectedUser || !charId || !content.trim()) return
    setSending(true)
    const res = await fetch('/api/admin/individual-send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: selectedUser.id, characterId: charId, content: content.trim() }),
    })
    setSending(false)
    if (res.ok) {
      setLastSent(content.trim())
      setContent('')
      // 会話リストを更新
      selectUser(selectedUser)
    } else {
      const err = await res.json().catch(() => ({}))
      alert(err.error ?? '送信に失敗しました')
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl font-bold mb-6">個別送信</h1>

      <div className="flex gap-4 items-start">
        {/* 左: ユーザー検索 */}
        <div className="w-80 shrink-0">
          <div className="relative mb-3">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
            <input
              className="w-full pl-9 pr-3 py-2 rounded-xl text-sm"
              style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
              placeholder="名前 / ユーザーコードで検索"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          {searching && (
            <div className="flex justify-center py-4"><Loader2 size={20} className="animate-spin" /></div>
          )}

          <div className="space-y-1">
            {users.map(u => (
              <button
                key={u.id}
                onClick={() => selectUser(u)}
                className="w-full text-left px-3 py-2 rounded-xl text-sm transition-colors"
                style={{
                  background: selectedUser?.id === u.id ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                  color: selectedUser?.id === u.id ? '#fff' : 'var(--color-text)',
                }}
              >
                <div className="font-medium">{u.display_name ?? '(名前なし)'}</div>
                <div className="text-xs opacity-70">
                  {u.user_code} · {u.points ?? 0}pt
                  {(u.bonus_points ?? 0) > 0 && <span> +{u.bonus_points}ボーナス</span>}
                </div>
              </button>
            ))}
            {!searching && query && users.length === 0 && (
              <p className="text-sm text-center py-4" style={{ color: 'var(--color-text-muted)' }}>見つかりません</p>
            )}
          </div>
        </div>

        {/* 右: 送信フォーム + 会話履歴 */}
        {selectedUser ? (
          <div className="flex-1 min-w-0 space-y-4">
            {/* ユーザー情報 */}
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{selectedUser.display_name ?? '(名前なし)'}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    {selectedUser.user_code} · 登録: {toJST(selectedUser.created_at).slice(0, 10)}
                    {selectedUser.last_login_at && ` · 最終ログイン: ${toJST(selectedUser.last_login_at).slice(0, 10)}`}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    ポイント: {selectedUser.points ?? 0}pt
                    {(selectedUser.bonus_points ?? 0) > 0 && ` + ボーナス ${selectedUser.bonus_points}pt`}
                  </div>
                </div>
                <a
                  href={`/admin/users/${selectedUser.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs"
                  style={{ color: 'var(--color-primary)' }}
                >
                  詳細 <ExternalLink size={12} />
                </a>
              </div>
            </div>

            {/* 送信フォーム */}
            <div className="glass rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium shrink-0">キャラクター</label>
                <select
                  className="flex-1 px-3 py-1.5 rounded-xl text-sm"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  value={charId}
                  onChange={e => setCharId(e.target.value)}
                >
                  {characters.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <textarea
                className="w-full px-3 py-2 rounded-xl text-sm resize-none"
                style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                rows={4}
                placeholder="送信するメッセージを入力..."
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send()
                }}
              />

              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  {content.length}/300文字 · Cmd+Enter で送信
                </span>
                <button
                  onClick={send}
                  disabled={sending || !content.trim() || content.length > 300}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                  style={{
                    background: 'var(--color-primary)',
                    color: '#fff',
                    opacity: sending || !content.trim() ? 0.6 : 1,
                  }}
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  送信
                </button>
              </div>

              {lastSent && (
                <div className="text-xs px-3 py-2 rounded-xl" style={{ background: '#d1fae5', color: '#065f46' }}>
                  送信完了: 「{lastSent.slice(0, 50)}{lastSent.length > 50 ? '…' : ''}」
                </div>
              )}
            </div>

            {/* 会話リスト */}
            {conversations.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MessageCircle size={16} /> 会話一覧 ({conversations.length})
                </h2>
                <div className="space-y-2">
                  {conversations.map(cv => (
                    <a
                      key={cv.id}
                      href={`/admin/conversations/${cv.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block glass rounded-xl px-4 py-3 hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{cv.characters?.name ?? cv.character_id.slice(0, 8)}</span>
                        {cv.last_message_at && (
                          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {toJST(cv.last_message_at).slice(0, 16)}
                          </span>
                        )}
                      </div>
                      {cv.last_message_content && (
                        <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-muted)' }}>
                          {cv.last_message_content}
                        </p>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center py-20" style={{ color: 'var(--color-text-muted)' }}>
            <p className="text-sm">ユーザーを検索・選択してください</p>
          </div>
        )}
      </div>
    </div>
  )
}
