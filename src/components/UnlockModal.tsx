'use client'

import { useState } from 'react'
import { X, ExternalLink, Send } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

interface Props {
  characterId: string
  characterName: string
  onClose: () => void
  onSuccess: () => void
}

export function UnlockModal({ characterId, characterName, onClose, onSuccess }: Props) {
  const { m } = useI18n()
  const [postUrl, setPostUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!postUrl.trim()) { setError(m.unlock.urlRequired); return }
    if (!postUrl.startsWith('http')) { setError(m.unlock.urlInvalid); return }

    setSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/unlock/submit-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ characterId, postUrl }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.error === 'already_submitted') {
          setError(m.unlock.alreadyRequested)
        } else if (data.error === 'already_unlocked') {
          onSuccess()
        } else {
          setError(m.unlock.sendFailed)
        }
        return
      }

      onSuccess()
    } catch {
      setError(m.unlock.networkError)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{
          width: '100%', maxWidth: 480,
          background: 'var(--color-bg)',
          borderRadius: '24px 24px 0 0',
          padding: '24px 20px 36px',
        }}
      >
        {/* ヘッダー */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <p style={{ fontWeight: 800, fontSize: 17 }}>🔓 {fmt(m.unlock.title, { name: characterName })}</p>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: 'var(--color-text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* 説明 */}
        <div style={{
          background: 'var(--color-primary-soft)',
          border: '1px solid var(--color-primary-border)',
          borderRadius: 16, padding: '14px 16px', marginBottom: 20,
        }}>
          <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 6, color: 'var(--color-primary)' }}>
            {m.unlock.heading}
          </p>
          <ol style={{ paddingLeft: 18, margin: 0, fontSize: 13, lineHeight: 2, color: 'var(--color-text-muted)' }}>
            <li>{m.unlock.step1}</li>
            <li>{m.unlock.step2}</li>
            <li>{fmt(m.unlock.step3, { name: characterName })}</li>
          </ol>
        </div>

        {/* URL入力 */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', marginBottom: 8, display: 'block' }}>
            {m.unlock.urlLabel}
          </label>
          <input
            type="url"
            value={postUrl}
            onChange={e => setPostUrl(e.target.value)}
            placeholder="https://x.com/..."
            style={{
              width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
              border: '1.5px solid var(--color-border-warm)',
              background: 'var(--color-surface-2)', outline: 'none',
              color: 'var(--color-text)',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {error && (
          <p style={{ fontSize: 13, color: '#e05', marginBottom: 14, background: 'rgba(220,0,80,0.06)', borderRadius: 10, padding: '8px 12px' }}>
            {error}
          </p>
        )}

        {/* ボタン */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !postUrl.trim()}
          style={{
            width: '100%', padding: '14px', borderRadius: 18,
            background: 'var(--color-primary)',
            color: '#fff', fontWeight: 700, fontSize: 15, border: 'none',
            cursor: submitting || !postUrl.trim() ? 'not-allowed' : 'pointer',
            opacity: submitting || !postUrl.trim() ? 0.6 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: 'none',
          }}
        >
          <Send size={16} />
          {submitting ? m.unlock.sending : m.unlock.submit}
        </button>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
          {m.unlock.reviewTime}
        </p>
      </div>
    </div>
  )
}
