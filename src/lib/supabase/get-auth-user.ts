import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'

/**
 * React cache() でリクエスト内でgetUser()を1度だけ実行する。
 * layout と page で両方呼んでも Auth サーバーへのリクエストは1回。
 * getUser() で確かめられなかったときに getSession() へ逃げてはいけない（Cookie を検証しないので、偽の Cookie で他人になれてしまう）。
 */
export const getAuthUser = cache(async () => {
  const supabase = createClient()
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) return user
  } catch { /* fall through */ }
  return null
})
