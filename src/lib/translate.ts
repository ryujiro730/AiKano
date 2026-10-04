import { openAIChatBody } from './llm-service'
import { LOCALE_NAMES, type Locale } from '@/i18n/config'

/**
 * キャラクターのチャット文を指定言語に訳す。{name} などの差し込み変数・絵文字・改行は保つ。
 * 失敗したら null（呼び出し側は元の日本語で送る）
 */
export async function translateChatText(text: string, locale: Locale): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || locale === 'ja' || !text.trim()) return null
  const prompt = [
    `次の日本語を${LOCALE_NAMES[locale]}（${locale}）に訳してください。`,
    '- 若い女性が親しい相手に送るチャットメッセージとして、自然な口語にする。',
    '- {name} のような波括弧の変数、絵文字、改行はそのまま残す。',
    '- 訳文だけを出力する。説明や引用符は付けない。',
    '',
    text,
  ].join('\n')
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(openAIChatBody(process.env.OPENAI_MEMORY_MODEL || 'gpt-6-luna', [{ role: 'user', content: prompt }], 800, 0.3)),
    })
    if (!res.ok) return null
    const data = await res.json()
    const out: string | undefined = data.choices?.[0]?.message?.content?.trim()
    return out || null
  } catch {
    return null
  }
}
