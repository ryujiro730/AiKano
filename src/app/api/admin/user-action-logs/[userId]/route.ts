export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

// ユーザーのアクションログ（新しい順）。?limit=（最大2000）&before=ISO日時 でページング
export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') ?? '500'), 2000)
  const before = req.nextUrl.searchParams.get('before')

  let q = auth.db
    .from('user_action_logs')
    .select('id, action_type, page_path, metadata, created_at, points_balance')
    .eq('user_id', params.userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (before) q = q.lt('created_at', before)
  const types = req.nextUrl.searchParams.get('types')
  if (types) q = q.in('action_type', types.split(',').filter(Boolean).slice(0, 50))

  const { data, error } = await q
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ logs: data ?? [], hasMore: (data?.length ?? 0) === limit })
}
