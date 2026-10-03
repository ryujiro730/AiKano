import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'

function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

async function checkAdmin(userId: string) {
  const admin = adminSupabase()
  const { data } = await admin.from('profiles').select('role').eq('id', userId).single()
  return ['admin', 'owner'].includes(data?.role ?? '')
}

// POST /api/admin/unlock  { submissionId, action: 'approve'|'reject', notes? }
export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!(await checkAdmin(user.id))) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: { submissionId: string; action: 'approve' | 'reject'; notes?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { submissionId, action, notes } = body
  if (!submissionId || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ error: 'submissionId と action は必須です' }, { status: 400 })
  }

  const admin = adminSupabase()

  const { data: submission } = await admin
    .from('promo_submissions')
    .select('id, user_id, character_id, status')
    .eq('id', submissionId)
    .single()

  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (submission.status !== 'pending') {
    return NextResponse.json({ error: 'already_reviewed' }, { status: 409 })
  }

  // ステータス更新
  await admin
    .from('promo_submissions')
    .update({
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      notes: notes ?? null,
    })
    .eq('id', submissionId)

  // 承認の場合はキャラ解放を記録
  if (action === 'approve') {
    await admin
      .from('character_unlocks')
      .upsert({
        user_id: submission.user_id,
        character_id: submission.character_id,
        unlock_type: 'promo',
      }, { onConflict: 'user_id,character_id' })
  }

  return NextResponse.json({ ok: true })
}
