import type { SupabaseClient } from '@supabase/supabase-js'
import { IMAGE_UNLOCK_POINTS, VIDEO_UNLOCK_POINTS } from './pricing'

/**
 * 有料メディア（キャラが送る画像・動画、アルバム写真）。
 * - URL は message_media / character_photos にだけ置き、未解錠のユーザーには返さない
 * - 解錠は media_unlocks に URL 単位で記録（チャットで解錠した写真はアルバムでも見られる）
 * - キャラのアイコン写真は無料
 */

export type MediaKind = 'image' | 'video'

export const MEDIA_PRICE: Record<MediaKind, number> = { image: IMAGE_UNLOCK_POINTS, video: VIDEO_UNLOCK_POINTS }

export type MessageMediaView = { kind: MediaKind; price: number; unlocked: boolean; url: string | null }

/** キャラ発言にメディアを付ける。URL は message_media に入れ、messages.metadata には目印だけ置く */
export async function attachMessageMedia(
  db: SupabaseClient,
  message: { conversation_id: string; content: string; metadata?: Record<string, unknown> | null; [k: string]: unknown },
  media: { url: string; kind: MediaKind; free?: boolean },
) {
  const { data: msg, error } = await db
    .from('messages')
    .insert({ ...message, sender_role: 'character', metadata: { ...(message.metadata ?? {}), media: media.kind } })
    .select()
    .single()
  if (error || !msg) return { msg: null, error }
  const { error: mediaErr } = await db.from('message_media').insert({
    message_id: msg.id, url: media.url, kind: media.kind, price: media.free ? 0 : MEDIA_PRICE[media.kind],
  })
  if (mediaErr) {
    await db.from('messages').delete().eq('id', msg.id)
    return { msg: null, error: mediaErr }
  }
  return { msg, error: null }
}

/** ユーザーが解錠済みの URL */
export async function getUnlockedUrls(db: SupabaseClient, userId: string, urls: string[]) {
  if (urls.length === 0) return new Set<string>()
  // URL を in() で渡すとクエリ文字列が長くなりすぎるので、本人の解錠記録を丸ごと取る（1人あたり多くない）
  const { data } = await db.from('media_unlocks').select('url').eq('user_id', userId).limit(5000)
  const want = new Set(urls)
  return new Set((data ?? []).map(r => r.url as string).filter(u => want.has(u)))
}

/** 会話中のメディア付きキャラ発言を、閲覧ユーザー向けに（未解錠なら URL なしで）返す */
export async function getConversationMedia(db: SupabaseClient, userId: string, conversationId: string) {
  const { data } = await db
    .from('message_media')
    .select('message_id, url, kind, price, messages!inner(conversation_id)')
    .eq('messages.conversation_id', conversationId)
    .limit(1000)
  const rows = (data ?? []) as unknown as { message_id: string; url: string; kind: MediaKind; price: number }[]
  const unlocked = await getUnlockedUrls(db, userId, rows.filter(r => r.price > 0).map(r => r.url))
  const out: Record<string, MessageMediaView> = {}
  for (const r of rows) {
    const open = r.price === 0 || unlocked.has(r.url)
    out[r.message_id] = { kind: r.kind, price: r.price, unlocked: open, url: open ? r.url : null }
  }
  return out
}

/**
 * Supabase Storage の画像変換で極小サムネイルの URL を作る（拡大表示するとモザイクになる）。
 * Storage 以外の URL は null。
 */
export function tinyImageUrl(url: string, width = 16, height = 16) {
  const marker = '/storage/v1/object/public/'
  const i = url.indexOf(marker)
  if (i < 0) return null
  const base = url.slice(0, i) + '/storage/v1/render/image/public/' + url.slice(i + marker.length).split('?')[0]
  return `${base}?width=${width}&height=${height}&resize=cover&quality=40`
}
