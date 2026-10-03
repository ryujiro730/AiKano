export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function admin() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { campaign_id } = await req.json()
  if (!campaign_id) return NextResponse.json({ error: 'campaign_id required' }, { status: 400 })

  const { data: campaign } = await admin()
    .from('campaigns')
    .select('display_frequency')
    .eq('id', campaign_id)
    .single()

  if (campaign?.display_frequency === 'once') {
    await admin()
      .from('campaign_displays')
      .upsert({ campaign_id, user_id: user.id }, { onConflict: 'campaign_id,user_id' })
  }

  return NextResponse.json({ ok: true })
}
