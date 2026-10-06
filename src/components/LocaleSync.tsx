'use client'

import { useEffect } from 'react'
import type { Locale } from '@/i18n/config'

/** ログイン中はプロフィールの言語を正とし、Cookie と食い違っていたら合わせて再読み込みする */
export function LocaleSync({ locale }: { locale: Locale }) {
  useEffect(() => {
    // Cookie が保存できない環境で再読み込みを繰り返さないよう、セッション中は1回だけ試す
    const key = `locale_sync_${locale}`
    try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, '1') } catch { return }
    fetch('/api/profile/locale', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ locale }) })
      .then(() => window.location.reload())
      .catch(() => {})
  }, [locale])
  return null
}
