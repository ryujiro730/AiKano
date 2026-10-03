export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function admin() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function GET() {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ blocks: [] })

  const { data } = await admin()
    .from('blocks')
    .select('character_id, created_at, character:characters(id, name, avatar_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ blocks: data ?? [] })
}
