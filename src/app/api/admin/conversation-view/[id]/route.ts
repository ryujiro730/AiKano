export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

// 管理画面: 会話の閲覧（読み取り専用）。メッセージは新しい順に最大300件、?before=ISO で過去を取得
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  const { db } = auth

  const before = req.nextUrl.searchParams.get('before')
  let mq = db.from('messages')
    .select('id, sender_role, content, metadata, points_used, is_deleted, created_at, message_media(url, kind)')
    .eq('conversation_id', params.id)
    .order('created_at', { ascending: false })
    .limit(300)
  if (before) mq = mq.lt('created_at', before)

  const [{ data: conv }, { data: msgs }] = await Promise.all([
    db.from('conversations')
      .select('id, user_id, character_id, last_message_at, characters(id, name, age, avatar_url), profiles(id, display_name, user_code, age, points, subscription_status, subscription_plan)')
      .eq('id', params.id).single(),
    mq,
  ])
  if (!conv) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const [{ data: affection }, { data: memory }] = await Promise.all([
    db.from('user_characters').select('affection_points, affection_level, message_count, last_chat_at')
      .eq('user_id', conv.user_id).eq('character_id', conv.character_id).maybeSingle(),
    db.from('user_character_memories').select('memory_text, updated_at')
      .eq('user_id', conv.user_id).eq('character_id', conv.character_id).maybeSingle(),
  ])

  return NextResponse.json({
    conversation: conv,
    // 有料メディアの URL は message_media にあるので、管理画面向けに metadata に戻す
    messages: (msgs ?? []).reverse().map(({ message_media, ...m }) => {
      const media = (Array.isArray(message_media) ? message_media[0] : message_media) as { url: string; kind: string } | null | undefined
      return media ? { ...m, metadata: { ...(m.metadata ?? {}), [media.kind === 'video' ? 'video_url' : 'image_url']: media.url } } : m
    }),
    hasMore: (msgs?.length ?? 0) === 300,
    affection,
    memory,
  })
}
