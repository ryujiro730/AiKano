import type { SupabaseClient } from '@supabase/supabase-js'
import type { Locale } from '@/i18n/config'
import { localizedText } from './content-i18n'

/**
 * キャラからのおねだり：会話の途中でたまに「〇〇が欲しいな」と言い、チャットにそのアイテムを贈るボタンを出す。
 * しつこくならないように、仲良くなってから・確率・会話ごとのクールダウンで絞る。
 */
const WISH_CHANCE = 0.15
const WISH_COOLDOWN_HOURS = 48
const WISH_MIN_MESSAGES = 8
const WISH_MIN_LEVEL = 2
const WISH_MIN_PRICE = 30
/** 好感度レベルごとにおねだりする価格の上限（仲良くなるほど高いものをねだる） */
const WISH_MAX_PRICE_BY_LEVEL: Record<number, number> = { 2: 150, 3: 400, 4: 800, 5: 1500, 6: 3000, 7: 1_000_000 }

export type WishItem = { id: string; name: string; image_url: string | null; price_points: number }

export async function pickWishItem(
  db: SupabaseClient,
  opts: { userId: string; characterId: string; conversationId: string; level: number; messageCount: number; locale: Locale },
): Promise<WishItem | null> {
  const { conversationId, level, messageCount, locale } = opts
  if (level < WISH_MIN_LEVEL || messageCount < WISH_MIN_MESSAGES || Math.random() >= WISH_CHANCE) return null

  const since = new Date(Date.now() - WISH_COOLDOWN_HOURS * 3600_000).toISOString()
  const [{ data: recentWish }, { data: items }, { data: gifted }] = await Promise.all([
    db.from('messages').select('id').eq('conversation_id', conversationId).eq('sender_role', 'character')
      .not('metadata->>wish_item_id', 'is', null).gte('created_at', since).limit(1),
    db.from('items').select('id, name, image_url, price_points, i18n').eq('is_active', true)
      .gte('price_points', WISH_MIN_PRICE).lte('price_points', WISH_MAX_PRICE_BY_LEVEL[Math.min(level, 7)] ?? 0).limit(500),
    db.from('messages').select('metadata').eq('conversation_id', conversationId).eq('sender_role', 'user')
      .not('metadata->>item_id', 'is', null).limit(500),
  ])
  if (recentWish?.length || !items?.length) return null

  // まだ贈ってもらっていないものを優先
  const giftedIds = new Set((gifted ?? []).map(r => (r.metadata as { item_id?: string } | null)?.item_id))
  const fresh = items.filter(i => !giftedIds.has(i.id))
  const pool = fresh.length > 0 ? fresh : items
  const picked = pool[Math.floor(Math.random() * pool.length)]
  const name = localizedText(picked, locale, ['name']).name as string
  return { id: picked.id, name, image_url: picked.image_url, price_points: picked.price_points }
}
