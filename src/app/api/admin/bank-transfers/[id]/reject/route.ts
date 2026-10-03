export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = adminDb()
  const { data: caller } = await admin.from('profiles').select('role').eq('id', user.id).single()
  if (caller?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { admin_note } = await req.json().catch(() => ({}))

  const { data: request } = await admin.from('bank_transfer_requests').select('status').eq('id', params.id).single()
  if (!request) return NextResponse.json({ error: '申請が見つかりません' }, { status: 404 })
  if (request.status !== 'pending') return NextResponse.json({ error: '既に処理済みです' }, { status: 400 })

  const { error } = await admin.from('bank_transfer_requests').update({
    status: 'rejected',
    admin_note: admin_note ?? null,
  }).eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
