/**
 * プレゼントのお礼写真のぼかしプレビュー（character_item_photos.preview、095）が空のものに入れる
 *   npx tsx --env-file=.env.local scripts/backfill-item-teasers.ts
 * 入れ忘れがあっても /api/items/teaser が表示時に作るので、再実行は不要。
 */
import { createClient } from '@supabase/supabase-js'
import { buildTeaserPreview } from '../src/lib/media-preview'

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  const { data } = await db.from('character_item_photos').select('character_id, item_id, url').is('preview', null).limit(5000)
  const rows = data ?? []
  let done = 0
  for (let i = 0; i < rows.length; i += 8) {
    await Promise.all(rows.slice(i, i + 8).map(async r => {
      const preview = await buildTeaserPreview(r.url)
      if (!preview) return
      await db.from('character_item_photos').update({ preview }).eq('character_id', r.character_id).eq('item_id', r.item_id)
      done++
    }))
  }
  console.log({ found: rows.length, done })
}

main()
