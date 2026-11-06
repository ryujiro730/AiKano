/**
 * モザイク用極小画像（preview 列）が空の行にまとめて入れる（090 適用後に1回実行）
 *   npx tsx --env-file=.env.local scripts/backfill-media-previews.ts
 * 入れ忘れがあっても /api/media/preview が初回表示時に作るので、再実行は不要。
 */
import { createClient } from '@supabase/supabase-js'
import { backfillPreviews } from '../src/lib/media-preview'

async function main() {
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
  for (const kind of ['p', 'v', 'm'] as const) {
    for (;;) {
      const r = await backfillPreviews(db, kind, 200)
      console.log(kind, r)
      if (r.found === 0 || r.done === 0) break
    }
  }
}

main()
