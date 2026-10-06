import { unstable_noStore as noStore } from 'next/cache'
import { BottomNavLive } from './BottomNavLive'
import { getBadgeCounts } from '@/lib/badge-counts'

export async function BottomNavServer({ userId, showGacha }: { userId: string; showGacha?: boolean }) {
  noStore()
  const { unread, support } = await getBadgeCounts(userId)
  return (
    <BottomNavLive
      userId={userId}
      initialUnread={unread}
      initialSupport={support}
      showGacha={showGacha}
    />
  )
}
