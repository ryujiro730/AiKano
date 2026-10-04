'use client'

import { useEffect, useState } from 'react'
import { AvatarImage } from '@/components/AvatarImage'
import { Ban, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'
import { INTL_LOCALE } from '@/i18n/config'

interface Block {
  character_id: string
  created_at: string
  character: { id: string; name: string; avatar_url: string }
}

export default function BlocksPage() {
  const { m, locale } = useI18n()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [loading, setLoading] = useState(true)
  const [unblocking, setUnblocking] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/blocks')
      .then(r => r.json())
      .then(({ blocks }) => setBlocks(blocks ?? []))
      .finally(() => setLoading(false))
  }, [])

  const unblock = async (characterId: string) => {
    setUnblocking(characterId)
    const res = await fetch(`/api/characters/${characterId}/block`, { method: 'DELETE' })
    if (res.ok) setBlocks(prev => prev.filter(b => b.character_id !== characterId))
    setUnblocking(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 py-3 mb-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Link href="/settings" className="p-1 -ml-1" style={{ color: 'var(--color-text-muted)' }}>
          <ChevronLeft size={22} />
        </Link>
        <h1 className="text-base font-bold">{m.blocks.title}</h1>
      </div>

      <div className="py-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--color-surface)' }}>
                <div className="w-12 h-12 rounded-full flex-shrink-0" style={{ background: 'var(--color-surface-2)' }} />
                <div className="flex-1 h-4 rounded" style={{ background: 'var(--color-surface-2)' }} />
                <div className="w-16 h-8 rounded-xl" style={{ background: 'var(--color-surface-2)' }} />
              </div>
            ))}
          </div>
        ) : blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Ban size={40} style={{ color: 'var(--color-border)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{m.blocks.empty}</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              {m.blocks.note}
            </p>
            {blocks.map(block => (
              <div
                key={block.character_id}
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1px solid var(--color-border)' }}>
                  <AvatarImage src={block.character?.avatar_url} alt={block.character?.name} iconSize={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{block.character?.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {fmt(m.blocks.blockedOn, { date: new Date(block.created_at).toLocaleDateString(INTL_LOCALE[locale], { month: 'long', day: 'numeric' }) })}
                  </p>
                </div>
                <button
                  onClick={() => unblock(block.character_id)}
                  disabled={unblocking === block.character_id}
                  className="text-xs px-3 py-1.5 rounded-xl border font-medium transition-opacity disabled:opacity-40"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                >
                  {unblocking === block.character_id ? m.blocks.unblocking : m.blocks.unblock}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
