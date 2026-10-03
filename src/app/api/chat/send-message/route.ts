export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { PLANS, type PlanId } from '@/lib/plans'
import { POINTS_PER_MESSAGE } from '@/lib/pricing'
import { logUserAction } from '@/lib/user-action-log'

// ユーザーメッセージ送信：ポイント消費 → メッセージ保存をサーバー側で一括実行。
// AI返信は ai-reply 側でポイント残高に関係なく返す。
const DEFAULT_POINTS_PER_MESSAGE = POINTS_PER_MESSAGE
const MAX_CONTENT_LENGTH = 300
const MAX_RETRY = 3

type Db = ReturnType<typeof adminDb>
type SubResult = { ok: boolean; reason?: string; model?: string; used?: number; limit?: number }
type PointsRow = { points: number | null; bonus_points: number | null; bonus_points_expires_at: string | null }

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
    return NextResponse.json({ error: `メッセージは${MAX_CONTENT_LENGTH}文字以内にしてください` }, { status: 400 })
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

  // ボーナス（有効期限内）→ 通常ポイントの順で消費。
  // 読み取った値を条件にした compare-and-swap 更新で二重送信時の競合を防ぐ。
  for (let i = 0; i < MAX_RETRY; i++) {
    const { data: p } = await db
      .from('profiles')
      .select('points, bonus_points, bonus_points_expires_at')
      .eq('id', userId)
      .single()
    if (!p) return { ok: false, status: 404, body: { error: 'Profile not found' } }

    const usable = usablePoints(p)
    if (usable.total < cost) {
      return { ok: false, status: 402, body: { error: 'insufficient_points', current: usable.total, required: cost } }
    }

    const bonusDeducted = Math.min(usable.bonus, cost)
    const newPoints = (p.points ?? 0) - (cost - bonusDeducted)
    // 期限切れボーナスは 0 に落とす
    const newBonus = usable.bonus - bonusDeducted

    let q = db.from('profiles')
      .update({ points: newPoints, bonus_points: newBonus })
      .eq('id', userId)
      .eq('points', p.points ?? 0)
    q = p.bonus_points == null ? q.is('bonus_points', null) : q.eq('bonus_points', p.bonus_points)
    const { data: updated } = await q.select('id')
    if (!updated || updated.length === 0) continue // 競合 → 再読込してやり直し

    await db.from('point_transactions').insert({
      user_id: userId, amount: -cost, type: 'spend', description: 'メッセージ送信',
    })

    return {
      ok: true, deducted: cost, bonusDeducted, usedSubscription: false,
      points: newPoints, bonus_points: newBonus,
      canSendNext: newPoints + newBonus >= cost,
    }
  }

  return { ok: false, status: 409, body: { error: 'conflict' } }
}

async function refund(db: Db, userId: string, charge: Extract<Charge, { ok: true }>) {
  if (charge.usedSubscription) {
    const { data: p } = await db.from('profiles').select('monthly_messages_used').eq('id', userId).single()
    await db.from('profiles')
      .update({ monthly_messages_used: Math.max(0, (p?.monthly_messages_used ?? 1) - 1) })
      .eq('id', userId)
    return
  }
  if (charge.deducted === 0) return
  // 通常分は add_points でアトミックに戻す。ボーナス分は直後なので現在値に加算。
  const regular = charge.deducted - charge.bonusDeducted
  if (regular > 0) await db.rpc('add_points', { p_user_id: userId, p_amount: regular })
  if (charge.bonusDeducted > 0) {
    const { data: p } = await db.from('profiles').select('bonus_points').eq('id', userId).single()
    await db.from('profiles').update({ bonus_points: (p?.bonus_points ?? 0) + charge.bonusDeducted }).eq('id', userId)
  }
  await db.from('point_transactions').insert({
    user_id: userId, amount: charge.deducted, type: 'admin_adjust', description: 'メッセージ送信失敗による返却',
  })
}

function usablePoints(p: PointsRow | null) {
  const bonusValid = !!p?.bonus_points_expires_at && new Date(p.bonus_points_expires_at) > new Date()
  const bonus = bonusValid ? (p?.bonus_points ?? 0) : 0
  return { bonus, total: (p?.points ?? 0) + bonus }
}
