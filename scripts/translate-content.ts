/**
 * 管理画面で登録する中身（アイテム・アイテムカテゴリ・動画）を各言語に訳して i18n 列に保存する（074 適用後）
 *   npx tsx scripts/translate-content.ts           … 翻訳がない行だけ
 *   npx tsx scripts/translate-content.ts --force   … 全部訳し直す
 */
import { LOCALES, LOCALE_NAMES, type Locale } from '../src/i18n/config'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }
const MODEL = process.env.OPENAI_MODEL || 'gpt-6-luna'

const TABLES: { table: string; fields: string[]; filter: string; context: string }[] = [
  { table: 'items', fields: ['name', 'description'], filter: 'is_active=eq.true', context: 'gift items a user gives to an AI girlfriend character in a chat app (short product name + one-line description)' },
  { table: 'item_categories', fields: ['name'], filter: '', context: 'category names of a gift shop in a chat app' },
  { table: 'video_items', fields: ['title', 'description'], filter: 'is_active=eq.true', context: 'video titles and descriptions in a chat app' },
]

async function translate(src: Record<string, string>, locale: Locale, context: string) {
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
    })
    if (!res.ok) continue
    try {
      const out = JSON.parse((await res.json()).choices[0].message.content) as Record<string, string>
      if (Object.keys(src).every(k => !src[k] || out[k]?.trim())) return out
    } catch { /* retry */ }
  }
  throw new Error(`failed: ${JSON.stringify(src)} (${locale})`)
}

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set')
  const force = process.argv.includes('--force')
  for (const t of TABLES) {
    const rows: Record<string, any>[] = await (await fetch(`${URL}/rest/v1/${t.table}?select=id,i18n,${t.fields.join(',')}${t.filter ? '&' + t.filter : ''}`, { headers: H })).json()
    if (!Array.isArray(rows)) throw new Error(`${t.table}: ${JSON.stringify(rows)}`)
    for (const row of rows) {
      const i18n = { ...(row.i18n ?? {}) }
      const targets = LOCALES.filter(l => l !== 'ja' && (force || !i18n[l]))
      if (targets.length === 0) continue
      const src = Object.fromEntries(t.fields.map(f => [f, row[f] ?? '']))
      const results = await Promise.all(targets.map(async l => [l, await translate(src, l, t.context)] as const))
      for (const [l, v] of results) i18n[l] = v
      const res = await fetch(`${URL}/rest/v1/${t.table}?id=eq.${row.id}`, { method: 'PATCH', headers: H, body: JSON.stringify({ i18n }) })
      console.log(`${t.table} ${row[t.fields[0]]}: ${targets.join(',')} → ${res.status} (en: ${i18n.en?.[t.fields[0]]})`)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
