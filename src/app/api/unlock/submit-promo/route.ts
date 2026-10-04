import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getMessages } from '@/i18n/server'

function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { characterId: string; postUrl: string; screenshotUrl?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { characterId, postUrl, screenshotUrl } = body
  if (!characterId || !postUrl?.trim()) {
    return NextResponse.json({ error: getMessages().api.required }, { status: 400 })
  }

  const admin = adminSupabase()

  // 既に解放済みチェック
  const { data: existing } = await admin
    .from('character_unlocks')
    .select('id')
    .eq('user_id', user.id)
    .eq('character_id', characterId)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'already_unlocked' }, { status: 409 })
  }

  // 既に申請済み（pending）チェック
  const { data: pendingSubmission } = await admin
    .from('promo_submissions')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('character_id', characterId)
    .eq('status', 'pending')
    .maybeSingle()

  if (pendingSubmission) {
    return NextResponse.json({ error: 'already_submitted' }, { status: 409 })
  }

  const { data, error } = await admin
    .from('promo_submissions')
    .insert({
      user_id: user.id,
      character_id: characterId,
      post_url: postUrl.trim(),
      screenshot_url: screenshotUrl ?? null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[submit-promo] error:', error.message)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, submissionId: data.id })
}
