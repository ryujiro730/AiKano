import { LOCALES, LOCALE_NAMES, type Locale } from '@/i18n/config'

const MODEL = process.env.OPENAI_MEMORY_MODEL || 'gpt-6-luna'

export const CONTENT_CONTEXT = {
  items: 'gift items a user gives to an AI girlfriend character in a chat app (short product name + one-line description)',
  item_categories: 'category names of a gift shop in a chat app',
  campaigns: 'promotional campaign banner texts for buying points in a chat app (catchy headline, short description, button label)',
} as const

async function translateOne(src: Record<string, string>, locale: Locale, context: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: `Translate the JSON values for ${context}. Keep the same keys, natural and concise. "pt" is Brazilian Portuguese. Output only JSON.` },
          { role: 'user', content: `Target language: ${LOCALE_NAMES[locale]} (${locale})\n${JSON.stringify(src)}` },
        ],
      }),
    }).catch(() => null)
    if (!res?.ok) continue
    try {
      const out = JSON.parse((await res.json()).choices[0].message.content) as Record<string, string>
      if (Object.keys(src).every(k => !src[k] || out[k]?.trim())) return out
    } catch { /* retry */ }
  }
  return null
}

/** 管理画面で登録した日本語テキストを全言語に訳して i18n 列の形で返す（失敗した言語は含めない） */
export async function translateContent(src: Record<string, string>, context: string) {
  if (!process.env.OPENAI_API_KEY) return {}
  const targets = LOCALES.filter(l => l !== 'ja')
  const results = await Promise.all(targets.map(async l => [l, await translateOne(src, l, context)] as const))
  return Object.fromEntries(results.filter(([, v]) => v)) as Partial<Record<Locale, Record<string, string>>>
}
