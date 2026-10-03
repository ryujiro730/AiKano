import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'
import { BottomNavLive } from './BottomNavLive'

async function getCounts(userId: string): Promise<{ unread: number; support: number }> {
  noStore()
  try {
    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const [{ data: convs }, { data: inquiries }] = await Promise.all([
      admin.from('conversations').select('id').eq('user_id', userId),
      admin.from('inquiries').select('id').eq('user_id', userId),
    ])

    const convIds = (convs ?? []).map((c: { id: string }) => c.id)
    const inquiryIds = (inquiries ?? []).map((i: { id: string }) => i.id)

    const [unreadResult, supportResult] = await Promise.all([
      convIds.length > 0
        ? admin.from('messages')
            .select('id', { count: 'exact', head: true })
            .in('conversation_id', convIds)
            .eq('sender_role', 'character')
            .eq('is_read', false)
        : Promise.resolve({ count: 0 }),
      inquiryIds.length > 0
        ? admin.from('inquiry_replies')
            .select('id', { count: 'exact', head: true })
            .in('inquiry_id', inquiryIds)
            .eq('sender_role', 'staff')
        : Promise.resolve({ count: 0 }),
    ])

    return {
      unread: unreadResult.count ?? 0,
      support: supportResult.count ?? 0,
    }
  } catch {
    return { unread: 0, support: 0 }
  }
}

export async function BottomNavServer({ userId }: { userId: string }) {
  const { unread, support } = await getCounts(userId)
  return (
    <BottomNavLive
      userId={userId}
      initialUnread={unread}
      initialSupport={support}
    />
  )
}
