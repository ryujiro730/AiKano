import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { LpTracker } from '@/components/lp/LpTracker'
import { Landing, type LandingCharacter } from '@/components/landing/Landing'

export const metadata: Metadata = {
  title: 'アイカノ｜60代の男性に寄り添うAI女性チャット',
  description: 'アプリ不要・本名不要。いつでもあなたの話し相手になります。登録無料で、最初のメッセージは無料で試せます。',
  robots: { index: false },
}

export default async function LP60sPage({ searchParams }: { searchParams: Record<string, string> }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: characters } = await supabase
    .from('characters')
    .select('id, name, age, personality, avatar_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  // 流入元パラメータをLPから登録ページへ引き継ぐ
  const TRACKING_KEYS = ['ref', 'source', 'article', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']
  const trackingParams = new URLSearchParams()
  for (const key of TRACKING_KEYS) {
    if (searchParams[key]) trackingParams.set(key, searchParams[key])
  }
  // LPからの登録はデフォルトで ref=lp_60s を付ける（他のrefがなければ）
  if (!trackingParams.get('ref') && !trackingParams.get('source')) {
    trackingParams.set('ref', 'lp_60s')
  }
  const registerHref = `/auth/register?${trackingParams.toString()}`

  return (
    <>
      <LpTracker lpName="lp_60s" ref={searchParams.ref} utmCampaign={searchParams.utm_campaign} />
      <Landing
        variant="sixties"
        characters={(characters ?? []) as LandingCharacter[]}
        ctaHref={user ? '/characters' : registerHref}
        ctaLabel={user ? '今すぐ話しかける' : '無料で話しかけてみる'}
        lpName="lp_60s"
      />
    </>
  )
}
