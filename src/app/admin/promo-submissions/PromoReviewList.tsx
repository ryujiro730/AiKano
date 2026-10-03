'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, ExternalLink, Clock } from 'lucide-react'

interface Submission {
  id: string
  user_id: string
  user_name: string
  character_id: string
  character_name: string
  post_url: string
  screenshot_url: string | null
  status: string
  notes: string | null
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function SubmissionRow({ s, onReviewed }: { s: Submission; onReviewed: (id: string, action: 'approve' | 'reject') => void }) {
  const [loading, setLoading] = useState(false)

  const handle = async (action: 'approve' | 'reject') => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId: s.id, action }),
      })
      if (res.ok) onReviewed(s.id, action)
      else alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ borderBottom: '1px solid var(--color-border)', padding: '14px 0', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{s.user_name}</span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>→</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-primary)' }}>🔒 {s.character_name}</span>
          <span style={{ fontSize: 11, color: 'var(--color-text-muted)', marginLeft: 'auto' }}>{formatDate(s.created_at)}</span>
        </div>

        <a
          href={s.post_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 12, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4, wordBreak: 'break-all' }}
        >
          <ExternalLink size={11} />
          {s.post_url.length > 60 ? s.post_url.slice(0, 60) + '…' : s.post_url}
        </a>

        {s.screenshot_url && (
          <a href={s.screenshot_url} target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={s.screenshot_url} alt="screenshot" style={{ marginTop: 8, maxHeight: 80, borderRadius: 8, border: '1px solid var(--color-border)' }} />
          </a>
        )}
      </div>

      {s.status === 'pending' && (
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => handle('approve')}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'rgba(34,197,94,0.12)', color: '#16a34a', fontWeight: 700, fontSize: 13,
              opacity: loading ? 0.5 : 1,
            }}
          >
            <CheckCircle size={14} /> 承認
          </button>
          <button
            onClick={() => handle('reject')}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'rgba(239,68,68,0.1)', color: '#dc2626', fontWeight: 700, fontSize: 13,
              opacity: loading ? 0.5 : 1,
            }}
          >
            <XCircle size={14} /> 却下
          </button>
        </div>
      )}

      {s.status === 'approved' && (
        <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>✓ 承認済み</span>
      )}
      {s.status === 'rejected' && (
        <span style={{ fontSize: 12, fontWeight: 700, color: '#dc2626', flexShrink: 0 }}>✗ 却下済み</span>
      )}
    </div>
  )
}

export function PromoReviewList({
  pending: initialPending,
  reviewed: initialReviewed,
}: {
  pending: Submission[]
  reviewed: Submission[]
}) {
  const [pending, setPending] = useState<Submission[]>(initialPending)
  const [reviewed, setReviewed] = useState<Submission[]>(initialReviewed)

  const handleReviewed = (id: string, action: 'approve' | 'reject') => {
    const target = pending.find(s => s.id === id)
    if (target) {
      setPending(prev => prev.filter(s => s.id !== id))
      setReviewed(prev => [{ ...target, status: action === 'approve' ? 'approved' : 'rejected' }, ...prev])
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-xl font-bold mb-6">プロモ申請 レビュー</h1>

      {/* 未審査 */}
      <section className="mb-8">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Clock size={16} style={{ color: 'var(--color-text-muted)' }} />
          <h2 style={{ fontWeight: 700, fontSize: 15 }}>未審査 ({pending.length}件)</h2>
        </div>
        {pending.length === 0 ? (
          <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>未審査の申請はありません</p>
        ) : (
          pending.map(s => <SubmissionRow key={s.id} s={s} onReviewed={handleReviewed} />)
        )}
      </section>

      {/* 審査済み */}
      {reviewed.length > 0 && (
        <section>
          <h2 style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: 'var(--color-text-muted)' }}>
            審査済み ({reviewed.length}件)
          </h2>
          {reviewed.map(s => <SubmissionRow key={s.id} s={s} onReviewed={handleReviewed} />)}
        </section>
      )}
    </div>
  )
}
