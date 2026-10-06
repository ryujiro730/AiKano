export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { translateContent, CONTENT_CONTEXT } from '@/lib/content-translate'

const FIELDS = { items: ['name', 'description'], item_categories: ['name'], campaigns: ['catchphrase', 'description', 'cta_text'] } as const

// POST /api/admin/content-translate { table: 'items' | 'item_categories' | 'campaigns', id } — 保存した日本語を各言語に訳して i18n に入れる
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res
  const { table, id } = await req.json().catch(() => ({}))
  if (!(table in FIELDS) || typeof id !== 'string') return NextResponse.json({ error: 'bad request' }, { status: 400 })
  const t = table as keyof typeof FIELDS

  const { data: row } = await auth.db.from(t).select(FIELDS[t].join(',')).eq('id', id).single()
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const src = Object.fromEntries(FIELDS[t].map(f => [f, ((row as unknown as Record<string, string | null>)[f] ?? '')]))
  const i18n = await translateContent(src, CONTENT_CONTEXT[t])
  const { error } = await auth.db.from(t).update({ i18n }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, locales: Object.keys(i18n) })
}
