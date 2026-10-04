'use client'

import { useState } from 'react'
import { Globe } from 'lucide-react'
import { useI18n } from '@/i18n/client'
import { LOCALES, LOCALE_NAMES, type Locale } from '@/i18n/config'

export function LanguageCard() {
  const { m, locale } = useI18n()
  const [saving, setSaving] = useState(false)

  const change = async (next: Locale) => {
    if (next === locale) return
    setSaving(true)
    await fetch('/api/profile/locale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale: next }) })
    window.location.reload()
  }

  return (
    <div className="card p-5 mb-4">
      <label className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <Globe size={13} /> {m.settings.language}
      </label>
      <select
        value={locale}
        disabled={saving}
        onChange={e => change(e.target.value as Locale)}
        className="input-warm w-full px-3 py-2.5 text-sm"
      >
        {LOCALES.map(l => <option key={l} value={l}>{LOCALE_NAMES[l]}</option>)}
      </select>
    </div>
  )
}
