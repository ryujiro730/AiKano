export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { INTERNAL_EMAILS } from '@/lib/internal-accounts'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { findEligibleCampaign } from '@/lib/campaigns'

function admin() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET(req: Request) {
  const isPurchaseContext = new URL(req.url).searchParams.get('purchase') === 'true'

  const user = await getAuthUser()
  if (!user) return NextResponse.json({ campaign: null })
  if (user.email && (INTERNAL_EMAILS as readonly string[]).includes(user.email as any)) {
    return NextResponse.json({ campaign: null })
  }

  const campaign = await findEligibleCampaign(admin(), user.id, { purchaseContext: isPurchaseContext })
  if (!campaign) return NextResponse.json({ campaign: null })

  return NextResponse.json({
    campaign: {
      id: campaign.id,
      image_url: campaign.image_url,
      catchphrase: campaign.catchphrase,
      description: campaign.description,
      cta_text: campaign.cta_text,
      cta_url: campaign.cta_url ?? '/payment',
      display_frequency: campaign.display_frequency,
      style_config: campaign.style_config ?? {},
      bonus_rate: campaign.bonus_rate ?? 1.0,
      min_price_yen: campaign.min_price_yen ?? null,
      max_price_yen: campaign.max_price_yen ?? null,
    }
  })
}
