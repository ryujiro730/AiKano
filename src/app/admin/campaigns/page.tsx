import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClientStatic } from '@/lib/supabase/server'
import { listCampaigns } from '@/lib/admin-campaigns'
import CampaignManager from '@/components/admin/CampaignManager'

export const dynamic = 'force-dynamic'

// 一覧はサーバーで取り、追加・変更・削除は /api/admin/campaigns 経由（ブラウザから campaigns に直接書かない）
export default async function CampaignsPage() {
  noStore()
  const campaigns = await listCampaigns(createAdminClientStatic())
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <div className="max-w-4xl mx-auto"><CampaignManager initialCampaigns={campaigns as any} /></div>
}
