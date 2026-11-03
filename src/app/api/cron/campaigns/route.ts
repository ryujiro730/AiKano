export const dynamic = 'force-dynamic'
// Supabase への fetch を Next.js のデータキャッシュに載せない（GET の cron では古い結果が返り続けていた）
export const fetchCache = 'force-no-store'
export const maxDuration = 300
import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/auto-broadcast'
import { processCampaignEmails } from '@/lib/campaign-email'

// キャンペーンのお知らせメール（開始日時が来たときのお知らせ・条件に入った人へのお知らせ・24時間後／72時間後の追いメール）。5分おき
export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    return NextResponse.json(await processCampaignEmails(createAdminSupabase()))
  } catch (e) {
    console.error('[cron/campaigns] error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
