export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createAdminClient } from '@/lib/supabase/server'
import { metaViewCheckout } from '@/lib/meta-capi'

export const fetchCache = 'force-no-store'

/**
 * POST /api/meta/event { event: 'view_checkout', eventId, url }
 * ブラウザで起きた行動を CAPI でも送る（ブラウザの Pixel は広告ブロック等で落ちるので、同じ eventId でサーバーからも送る）
 */
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { event, eventId, url } = await req.json().catch(() => ({}))
  if (event !== 'view_checkout' || typeof eventId !== 'string' || eventId.length > 80) return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const source = typeof url === 'string' && url.startsWith('https://aikano.chat') ? url : 'https://aikano.chat/payment'
  await metaViewCheckout(createAdminClient(), user.id, eventId, source)
  return NextResponse.json({ ok: true })
}
