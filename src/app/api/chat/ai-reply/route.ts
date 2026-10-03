export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { generateReply, type LLMMessage } from '@/lib/llm-service'
import { sendNotificationEmail } from '@/lib/send-notification-email'
import { PLANS, type PlanId } from '@/lib/plans'

const DEFAULT_POINTS_PER_MESSAGE = 10

function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  const authClient = createServerClient()
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
    return NextResponse.json({ error: 'conversationId, characterId, userMessage are required' }, { status: 400 })
  }
  if (userMessage.trim().length > 300) {
    return NextResponse.json({ error: 'メッセージは300文字以内にしてください' }, { status: 400 })
  }

  const admin = adminSupabase()

  // ── 日次無料メッセージ（全ユーザー 1日2回/キャラ無料）────────────
  type FreeResult = { ok: boolean; used: number; limit: number }
  const { data: freeResult } = await admin.rpc('use_daily_free_message', {
    p_user_id: user.id,
    p_character_id: characterId,
  })
  const free = freeResult as FreeResult | null

  let modelOverride: string | undefined
  let pointsToDeduct = 0
  const freeUsed = free?.used ?? 0
  const freeLimit = free?.limit ?? 2

  if (!free?.ok) {
    // 無料枠を使い切った → サブスク / ポイント課金
    type SubResult = { ok: boolean; reason?: string; model?: string; used?: number; limit?: number }
    const { data: subResult } = await admin.rpc('use_subscription_message', { p_user_id: user.id })
    const sub = subResult as SubResult | null

    if (sub?.ok) {
      // サブスク枠内
      const planId = sub.model as PlanId | undefined
      modelOverride = planId ? PLANS[planId]?.model : undefined
    } else if (sub?.reason === 'over_limit') {
      // サブスク上限超過 → 超過ポイント消費
      const planId = sub.model as PlanId | undefined
      const overageCost = planId ? PLANS[planId].overage_points : DEFAULT_POINTS_PER_MESSAGE
      modelOverride = planId ? PLANS[planId].model : undefined

      const { data: profileForPoints } = await admin
        .from('profiles')
        .select('points, bonus_points, bonus_points_expires_at')
        .eq('id', user.id)
        .single()
      const now = new Date()
      const bonusValid = profileForPoints?.bonus_points_expires_at
        ? new Date(profileForPoints.bonus_points_expires_at) > now : false
      const balance = (profileForPoints?.points ?? 0) + (bonusValid ? (profileForPoints?.bonus_points ?? 0) : 0)
      if (balance < overageCost) {
        return NextResponse.json({ error: 'ポイントが不足しています', code: 'insufficient_points' }, { status: 402 })
      }
      pointsToDeduct = overageCost
    } else {
      // サブスクなし → 通常ポイント消費
      const { data: profileForPoints } = await admin
        .from('profiles')
        .select('points, bonus_points, bonus_points_expires_at')
        .eq('id', user.id)
        .single()
      const now = new Date()
      const bonusValid = profileForPoints?.bonus_points_expires_at
        ? new Date(profileForPoints.bonus_points_expires_at) > now : false
      const balance = (profileForPoints?.points ?? 0) + (bonusValid ? (profileForPoints?.bonus_points ?? 0) : 0)
      if (balance < DEFAULT_POINTS_PER_MESSAGE) {
        return NextResponse.json({ error: 'ポイントが不足しています', code: 'insufficient_points' }, { status: 402 })
      }
      pointsToDeduct = DEFAULT_POINTS_PER_MESSAGE
    }
  }

  // キャラクター情報取得
  const { data: character, error: charErr } = await admin
    .from('characters')
    .select('id, name, age, description, personality, system_prompt')
    .eq('id', characterId)
    .single()

  if (charErr || !character) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 })
  }

  // 会話履歴取得（直近30件）
  const { data: msgs } = await admin
    .from('messages')
    .select('sender_role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(30)

  const history: LLMMessage[] = (msgs ?? []).map(m => ({
    role: m.sender_role === 'user' ? 'user' : 'assistant',
    content: m.content,
  }))

  let replyText: string
  try {
    replyText = await generateReply(character, history, userMessage.trim(), modelOverride)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[ai-reply] LLM error:', msg)
    return NextResponse.json({ error: 'LLM generation failed', detail: msg }, { status: 502 })
  }

  // ポイント消費（生成成功後）
  if (pointsToDeduct > 0) {
    await admin.rpc('add_points', { p_user_id: user.id, p_amount: -pointsToDeduct })
  }

  const now = new Date().toISOString()
  const { data: newMsg, error: insertErr } = await admin
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_role: 'character',
      content: replyText,
      points_used: pointsToDeduct,
      is_read: false,
    })
    .select()
    .single()

  if (insertErr || !newMsg) {
    console.error('[ai-reply] insert error:', insertErr?.message)
    return NextResponse.json({ error: 'Failed to save reply' }, { status: 500 })
  }

  await admin
    .from('conversations')
    .update({ last_message_at: now, is_unread_staff: false })
    .eq('id', conversationId)

  // メール通知（非同期・非クリティカル）
  Promise.all([admin.auth.admin.getUserById(user.id)]).then(([{ data: authData }]) => {
    const email = authData?.user?.email
    if (email) {
      sendNotificationEmail({
        toEmail: email,
        characterName: character.name,
        messageContent: replyText,
        conversationId,
      })
    }
  }).catch(() => {})

  return NextResponse.json({
    message: newMsg,
    freeUsed,
    freeLimit,
    wasFree: free?.ok ?? false,
  })
}
