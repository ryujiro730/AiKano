export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function admin() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ ok: false })

  const db = admin()
  const now = new Date()
  await db.from('profiles').update({ last_login_at: now.toISOString() } as any).eq('id', user.id)

  // ログイン回数の集計（login_events）に、パスワードログインも含める（JSTで1日1回）
  const jstDayStart = new Date(Math.floor((now.getTime() + 9 * 3600000) / 86400000) * 86400000 - 9 * 3600000).toISOString()
  const { count } = await db.from('login_events').select('id', { count: 'exact', head: true })
    .eq('user_id', user.id).gte('logged_in_at', jstDayStart)
  if (!count) await db.from('login_events').insert({ user_id: user.id, logged_in_at: now.toISOString() })

  return NextResponse.json({ ok: true })
}
