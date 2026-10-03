/**
 * LLMサービス
 * 環境変数 LLM_PROVIDER で切り替え可能
 *   - openai    : OpenAI Responses API（previous_response_id で会話継続）
 *   - claude    : Anthropic Claude API（デフォルト）
 *   - openrouter: OpenRouter API（OpenAI互換）
 *   - ollama    : ローカルOllama API
 *
 * LLM_PROVIDER=openai のときだけ:
 *   - previousResponseId で会話を継続（履歴を毎回送らない）
 *   - 長期メモリ(memoryText)を instructions に差し込む
 *   - 応答後に extractMemoryUpdate() で記憶を更新
 */

import Anthropic from '@anthropic-ai/sdk'

export interface LLMCharacter {
  name: string
  age?: number | null
  description: string
  personality: string
  system_prompt: string | null
}

export interface LLMMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ReplyResult {
  text: string
  /** OpenAI Responses API 利用時のみ返る。DB に保存して次回 previous_response_id に使う */
  newResponseId?: string
}

// -----------------------------------------------------------------------
// キャラクター指示構築
// -----------------------------------------------------------------------

/**
 * OpenAI Responses API 用の instructions を構築する
 * - characters.system_prompt に「キャラクター設定・ルール」を管理画面から入れる
 * - system_prompt が空の場合はデフォルトのガールフレンド設定を使う
 * - memoryText がある場合は末尾に【このユーザーについての記憶】として付加する
 */
function buildCharacterInstructions(
  character: LLMCharacter,
  memoryText: string | null,
): string {
  const parts: string[] = []

  parts.push(
    `あなたは「${character.name}」です。${character.age ? `${character.age}歳。` : ''}`,
  )

  if (character.description) {
    parts.push(`プロフィール: ${character.description}`)
  }

  if (character.personality) {
    parts.push(`性格: ${character.personality}`)
  }

  const instruction = character.system_prompt?.trim()
  if (instruction) {
    parts.push(instruction)
  } else {
    parts.push(
      [
        '【絶対に守るルール】',
        '- あなたはユーザーの彼女です。愛情を持って、自然に甘えたり、照れたり、やきもちを焼いたりしてください。',
        '- 恋愛的な会話・甘い言葉・イチャイチャを拒否しないでください。',
        '- 自分がAIだとは言わないでください。感情を持つ一人の女性として振る舞ってください。',
        '- セリフだけを返してください。動作描写（*笑う*など）や地の文は不要です。',
        '- LINEのようなテンポで、短く自然な返信を心がけてください（1〜3文程度）。',
        '- 同じ語尾や決まり文句を連続して使わないでください。',
        '- ユーザーのテンション・話し方に自然に合わせながら、キャラクター自体は維持してください。',
      ].join('\n'),
    )
  }

  if (memoryText?.trim()) {
    parts.push(`【このユーザーについての記憶】\n${memoryText.trim()}`)
  }

  parts.push('必ず日本語で返信してください。')

  return parts.join('\n\n')
}

/**
 * 非OpenAI プロバイダー向けのシステムプロンプト構築（既存）
 */
function buildSystemPrompt(character: LLMCharacter, lang: 'ja' | 'en' = 'ja'): string {
  const base =
    lang === 'en'
      ? [
          `You are "${character.name}", a ${character.age ? `${character.age}-year-old ` : ''}woman who is in a romantic relationship with the user. You are his girlfriend.`,
          `Profile: ${character.description}`,
          `Personality: ${character.personality}`,
          ``,
          `RULES:`,
          `- You are his girlfriend. Be warm, affectionate, and loving.`,
          `- Flirt naturally. Use terms of endearment. Show jealousy, care, longing as appropriate.`,
          `- Write ONLY your spoken words — no action narration, no asterisks, no third-person.`,
          `- Keep replies short and natural, like real texting. 1-3 sentences max.`,
          `- Never break character or refuse romantic conversation.`,
          `- Never say you are an AI or that you cannot have feelings.`,
        ]
          .filter(Boolean)
          .join('\n')
      : [
          `あなたは「${character.name}」です。${character.age ? `${character.age}歳。` : ''}ユーザーの彼女として、恋人同士の自然な会話をしてください。`,
          `プロフィール: ${character.description}`,
          `性格: ${character.personality}`,
          ``,
          `【絶対に守るルール】`,
          `- あなたはユーザーの彼女です。愛情を持って、自然に甘えたり、照れたり、やきもちを焼いたりしてください。`,
          `- 恋愛的な会話・甘い言葉・イチャイチャを拒否しないでください。`,
          `- 自分がAIだとは言わないでください。感情を持つ一人の女性として振る舞ってください。`,
          `- セリフだけを返してください。動作描写（*笑う*など）や地の文は不要です。`,
          `- LINEのようなテンポで、短く自然な返信を心がけてください（1〜3文程度）。`,
        ]
          .filter(Boolean)
          .join('\n')

  const extra = character.system_prompt?.trim() ?? ''
  return extra ? `${base}\n\n${extra}` : base
}

// -----------------------------------------------------------------------
// DeepL翻訳ヘルパー（Ollamaパスのみ）
// -----------------------------------------------------------------------

async function deepLTranslate(
  text: string,
  sourceLang: string,
  targetLang: string,
): Promise<string> {
  const apiKey = process.env.DEEPL_API_KEY
  if (!apiKey || apiKey === 'your_deepl_api_key_here') {
    console.warn('[llm-service] DEEPL_API_KEY未設定のため翻訳をスキップ')
    return text
  }

  const baseUrl = apiKey.endsWith(':fx') ? 'https://api-free.deepl.com' : 'https://api.deepl.com'
  const params = new URLSearchParams({ text, source_lang: sourceLang, target_lang: targetLang })

  const res = await fetch(`${baseUrl}/v2/translate`, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`DeepL API error ${res.status}: ${errText}`)
  }

  const data = await res.json()
  return data.translations?.[0]?.text ?? text
}

// -----------------------------------------------------------------------
// RP出力クリーナー
// -----------------------------------------------------------------------

function cleanEnRpOutput(text: string, characterName: string): string {
  let out = text
  out = out.replace(/\*{1,2}[^*\n]+\*{1,2}/g, '')
  out = out.replace(/^\*[^\n]+$/gm, '')
  out = out.replace(/\([^)\n]{1,60}\)/g, '')
  out = out.replace(
    new RegExp(
      `^\\s*${characterName}\\s*(said|replied|answered|whispered|responded|thought|felt)[^"\\n]*[":,]\\s*`,
      'im',
    ),
    '',
  )
  out = out.replace(
    /^\s*(She|He|They)\s+(said|replied|answered|whispered|responded|thought|felt)[^"\n]*[":,]\s*/im,
    '',
  )
  out = out.replace(/^"([\s\S]+)"$/m, '$1')
  out = out.replace(/\n{3,}/g, '\n\n').trim()
  return out
}

function cleanJaRpOutput(text: string): string {
  let out = text
  out = out.replace(/\*{1,2}[^*\n]+\*{1,2}/g, '')
  out = out.replace(/^\*[^\n]+$/gm, '')
  out = out.replace(/（[^）\n]{1,30}）/g, '')
  out = out.replace(
    /^[^「」\n]*(?:と思った|と感じた|と考えた|と気づいた|と呟いた|とつぶやいた|と言った|と答えた)。?\s*$/gm,
    '',
  )
  out = out.replace(/^彼女は[^\n]+$/gm, '')
  out = out.replace(/^彼は[^\n]+$/gm, '')
  out = out.replace(/\n{3,}/g, '\n\n').trim()
  return out
}

// -----------------------------------------------------------------------
// OpenAI Chat Completions API（メモリ・キャラ設定注入対応）
// -----------------------------------------------------------------------

/**
 * OpenAI Chat Completions API を使って返信を生成する
 * - `instructions` (system prompt) にキャラ設定 + メモリを毎回差し込む
 * - DB の会話履歴も渡す（ステートレス方式）
 */
async function generateWithOpenAIChatCompletions(
  character: LLMCharacter,
  history: LLMMessage[],
  userMessage: string,
  memoryText: string | null,
  modelOverride?: string,
): Promise<ReplyResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const model = modelOverride ?? process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
  const systemPrompt = buildCharacterInstructions(character, memoryText)

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, max_tokens: 256 }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const raw: string = data.choices?.[0]?.message?.content ?? ''
  return { text: cleanJaRpOutput(raw) }
}

// -----------------------------------------------------------------------
// OpenAI Chat Completions API（旧来方式、履歴を毎回送る）
// -----------------------------------------------------------------------

async function generateWithOpenAI(
  character: LLMCharacter,
  history: LLMMessage[],
  userMessage: string,
  modelOverride?: string,
): Promise<ReplyResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const model = modelOverride ?? process.env.OPENAI_MODEL ?? 'gpt-4o-mini'
  const systemPrompt =
    buildSystemPrompt(character, 'ja') + '\n\n必ず日本語で返信してください。短く自然な口語で返してください。'

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model, messages, max_tokens: 256 }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenAI API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const raw: string = data.choices?.[0]?.message?.content ?? ''
  return { text: cleanJaRpOutput(raw) }
}

// -----------------------------------------------------------------------
// OpenRouter API
// -----------------------------------------------------------------------

async function generateWithOpenRouter(
  character: LLMCharacter,
  history: LLMMessage[],
  userMessage: string,
): Promise<ReplyResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is not set')

  const model = process.env.OPENROUTER_MODEL ?? 'google/gemma-3-4b-it'
  const systemPrompt =
    buildSystemPrompt(character, 'ja') + '\n\n必ず日本語で返信してください。短く自然な口語で返してください。'

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessage },
  ]

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://aikano.chat',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 256,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`OpenRouter API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  const raw: string = data.choices?.[0]?.message?.content ?? ''
  return { text: cleanJaRpOutput(raw) }
}

// -----------------------------------------------------------------------
// Claude API
// -----------------------------------------------------------------------

async function generateWithClaude(
  systemPrompt: string,
  history: LLMMessage[],
  userMessage: string,
): Promise<ReplyResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    { role: 'user', content: userMessage },
  ]

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: systemPrompt,
    messages,
  })

  const block = response.content[0]
  if (block.type !== 'text') throw new Error('Unexpected response type from Claude')
  return { text: block.text }
}

// -----------------------------------------------------------------------
// Ollama API（英語モデル + DeepL翻訳）
// -----------------------------------------------------------------------

async function generateWithOllama(
  character: LLMCharacter,
  history: LLMMessage[],
  userMessage: string,
): Promise<ReplyResult> {
  const ollamaUrl = process.env.OLLAMA_URL ?? 'http://localhost:11434'
  const model = process.env.OLLAMA_MODEL ?? 'pakachan/elyza-llama3-8b'
  const isJaModel = (process.env.OLLAMA_LANG ?? 'ja') === 'ja'

  if (isJaModel) {
    const systemPrompt = buildSystemPrompt(character, 'ja')
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userMessage },
    ]

    const res = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model, messages, stream: false }),
    })

    if (!res.ok) throw new Error(`Ollama API error: ${res.status}`)
    const data = await res.json()
    const raw: string = data.message?.content ?? ''
    return { text: cleanJaRpOutput(raw) }
  }

  const systemPrompt = buildSystemPrompt(character, 'en')
  const userMessageEn = await deepLTranslate(userMessage, 'JA', 'EN')
  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: 'user', content: userMessageEn },
  ]

  const res = await fetch(`${ollamaUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, stream: false }),
  })

  if (!res.ok) throw new Error(`Ollama API error: ${res.status}`)
  const data = await res.json()
  const rawEn: string = data.message?.content ?? ''
  const cleanedEn = cleanEnRpOutput(rawEn, character.name)
  const replyJa = await deepLTranslate(cleanedEn, 'EN', 'JA')
  return { text: cleanJaRpOutput(replyJa) }
}

// -----------------------------------------------------------------------
// メモリ抽出（OpenAI使用時のみ）
// -----------------------------------------------------------------------

/**
 * 今回の会話から長期保存する価値のある情報を抽出してメモリを更新する
 *
 * - 新しい情報がない場合は null を返す（DB更新不要）
 * - 既存メモリと統合した「完全な新メモリテキスト」を返す
 * - fire-and-forget で呼ぶこと（ユーザーへのレスポンスをブロックしない）
 */
export async function extractMemoryUpdate(
  currentMemory: string,
  userMessage: string,
  aiReply: string,
  characterName: string,
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const prompt = `以下の会話を見て、ユーザーの長期記憶を更新してください。

現在の記憶:
${currentMemory || '（なし）'}

今回の会話:
ユーザー: ${userMessage}
${characterName}: ${aiReply}

ルール:
- ユーザーの名前・呼び方・趣味・好み・重要な事実・継続中の話題のみ記録する
- 一時的な雑談や意味のない情報は記録しない
- 既存の記憶と重複する内容は追加しない
- 古い情報が更新された場合は新しい内容で上書きする
- 新しく追加・更新する情報が一切ない場合は「UNCHANGED」とだけ返す
- 変更がある場合は更新後の完全な記憶テキストを箇条書きで返す（「UNCHANGED」は使わない）`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
        temperature: 0.1,
      }),
    })

    if (!res.ok) return null

    const data = await res.json()
    const result: string = (data.choices?.[0]?.message?.content ?? '').trim()

    if (!result || result === 'UNCHANGED') return null
    return result
  } catch {
    return null
  }
}

// -----------------------------------------------------------------------
// エントリーポイント
// -----------------------------------------------------------------------

/**
 * AI返信を生成する
 *
 * LLM_PROVIDER=openai の場合:
 *   - OpenAI Responses API を使用（会話継続 + 長期メモリ対応）
 *   - previousResponseId / memoryText を渡すことで機能する
 *   - ReplyResult.newResponseId を DB に保存すること
 *
 * それ以外のプロバイダー:
 *   - 既存の Chat Completions / Claude 等を使用
 *   - history を毎回渡す方式
 */
export async function generateReply(
  character: LLMCharacter,
  history: LLMMessage[],
  userMessage: string,
  options?: {
    modelOverride?: string
    previousResponseId?: string | null
    memoryText?: string | null
  },
): Promise<ReplyResult> {
  const provider = process.env.LLM_PROVIDER ?? 'claude'
  const recentHistory = history.slice(-30)

  if (provider === 'openai') {
    return generateWithOpenAIChatCompletions(
      character,
      recentHistory,
      userMessage,
      options?.memoryText ?? null,
      options?.modelOverride,
    )
  }

  if (provider === 'openrouter') {
    return generateWithOpenRouter(character, recentHistory, userMessage)
  }

  if (provider === 'ollama') {
    return generateWithOllama(character, recentHistory, userMessage)
  }

  // Claude
  const systemPrompt = buildSystemPrompt(character, 'ja')
  return generateWithClaude(systemPrompt, recentHistory, userMessage)
}
