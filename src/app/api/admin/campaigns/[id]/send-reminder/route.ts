export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { sendCampaignManualReminder } from '@/lib/campaign-email'

export const fetchCache = 'force-no-store'
export const maxDuration = 300

// 管理画面の ✉: まだ買っていない対象者へ追いメール（1キャンペーン1人1回）
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  const { emailSubject, emailBody, emailCtaUrl, emailCtaLabel } = await req.json().catch(() => ({}))
  try {
    const result = await sendCampaignManualReminder(auth.db, params.id, {
      subject: typeof emailSubject === 'string' ? emailSubject : undefined,
      body: typeof emailBody === 'string' ? emailBody : undefined,
      ctaUrl: typeof emailCtaUrl === 'string' ? emailCtaUrl : undefined,
      ctaLabel: typeof emailCtaLabel === 'string' ? emailCtaLabel : undefined,
    })
    return NextResponse.json(result)
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}
