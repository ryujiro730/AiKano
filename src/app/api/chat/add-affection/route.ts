export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createClient as createAdminClient } from '@supabase/supabase-js'

function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ ok: false }, { status: 401 })

    const { characterId, points = 3 } = await req.json()
    if (!characterId) return NextResponse.json({ ok: false }, { status: 400 })

    const admin = adminSupabase()
    const { data, error } = await admin.rpc('add_affection', {
      p_user_id: user.id,
      p_character_id: characterId,
      p_points: points,
    })

    if (error) {
      console.error('[add-affection] RPC error:', error.message)
      return NextResponse.json({ ok: false })
    }

    return NextResponse.json({ ok: true, ...data })
  } catch (err) {
    return NextResponse.json({ ok: false })
  }
}
