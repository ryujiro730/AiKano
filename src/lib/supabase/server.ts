import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export function createClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

/**
 * service role クライアント（RLS・列権限をバイパス）。
 * 以前は @supabase/ssr + cookies で作っていたため、ログイン中ユーザーのセッションが付き
 * 実際には「そのユーザーの権限」で動いていた。065 で書き込み権限を絞ったことで破綻したため、
 * cookie を持たない純粋な service role クライアントに変更。ユーザーの特定は getAuthUser() で行うこと。
 */
export function createAdminClient() {
  return createAdminClientStatic()
}

// unstable_cache内など cookies() が使えない場所で使うservice roleクライアント
export function createAdminClientStatic() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )
}
