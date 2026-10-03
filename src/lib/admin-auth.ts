import { NextResponse } from 'next/server'
import { createClient as createAdminClient, type SupabaseClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'

export function serviceDb(): SupabaseClient {
  return createAdminClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

/**
 * 管理APIの認可。管理者なら { db, adminId } を、それ以外は返すべきレスポンスを返す。
 * 使い方: const auth = await requireAdmin(); if ('res' in auth) return auth.res
 */
export async function requireAdmin(): Promise<{ db: SupabaseClient; adminId: string } | { res: NextResponse }> {
  const user = await getAuthUser()
  if (!user) return { res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  const db = serviceDb()
  const { data: profile } = await db.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { res: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  return { db, adminId: user.id }
}
