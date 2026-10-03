export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = adminDb()
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: requests } = await admin
    .from('bank_transfer_requests')
    .select('*')
    .order('requested_at', { ascending: false })
    .limit(200)

  if (!requests || requests.length === 0) return NextResponse.json({ requests: [] })

  const userIds = Array.from(new Set(requests.map((r: any) => r.user_id)))
  const { data: profiles } = await admin
    .from('profiles')
    .select('id, display_name')
    .in('id', userIds)

  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]))

  return NextResponse.json({
    requests: requests.map((r: any) => ({ ...r, user: profileMap.get(r.user_id) ?? null })),
  })
}
