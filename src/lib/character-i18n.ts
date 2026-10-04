import type { Locale } from '@/i18n/config'

type CharacterText = { name?: string; personality?: string | null; description?: string | null }

/** キャラの名前・性格・説明を表示言語に合わせる（翻訳がなければ元の日本語） */
export function localizedCharacter<T extends CharacterText & { i18n?: unknown }>(c: T, locale: Locale): T {
  if (locale === 'ja') return c
  const t = ((c.i18n ?? {}) as Record<string, CharacterText>)[locale]
  if (!t) return c
  return {
    ...c,
    ...(t.name ? { name: t.name } : {}),
    ...(t.personality ? { personality: t.personality } : {}),
    ...(t.description ? { description: t.description } : {}),
  }
}
