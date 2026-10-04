'use client'

import { useRouter } from 'next/navigation'
import { ArrowDownUp } from 'lucide-react'
import { useI18n } from '@/i18n/client'

export function SortToggleButton({ currentSort }: { currentSort: 'asc' | 'desc' }) {
  const { m } = useI18n()
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
      {currentSort === 'desc' ? m.conversations.newest : m.conversations.oldest}
    </button>
  )
}
