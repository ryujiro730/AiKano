import Link from 'next/link'
import Image from 'next/image'
import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClientStatic } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// プレゼントのお礼写真（character_item_photos）の一覧。キャラを選ぶと、アイテムごとに送られる写真を並べる
export default async function ItemPhotosPage({ searchParams }: { searchParams: { c?: string } }) {
  noStore()
  const db = createAdminClientStatic()
  const [{ data: characters }, { data: items }, { data: counts }] = await Promise.all([
    db.from('characters').select('id, name, avatar_url').eq('is_active', true).order('sort_order'),
    db.from('items').select('id, name, image_url, price_points, is_active').order('sort_order').order('created_at'),
    db.from('character_item_photos').select('character_id').limit(5000),
  ])
  const perChar = new Map<string, number>()
  for (const r of counts ?? []) perChar.set(r.character_id, (perChar.get(r.character_id) ?? 0) + 1)

  const selected = (characters ?? []).find(c => c.id === searchParams.c) ?? characters?.[0]
  const { data: photos } = selected
    ? await db.from('character_item_photos').select('item_id, url').eq('character_id', selected.id).limit(500)
    : { data: [] }
  const photoByItem = new Map((photos ?? []).map(p => [p.item_id as string, p.url as string]))
  const activeItems = (items ?? []).filter(i => i.is_active)
  const missing = activeItems.filter(i => !photoByItem.has(i.id)).length

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-lg font-bold mb-1">プレゼント写真</h1>
      <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
        アイテムを贈ると、キャラがそのアイテムを持った写真を送る（有効なアイテム {activeItems.length} 種）
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {(characters ?? []).map(c => {
          const on = c.id === selected?.id
          return (
            <Link key={c.id} href={`/admin/item-photos?c=${c.id}`} prefetch={false}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-sm border"
              style={{ borderColor: on ? 'var(--color-primary)' : 'var(--color-border)', color: on ? 'var(--color-primary)' : undefined, fontWeight: on ? 600 : 400 }}>
              <span className="relative w-6 h-6 rounded-full overflow-hidden">
                <Image src={c.avatar_url} alt="" fill className="object-cover" sizes="24px" />
              </span>
              {c.name}
              <span className="text-xs tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{perChar.get(c.id) ?? 0}</span>
            </Link>
          )
        })}
      </div>

      {selected && missing > 0 && (
        <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>{selected.name} は {missing} 種の写真がない（贈られたらガチャ写真から送る）</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {activeItems.map(item => {
          const url = photoByItem.get(item.id)
          return (
            <div key={item.id} className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
              {url ? (
                <a href={url} target="_blank" rel="noreferrer" className="relative block" style={{ aspectRatio: '3 / 4' }}>
                  <Image src={url} alt={item.name} fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" />
                </a>
              ) : (
                <div className="flex items-center justify-center text-xs" style={{ aspectRatio: '3 / 4', background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>写真なし</div>
              )}
              <div className="flex items-center gap-2 p-2">
                {item.image_url && (
                  <span className="relative w-7 h-7 flex-shrink-0 rounded overflow-hidden">
                    <Image src={item.image_url} alt="" fill className="object-cover" sizes="28px" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-medium truncate">{item.name}</p>
                  <p className="text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{item.price_points.toLocaleString()}pt</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
