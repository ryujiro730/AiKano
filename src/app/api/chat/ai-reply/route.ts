export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { generateReply, extractMemoryUpdate, type LLMMessage } from '@/lib/llm-service'
import { getActivePlan } from '@/lib/plans'
import { logUserAction } from '@/lib/user-action-log'

// 1通あたりの好感度上昇（会員はプランの倍率を掛ける）
const BASE_AFFECTION_POINTS = 3


function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { conversationId: string; characterId: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 返信対象のユーザーメッセージはクライアント申告ではなく DB の最新メッセージを使う
  const { conversationId, characterId } = body
  if (!conversationId || !characterId) {
    return NextResponse.json(
      { error: 'conversationId, characterId are required' },
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

  // 最新31件（返信対象のユーザーメッセージ＋履歴30件）を降順取得
  const msgsPromise = admin
    .from('messages')
    .select('sender_role, content')
    .eq('conversation_id', conversationId)
    .eq('is_deleted', false)
    .order('created_at', { ascending: false })
    .limit(31)

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
    .select('subscription_plan, subscription_status, subscription_period_end, display_name, age')
    .eq('id', user.id)
    .single()

  // 現在の好感度レベル（会話の距離感に使う）
  const affectionPromise = admin
    .from('user_characters')
    .select('affection_level')
    .eq('user_id', user.id)
    .eq('character_id', characterId)
    .maybeSingle()

  const convPromise = admin
    .from('conversations')
    .select('user_id, character_id')
    .eq('id', conversationId)
    .single()

  // ── 並列発火済みクエリを回収 ────────────────────────────────────────────
  const [{ data: character, error: charErr }, { data: msgs }, memData, { data: prof }, { data: conv }, { data: uc }] = await Promise.all([
    characterPromise,
    msgsPromise,
    memoryPromise,
    profilePromise,
    convPromise,
    affectionPromise,
  ])

  if (!conv || conv.user_id !== user.id || conv.character_id !== characterId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  // 返信待ちのユーザーメッセージがない場合は生成しない（送信なしでの無料返信を防止）
  const [latest, ...older] = (msgs as { sender_role: string; content: string }[] | null) ?? []
  if (latest?.sender_role !== 'user') {
    return NextResponse.json({ error: 'No pending user message' }, { status: 409 })
  }

  if (charErr || !character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 })
  }

  const activePlan = getActivePlan(prof)
  const modelOverride: string | undefined = activePlan?.model

  const currentMemory: string = (memData as any)?.data?.memory_text ?? ''

  const userMessage = latest.content.trim()
  // 返信対象メッセージは generateReply の userMessage として渡すので履歴からは除く（二重送信防止）
  const history: LLMMessage[] = older.reverse().map((m) => ({
    role: m.sender_role === 'user' ? 'user' : 'assistant',
    content: m.content,
  }))

  // ── LLM 生成 ──────────────────────────────────────────────────────────
  let replyText: string
  try {
    const result = await generateReply(character, history, userMessage, {
      modelOverride,
      memoryText: isOpenAI ? currentMemory : undefined,
      user: { name: prof?.display_name, age: prof?.age, affectionLevel: uc?.affection_level ?? 1 },
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

  // 好感度加算（返信1回につき1回。会員は倍率適用）
  const { data: affection, error: affErr } = await admin.rpc('add_affection', {
    p_user_id: user.id,
    p_character_id: characterId,
    p_points: BASE_AFFECTION_POINTS * (activePlan?.affection_multiplier ?? 1),
  })
  if (affErr) console.error('[ai-reply] add_affection error:', affErr.message)
  if ((affection as { leveled_up?: boolean } | null)?.leveled_up) {
    await logUserAction(admin, user.id, 'level_up', { character_name: character.name, level: (affection as { affection_level?: number }).affection_level })
  }

  // ── 非同期後処理（fire-and-forget）─────────────────────────────────────

  admin.from('conversations').update({ last_message_at: now, is_unread_staff: false }).eq('id', conversationId)
    .then(({ error }) => { if (error) console.error('[ai-reply] conversation update error:', error.message) })

  // メモリ更新（OpenAIプロバイダーのみ）
  if (isOpenAI) {
    extractMemoryUpdate(currentMemory, userMessage, replyText, character.name)
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

  return NextResponse.json({ message: newMsg, affection: affErr ? null : affection })
}
