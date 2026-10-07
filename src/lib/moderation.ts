/**
 * OpenAI Moderation API で、AI の返信が性的に露骨でないかを送信前にチェックする。
 * 判定に失敗した（API エラー等）ときは会話を止めないよう「問題なし」として扱い、ログだけ残す。
 */
const MODEL = process.env.OPENAI_MODERATION_MODEL || 'omni-moderation-latest'

export type ModerationResult = { flagged: boolean; categories: string[] }

export async function checkSexualContent(text: string): Promise<ModerationResult> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey || !text.trim()) return { flagged: false, categories: [] }
  try {
    const res = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, input: text }),
    })
    if (!res.ok) {
      console.error('[moderation] HTTP', res.status)
      return { flagged: false, categories: [] }
    }
    const data = await res.json()
    const cats = (data.results?.[0]?.categories ?? {}) as Record<string, boolean>
    // 性的な内容だけを対象にする（未成年が絡むものは必ず止める）
    const hit = ['sexual', 'sexual/minors'].filter(c => cats[c])
    return { flagged: hit.length > 0, categories: hit }
  } catch (e) {
    console.error('[moderation] error', e)
    return { flagged: false, categories: [] }
  }
}
