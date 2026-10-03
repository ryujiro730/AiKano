export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { generateReply, extractMemoryUpdate, type LLMMessage } from '@/lib/llm-service'
import { PLANS, type PlanId } from '@/lib/plans'

const DEFAULT_POINTS_PER_MESSAGE = 10

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

  const msgsPromise = admin
    .from('messages')
    .select('sender_role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
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

  const freeCheckPromise = admin.rpc('use_daily_free_message', {
    p_user_id: user.id,
    p_character_id: characterId,
  })

  // ── 課金チェック（直列が必要な部分）────────────────────────────────────
  type FreeResult = { ok: boolean; used: number; limit: number }
  const { data: freeResult } = await freeCheckPromise
  const free = freeResult as FreeResult | null

  let modelOverride: string | undefined
  let pointsToDeduct = 0
  const freeUsed = free?.used ?? 0
  const freeLimit = free?.limit ?? 0

  if (!free?.ok) {
    type SubResult = { ok: boolean; reason?: string; model?: string; used?: number; limit?: number }
    const { data: subResult } = await admin.rpc('use_subscription_message', { p_user_id: user.id })
    const sub = subResult as SubResult | null

    if (sub?.ok) {
      const planId = sub.model as PlanId | undefined
      modelOverride = planId ? PLANS[planId]?.model : undefined
    } else if (sub?.reason === 'over_limit') {
      const planId = sub.model as PlanId | undefined
      const overageCost = planId ? PLANS[planId].overage_points : DEFAULT_POINTS_PER_MESSAGE
      modelOverride = planId ? PLANS[planId].model : undefined
      pointsToDeduct = overageCost
    } else {
      pointsToDeduct = DEFAULT_POINTS_PER_MESSAGE
    }
  }

  // ── 並列発火済みクエリを回収 ────────────────────────────────────────────
  const [{ data: character, error: charErr }, { data: msgs }, memData] = await Promise.all([
    characterPromise,
    msgsPromise,
    memoryPromise,
  ])

  if (charErr || !character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 })
  }

  const currentMemory: string = (memData as any)?.data?.memory_text ?? ''

  const history: LLMMessage[] = ((msgs as any[]) ?? []).map((m: any) => ({
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

  // ── 生成成功後: ポイント消費・メッセージ保存を並列 ──────────────────────
  const now = new Date().toISOString()

  const [, { data: newMsg, error: insertErr }] = await Promise.all([
    pointsToDeduct > 0
      ? admin.rpc('add_points', { p_user_id: user.id, p_amount: -pointsToDeduct })
      : Promise.resolve(null),
    admin
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_role: 'character',
        content: replyText,
        points_used: pointsToDeduct,
        is_read: false,
      })
      .select()
      .single(),
  ])

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

  return NextResponse.json({
    message: newMsg,
    freeUsed,
    freeLimit,
    wasFree: free?.ok ?? false,
    pointsDeducted: pointsToDeduct,
  })
}
