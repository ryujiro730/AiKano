'use client'

import { useRouter } from 'next/navigation'
import { ArrowDownUp } from 'lucide-react'

export function SortToggleButton({ currentSort }: { currentSort: 'asc' | 'desc' }) {
  const router = useRouter()

  const toggle = () => {
    const next = currentSort === 'desc' ? 'asc' : 'desc'
    router.push(`/conversations?sort=${next}`)
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1.5 text-xs font-medium px-3 h-9 rounded-[10px] transition-colors"
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-text)',
        border: '1px solid var(--color-border)',
      }}
    >
      <ArrowDownUp size={12} />
      {currentSort === 'desc' ? '新しい順' : '古い順'}
    </button>
  )
}
