'use client'

import { createContext, useContext } from 'react'
import type { Locale } from './config'
import type { Messages } from './messages/ja'

const I18nContext = createContext<{ locale: Locale; m: Messages } | null>(null)

export function I18nProvider({ locale, messages, children }: { locale: Locale; messages: Messages; children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, m: messages }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('I18nProvider がありません')
  return ctx
}
