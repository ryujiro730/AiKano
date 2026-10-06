export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { PLANS, type PlanId } from '@/lib/plans'
import { POINTS_PER_MESSAGE } from '@/lib/pricing'
import { logUserAction } from '@/lib/user-action-log'
import { spendPoints, refundPoints, usablePoints } from '@/lib/points'
import { getMessages } from '@/i18n/server'
import { fmt } from '@/i18n/fmt'

// ユーザーメッセージ送信：ポイント消費 → メッセージ保存をサーバー側で一括実行。
// AI返信は ai-reply 側でポイント残高に関係なく返す。
const DEFAULT_POINTS_PER_MESSAGE = POINTS_PER_MESSAGE
const MAX_CONTENT_LENGTH = 300

type Db = ReturnType<typeof adminDb>
type SubResult = { ok: boolean; reason?: string; model?: string; used?: number; limit?: number }

function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { conversationId, content: rawContent } = await req.json().catch(() => ({}))
  const content = typeof rawContent === 'string' ? rawContent.trim() : ''
  if (!conversationId || !content) {
    return NextResponse.json({ error: 'conversationId, content are required' }, { status: 400 })
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return NextResponse.json({ error: fmt(getMessages().api.messageTooLong, { n: MAX_CONTENT_LENGTH }) }, { status: 400 })
  }

  const db = adminDb()

  const { data: conv } = await db.from('conversations').select('user_id, characters(name)').eq('id', conversationId).single()
  if (!conv || conv.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // ── ポイント消費 ────────────────────────────────────────────────────────
  const characterName = (conv.characters as { name?: string } | null)?.name
  const charge = await chargeForMessage(db, user.id)
  if (!charge.ok) {
    if (charge.status === 402) {
      await logUserAction(db, user.id, 'points_shortage', { context: 'message', character_name: characterName, current: charge.body.current, required: charge.body.required })
    }
    return NextResponse.json(charge.body, { status: charge.status })
  }

  // ── メッセージ保存（失敗したら消費分を返却）──────────────────────────────
  const { data: msg, error: insertErr } = await db
    .from('messages')
    .insert({ conversation_id: conversationId, sender_role: 'user', content, points_used: charge.deducted })
    .select()
    .single()

  if (insertErr || !msg) {
    console.error('[send-message] insert error:', insertErr?.message)
    await refund(db, user.id, charge)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }

  await db.from('conversations')
    .update({ last_message_at: new Date().toISOString(), is_unread_staff: true })
    .eq('id', conversationId)

  await logUserAction(db, user.id, 'message_sent', {
    character_name: characterName,
    cost: charge.deducted,
    via: charge.usedSubscription ? 'subscription' : 'points',
  })

  return NextResponse.json({
    message: msg,
    deducted: charge.deducted,
    points: charge.points,
    bonus_points: charge.bonus_points,
    canSendNext: charge.canSendNext,
  })
}

type Charge =
  | { ok: true; deducted: number; bonusDeducted: number; points: number; bonus_points: number; canSendNext: boolean; usedSubscription: boolean }
  | { ok: false; status: number; body: Record<string, unknown> }

async function chargeForMessage(db: Db, userId: string): Promise<Charge> {
  // サブスク判定（月次リセット・期限切れ・カウント加算は RPC 内でアトミックに処理）
  const { data: subData } = await db.rpc('use_subscription_message', { p_user_id: userId })
  const sub = subData as SubResult | null
  const planId = sub?.model as PlanId | undefined
  const overageCost = planId ? PLANS[planId].overage_points : DEFAULT_POINTS_PER_MESSAGE

  if (sub?.ok) {
    const { data: p } = await db.from('profiles').select('points, bonus_points, bonus_points_expires_at').eq('id', userId).single()
    const usable = usablePoints(p)
    return {
      ok: true, deducted: 0, bonusDeducted: 0, usedSubscription: true,
      points: p?.points ?? 0, bonus_points: usable.bonus,
      canSendNext: (sub.used ?? 0) < (sub.limit ?? 0) || usable.total >= overageCost,
    }
  }

  const cost = sub?.reason === 'over_limit' ? overageCost : DEFAULT_POINTS_PER_MESSAGE
  const spend = await spendPoints(db, userId, cost, 'メッセージ送信')
  if (!spend.ok) return spend
  return {
    ok: true, deducted: spend.deducted, bonusDeducted: spend.bonusDeducted, usedSubscription: false,
    points: spend.points, bonus_points: spend.bonus_points,
    canSendNext: spend.points + spend.bonus_points >= cost,
  }
}

async function refund(db: Db, userId: string, charge: Extract<Charge, { ok: true }>) {
  if (charge.usedSubscription) {
    const { data: p } = await db.from('profiles').select('monthly_messages_used').eq('id', userId).single()
    await db.from('profiles')
      .update({ monthly_messages_used: Math.max(0, (p?.monthly_messages_used ?? 1) - 1) })
      .eq('id', userId)
    return
  }
  await refundPoints(db, userId, charge, 'メッセージ送信失敗による返却')
}
