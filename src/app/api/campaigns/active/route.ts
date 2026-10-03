export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { INTERNAL_EMAILS } from '@/lib/internal-accounts'
import { createClient as createAdminClient } from '@supabase/supabase-js'

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

  const db = admin()
  const now = new Date()

  const { data: allCampaigns } = await db
    .from('campaigns')
    .select('*, campaign_conditions(*)')
    .eq('is_active', true)
    .order('bonus_rate', { ascending: false })
    .order('created_at', { ascending: false })

  if (!allCampaigns?.length) return NextResponse.json({ campaign: null })

  const campaigns = allCampaigns.filter((c: any) => {
    const start = c.starts_at ? new Date(c.starts_at) : null
    const end = c.ends_at ? new Date(c.ends_at) : null
    return (start === null || start <= now) && (end === null || end >= now)
  })

  if (!campaigns.length) return NextResponse.json({ campaign: null })

  const [{ data: displayed }, { data: profile }, { data: purchases }] = await Promise.all([
    db.from('campaign_displays').select('campaign_id').eq('user_id', user.id),
    db.from('profiles').select('created_at').eq('id', user.id).single(),
    db.from('point_transactions')
      .select('price_yen, created_at')
      .eq('user_id', user.id)
      .eq('type', 'purchase')
      .order('created_at', { ascending: false })
      .limit(200),
  ])

  const displayedIds = new Set((displayed ?? []).map((d: any) => d.campaign_id))
  const purchaseCount = purchases?.length ?? 0
  const purchaseAmount = (purchases ?? []).reduce((s: number, p: any) => s + (p.price_yen ?? 0), 0)
  const registeredAt = profile?.created_at ? new Date(profile.created_at) : null

  for (const campaign of campaigns) {
    if (!isPurchaseContext && campaign.display_frequency === 'once' && displayedIds.has(campaign.id)) continue

    if (campaign.one_time_per_user === true) {
      const hasPurchased = campaign.starts_at
        ? (purchases ?? []).some((p: any) => new Date(p.created_at) >= new Date(campaign.starts_at))
        : (purchases?.length ?? 0) > 0
      if (hasPurchased) continue
    }

    const conditions: any[] = campaign.campaign_conditions ?? []
    const matches = conditions.every((cond: any) => {
      const val = cond.value
      const op = cond.operator

      if (cond.condition_type === 'registered_at') {
        if (!registeredAt) return false
        const threshold = new Date(val)
        return op === 'gte' ? registeredAt >= threshold : registeredAt <= threshold
      }
      if (cond.condition_type === 'hours_since_registration') {
        if (!registeredAt) return false
        const hoursSinceReg = (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60)
        const threshold = parseInt(val, 10)
        if (op === 'gte') return hoursSinceReg >= threshold
        if (op === 'lt') return hoursSinceReg < threshold
        return false
      }
      if (cond.condition_type === 'purchase_count') {
        const n = parseInt(val, 10)
        if (op === 'gte') return purchaseCount >= n
        if (op === 'lte') return purchaseCount <= n
        if (op === 'lt') return purchaseCount < n
        return false
      }
      if (cond.condition_type === 'purchase_amount') {
        const n = parseInt(val, 10)
        if (op === 'gte') return purchaseAmount >= n
        if (op === 'lte') return purchaseAmount <= n
        if (op === 'lt') return purchaseAmount < n
        return false
      }
      return true
    })

    if (matches) {
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
  }

  return NextResponse.json({ campaign: null })
}
