export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function admin() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ count: 0 })

  const adm = admin()

  const [{ data: profile }, { data: inquiries }] = await Promise.all([
    adm.from('profiles').select('support_last_read_at').eq('id', user.id).single(),
    adm.from('inquiries').select('id').eq('user_id', user.id),
  ])

  const inquiryIds = (inquiries ?? []).map((i: { id: string }) => i.id)
  if (inquiryIds.length === 0) return NextResponse.json({ count: 0 })

  const lastRead = profile?.support_last_read_at ?? null
  let q = adm
    .from('inquiry_replies')
    .select('id', { count: 'exact', head: true })
    .in('inquiry_id', inquiryIds)
    .eq('sender_role', 'staff')
  if (lastRead) q = q.gt('created_at', lastRead)

  const { count } = await q
  return NextResponse.json({ count: count ?? 0 })
}
