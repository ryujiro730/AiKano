export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getBadgeCounts } from '@/lib/badge-counts'

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ count: 0 })
  const { support } = await getBadgeCounts(user.id)
  return NextResponse.json({ count: support })
}
