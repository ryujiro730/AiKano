'use client'

import { Globe } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { LOCALES, LOCALE_NAMES, type Locale } from '@/i18n/config'

/** ゲストでも使える小さな言語切替 */
export function LanguageSelect() {
  const { locale, m } = useI18n()
  const change = async (next: Locale) => {
    await fetch('/api/profile/locale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: next }) })
    window.location.reload()
  }
  return (
    <label className="inline-flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
      <Globe size={13} aria-hidden />
      <span className="sr-only">{m.common.language}</span>
      <select
        value={locale}
        onChange={e => change(e.target.value as Locale)}
        className="bg-transparent text-xs outline-none cursor-pointer"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {LOCALES.map(l => <option key={l} value={l}>{LOCALE_NAMES[l]}</option>)}
      </select>
    </label>
  )
}
