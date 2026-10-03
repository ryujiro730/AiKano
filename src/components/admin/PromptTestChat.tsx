'use client'

import { useState } from 'react'
import { Loader2, Send, RotateCcw } from 'lucide-react'
import { AFFECTION_LEVELS } from '@/lib/affection'

type Draft = { name: string; age: number | string | null; description: string; personality: string; system_prompt: string }
type Msg = { role: 'user' | 'assistant'; content: string }

/** 編集中のキャラ設定でAIの返事を試すパネル（保存・送信はしない） */
export function PromptTestChat({ draft }: { draft: Draft }) {
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [level, setLevel] = useState(1)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const send = async () => {
    const text = input.trim()
    if (!text || busy) return
    setInput(''); setError(''); setBusy(true)
    const history = msgs
    setMsgs(m => [...m, { role: 'user', content: text }])
    const res = await fetch('/api/admin/character-test', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ character: draft, history, message: text, affectionLevel: level }),
    })
    const data = await res.json().catch(() => ({}))
    setBusy(false)
    if (!res.ok) { setError(data.error ?? 'エラー'); return }
    setMsgs(m => [...m, { role: 'assistant', content: data.reply }])
  }

  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <p className="text-xs font-bold">テスト会話 <span className="font-normal" style={{ color: 'var(--color-text-muted)' }}>（保存前の設定で試せます。ユーザーには送られません）</span></p>
        <div className="flex items-center gap-2">
          <select value={level} onChange={e => setLevel(Number(e.target.value))} className="text-xs rounded-md px-1.5 py-1" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
            {AFFECTION_LEVELS.map(l => <option key={l.level} value={l.level}>Lv.{l.level} {l.title}</option>)}
          </select>
          <button type="button" onClick={() => { setMsgs([]); setError('') }} className="p-1" style={{ color: 'var(--color-text-muted)' }} aria-label="リセット"><RotateCcw size={14} /></button>
        </div>
      </div>
      <div className="flex flex-col gap-1.5 mb-2 overflow-y-auto" style={{ maxHeight: 260 }}>
        {msgs.length === 0 && <p className="text-xs py-3 text-center" style={{ color: 'var(--color-text-muted)' }}>ユーザーとして話しかけてみてください</p>}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : ''}`}>
            <div className={`${m.role === 'user' ? 'bubble-user' : 'bubble-operator'} px-3 py-1.5 text-sm max-w-[85%] whitespace-pre-wrap`}>{m.content}</div>
          </div>
        ))}
        {busy && <Loader2 size={14} className="animate-spin" style={{ color: 'var(--color-text-muted)' }} />}
      </div>
      {error && <p className="text-xs text-red-500 mb-1">{error}</p>}
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) { e.preventDefault(); send() } }}
          placeholder="例: 今日仕事で疲れた" className="flex-1 rounded-md px-3 py-1.5 text-sm" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} />
        <button type="button" onClick={send} disabled={busy || !input.trim() || !draft.name} className="btn-primary px-3 disabled:opacity-40" aria-label="送信"><Send size={14} /></button>
      </div>
    </div>
  )
}
