'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

export function UnlockWithPointsButton() {
  const { m } = useI18n()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleUnlock() {
    setLoading(true)
    setError('')
    const res = await fetch('/api/points/unlock-character', { method: 'POST' })
    const data = await res.json()
    setLoading(false)
    if (data.ok) {
      router.refresh()
    } else {
      setError(data.message ?? m.common.error)
    }
  }

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      <button
        onClick={handleUnlock}
        disabled={loading}
        style={{
          fontSize: '10px', color: '#ffd700', fontWeight: 600,
          background: 'none', border: '1px solid rgba(255,215,0,0.4)',
          borderRadius: '6px', padding: '4px 10px', cursor: 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? m.packages.processing : fmt(m.unlockFor, { pt: '3,000' })}
      </button>
      {error && <p style={{ fontSize: '9px', color: '#ff6b6b', marginTop: '4px', padding: '0 4px' }}>{error}</p>}
    </div>
  )
}
