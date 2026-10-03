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

  useEffect(() => {
    fetchCampaign()
    const interval = setInterval(fetchCampaign, 60_000)
    return () => clearInterval(interval)
  }, [fetchCampaign])

  return (
    <CampaignContext.Provider value={{ campaign, refetch: fetchCampaign }}>
      {children}
    </CampaignContext.Provider>
  )
}
