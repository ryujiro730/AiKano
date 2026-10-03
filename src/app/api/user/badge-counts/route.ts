export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ unread: 0, support: 0 })

    const admin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) } }
    )

    const [{ data: convs }, { data: inquiries }] = await Promise.all([
      admin.from('conversations').select('id').eq('user_id', user.id),
      admin.from('inquiries').select('id').eq('user_id', user.id),
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

    return NextResponse.json({
      unread: unreadResult.count ?? 0,
      support: supportResult.count ?? 0,
    })
  } catch {
    return NextResponse.json({ unread: 0, support: 0 })
  }
}
