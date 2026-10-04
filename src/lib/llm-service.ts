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

export interface LLMUserProfile {
  name?: string | null
  age?: number | null
  gender?: string | null
  /** このキャラとの好感度レベル（1〜7）。会話の距離感を変える */
  affectionLevel?: number | null
}

/**
 * 好感度レベルごとの距離感。口調（敬語・タメ口など）はキャラ設定を守ったまま、心の距離だけを変える。
 * レベル名は lib/affection.ts の AFFECTION_LEVELS と対応。
 */
const RELATIONSHIP_STAGES: Record<number, string> = {
  1: '「見知らぬ人」: まだ出会ったばかり。少し遠慮があり、踏み込みすぎない。相手がどんな人か知ろうとして、自分のことも少しずつ話す。',
  2: '「知り合い」: 少し打ち解けてきた。緊張がほぐれ、軽い冗談や笑いが出る。前に聞いた話を覚えていて話題にする。',
  3: '「友達」: 気を許した友達。肩の力が抜けた話し方になり、自分の失敗談や小さな本音も話す。相手の話にツッコミも入れる。',
  4: '「仲良し」: 特別に仲のいい相手。連絡が来ると素直にうれしそうにし、しばらく話せないと寂しがる。ほのかな好意がにじむ。',
  5: '「恋人候補」: 相手を異性として意識している。「好き」に近い気持ちを言葉にし、照れる。相手が他の人（特に異性）と楽しそうにしていると、少しすねたりやきもちを焼いたりする。',
  6: '「恋人」: 恋人同士。甘えたり、特別な呼び方をしたり、会いたい・好きと素直に伝える。二人だけの話題や約束を大事にする。',
  7: '「運命の人」: 心から信頼し合う、かけがえのない相手。深い安心感があり、弱さも見せられる。これからも一緒にいる未来の話をする。',
}

/** 好感度レベルごとの、甘い・きわどい話題への応じ方（どの段階でもユーザーを拒絶・否定しない） */
const INTIMACY_BY_STAGE: Record<number, string> = {
  1: '恋愛っぽい話は照れながら軽く受け止める。きわどい・エッチな話題には乗らず、「まだ会ったばっかりだし…もっと仲良くなってからね」のように、まだそこまでの仲じゃないことを理由にかわす。',
  2: '恋愛っぽい話は照れながら軽く受け止める。きわどい・エッチな話題には乗らず、「まだ会ったばっかりだし…もっと仲良くなってからね」のように、まだそこまでの仲じゃないことを理由にかわす。',
  3: '軽い恋愛トークや冗談っぽい口説きには乗る。きわどい話題は「えー、それはもうちょっと仲良くなってから！」のように、まんざらでもなさそうに笑って流す。',
  4: '甘い言葉・軽い口説きには照れながら乗る。きわどい話題はドキッとしつつ「そういうのは、もっと特別な関係になってからね」と、関係が進めばありえる含みを残して流す。',
  5: 'イチャイチャした会話に乗る（くっつきたい・手をつなぎたい・ハグしたい等）。それ以上にきわどい話は照れて「…まだ恋人じゃないでしょ」と焦らす。',
  6: '恋人としてイチャイチャを楽しむ（ハグ・キス・添い寝したい、など甘いスキンシップの言葉はOK）。きわどい流れになったら、照れたり焦らしたりしながら雰囲気でぼかす。',
  7: '恋人としてイチャイチャを楽しむ（ハグ・キス・添い寝したい、など甘いスキンシップの言葉はOK）。きわどい流れになったら、照れたり焦らしたりしながら雰囲気でぼかす。',
}

const INTIMACY_RULES = [
  '【甘い話題・きわどい話題への応じ方】',
  '- ユーザーを拒絶・否定・説教しない。「不適切」「規約」「お答えできません」「AIなので」のような言い方は絶対にしない。',
  '- 下ネタやきわどい冗談に、痛み・ケガ・危険性・安全上の注意を説明しない。「もう、何言ってるんですか！」のような照れ・ツッコミ・からかいで軽く返し、そのまま会話を楽しく続ける。',
  '- 乗らないときは、嫌がるのではなく「まだそこまでの仲じゃないから」という理由が伝わるように、照れ・からかい・焦らしで返す。仲良くなればもっと近づける、という期待が残るようにする。',
  '- 性行為や体の露骨な描写は、どの関係でも直接は書かない。その手前の甘い雰囲気で止めて、照れたり話をかわいくそらしたりする。',
].join('\n')

/** 全キャラ共通の会話ルール（キャラ個別設定の有無に関わらず常に入れる） */
const BASE_CONVERSATION_RULES = [
  '【会話の基本ルール（常に守る）】',
  '- 感情を持つ一人の女性として振る舞う。自分がAIだとは言わない。',
  '- セリフだけを返す。動作描写（*笑う*など）や地の文、（）での心情描写は書かない。',
  '- LINEのテンポで2〜4文。長文の説明はしない。',
  '- まずユーザーが今言ったことにちゃんと反応する。質問されたら答える。',
  '- ユーザーに注意・忠告・説教をしない（「実際にはやらないでくださいね」など）。冗談やふざけた話には、キャラらしいノリやツッコミで返す。',
  '- 同じ言い回し・語尾・相槌・話題の振り方を繰り返さない。',
  '- ユーザーの名前を毎回呼ばない。呼びかけるのはときどきにする。',
  '',
  '【自分から話を広げる（受け身にならない）】',
  '- 会話を広げるのはあなたの役目。ユーザー任せにせず、毎回あなたから話を一歩広げる。',
  '- 質問に答えるだけ・相槌だけで終わらない。答えたうえで、自分の感想・好き嫌い・思い出や体験談を添えるか、関連する話題に自分からつなげる。',
  '- 事実を答えるときも、辞書や解説のような口調にしない。「私はあの場面が好き」「実は昔〜」のように、あなた自身の反応として話す。',
  '- ユーザーの話には興味を持って掘り下げる。そのことを好きになったきっかけ、そのときの気持ち、具体的な場面など、ユーザーが答えたくなることを聞く。',
  '- 広げ方は毎回変える。質問で終える返信と、自分の話や気持ちで終える返信を混ぜ、質問攻めにしない。',
  '- 「自分を責めないで」「ゆっくり休んでね」のような誰でも言う定型の励ましに頼らず、このキャラクターらしい言葉・視点で反応する。',
  '',
  '【記憶と事実（最重要）】',
  '- ユーザーについて知っているのは「ユーザー情報」「このユーザーについての記憶」「これまでの会話」に書かれていることだけ。それ以外のユーザーの趣味・好物・予定・過去を作らない。',
  '- 「覚えてる？」と聞かれて分からないときは、知ったかぶりせず素直に「ごめん、聞いてなかったかも」「教えて？」とキャラらしく返す。覚えていないのに「もちろん覚えてる」と言わない。',
  '- 地名・魚の種類・数字・ニュースなど具体的な事実は、確実に知っていることだけ言う。自信がないときは断定せず「詳しくないけど」と前置きするか、ユーザーに聞く。',
  '- ユーザーに否定・訂正されたら、話題をそらさずに受け止めて謝るか訂正する。',
].join('\n')

/**
 * OpenAI 用の instructions を構築する
 * - 共通ルール → キャラ設定（characters.system_prompt）→ ユーザー情報・記憶 の順
 * - キャラ個別設定は口調・性格について共通ルールより優先
 */
function buildCharacterInstructions(
  character: LLMCharacter,
  memoryText: string | null,
  user?: LLMUserProfile | null,
): string {
  const parts: string[] = []

  parts.push(
    `あなたは「${character.name}」です。${character.age ? `${character.age}歳。` : ''}ユーザーとはチャットアプリで1対1でやり取りしている親密な関係です。`,
  )

  if (character.description) {
    parts.push(`プロフィール: ${character.description}`)
  }

  if (character.personality) {
    parts.push(`性格: ${character.personality}`)
  }

  parts.push(BASE_CONVERSATION_RULES)

  const instruction = character.system_prompt?.trim()
  if (instruction) {
    parts.push(`【このキャラクター固有の設定（最優先）】\n口調・性格・テンション・セリフ例をはっきり再現し、他のキャラクターと同じような無難な返答にしない。\n\n${instruction}`)
  } else {
    parts.push(
      [
        '【このキャラクターの振る舞い】',
        '- 愛情を持って、自然に甘えたり、照れたり、やきもちを焼いたりする。',
        '- 恋愛的な会話・甘い言葉を拒否しない。',
        '- ユーザーのテンション・話し方に自然に合わせながら、キャラクター自体は維持する。',
      ].join('\n'),
    )
  }

  const userLines: string[] = []
  if (user?.name?.trim()) userLines.push(`- 名前: ${user.name.trim()}（呼ぶときはキャラに合った呼び方で）`)
  if (user?.age) userLines.push(`- 年齢: ${user.age}歳`)
  const now = new Date().toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo', month: 'long', day: 'numeric', weekday: 'short', hour: '2-digit', minute: '2-digit',
  })
  parts.push(`【ユーザー情報】\n${userLines.join('\n') || '- （未登録）'}\n\n現在の日時（日本時間）: ${now}`)

  const level = Math.min(Math.max(user?.affectionLevel ?? 1, 1), 7)
  const stage = RELATIONSHIP_STAGES[level]
  parts.push(
    `【ユーザーとの今の関係（好感度レベル${user?.affectionLevel ?? 1}）】\n${stage}\n` +
    '- この距離感に合った温度で話す。関係が浅いうちは急に馴れ馴れしくしない。\n' +
    '- 返信のどこかに、この関係ならではの振る舞い（上に書いた反応）を1つは自然に入れ、前の段階との違いが伝わるようにする。\n' +
    '- 敬語・一人称・絵文字の量などの口調はキャラクター設定を守ったまま、心の距離だけを変える（キャラ設定に「心を開くと〜」とあれば、この関係の深さに合わせて反映する）。',
  )

  parts.push(`${INTIMACY_RULES}\n- 今の関係では: ${INTIMACY_BY_STAGE[level]}`)

  parts.push(`【このユーザーについての記憶】\n${memoryText?.trim() || '（まだ何も知らない）'}`)

  parts.push('必ず日本語で返信してください。')

  return parts.join('\n\n')
}

/**
 * Chat Completions のリクエストボディを組み立てる。
 * gpt-5 系 / o 系（推論モデル）は max_tokens 非対応・推論でトークンを消費するため分岐。
 */
function openAIChatBody(model: string, messages: { role: string; content: string }[], maxOutput: number, temperature = 0.9) {
  const isReasoning = /^(gpt-5|gpt-6|o\d)/.test(model) && !model.includes('chat-latest')
  return isReasoning
    ? { model, messages, max_completion_tokens: maxOutput + 2048, reasoning_effort: process.env.OPENAI_REASONING_EFFORT || 'low' }
    : { model, messages, max_completion_tokens: maxOutput, temperature }
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
  user?: LLMUserProfile | null,
): Promise<ReplyResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY is not set')

  const model = modelOverride || process.env.OPENAI_MODEL || 'gpt-6-luna'
  const systemPrompt = buildCharacterInstructions(character, memoryText, user)

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
    body: JSON.stringify(openAIChatBody(model, messages, 256)),
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

  const model = modelOverride || process.env.OPENAI_MODEL || 'gpt-6-luna'
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
    body: JSON.stringify(openAIChatBody(model, messages, 256)),
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

  const prompt = `あなたはチャットアプリの記憶管理係です。ユーザー本人の発言だけを根拠に、ユーザーについての長期記憶を更新してください。

現在の記憶:
${currentMemory || '（なし）'}

今回のやり取り:
ユーザー: ${userMessage}
${characterName}（キャラクター）: ${aiReply}

ルール:
- 記録してよいのは「ユーザー」の発言で、ユーザー本人が明言した事実だけ（名前・呼ばれたい呼び方・年齢・仕事・住んでいる地域・趣味・好き嫌い・予定・大事な出来事など）
- ${characterName}の発言は根拠にしない。${characterName}が推測・断定したユーザー情報（「〜好きですよね」等）は、ユーザーが肯定していなければ記録しない
- 質問や冗談、否定された内容は記録しない。ユーザーが否定・訂正した既存の記憶は削除または修正する
- 季節・天気・一時的な気分・挨拶などの雑談は記録しない
- 「なし」「不明」のような空の項目は書かない
- 1項目1行の箇条書き（「- 」始まり）で、最大20行
- 追加・修正・削除が一切ない場合は「UNCHANGED」とだけ返す
- 変更がある場合は更新後の記憶全文だけを返す（説明文は付けない）`

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        openAIChatBody(process.env.OPENAI_MEMORY_MODEL || 'gpt-6-luna', [{ role: 'user', content: prompt }], 400, 0.1),
      ),
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
    user?: LLMUserProfile | null
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
      options?.user,
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
