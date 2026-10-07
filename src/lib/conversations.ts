import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * ユーザー×キャラの会話を取得し、なければ作る。
 * 「探す→なければ insert」だと同時実行（二重タップ・cron の重なり）で一意制約違反になるため、
 * insert は ON CONFLICT DO NOTHING（upsert + ignoreDuplicates）で行い、エラーを出さない。
 */
export async function getOrCreateConversation(
  db: SupabaseClient,
  userId: string,
  characterId: string,
  fields: Record<string, unknown> = {},
): Promise<{ id: string; created: boolean } | null> {
  const find = async () => {
    const { data } = await db.from('conversations').select('id')
      .eq('user_id', userId).eq('character_id', characterId).maybeSingle()
    return data?.id as string | undefined
  }

  const existing = await find()
  if (existing) return { id: existing, created: false }

  const { data: inserted, error } = await db.from('conversations')
    .upsert({ user_id: userId, character_id: characterId, ...fields }, { onConflict: 'user_id,character_id', ignoreDuplicates: true })
    .select('id')
  if (error) {
    console.error('[getOrCreateConversation]', error.message)
    return null
  }
  if (inserted && inserted.length > 0) return { id: inserted[0].id as string, created: true }

  // 同時に別の処理が先に作っていた
  const raced = await find()
  return raced ? { id: raced, created: false } : null
}
