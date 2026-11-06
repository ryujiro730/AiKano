export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { getOrBuildPreview } from '@/lib/media-preview'

export const fetchCache = 'force-no-store'

/**
 * GET /api/media/preview?m=<messageId> | ?p=<photoId> | ?v=<videoItemId>
 * 未解錠メディアのモザイク用サムネイル（6px 四方程度の極小画像）。元 URL はクライアントに渡さない。
 * 一度作ったものは行の preview 列に保存してあり、2回目からは画像変換をしない（lib/media-preview.ts）
 */
export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return new NextResponse(null, { status: 401 })
  const sp = req.nextUrl.searchParams
  const db = createAdminClient()

  let preview: string | null = null
  if (sp.get('m')) {
    const id = sp.get('m')!
    const { data } = await db
      .from('message_media')
      .select('url, kind, preview, messages!inner(conversations!inner(user_id))')
      .eq('message_id', id)
      .limit(1)
      .maybeSingle()
    const owner = (data as unknown as { messages?: { conversations?: { user_id?: string } } } | null)?.messages?.conversations?.user_id
    if (data && owner === user.id && data.kind === 'image') preview = await getOrBuildPreview(db, 'm', id, data.url, data.preview)
  } else if (sp.get('p')) {
    const id = sp.get('p')!
    const { data } = await db.from('character_photos').select('url, preview').eq('id', id).maybeSingle()
    if (data?.url) preview = await getOrBuildPreview(db, 'p', id, data.url, data.preview)
  } else if (sp.get('v')) {
    const id = sp.get('v')!
    const { data } = await db.from('video_items').select('thumbnail_url, preview').eq('id', id).maybeSingle()
    if (data?.thumbnail_url) preview = await getOrBuildPreview(db, 'v', id, data.thumbnail_url, data.preview)
  }

  const match = preview?.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return new NextResponse(null, { status: 404 })
  return new NextResponse(Buffer.from(match[2], 'base64'), {
    headers: { 'Content-Type': match[1], 'Cache-Control': 'private, max-age=604800' },
  })
}
