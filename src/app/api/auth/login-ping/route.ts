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

  await admin()
    .from('profiles')
    .update({ last_login_at: new Date().toISOString() } as any)
    .eq('id', user.id)

  return NextResponse.json({ ok: true })
}
