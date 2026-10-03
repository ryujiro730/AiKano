'use client'

import { useState, useEffect } from 'react'
import { Loader2, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import { PLANS } from '@/lib/plans'

type Request = {
  id: string
  user_id: string
  plan_id: string
  amount_yen: number
  receipt_url: string | null
  status: 'pending' | 'confirmed' | 'rejected'
  requested_at: string
  confirmed_at: string | null
  admin_note: string | null
  user: { id: string; display_name: string | null } | null
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminBankTransfersPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState<Record<string, string>>({})
  const [processing, setProcessing] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/bank-transfers')
    const data = await res.json()
    setRequests(data.requests ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const pendingCount = requests.filter(r => r.status === 'pending').length
  const filtered = tab === 'pending' ? requests.filter(r => r.status === 'pending') : requests

  const confirm = async (r: Request) => {
    if (!window.confirm(`${r.user?.display_name ?? 'このユーザー'}の${PLANS[r.plan_id as keyof typeof PLANS]?.name ?? r.plan_id}プランを有効化しますか？`)) return
    setProcessing(r.id)
    const res = await fetch(`/api/admin/bank-transfers/${r.id}/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_note: noteInput[r.id] ?? null }),
    })
    if (res.ok) { await load(); setExpanded(null) }
    else { alert('処理に失敗しました'); setProcessing(null) }
  }

  const reject = async (r: Request) => {
    if (!window.confirm('この申請を却下しますか？')) return
    setProcessing(r.id)
    const res = await fetch(`/api/admin/bank-transfers/${r.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_note: noteInput[r.id] ?? null }),
    })
    if (res.ok) { await load(); setExpanded(null) }
    else { alert('処理に失敗しました'); setProcessing(null) }
  }

  const badge = (status: string) => {
    if (status === 'pending') return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(234,179,8,0.15)', color: '#b45309' }}>
        <Clock size={10} />未確認
      </span>
    )
    if (status === 'confirmed') return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(125,186,132,0.15)', color: '#16a34a' }}>
        <CheckCircle2 size={10} />有効化済み
      </span>
    )
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626' }}>
        <XCircle size={10} />却下
      </span>
    )
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">銀行振込申請</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>着金確認後にプランを手動で有効化</p>
        </div>
        <button onClick={load} className="text-xs px-3 py-1.5 rounded-lg border"
          style={{ color: 'var(--color-text-muted)', borderColor: 'var(--color-border)' }}>更新</button>
      </div>

      <div className="flex gap-1 mb-4 p-1 rounded-xl" style={{ background: 'var(--color-surface-2)' }}>
        {([['pending', `未確認${pendingCount > 0 ? ` (${pendingCount})` : ''}`], ['all', '全件']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
            style={{
              background: tab === key ? 'var(--color-surface)' : 'transparent',
              color: tab === key ? 'var(--color-primary)' : 'var(--color-text-muted)',
            }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={24} /></div>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {tab === 'pending' ? '未確認の申請はありません' : '申請はありません'}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => {
            const isExpanded = expanded === r.id
            const plan = PLANS[r.plan_id as keyof typeof PLANS]
            return (
              <div key={r.id} className="card overflow-hidden">
                <button className="w-full text-left px-4 py-3 flex items-center gap-3"
                  onClick={() => setExpanded(isExpanded ? null : r.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{r.user?.display_name ?? '不明'}</span>
                      {badge(r.status)}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-sm font-bold">¥{r.amount_yen.toLocaleString()}</span>
                      <span className="text-xs" style={{ color: 'var(--color-primary)' }}>{plan?.name ?? r.plan_id}プラン</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{fmt(r.requested_at)}</span>
                      {r.receipt_url && <span className="text-xs" style={{ color: 'var(--color-primary)' }}>明細あり</span>}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={16} style={{ color: 'var(--color-text-muted)' }} />
                    : <ChevronDown size={16} style={{ color: 'var(--color-text-muted)' }} />}
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                    {r.receipt_url && (
                      <div className="pt-4">
                        <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>振込明細</p>
                        <a href={r.receipt_url} target="_blank" rel="noopener noreferrer">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={r.receipt_url} alt="振込明細" className="max-w-full max-h-72 object-contain rounded-xl border"
                            style={{ borderColor: 'var(--color-border)' }} />
                        </a>
                        <a href={r.receipt_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: 'var(--color-primary)' }}>
                          <ExternalLink size={11} />画像を別タブで開く
                        </a>
                      </div>
                    )}

                    {r.status === 'confirmed' && (
                      <div className="rounded-xl p-3 pt-4"
                        style={{ background: 'rgba(125,186,132,0.08)', border: '1px solid rgba(125,186,132,0.2)' }}>
                        <p className="text-xs font-semibold" style={{ color: '#16a34a' }}>有効化済み</p>
                        <p className="text-sm mt-1">{plan?.name}プラン（30日間）を有効化しました</p>
                        {r.confirmed_at && <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{fmt(r.confirmed_at)}</p>}
                        {r.admin_note && <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>メモ: {r.admin_note}</p>}
                      </div>
                    )}

                    {r.status === 'rejected' && (
                      <div className="rounded-xl p-3 pt-4"
                        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
                        <p className="text-xs font-semibold" style={{ color: '#dc2626' }}>却下済み</p>
                        {r.admin_note && <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>メモ: {r.admin_note}</p>}
                      </div>
                    )}

                    {r.status === 'pending' && (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="text-xs font-semibold block mb-1">メモ（任意）</label>
                          <input type="text" placeholder="着金確認済み など"
                            value={noteInput[r.id] ?? ''}
                            onChange={e => setNoteInput(prev => ({ ...prev, [r.id]: e.target.value }))}
                            className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => confirm(r)} disabled={processing === r.id}
                            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
                            style={{ background: 'var(--color-primary)' }}>
                            {processing === r.id ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
                            着金確認・プラン有効化
                          </button>
                          <button onClick={() => reject(r)} disabled={processing === r.id}
                            className="px-4 py-3 rounded-xl font-bold text-sm disabled:opacity-50"
                            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
                            却下
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
