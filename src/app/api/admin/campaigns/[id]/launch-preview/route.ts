export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { countCampaignLaunchTargets } from '@/lib/campaign-email'

export const fetchCache = 'force-no-store'

// 公開する前の確認: 今公開したら何人にお知らせメールが届くか（送らない）
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  try {
    return NextResponse.json({ count: await countCampaignLaunchTargets(auth.db, params.id) })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
