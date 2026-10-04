/**
 * キャラの名前・性格・プロフィールを各言語に訳して characters.i18n に保存する（073 適用後に実行）
 *   npx tsx scripts/translate-characters.ts           … 翻訳がない言語だけ
 *   npx tsx scripts/translate-characters.ts --force   … 全部訳し直す
 * キャラを追加・編集したら再実行する。
 */
import { LOCALES, LOCALE_NAMES, type Locale } from '../src/i18n/config'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }
const MODEL = process.env.OPENAI_MODEL || 'gpt-6-luna'

type Text = { name: string; personality: string; description: string }

async function translate(src: Text, locale: Locale): Promise<Text> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: [
              'You localize profiles of Japanese AI girlfriend characters for a chat app.',
              'Return JSON {"name","personality","description"}.',
              '- name: romanize Japanese names (e.g. もも → Momo, 岸本絵理 → Eri Kishimoto with given name first). Already-romanized names stay. Translate any extra label in brackets naturally.',
              '- personality: short trait tags separated by ", " (the source uses "・").',
              '- description: natural, appealing profile text. Keep facts (age, job, hobbies). The characters are Japanese women living in Japan.',
              '- "pt" is Brazilian Portuguese. Output only the JSON.',
            ].join('\n'),
          },
          { role: 'user', content: `Target language: ${LOCALE_NAMES[locale]} (${locale})\n${JSON.stringify(src)}` },
        ],
      }),
    })
    if (!res.ok) continue
    try {
      const out = JSON.parse((await res.json()).choices[0].message.content) as Text
      if (out.name?.trim() && (!src.personality || out.personality?.trim()) && (!src.description || out.description?.trim())) return out
    } catch { /* retry */ }
  }
  throw new Error(`failed: ${src.name} (${locale})`)
}

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set')
  const force = process.argv.includes('--force')
  const chars: (Text & { id: string; i18n: Record<string, Text> | null })[] =
    await (await fetch(`${URL}/rest/v1/characters?select=id,name,personality,description,i18n`, { headers: H })).json()
  if (!Array.isArray(chars)) throw new Error(JSON.stringify(chars))

  for (const c of chars) {
    const i18n = { ...(c.i18n ?? {}) }
    const targets = LOCALES.filter(l => l !== 'ja' && (force || !i18n[l]))
    if (targets.length === 0) continue
    const src = { name: c.name, personality: c.personality ?? '', description: c.description ?? '' }
    const results = await Promise.all(targets.map(async l => [l, await translate(src, l)] as const))
    for (const [l, t] of results) i18n[l] = t
    const res = await fetch(`${URL}/rest/v1/characters?id=eq.${c.id}`, { method: 'PATCH', headers: H, body: JSON.stringify({ i18n }) })
    console.log(`${c.name}: ${targets.join(',')} → ${res.status}  (en: ${i18n.en?.name})`)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
