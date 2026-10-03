export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

// ユーザーの行動タイムライン（新しい順）。
// 行動ログ＋送信メッセージ＋ポイント取引＋ログインを DB 関数 admin_user_timeline で合成する。
// ?limit=（最大1000）&before=ISO日時 でページング、?types=a,b で種類を絞り込み
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res

  const sp = req.nextUrl.searchParams
  const limit = Math.min(parseInt(sp.get('limit') ?? '300'), 1000)
  const types = sp.get('types')?.split(',').filter(Boolean).slice(0, 60)

  const { data, error } = await auth.db.rpc('admin_user_timeline', {
    p_user_id: params.userId,
    p_before: sp.get('before') || null,
    p_types: types?.length ? types : null,
    p_limit: limit,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ logs: data ?? [], hasMore: (data?.length ?? 0) === limit })
}
