export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function admin() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const body = await req.json()
  const { action_type, page_path, metadata: rawMetadata } = body
  if (!action_type || typeof action_type !== 'string') {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  let metadata: Record<string, unknown> | null = null
  if (rawMetadata !== undefined && rawMetadata !== null) {
    if (typeof rawMetadata !== 'object' || Array.isArray(rawMetadata)) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    if (JSON.stringify(rawMetadata).length > 5120) {
      return NextResponse.json({ ok: false }, { status: 400 })
    }
    metadata = rawMetadata as Record<string, unknown>
  }

  const db = admin()
  const { data: profile } = await db
    .from('profiles')
    .select('points, bonus_points, bonus_points_expires_at')
    .eq('id', user.id)
    .single()

  const now = new Date()
  const bonusActive = profile?.bonus_points_expires_at && new Date(profile.bonus_points_expires_at) > now
    ? (profile.bonus_points ?? 0) : 0
  const totalBalance = (profile?.points ?? 0) + bonusActive

  try {
    await db.from('user_action_logs').insert({
      user_id: user.id,
      action_type,
      page_path: page_path ?? null,
      metadata: metadata ?? null,
      points_balance: profile ? totalBalance : null,
    } as any)
  } catch {}

  return NextResponse.json({ ok: true })
}
