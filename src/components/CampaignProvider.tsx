'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

export type CampaignData = {
  id: string
  image_url: string | null
  catchphrase: string
  description: string
  cta_text: string
  cta_url: string
  display_frequency: 'once' | 'always'
  style_config: Record<string, unknown> | null
  bonus_rate: number
  min_price_yen: number | null
  max_price_yen: number | null
}

type CampaignContextValue = {
  campaign: CampaignData | null
  refetch: () => void
}

const CampaignContext = createContext<CampaignContextValue>({
  campaign: null,
  refetch: () => {},
})

export function useCampaign() {
  return useContext(CampaignContext)
}

export function CampaignProvider({ children }: { children: React.ReactNode }) {
  const [campaign, setCampaign] = useState<CampaignData | null>(null)

  const fetchCampaign = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns/active')
      if (!res.ok) { setCampaign(null); return }
      const { campaign: c } = await res.json()
      setCampaign(c ?? null)
    } catch {
      setCampaign(null)
    }
  }, [])

  // 取り直しは5分ごと。タブが裏にあるあいだは取らず、表に戻ったときに取る（開きっぱなしの人の分だけリクエストが増えるため）
  useEffect(() => {
    fetchCampaign()
    const interval = setInterval(() => { if (document.visibilityState === 'visible') fetchCampaign() }, 5 * 60_000)
    const onVisible = () => { if (document.visibilityState === 'visible') fetchCampaign() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', onVisible) }
  }, [fetchCampaign])

  return (
    <CampaignContext.Provider value={{ campaign, refetch: fetchCampaign }}>
      {children}
    </CampaignContext.Provider>
  )
}
