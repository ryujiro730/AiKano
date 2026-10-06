export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getConversationMedia } from '@/lib/paid-media'

// GET /api/media/conversation?conversationId=… — 会話内のキャラ送信メディア（未解錠は URL なし）
export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const conversationId = req.nextUrl.searchParams.get('conversationId')
  if (!conversationId) return NextResponse.json({ error: 'conversationId required' }, { status: 400 })

  const db = createAdminClient()
  const { data: conv } = await db.from('conversations').select('user_id').eq('id', conversationId).single()
  if (!conv || conv.user_id !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  return NextResponse.json({ media: await getConversationMedia(db, user.id, conversationId) })
}
