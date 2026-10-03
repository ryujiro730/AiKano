import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { serviceDb } from '@/lib/admin-auth'
import { INTERNAL_EMAILS } from '@/lib/internal-accounts'
import { RefreshOnMount } from '@/components/RefreshOnMount'

type PeriodStats = { registrations: number; senders: number; messages: number; revenue: number; payers: number; new_members: number }
type Overview = {
  periods: Record<'today' | 'yesterday' | 'week', PeriodStats>
  totals: { users: number; members: number; payers: number }
  todo: { bank_transfers: number; inquiries: number; promo_submissions: number }
  recent_purchases: { user_id: string; display_name: string | null; price_yen: number | null; description: string; created_at: string }[]
  recent_signups: { id: string; display_name: string | null; age: number | null; utm_source: string | null; referral_source: string | null; created_at: string }[]
}

const METRICS: { key: keyof PeriodStats; label: string; yen?: boolean }[] = [
  { key: 'registrations', label: '新規登録' },
  { key: 'senders', label: '送信したユーザー' },
  { key: 'messages', label: '送信メッセージ' },
  { key: 'payers', label: '課金者' },
  { key: 'revenue', label: '売上', yen: true },
  { key: 'new_members', label: '新規会員' },
]
const ago = (d: string) => formatDistanceToNow(new Date(d), { addSuffix: true, locale: ja })

// 管理画面: 概要（AIが返信するので「未読」ではなく、売上と行動の数字を一目で見る）
export default async function AdminOverviewPage() {
  noStore()
  const db = serviceDb()
  const { data: internal } = await db.from('profiles').select('id').in('email', [...INTERNAL_EMAILS])
  const { data, error } = await db.rpc('admin_overview', { p_exclude_ids: (internal ?? []).map(p => p.id as string) })
  if (error || !data) return <p className="text-sm text-red-500">集計の取得に失敗しました: {error?.message}</p>
  const o = data as Overview

  const todo = [
    { label: '銀行振込の承認待ち', n: o.todo.bank_transfers, href: '/admin/bank-transfers' },
    { label: '未対応のお問い合わせ', n: o.todo.inquiries, href: '/admin/inquiries' },
    { label: 'プロモ申請', n: o.todo.promo_submissions, href: '/admin/promo-submissions' },
  ].filter(t => t.n > 0)

  return (
    <div className="max-w-5xl space-y-5">
      <RefreshOnMount />
      <div className="flex items-baseline justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold">概要</h1>
        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          ユーザー {o.totals.users.toLocaleString()}人 · 課金者 {o.totals.payers}人 · 会員 {o.totals.members}人（社内アカウント除く）
        </p>
      </div>

      {todo.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {todo.map(t => (
            <Link key={t.href} href={t.href} className="text-sm font-semibold px-3 py-2 rounded-lg" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>
              {t.label} <span className="tabular-nums">{t.n}件</span> →
            </Link>
          ))}
        </div>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: 'var(--color-text-muted)' }}>
              <th className="text-left font-semibold px-4 py-2.5" />
              <th className="text-right font-semibold px-4">今日</th>
              <th className="text-right font-semibold px-4">昨日</th>
              <th className="text-right font-semibold px-4">直近7日</th>
            </tr>
          </thead>
          <tbody>
            {METRICS.map(m => (
              <tr key={m.key} style={{ borderTop: '1px solid var(--color-border)' }}>
                <td className="px-4 py-2.5 font-semibold whitespace-nowrap">{m.label}</td>
                {(['today', 'yesterday', 'week'] as const).map(p => {
                  const v = Number(o.periods[p][m.key] ?? 0)
                  return <td key={p} className="text-right px-4 tabular-nums">{m.yen ? `¥${v.toLocaleString()}` : v.toLocaleString()}</td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card p-4">
          <h2 className="text-xs font-bold mb-2" style={{ color: 'var(--color-text-muted)' }}>最近の課金</h2>
          {o.recent_purchases.length === 0 ? <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>まだありません</p> : o.recent_purchases.map((r, i) => (
            <Link key={i} href={`/admin/users/${r.user_id}`} className="flex justify-between gap-3 py-1.5 text-sm hover:underline">
              <span className="truncate">{r.display_name ?? '未設定'} <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{r.description}</span></span>
              <span className="flex-shrink-0 tabular-nums">¥{(r.price_yen ?? 0).toLocaleString()} <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{ago(r.created_at)}</span></span>
            </Link>
          ))}
        </div>
        <div className="card p-4">
          <h2 className="text-xs font-bold mb-2" style={{ color: 'var(--color-text-muted)' }}>最近の登録</h2>
          {o.recent_signups.map(r => (
            <Link key={r.id} href={`/admin/users/${r.id}`} className="flex justify-between gap-3 py-1.5 text-sm hover:underline">
              <span className="truncate">{r.display_name ?? '未設定'}{r.age ? <span className="text-xs ml-1" style={{ color: 'var(--color-text-muted)' }}>{r.age}歳</span> : null}</span>
              <span className="flex-shrink-0 text-xs" style={{ color: 'var(--color-text-muted)' }}>{r.utm_source ?? r.referral_source ?? '直接'} · {ago(r.created_at)}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
