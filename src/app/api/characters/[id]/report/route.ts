export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function admin() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { reason } = await req.json()
  if (!reason?.trim()) return NextResponse.json({ error: 'reason required' }, { status: 400 })

  const { error } = await admin().from('reports').insert({
    reporter_id: user.id,
    character_id: params.id,
    reason: reason.trim(),
  } as any)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
