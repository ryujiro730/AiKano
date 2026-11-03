export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { listCampaigns, saveCampaign } from '@/lib/admin-campaigns'

export const fetchCache = 'force-no-store'

export async function GET() {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  return NextResponse.json({ campaigns: await listCampaigns(auth.db) })
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  const result = await saveCampaign(auth.db, null, await req.json().catch(() => ({})))
  if ('error' in result) return NextResponse.json(result, { status: 400 })
  return NextResponse.json(result)
}
