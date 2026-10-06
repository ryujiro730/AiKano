export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getLocale } from '@/i18n/server'
import { localizedText } from '@/lib/content-i18n'

// GET /api/items - 公開中のアイテム・カテゴリ（アイテムがあるものだけ）・ユーザーの持ち物
export async function GET() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const user = session.user
  const locale = getLocale()

  const [{ data: items }, { data: categories }, { data: inventory }, { data: profile }] = await Promise.all([
    supabase.from('items').select('*, category:item_categories(*)').eq('is_active', true).order('sort_order').order('created_at'),
    supabase.from('item_categories').select('*').order('sort_order').order('created_at'),
    supabase.from('user_items').select('*, item:items(*, category:item_categories(*))').eq('user_id', user.id).gt('quantity', 0),
    supabase.from('profiles').select('points').eq('id', user.id).single(),
  ])

  const localize = (item: any) => item && {
    ...localizedText(item, locale, ['name', 'description']),
    category: item.category && localizedText(item.category, locale, ['name']),
  }
  const activeItems = (items ?? []).map(localize)
  const usedCategoryIds = new Set(activeItems.map((i: any) => i.category_id))

  return NextResponse.json({
    items: activeItems,
    categories: (categories ?? []).filter(c => usedCategoryIds.has(c.id)).map(c => localizedText(c, locale, ['name'])),
    inventory: (inventory ?? []).filter((r: any) => r.item?.is_active).map((r: any) => ({ ...r, item: localize(r.item) })),
    points: profile?.points ?? 0,
  })
}
