import { createClient as createSupabaseClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js'

type Options = SupabaseClientOptions<'public'>

/**
 * サーバー側で使う Supabase クライアント（@supabase/supabase-js の createClient と同じ呼び方）。
 * 標準の autoRefreshToken: true のまま毎リクエスト作ると、トークン自動更新の仕組みがクライアントごとに残り、
 * 1回あたり約18KB ずつメモリが漏れる（本番が数時間ごとに heap out of memory で落ちていた原因。2026-10-15 計測）。
 * サーバーでは自動更新もセッション保存も要らないので必ず切る。サーバーのコードは supabase-js を直接 import せずこれを使う
 */
export function createClient(url: string, key: string, options: Options = {}): SupabaseClient {
  return createSupabaseClient(url, key, {
    ...options,
    auth: { ...options.auth, autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
  })
}
