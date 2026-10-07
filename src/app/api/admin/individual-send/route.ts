export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { resolveVariables } from '@/lib/message-variables'
import { sendNotificationEmail } from '@/lib/send-notification-email'
import { getOrCreateConversation } from '@/lib/conversations'

function adminSupabase() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

// POST /api/admin/individual-send
// body: { userId, characterId, content }
export async function POST(req: NextRequest) {
  const authClient = createServerClient()
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: staffProfile } = await authClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!staffProfile || !['admin', 'staff'].includes(staffProfile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: { userId: string; characterId: string; content: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { userId, characterId, content } = body
  if (!userId || !characterId || !content?.trim()) {
    return NextResponse.json({ error: 'userId, characterId, content are required' }, { status: 400 })
  }

  const admin = adminSupabase()

  // ユーザープロフィール取得（変数置換用）
  const { data: userProfile } = await admin
    .from('profiles')
    .select('display_name, age, gender')
    .eq('id', userId)
    .single()

  const resolvedContent = userProfile
    ? resolveVariables(content.trim(), userProfile)
    : content.trim()

  // 既存の会話を探す
  const conv = await getOrCreateConversation(admin, userId, characterId)
  if (!conv) return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  const conversationId = conv.id

  // メッセージを挿入
  const now = new Date().toISOString()
  const { data: msg, error: insertErr } = await admin
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_role: 'character',
      content: resolvedContent,
      points_used: 0,
      is_read: false,
    })
    .select()
    .single()

  if (insertErr || !msg) {
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }

  // 会話を更新
  await admin
    .from('conversations')
    .update({ last_message_at: now, is_unread_staff: false })
    .eq('id', conversationId)

  // メール通知（非同期）
  Promise.all([
    admin.auth.admin.getUserById(userId),
    admin.from('characters').select('name').eq('id', characterId).single(),
  ]).then(([{ data: authData }, { data: charData }]) => {
    const email = authData?.user?.email
    if (email && charData?.name) {
      sendNotificationEmail({
        toEmail: email,
        characterName: charData.name,
        messageContent: resolvedContent,
        conversationId,
      })
    }
  }).catch(() => {})

  return NextResponse.json({ message: msg, conversationId })
}
