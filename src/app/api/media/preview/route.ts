export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { tinyImageUrl } from '@/lib/paid-media'

/**
 * GET /api/media/preview?m=<messageId> | ?p=<photoId> | ?v=<videoItemId>
 * 未解錠メディアのモザイク用サムネイル（最大 6×6px の極小画像）。元 URL はクライアントに渡さない。
 * 何の写真か分からない濃さにするため、サイズの上限はサーバーで固定する（w/h は最大 6）。
 */
export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return new NextResponse(null, { status: 401 })
  const sp = req.nextUrl.searchParams
  const w = clamp(Number(sp.get('w')) || MAX_SIDE)
  const h = clamp(Number(sp.get('h')) || MAX_SIDE)
  const db = createAdminClient()

  let url: string | null = null
  if (sp.get('m')) {
    const { data } = await db
      .from('message_media')
      .select('url, kind, messages!inner(conversations!inner(user_id))')
      .eq('message_id', sp.get('m')!)
      .limit(1)
      .maybeSingle()
    const owner = (data as unknown as { messages?: { conversations?: { user_id?: string } } } | null)?.messages?.conversations?.user_id
    if (data && owner === user.id && data.kind === 'image') url = data.url
  } else if (sp.get('p')) {
    const { data } = await db.from('character_photos').select('url').eq('id', sp.get('p')!).maybeSingle()
    url = data?.url ?? null
  } else if (sp.get('v')) {
    const { data } = await db.from('video_items').select('thumbnail_url').eq('id', sp.get('v')!).maybeSingle()
    url = data?.thumbnail_url ?? null
  }

  const tiny = url ? tinyImageUrl(url, w, h) : null
  if (!tiny) return new NextResponse(null, { status: 404 })
  const res = await fetch(tiny, { cache: 'no-store' }).catch(() => null)
  if (!res?.ok) return new NextResponse(null, { status: 404 })
  return new NextResponse(await res.arrayBuffer(), {
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'image/png',
      'Cache-Control': 'private, max-age=86400',
    },
  })
}

const MAX_SIDE = 6

function clamp(n: number) {
  return Math.max(3, Math.min(MAX_SIDE, Math.round(n)))
}
