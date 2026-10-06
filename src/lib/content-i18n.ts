import type { Locale } from '@/i18n/config'

/** DB の i18n 列（{ en: { name, ... } }）から表示言語の文字列を選ぶ。翻訳がない項目は元の日本語 */
export function localizedText<T extends { i18n?: unknown }>(row: T, locale: Locale, fields: (keyof T & string)[]): T {
  if (locale === 'ja') return row
  const t = ((row.i18n ?? {}) as Record<string, Record<string, string>>)[locale]
  if (!t) return row
  const out = { ...row }
  for (const f of fields) if (t[f]) (out as Record<string, unknown>)[f] = t[f]
  return out
}
