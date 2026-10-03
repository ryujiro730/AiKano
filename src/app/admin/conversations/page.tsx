import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { unstable_noStore as noStore } from 'next/cache'
import { serviceDb } from '@/lib/admin-auth'

const PAGE_SIZE = 50

type Row = {
  id: string; last_message_at: string | null
  user_id: string; display_name: string | null; user_code: string
  character_id: string | null; character_name: string | null; avatar_url: string | null
  user_messages: number; total_messages: number
  last_content: string | null; last_sender: string | null
  affection_level: number | null; total_charged: number
}

// 管理画面: 会話一覧（閲覧用。AIが返信するので「未返信」の概念はない）
export default async function AdminConversationsPage({ searchParams }: {
  searchParams: { q?: string; character?: string; payers?: string; page?: string }
}) {
  noStore()
  const db = serviceDb()
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10))

  const [{ data: rows, error }, { data: characters }] = await Promise.all([
    db.rpc('admin_conversation_list', {
      p_character_id: searchParams.character || null,
      p_query: searchParams.q?.trim() || null,
      p_payers_only: searchParams.payers === '1',
      p_limit: PAGE_SIZE + 1,
      p_offset: (page - 1) * PAGE_SIZE,
    }),
    db.from('characters').select('id, name').eq('is_active', true).order('sort_order'),
  ])

  const list = ((rows ?? []) as Row[]).slice(0, PAGE_SIZE)
  const hasNext = (rows?.length ?? 0) > PAGE_SIZE
  const qs = (p: number) => {
    const s = new URLSearchParams()
    if (searchParams.q) s.set('q', searchParams.q)
    if (searchParams.character) s.set('character', searchParams.character)
    if (searchParams.payers) s.set('payers', searchParams.payers)
    s.set('page', String(p))
    return `/admin/conversations?${s}`
  }

  return (
    <div className="max-w-5xl">
      <h1 className="text-xl font-bold mb-4">会話</h1>

      <form className="card p-3 mb-4 flex flex-wrap gap-2 items-center" method="get">
        <input name="q" defaultValue={searchParams.q} placeholder="ユーザー名・ID・メール" className="input-warm px-3 py-1.5 text-sm flex-1 min-w-[180px]" />
        <select name="character" defaultValue={searchParams.character ?? ''} className="input-warm px-2 py-1.5 text-sm">
          <option value="">全キャラ</option>
          {(characters ?? []).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <label className="flex items-center gap-1.5 text-sm px-1">
          <input type="checkbox" name="payers" value="1" defaultChecked={searchParams.payers === '1'} />課金ユーザーのみ
        </label>
        <button className="btn-primary px-4 py-1.5 text-sm">絞り込む</button>
      </form>

      {error && <p className="text-sm text-red-500 mb-3">エラー: {error.message}</p>}

      <div className="card overflow-hidden">
        {list.length === 0 ? (
          <p className="text-sm text-center py-10" style={{ color: 'var(--color-text-muted)' }}>該当する会話はありません</p>
        ) : list.map((r, i) => (
          <Link key={r.id} href={`/admin/conversations/${r.id}`}
            className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-surface-2)]"
            style={i > 0 ? { borderTop: '1px solid var(--color-border)' } : undefined}>
            {r.avatar_url
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={r.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" style={{ objectPosition: 'top center' }} />
              : <div className="w-10 h-10 rounded-full flex-shrink-0" style={{ background: 'var(--color-surface-2)' }} />}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold truncate">{r.display_name ?? '未設定'}</span>
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>× {r.character_name}</span>
                {r.total_charged > 0 && <span className="text-[10px] font-bold px-1 rounded" style={{ background: '#f0fdf4', color: '#16a34a' }}>¥{Number(r.total_charged).toLocaleString()}</span>}
                {r.affection_level ? <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Lv.{r.affection_level}</span> : null}
              </div>
              <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {r.last_sender === 'user' ? 'ユーザー: ' : 'AI: '}{r.last_content}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                {r.last_message_at ? formatDistanceToNow(new Date(r.last_message_at), { addSuffix: true, locale: ja }) : ''}
              </p>
              <p className="text-[11px] tabular-nums" style={{ color: 'var(--color-text-muted)' }}>送信 {r.user_messages}通</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-between mt-3 text-sm">
        {page > 1 ? <Link href={qs(page - 1)} className="font-semibold">← 前へ</Link> : <span />}
        {hasNext ? <Link href={qs(page + 1)} className="font-semibold">次へ →</Link> : <span />}
      </div>
    </div>
  )
}
