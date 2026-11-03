import { createAdminClientStatic } from '@/lib/supabase/server'
import Link from 'next/link'
import { getMessages } from '@/i18n/server'
import { resolveCampaignForUser } from '@/lib/campaign-eligibility'

export async function CampaignBannerImage({ className, userId }: { className?: string; userId?: string | null }) {
  const m = getMessages()
  const admin = createAdminClientStatic()

  if (!userId) return null
  // 判定は購入時と同じもの（campaign-eligibility.ts）。画像バナーなので「1回のみ表示」の既表示では隠さない
  const campaign = await resolveCampaignForUser(admin, userId, { purchaseContext: true, requireImage: true })

  if (!campaign?.image_url) return null

  const href = campaign.cta_url ?? '/payment'

  return (
    <Link href={href} className={`block${className ? ` ${className}` : ''}`}>
      <img src={campaign.image_url} alt={m.campaign.imageAlt} style={{ width: '100%', borderRadius: '12px', display: 'block' }} />
    </Link>
  )
}
