import type { SupabaseClient } from '@supabase/supabase-js'

/** そのキャラがそのアイテムを持っている写真（character_item_photos）。無ければ null */
export async function getGiftItemPhoto(db: SupabaseClient, characterId: string, itemId: string) {
  const { data } = await db.from('character_item_photos')
    .select('url')
    .eq('character_id', characterId)
    .eq('item_id', itemId)
    .maybeSingle()
  return (data?.url as string | undefined) ?? null
}
