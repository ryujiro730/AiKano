export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createAdminClient } from '@/lib/supabase/server'
import { getFirstOffer } from '@/lib/first-offer'

export const fetchCache = 'force-no-store'

/** GET: 初回限定パックを出せるか ／ POST: 出せるなら（まだなら）24時間の期限を始めて返す */
export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ eligible: false }, { status: 401 })
  return NextResponse.json(await getFirstOffer(createAdminClient(), user.id))
}

export async function POST() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ eligible: false }, { status: 401 })
  return NextResponse.json(await getFirstOffer(createAdminClient(), user.id, { start: true }))
}
