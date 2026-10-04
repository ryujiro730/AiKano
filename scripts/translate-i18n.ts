/**
 * 日本語の翻訳ファイル（src/i18n/messages/ja.ts）と規約から、他言語のファイルを生成する。
 *   npx tsx scripts/translate-i18n.ts            … 全言語・全部
 *   npx tsx scripts/translate-i18n.ts en de      … 指定言語だけ
 * 必要な環境変数: OPENAI_API_KEY（モデルは OPENAI_MODEL、未設定なら gpt-6-luna）
 * 生成物は手で直してよい。日本語を変えたら再実行する。
 */
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'
import { ja } from '../src/i18n/messages/ja'
import { LOCALES, LOCALE_NAMES, type Locale } from '../src/i18n/config'
import { legalSourceJa } from '../src/i18n/legal'

const ROOT = path.join(__dirname, '..')
const MODEL = process.env.OPENAI_MODEL || 'gpt-6-luna'

const GUIDE = [
  'You translate UI copy for "AiKano", a chat app where users talk with AI girlfriend characters.',
  'Rules:',
  '- Output ONLY a JSON object with exactly the same structure and keys as the input. Translate string values only.',
  '- Keep placeholders like {pt}, {name}, {n} exactly as they are. Keep "\\n" line breaks in the same places. Keep emojis, numbers, "¥", "pt", "Lv." and the brand name "AiKano".',
  '- The Japanese brand name アイカノ becomes "AiKano".',
  '- "pt" means Brazilian Portuguese (pt-BR) and "es" means neutral Spanish understood in Latin America and Spain. Avoid words that are vulgar or offensive in any major region.',
  '- Write natural, warm, concise UI text a native speaker would expect in a consumer app. Not literal.',
  '- Japanese honorific suffixes (さん, くん) and Japanese-specific phrasing should become natural equivalents.',
  '- Sample chat conversations may be adapted so they feel natural for that culture (food, places), keeping the same mood and length.',
  '- Legal text: translate faithfully and formally; keep article numbering (e.g. 第1条 → Article 1).',
  '- Japanese date patterns for date-fns (e.g. "yyyy年M月d日", "M月d日（E）") must become the target language\'s natural date-fns pattern.',
].join('\n')

// 文言だけでは文脈が伝わらないキーへの補足（キー: 説明）
const HINTS: Record<string, string> = {
  'common.company': 'Footer label meaning "Operating company" (the legal operator of the service).',
  'common.tokusho': 'Footer link to the Japanese legal disclosure page required by law (Act on Specified Commercial Transactions). Keep it short.',
  'lp.heroLine1': 'heroLine1-3 are ONE headline split over 3 lines, meaning "There is a girl who talks only to you." Each line must read naturally on its own line.',
  'lp.featuresTitleA': 'featuresTitleA + featuresTitleB form one heading; B is highlighted.',
  'lp.realTitleA': 'realTitleA + realTitleB + realTitleC form one heading; B is highlighted.',
  'lp.referralTitleA': 'referralTitleA is line 1 and referralTitleB is line 2 of one heading.',
  'loginBonus.today': 'Big headline in a daily bonus popup: "{n} free messages today".',
  'chat.gift': 'Small label above a gift item name in a chat bubble.',
  'chat.giftSent': 'Small text shown under the gift item name, meaning "(this gift) was sent".',
  'chat.hintBodyA': 'hintBodyA + hintBodyLevel + hintBodyB form one sentence: "When your affection reaches Lv.5 Lover, you can have sweeter, more intimate conversations."',
  'payment.referralA': 'referralA + referralB + referralC form one sentence; B is highlighted.',
  'auth.consentA': 'consentA + consentTerms + consentAnd + consentPrivacy + consentB form one sentence.',
  'settings.deleteWord': 'A short phrase the user must type to confirm account deletion (e.g. "DELETE").',
}

function placeholders(s: string) {
  return (s.match(/\{\w+\}/g) ?? []).sort().join(',')
}

/** 構造・差し込み変数・改行数が元と一致するか。違えば理由を返す */
function check(src: unknown, out: unknown, at = ''): string | null {
  if (typeof src === 'string') {
    if (typeof out !== 'string') return `${at}: not a string`
    if (src.length > 0 && out.trim().length === 0) return `${at}: empty`
    if (placeholders(src) !== placeholders(out)) return `${at}: placeholders ${placeholders(src)} vs ${placeholders(out)}`
    if (src.split('\n').length !== out.split('\n').length) return `${at}: line breaks`
    return null
  }
  if (Array.isArray(src)) {
    if (!Array.isArray(out) || out.length !== src.length) return `${at}: array length`
    for (let i = 0; i < src.length; i++) { const e = check(src[i], out[i], `${at}[${i}]`); if (e) return e }
    return null
  }
  if (src && typeof src === 'object') {
    if (!out || typeof out !== 'object' || Array.isArray(out)) return `${at}: not an object`
    for (const k of Object.keys(src)) { const e = check((src as any)[k], (out as any)[k], `${at}.${k}`); if (e) return e }
    return null
  }
  return out === src ? null : `${at}: non-string value changed`
}

async function translate<T>(value: T, locale: Locale, label: string): Promise<T> {
  let lastError = ''
  const hints = Object.entries(HINTS).filter(([k]) => k.startsWith(label + '.')).map(([k, v]) => `- ${k.slice(label.length + 1)}: ${v}`)
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: GUIDE },
          { role: 'user', content: `Target language: ${LOCALE_NAMES[locale]} (${locale}).${hints.length ? `\nContext for some keys:\n${hints.join('\n')}` : ''}${lastError ? `\nPrevious attempt was invalid (${lastError}). Fix it.` : ''}\n\n${JSON.stringify({ data: value })}` },
        ],
      }),
    })
    if (!res.ok) { lastError = `HTTP ${res.status}`; continue }
    const json = await res.json()
    try {
      const out = JSON.parse(json.choices[0].message.content).data as T
      const err = check(value, out, label)
      if (!err) return out
      lastError = err
    } catch (e) {
      lastError = `JSON parse: ${e}`
    }
    console.warn(`  retry ${label} (${locale}) #${attempt}: ${lastError}`)
  }
  throw new Error(`translation failed: ${label} (${locale}): ${lastError}`)
}

async function translateMessages(locale: Locale) {
  // セクション単位で並列に訳す（1回の出力が大きくなりすぎないように）
  const entries = await Promise.all(
    Object.entries(ja).map(async ([key, section]) => [key, await translate(section, locale, key)] as const),
  )
  const out = Object.fromEntries(entries)
  const file = path.join(ROOT, 'src/i18n/messages', `${locale}.ts`)
  writeFileSync(file, `// scripts/translate-i18n.ts で ja.ts から生成。手で直してよい\nimport type { Messages } from './ja'\n\nexport const ${locale}: Messages = ${JSON.stringify(out, null, 2)}\n`)
  console.log(`wrote ${path.relative(ROOT, file)}`)
}

async function translateLegal(locale: Locale) {
  const dir = path.join(ROOT, 'src/i18n/legal/generated')
  mkdirSync(dir, { recursive: true })
  for (const kind of ['terms', 'privacy'] as const) {
    const src = legalSourceJa(kind)
    // 条ごとに訳す
    const sections = await Promise.all(src.sections.map((s, i) => translate(s, locale, `${kind}.sections[${i}]`)))
    const head = await translate({ title: src.title, updated: src.updated, footer: src.footer }, locale, `${kind}.head`)
    writeFileSync(path.join(dir, `${kind}.${locale}.json`), JSON.stringify({ ...head, sections }, null, 2))
    console.log(`wrote legal ${kind}.${locale}.json`)
  }
}

async function main() {
  if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set')
  const args = process.argv.slice(2)
  const targets = (args.length ? args : LOCALES.filter(l => l !== 'ja')) as Locale[]
  for (const locale of targets) {
    console.log(`== ${locale}`)
    await translateMessages(locale)
    await translateLegal(locale)
  }
}

main().catch(e => { console.error(e); process.exit(1) })
