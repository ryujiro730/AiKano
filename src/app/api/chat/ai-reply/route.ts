export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { generateReply, extractMemoryUpdate, type LLMMessage } from '@/lib/llm-service'
import { PLANS, type PlanId } from '@/lib/plans'


function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { conversationId: string; characterId: string; userMessage: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { conversationId, characterId, userMessage } = body
  if (!conversationId || !characterId || !userMessage?.trim()) {
    return NextResponse.json(
      { error: 'conversationId, characterId, userMessage are required' },
      { status: 400 },
    )
  }
  if (userMessage.trim().length > 300) {
    return NextResponse.json(
      { error: 'メッセージは300文字以内にしてください' },
      { status: 400 },
    )
  }

  const admin = adminSupabase()
  const isOpenAI = (process.env.LLM_PROVIDER ?? 'claude') === 'openai'

  // ── 独立クエリを並列で発火 ────────────────────────────────────────────
  const characterPromise = admin
    .from('characters')
    .select('id, name, age, description, personality, system_prompt')
    .eq('id', characterId)
    .single()

  // 最新30件を降順取得後、昇順に並べ直してLLMに渡す
  const msgsPromise = admin
    .from('messages')
    .select('sender_role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(30)

  // OpenAI: メモリを取得（キャラ設定注入に使う）
  const memoryPromise = isOpenAI
    ? admin
        .from('user_character_memories')
        .select('memory_text')
        .eq('user_id', user.id)
        .eq('character_id', characterId)
        .maybeSingle()
    : Promise.resolve(null)

  // ポイント消費・サブスク通数カウントは送信時（send-message API）で完結済み。
  // ここではサブスクユーザーのモデル切り替えのみ（カウントは増やさない）。
  const profilePromise = admin
    .from('profiles')
    .select('subscription_plan, subscription_status')
    .eq('id', user.id)
    .single()

  const convPromise = admin
    .from('conversations')
    .select('user_id, character_id')
    .eq('id', conversationId)
    .single()

  // ── 並列発火済みクエリを回収 ────────────────────────────────────────────
  const [{ data: character, error: charErr }, { data: msgs }, memData, { data: prof }, { data: conv }] = await Promise.all([
    characterPromise,
    msgsPromise,
    memoryPromise,
    profilePromise,
    convPromise,
  ])

  if (!conv || conv.user_id !== user.id || conv.character_id !== characterId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  // 返信待ちのユーザーメッセージがない場合は生成しない（送信なしでの無料返信を防止）
  if ((msgs as any[] | null)?.[0]?.sender_role !== 'user') {
    return NextResponse.json({ error: 'No pending user message' }, { status: 409 })
  }

  if (charErr || !character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 })
  }

  let modelOverride: string | undefined
  if (prof?.subscription_status === 'active' || prof?.subscription_status === 'trialing') {
    const planId = prof.subscription_plan as PlanId | null
    modelOverride = planId ? PLANS[planId]?.model : undefined
  }

  const currentMemory: string = (memData as any)?.data?.memory_text ?? ''

  const history: LLMMessage[] = ((msgs as any[]) ?? []).reverse().map((m: any) => ({
    role: m.sender_role === 'user' ? 'user' : 'assistant',
    content: m.content,
  }))

  // ── LLM 生成 ──────────────────────────────────────────────────────────
  let replyText: string
  try {
    const result = await generateReply(character, history, userMessage.trim(), {
      modelOverride,
      memoryText: isOpenAI ? currentMemory : undefined,
    })
    replyText = result.text
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[ai-reply] LLM error:', msg)
    return NextResponse.json({ error: 'LLM generation failed', detail: msg }, { status: 502 })
  }

  // ── 生成成功後: メッセージ保存 ──────────────────────────────────────────
  const now = new Date().toISOString()

  const { data: newMsg, error: insertErr } = await admin
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_role: 'character',
      content: replyText,
      points_used: 0,
      is_read: false,
    })
    .select()
    .single()

  if (insertErr || !newMsg) {
    console.error('[ai-reply] insert error:', insertErr?.message)
    return NextResponse.json({ error: 'Failed to save reply' }, { status: 500 })
  }

  // ── 非同期後処理（fire-and-forget）─────────────────────────────────────

  admin.from('conversations').update({ last_message_at: now, is_unread_staff: false }).eq('id', conversationId)

  // メモリ更新（OpenAIプロバイダーのみ）
  if (isOpenAI) {
    extractMemoryUpdate(currentMemory, userMessage.trim(), replyText, character.name)
      .then(async (updatedMemory) => {
        if (!updatedMemory) return
        await admin
          .from('user_character_memories')
          .upsert(
            {
              user_id: user.id,
              character_id: characterId,
              memory_text: updatedMemory,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,character_id' },
          )
      })
      .catch(() => {})
  }

  return NextResponse.json({ message: newMsg })
}
