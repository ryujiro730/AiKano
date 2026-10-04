export const LOCALES = ['ja', 'en', 'es', 'pt', 'de', 'fr'] as const
export type Locale = typeof LOCALES[number]

export const DEFAULT_LOCALE: Locale = 'en'
export const LOCALE_COOKIE = 'lang'
export const LOCALE_HEADER = 'x-aikano-locale'

export const LOCALE_NAMES: Record<Locale, string> = {
  ja: '日本語', en: 'English', es: 'Español', pt: 'Português', de: 'Deutsch', fr: 'Français',
}

// date-fns / Intl 用
export const INTL_LOCALE: Record<Locale, string> = {
  ja: 'ja-JP', en: 'en-US', es: 'es-ES', pt: 'pt-BR', de: 'de-DE', fr: 'fr-FR',
}

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}

/** Accept-Language から対応言語を選ぶ（なければ英語） */
export function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return DEFAULT_LOCALE
  const tags = header.split(',')
    .map(part => {
      const [tag, q] = part.trim().split(';q=')
      return { lang: tag.toLowerCase().split('-')[0], q: q ? parseFloat(q) : 1 }
    })
    .sort((a, b) => b.q - a.q)
  return tags.find(t => isLocale(t.lang))?.lang as Locale ?? DEFAULT_LOCALE
}
