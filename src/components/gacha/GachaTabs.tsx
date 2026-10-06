'use client'

import Link from 'next/link'
import { Sparkles, LayoutGrid } from 'lucide-react'
import { useI18n } from '@/i18n/client'

/** ガチャ ⇄ コレクション の切り替えタブ */
export function GachaTabs({ active }: { active: 'gacha' | 'collection' }) {
  const { m } = useI18n()
  const tabs = [
    { key: 'gacha', href: '/gacha', label: m.album.tabGacha, icon: Sparkles },
    { key: 'collection', href: '/album', label: m.album.tabCollection, icon: LayoutGrid },
  ] as const
  return (
    <div className="flex p-1 mb-4" style={{ background: 'var(--color-surface-2)', borderRadius: 12 }}>
      {tabs.map(t => {
        const on = t.key === active
        return (
          <Link key={t.key} href={t.href} prefetch={false}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-bold transition-colors"
            style={on
              ? { background: 'var(--color-surface)', color: 'var(--color-primary)', borderRadius: 9, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }
              : { color: 'var(--color-text-muted)' }}>
            <t.icon size={15} strokeWidth={2.2} />{t.label}
          </Link>
        )
      })}
    </div>
  )
}
