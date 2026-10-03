'use client'

import { useState, useEffect, useCallback } from 'react'
import { BottomNav } from './BottomNav'
import { useCampaign } from './CampaignProvider'
import { usePathname } from 'next/navigation'
import { BADGES_CHANGED_EVENT } from '@/lib/badge-events'

export function BottomNavLive({
  userId,
  initialUnread = 0,
  initialSupport = 0,
}: {
  userId?: string
  initialUnread?: number
  initialSupport?: number
}) {
  const [counts, setCounts] = useState({ unread: initialUnread, support: initialSupport })
  const { campaign: rawCampaign } = useCampaign()
  const pathname = usePathname()
  const [dismissedId, setDismissedId] = useState<string | null>(null)

  const activeCampaign = rawCampaign && rawCampaign.id !== dismissedId
    ? { id: rawCampaign.id, catchphrase: rawCampaign.catchphrase ?? '' }
    : null

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/user/badge-counts')
      if (res.ok) setCounts(await res.json())
    } catch {}
  }, [])

  useEffect(() => {
    if (!userId) return

    const interval = setInterval(refresh, 60_000)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') refresh()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener(BADGES_CHANGED_EVENT, refresh)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener(BADGES_CHANGED_EVENT, refresh)
    }
  }, [userId, refresh])

  // 画面遷移のたびに最新化（チャットから戻ったとき等）
  useEffect(() => {
    if (userId) refresh()
  }, [pathname, userId, refresh])

  const handleDismiss = useCallback(() => {
    if (rawCampaign) setDismissedId(rawCampaign.id)
  }, [rawCampaign])

  return (
    <BottomNav
      unreadCount={counts.unread}
      supportCount={counts.support}
      activeCampaign={activeCampaign}
      onDismissCampaign={handleDismiss}
    />
  )
}
