'use client'

import { useState } from 'react'
import { X, ExternalLink, Send } from 'lucide-react'

interface Props {
  characterId: string
  characterName: string
  onClose: () => void
  onSuccess: () => void
}

export function UnlockModal({ characterId, characterName, onClose, onSuccess }: Props) {
  const [postUrl, setPostUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!postUrl.trim()) { setError('投稿URLを入力してください'); return }
    if (!postUrl.startsWith('http')) { setError('正しいURLを入力してください'); return }

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
          setError('既に申請済みです。審査をお待ちください。')
        } else if (data.error === 'already_unlocked') {
          onSuccess()
        } else {
          setError('送信に失敗しました。再度お試しください。')
        }
        return
      }

      onSuccess()
    } catch {
      setError('通信エラーが発生しました。')
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
          <p style={{ fontWeight: 800, fontSize: 17 }}>🔓 {characterName}を解放する</p>
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
            SNSで宣伝してキャラ解放！
          </p>
          <ol style={{ paddingLeft: 18, margin: 0, fontSize: 13, lineHeight: 2, color: 'var(--color-text-muted)' }}>
            <li>AiKanoをSNS（Twitter / Instagram等）で紹介する</li>
            <li>投稿のURLをコピーして下に貼り付ける</li>
            <li>スタッフが確認後、{characterName}が解放されます</li>
          </ol>
        </div>

        {/* URL入力 */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-text-muted)', letterSpacing: '0.06em', marginBottom: 8, display: 'block' }}>
            投稿URL
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
          {submitting ? '送信中...' : '申請する'}
        </button>

        <p style={{ fontSize: 11, color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 12, lineHeight: 1.6 }}>
          通常1〜3営業日以内に審査完了します
        </p>
      </div>
    </div>
  )
}
