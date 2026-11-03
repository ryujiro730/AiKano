export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { saveCampaign } from '@/lib/admin-campaigns'

export const fetchCache = 'force-no-store'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  const result = await saveCampaign(auth.db, params.id, await req.json().catch(() => ({})))
  if ('error' in result) return NextResponse.json(result, { status: 400 })
  return NextResponse.json(result)
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  const { error } = await auth.db.from('campaigns').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
