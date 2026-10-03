export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { generateReply, type LLMMessage } from '@/lib/llm-service'

// 管理画面: 編集中のキャラ設定でAIの返事を試す（保存もユーザーへの送信もしない）
export async function POST(req: Request) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res

  const { character, history, message, affectionLevel, userName } = await req.json().catch(() => ({}))
  if (!character?.name || typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'character と message は必須です' }, { status: 400 })
  }

  try {
    const result = await generateReply(
      {
        name: String(character.name),
        age: character.age ? Number(character.age) : null,
        description: String(character.description ?? ''),
        personality: String(character.personality ?? ''),
        system_prompt: character.system_prompt ? String(character.system_prompt) : null,
      },
      (Array.isArray(history) ? history : []).slice(-30) as LLMMessage[],
      message.trim(),
      { user: { name: userName || 'テスト', affectionLevel: Number(affectionLevel) || 1 }, memoryText: '' },
    )
    return NextResponse.json({ reply: result.text })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 502 })
  }
}
