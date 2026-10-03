'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export function PointsDisplay({ initialPoints }: { initialPoints: number }) {
  const [points, setPoints] = useState(initialPoints)

  useEffect(() => {
    const handler = (e: Event) => {
      setPoints((e as CustomEvent<{ points: number }>).detail.points)
    }
    window.addEventListener('pointsUpdated', handler)
    return () => window.removeEventListener('pointsUpdated', handler)
  }, [])

  return (
    <Link
      href="/payment#points"
      className="flex items-center gap-1.5 rounded-lg pl-2.5 pr-1 py-1 transition-opacity hover:opacity-80"
      style={{ background: 'var(--color-surface-2)' }}
    >
      <span className="text-[13px] font-bold tabular-nums" style={{ color: 'var(--color-text)' }}>
        {points.toLocaleString()}
      </span>
      <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>pt</span>
      <span className="w-5 h-5 rounded-md flex items-center justify-center ml-0.5"
        style={{ background: 'var(--color-primary)' }}>
        <Plus size={12} color="#fff" strokeWidth={2.5} />
      </span>
    </Link>
  )
}
