import type { SupabaseClient } from '@supabase/supabase-js'
import { tinyImageUrl } from './paid-media'
import type { PreviewKind } from './preview-src'

/**
 * 未解錠メディアのモザイク用極小画像（data URI）。
 * Supabase の画像変換は1枚あたり約1秒かかるので、一度作ったら行の preview 列に保存して使い回す（090）。
 * 写真一覧はページに直接埋め込み、無いものだけ /api/media/preview が作って保存する。
 */

/** 種類ごとの大きさ（何の写真か分からない粗さに固定） */
const SIZE: Record<PreviewKind, [number, number]> = { p: [6, 6], m: [6, 5], v: [6, 4] }

/** どの表のどの行か（m は message_id で引く） */
const SOURCE: Record<PreviewKind, { table: string; key: string; col: string }> = {
  p: { table: 'character_photos', key: 'id', col: 'url' },
  m: { table: 'message_media', key: 'message_id', col: 'url' },
  v: { table: 'video_items', key: 'id', col: 'thumbnail_url' },
}

/** 元画像から極小画像を作って data URI で返す */
export async function buildPreview(kind: PreviewKind, url: string): Promise<string | null> {
  const [w, h] = SIZE[kind]
  const tiny = tinyImageUrl(url, w, h)
  if (!tiny) return null
  // webp を頼むと png の半分以下になる（ページに埋め込むので小さいほうがよい）
  const res = await fetch(tiny, { cache: 'no-store', headers: { accept: 'image/webp' } }).catch(() => null)
  if (!res?.ok) return null
  const type = res.headers.get('content-type') ?? 'image/png'
  return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`
}

/**
 * プレゼントのお礼写真のちら見せ用（character_item_photos.preview、095）。
 * モザイクより少し大きい 24×36 にして、画面側でぼかす（何を持っているかの雰囲気だけ伝わる）
 */
export async function buildTeaserPreview(url: string): Promise<string | null> {
  const tiny = tinyImageUrl(url, 24, 36)
  if (!tiny) return null
  const res = await fetch(tiny, { cache: 'no-store', headers: { accept: 'image/webp' } }).catch(() => null)
  if (!res?.ok) return null
  const type = res.headers.get('content-type') ?? 'image/png'
  return `data:${type};base64,${Buffer.from(await res.arrayBuffer()).toString('base64')}`
}

/** 行の preview を読む（無ければ作って保存する）。元 URL は返さない */
export async function getOrBuildPreview(db: SupabaseClient, kind: PreviewKind, id: string, url: string, saved: string | null) {
  if (saved) return saved
  const preview = await buildPreview(kind, url)
  if (preview) {
    const { table, key } = SOURCE[kind]
    await db.from(table).update({ preview }).eq(key, id)
  }
  return preview
}

/** 既存の行にまとめて preview を入れる（scripts から使う） */
export async function backfillPreviews(db: SupabaseClient, kind: PreviewKind, limit = 1000) {
  const { table, key, col } = SOURCE[kind]
  const { data } = await db.from(table).select(`${key}, ${col}`).is('preview', null).not(col, 'is', null).limit(limit)
  let done = 0
  const rows = (data ?? []) as unknown as Record<string, string>[]
  for (let i = 0; i < rows.length; i += 8) {
    await Promise.all(rows.slice(i, i + 8).map(async r => {
      if (await getOrBuildPreview(db, kind, r[key], r[col], null)) done++
    }))
  }
  return { found: rows.length, done }
}
