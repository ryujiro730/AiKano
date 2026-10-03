export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getBadgeCounts } from '@/lib/badge-counts'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ unread: 0, support: 0 })
  return NextResponse.json(await getBadgeCounts(user.id))
}
