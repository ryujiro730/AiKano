export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { logUserAction } from '@/lib/user-action-log'

// 管理画面: ユーザーのBAN / 解除（Supabase Auth のBAN。ログイン・セッション更新ができなくなる）
export async function POST(req: Request) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res

  const { userId, ban, reason } = await req.json().catch(() => ({}))
  if (!userId || typeof ban !== 'boolean') return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
  if (userId === auth.adminId) return NextResponse.json({ error: '自分自身はBANできません' }, { status: 400 })

  const { data: target } = await auth.db.from('profiles').select('role').eq('id', userId).single()
  if (target?.role === 'admin') return NextResponse.json({ error: '管理者はBANできません' }, { status: 400 })

  const { data, error } = await auth.db.auth.admin.updateUserById(userId, { ban_duration: ban ? '876000h' : 'none' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await logUserAction(auth.db, userId, 'admin_ban', { action: ban ? 'BAN' : '解除', reason: reason || undefined })
  return NextResponse.json({ ok: true, banned_until: data.user.banned_until ?? null })
}
