export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { createAdminClient } from '@/lib/supabase/server'
import { isLocale, LOCALE_COOKIE } from '@/i18n/config'

// 表示言語の変更。Cookie と profiles.locale（自動同報・メール用）の両方を更新する
export async function POST(req: NextRequest) {
  const { locale } = await req.json().catch(() => ({}))
  if (!isLocale(locale)) return NextResponse.json({ error: 'invalid locale' }, { status: 400 })

  const user = await getAuthUser()
  if (user) await createAdminClient().from('profiles').update({ locale }).eq('id', user.id)

  const res = NextResponse.json({ ok: true })
  res.cookies.set(LOCALE_COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365, sameSite: 'lax' })
  return res
}
