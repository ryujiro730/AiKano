export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createAdminClient } from '@/lib/supabase/server'
import { buildTeaserPreview } from '@/lib/media-preview'

export const fetchCache = 'force-no-store'

const SHOW = 4

/**
 * GET /api/items/teaser?characterId=...
 * プレゼント画面の「贈るとこんな写真が届く」用。そのキャラのお礼写真から数枚を、ぼかし用の極小画像で返す（元 URL は返さない）
 */
export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const characterId = req.nextUrl.searchParams.get('characterId')
  if (!characterId) return NextResponse.json({ error: 'bad request' }, { status: 400 })

  const db = createAdminClient()
  const { data } = await db
    .from('character_item_photos')
    .select('item_id, url, preview, items!inner(name, image_url, is_active)')
    .eq('character_id', characterId)
    .eq('items.is_active', true)
    .limit(200)
  const rows = (data ?? []) as unknown as { item_id: string; url: string; preview: string | null; items: { name: string; image_url: string | null } }[]
  // 毎回ちがう写真を見せる
  const picked = rows.sort(() => Math.random() - 0.5).slice(0, SHOW)
  const photos = await Promise.all(picked.map(async r => {
    let preview = r.preview
    if (!preview) {
      preview = await buildTeaserPreview(r.url)
      if (preview) await db.from('character_item_photos').update({ preview }).eq('character_id', characterId).eq('item_id', r.item_id)
    }
    return { itemName: r.items.name, itemIcon: r.items.image_url, preview }
  }))
  return NextResponse.json({ total: rows.length, photos: photos.filter(p => p.preview) })
}
