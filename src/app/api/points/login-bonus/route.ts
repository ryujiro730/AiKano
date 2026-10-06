export const dynamic = 'force-dynamic'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { LOGIN_BONUS, LOGIN_BONUS_HOURS } from '@/lib/pricing'
import { logUserAction } from '@/lib/user-action-log'

const BONUS_AMOUNT = LOGIN_BONUS

const jstDate = () => new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Tokyo' })

export async function POST() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = session.user.id

  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('points, bonus_points, bonus_points_expires_at, last_login_bonus_at')
    .eq('id', userId)
    .single()

  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const today = jstDate()

  // すでに今日受け取り済み
  if (profile.last_login_bonus_at === today) {
    return NextResponse.json({ awarded: false })
  }

  // ログインボーナスは付与から24時間有効。前日の使い残しは持ち越さず、今日の分に置き換える
  const now = new Date()
  const expiresAt = new Date(now.getTime() + LOGIN_BONUS_HOURS * 3600_000)
  const newBonusPoints = BONUS_AMOUNT

  await Promise.all([
    admin
      .from('profiles')
      .update({
        bonus_points: newBonusPoints,
        bonus_points_expires_at: expiresAt.toISOString(),
        last_login_bonus_at: today,
      })
      .eq('id', userId),
    admin.from('point_transactions').insert({
      user_id: userId,
      amount: BONUS_AMOUNT,
      type: 'login_bonus',
      description: 'ログインボーナス',
    }),
  ])

  await logUserAction(admin, userId, 'login_bonus', { points: BONUS_AMOUNT })

  return NextResponse.json({
    awarded: true,
    amount: BONUS_AMOUNT,
    bonus_points: newBonusPoints,
    expires_at: expiresAt.toISOString(),
    regular_points: profile.points,
  })
}
