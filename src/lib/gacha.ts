import type { SupabaseClient } from '@supabase/supabase-js'
import { getActivePlan } from './plans'
import { GACHA_SINGLE_POINTS, GACHA_TEN_POINTS, GIFT_PHOTO_MIN_ITEM_POINTS } from './pricing'

/**
 * キャラごとの写真ガチャ。キャラのフォト（character_photos）がそのままガチャの中身になる。
 * - そのユーザーがまだ持っていない写真だけから、均等な確率で出る（重複なし。引き続ければ必ずそろう）
 * - 会員限定フォトは会員だけ、好感度レベル限定フォトはガチャに入れない（レベルのご褒美）
 * - 持っている＝ media_unlocks に URL がある（チャットで解錠した写真も含む）
 * コンプリート報酬は付けない（コンプガチャ規制）
 */

export const GACHA_PLANS = {
  1: GACHA_SINGLE_POINTS,
  10: GACHA_TEN_POINTS,
} as const
export type GachaCount = keyof typeof GACHA_PLANS

type PoolPhoto = { id: string; url: string }

/** ガチャの中身（ユーザーが引ける写真）と、そのうち持っていないもの */
export async function getGachaPool(db: SupabaseClient, userId: string, characterId: string) {
  const [{ data: photos }, { data: profile }, { data: owned }] = await Promise.all([
    db.from('character_photos').select('id, url, members_only, required_level').eq('character_id', characterId).order('order_index'),
    db.from('profiles').select('subscription_status, subscription_plan, subscription_period_end, role').eq('id', userId).single(),
    db.from('media_unlocks').select('url').eq('user_id', userId).limit(5000),
  ])
  const canSeeMembers = !!getActivePlan(profile) || profile?.role === 'admin'
  const ownedUrls = new Set((owned ?? []).map(r => r.url as string))
  const pool: PoolPhoto[] = (photos ?? [])
    .filter(p => !p.required_level && (canSeeMembers || !p.members_only))
    .map(p => ({ id: p.id as string, url: p.url as string }))
  const remaining = pool.filter(p => !ownedUrls.has(p.url))
  return { pool, remaining }
}

function shuffle<T>(arr: T[]) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * 持っていない写真を n 枚選んで持ち物（media_unlocks）に入れる。
 * 同時に引いて同じ写真を取り合った分は入らないので、実際に入った写真だけを返す。
 */
export async function grantRandomPhotos(db: SupabaseClient, userId: string, remaining: PoolPhoto[], n: number, pricePerPhoto: number) {
  const picked = shuffle(remaining).slice(0, n)
  if (picked.length === 0) return []
  const { data } = await db.from('media_unlocks')
    .upsert(picked.map(p => ({ user_id: userId, url: p.url, kind: 'image', price: pricePerPhoto })), { onConflict: 'user_id,url', ignoreDuplicates: true })
    .select('url')
  const inserted = new Set((data ?? []).map(r => r.url as string))
  return picked.filter(p => inserted.has(p.url))
}

/**
 * プレゼントのお礼写真：一定額（GIFT_PHOTO_MIN_ITEM_POINTS）以上のアイテムを贈ると、まだ持っていない写真を1枚無料でもらえる。
 * もらえる写真がなければ null（返事の文章だけになる）
 */
export async function grantGiftRewardPhoto(db: SupabaseClient, userId: string, characterId: string, itemId: string) {
  const { data: item } = await db.from('items').select('price_points').eq('id', itemId).maybeSingle()
  if (!item || item.price_points < GIFT_PHOTO_MIN_ITEM_POINTS) return null
  const { remaining } = await getGachaPool(db, userId, characterId)
  const [got] = await grantRandomPhotos(db, userId, remaining, 1, 0)
  return got?.url ?? null
}
