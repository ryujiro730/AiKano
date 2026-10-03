export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function admin() {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await admin().from('blocks').upsert(
    { user_id: user.id, character_id: params.id },
    { onConflict: 'user_id,character_id', ignoreDuplicates: true }
  )
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { error } = await admin()
    .from('blocks')
    .delete()
    .eq('user_id', user.id)
    .eq('character_id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
