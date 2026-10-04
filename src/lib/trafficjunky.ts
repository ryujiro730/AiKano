import type { SupabaseClient } from '@supabase/supabase-js'

// TrafficJunky はマチコイと共通アカウント。トラッカーは AiKano 専用のものを使う
const TRACKER_ID_SIGNUP   = '1000591191'
const TRACKER_ID_PURCHASE = '1000591181'
const MEMBER_ID           = '1009050541'

export async function sendTJPostback({ aclid, transactionId, valueYen, description, event }: {
  aclid: string
  transactionId: string
  valueYen?: number
  description?: string
  event: 'signup' | 'purchase'
}): Promise<void> {
  try {
    const url = new URL('https://ads.trafficjunky.net/ct')
    url.searchParams.set('a', event === 'signup' ? TRACKER_ID_SIGNUP : TRACKER_ID_PURCHASE)
    url.searchParams.set('member_id', MEMBER_ID)
    url.searchParams.set('cb', String(Date.now()))
    url.searchParams.set('cti', transactionId)
    if (valueYen != null) url.searchParams.set('ctv', String(valueYen))
    // ctd は ASCII のみ（TJ が非ASCII を正しく扱わない）
    if (description) url.searchParams.set('ctd', description.replace(/[^\x20-\x7E]/g, ''))
    url.searchParams.set('aclid', aclid)
    const res = await fetch(url.toString(), { method: 'GET' })
    console.log('[trafficjunky] postback:', event, res.status)
  } catch (e) {
    console.error('[trafficjunky] postback error:', e)
  }
}

/** TJ 広告経由（tj_aclid あり）のユーザーの課金を TJ に通知する */
export async function sendTJPurchase(db: SupabaseClient, userId: string, transactionId: string, valueYen: number, description: string) {
  const { data } = await db.from('profiles').select('tj_aclid').eq('id', userId).maybeSingle()
  if (!data?.tj_aclid) return
  await sendTJPostback({ aclid: data.tj_aclid, transactionId, valueYen, description, event: 'purchase' })
}
