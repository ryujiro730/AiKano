'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function ReviewButton({ reportId }: { reportId: string }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const markReviewed = async () => {
    setLoading(true)
    await fetch(`/api/admin/reports/${reportId}/review`, { method: 'POST' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={markReviewed}
      disabled={loading}
      className="text-xs px-3 py-1.5 rounded-lg font-medium transition-opacity disabled:opacity-40"
      style={{ background: '#dcfce7', color: '#16a34a' }}
    >
      {loading ? '…' : '対応済みにする'}
    </button>
  )
}
