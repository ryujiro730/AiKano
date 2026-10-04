import { createAdminClientStatic } from '@/lib/supabase/server'
import Link from 'next/link'
import { getMessages } from '@/i18n/server'

export async function CampaignBannerImage({ className, userId }: { className?: string; userId?: string | null }) {
  const m = getMessages()
  const admin = createAdminClientStatic()

  const { data: campaigns } = await admin
    .from('campaigns')
    .select('image_url, cta_url, starts_at, ends_at, one_time_per_user, created_at, bonus_rate, campaign_conditions(*)')
    .eq('is_active', true)
    .not('image_url', 'is', null)
    .order('bonus_rate', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(10)

  const now = new Date()
  const activeCampaigns = (campaigns ?? []).filter(c => {
    const start = c.starts_at ? new Date(c.starts_at) : null
    const end = c.ends_at ? new Date(c.ends_at) : null
    return (start === null || start <= now) && (end === null || end >= now)
  })

  if (!activeCampaigns.length) return null

  const needsUserData = userId && activeCampaigns.some(c =>
    c.one_time_per_user || ((c as any).campaign_conditions ?? []).length > 0
  )

  let purchaseCount = 0
  let purchaseAmount = 0
  let registeredAt: Date | null = null
  let hoursSinceReg = 0
  let latestPurchaseAt: Date | null = null

  if (needsUserData) {
    const [profileRes, purchasesRes] = await Promise.all([
      admin.from('profiles').select('created_at').eq('id', userId!).single(),
      admin.from('point_transactions')
        .select('price_yen, created_at')
        .eq('user_id', userId!)
        .eq('type', 'purchase')
        .order('created_at', { ascending: false })
        .limit(200),
    ])
    registeredAt = profileRes.data?.created_at ? new Date(profileRes.data.created_at) : null
    if (registeredAt) hoursSinceReg = (now.getTime() - registeredAt.getTime()) / (1000 * 60 * 60)
    const purchases = purchasesRes.data ?? []
    purchaseCount = purchases.length
    purchaseAmount = purchases.reduce((sum, p) => sum + (p.price_yen ?? 0), 0)
    latestPurchaseAt = purchases[0]?.created_at ? new Date(purchases[0].created_at) : null
  }

  const campaign = activeCampaigns.find(c => {
    if (c.one_time_per_user === true) {
      const hasPurchased = c.starts_at
        ? (latestPurchaseAt !== null && latestPurchaseAt >= new Date(c.starts_at))
        : purchaseCount > 0
      if (hasPurchased) return false
    }

    const conditions: any[] = (c as any).campaign_conditions ?? []
    return conditions.every((cond: any) => {
      const val = cond.value
      const op = cond.operator
      if (cond.condition_type === 'registered_at') {
        if (!registeredAt) return false
        const threshold = new Date(val)
        return op === 'gte' ? registeredAt >= threshold : registeredAt <= threshold
      }
      if (cond.condition_type === 'hours_since_registration') {
        const threshold = parseInt(val, 10)
        if (op === 'gte') return hoursSinceReg >= threshold
        if (op === 'lt') return hoursSinceReg < threshold
        if (op === 'lte') return hoursSinceReg <= threshold
        return false
      }
      if (cond.condition_type === 'purchase_count') {
        const n = parseInt(val, 10)
        return op === 'gte' ? purchaseCount >= n : purchaseCount <= n
      }
      if (cond.condition_type === 'purchase_amount') {
        const n = parseInt(val, 10)
        return op === 'gte' ? purchaseAmount >= n : purchaseAmount <= n
      }
      return true
    })
  })

  if (!campaign?.image_url) return null

  const href = (campaign as any).cta_url ?? '/payment'

  return (
    <Link href={href} className={`block${className ? ` ${className}` : ''}`}>
      <img src={campaign.image_url} alt={m.campaign.imageAlt} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
    </Link>
  )
}
