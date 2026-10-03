import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { serviceDb } from '@/lib/admin-auth'
import { LabelFilter } from '@/components/admin/LabelFilter'

const PAGE_SIZE = 50

type SP = Record<string, string | string[] | undefined>
type Row = {
  id: string; user_code: string; email: string; display_name: string | null; age: number | null; gender: string | null
  points: number; bonus_points: number | null; total_charged: number; purchase_count: number; last_payment_at: string | null
  last_login_at: string | null; created_at: string; utm_source: string | null; referral_source: string | null
  subscription_status: string | null; subscription_plan: string | null; total_count: number
}

const s = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''
const n = (v: string | string[] | undefined) => (s(v) ? parseInt(s(v), 10) : null)
// 日付入力（JST の日付）を timestamptz に変換。to は当日の終わりまで含める
const jst = (v: string, end = false) => (v ? `${v}T${end ? '23:59:59' : '00:00:00'}+09:00` : null)
const ago = (d: string | null) => (d ? formatDistanceToNow(new Date(d), { addSuffix: true, locale: ja }) : '—')
const GENDER: Record<string, string> = { male: '男性', female: '女性', other: 'その他' }

// 管理画面: ユーザー一覧（絞り込み・並び替え・ページングはすべて DB 関数 search_admin_users で処理）
export default async function AdminUsersPage({ searchParams }: { searchParams: SP }) {
  noStore()
  const db = serviceDb()
  const page = Math.max(1, n(searchParams.page) ?? 1)
  const labelIds = ([] as string[]).concat(searchParams.label_ids ?? []).filter(Boolean)

  const [{ data: labels }, { data, error }] = await Promise.all([
    db.from('admin_labels').select('id, name, color').order('name'),
    db.rpc('search_admin_users', {
      p_q: s(searchParams.q) || null,
      p_gender: s(searchParams.gender) || null,
      p_age_min: n(searchParams.age_min),
      p_age_max: n(searchParams.age_max),
      p_registered_from: jst(s(searchParams.registered_from)),
      p_registered_to: jst(s(searchParams.registered_to), true),
      p_login_from: jst(s(searchParams.login_from)),
      p_login_to: jst(s(searchParams.login_to), true),
      p_payment_from: jst(s(searchParams.payment_from)),
      p_payment_to: jst(s(searchParams.payment_to), true),
      p_charged_min: n(searchParams.charged_min),
      p_charged_max: n(searchParams.charged_max),
      p_points_min: n(searchParams.points_min),
      p_points_max: n(searchParams.points_max),
      p_payer: s(searchParams.payer) || null,
      p_member: s(searchParams.member) || null,
      p_utm_source: s(searchParams.utm_source) || null,
      p_label_ids: labelIds.length ? labelIds : null,
      p_label_mode: s(searchParams.label_mode) || 'or',
      p_sort: s(searchParams.sort) || 'created_at',
      p_order: s(searchParams.order) || 'desc',
      p_limit: PAGE_SIZE,
      p_offset: (page - 1) * PAGE_SIZE,
    }),
  ])

  const rows = (data ?? []) as Row[]
  const total = Number(rows[0]?.total_count ?? 0)
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const qs = (p: number) => {
    const q = new URLSearchParams()
    for (const [k, v] of Object.entries(searchParams)) {
      if (k === 'page' || v === undefined) continue
      for (const x of ([] as string[]).concat(v)) if (x) q.append(k, x)
    }
    q.set('page', String(p))
    return `/admin/users?${q}`
  }
  const advancedOpen = ['age_min', 'age_max', 'registered_from', 'registered_to', 'login_from', 'login_to', 'payment_from', 'payment_to', 'charged_min', 'charged_max', 'points_min', 'points_max', 'utm_source', 'gender']
    .some(k => s(searchParams[k])) || labelIds.length > 0

  const input = 'input-warm w-full px-2.5 py-1.5 text-sm'
  const Range = ({ label, a, b, type = 'number' }: { label: string; a: string; b: string; type?: string }) => (
    <div>
      <label className="text-[11px] mb-1 block" style={{ color: 'var(--color-text-muted)' }}>{label}</label>
      <div className="flex items-center gap-1.5">
        <input type={type} name={a} defaultValue={s(searchParams[a])} className={input} />
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>〜</span>
        <input type={type} name={b} defaultValue={s(searchParams[b])} className={input} />
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl">
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="text-xl font-bold">ユーザー</h1>
        <p className="text-sm tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{total.toLocaleString()}人</p>
      </div>

      <form method="GET" className="card p-4 mb-4 space-y-3">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[220px]">
            <label className="text-[11px] mb-1 block" style={{ color: 'var(--color-text-muted)' }}>名前・ユーザーID・メール</label>
            <input name="q" defaultValue={s(searchParams.q)} className={input} />
          </div>
          <div>
            <label className="text-[11px] mb-1 block" style={{ color: 'var(--color-text-muted)' }}>課金</label>
            <select name="payer" defaultValue={s(searchParams.payer)} className={input}>
              <option value="">すべて</option><option value="payer">課金した人</option><option value="nonpayer">未課金</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] mb-1 block" style={{ color: 'var(--color-text-muted)' }}>会員</label>
            <select name="member" defaultValue={s(searchParams.member)} className={input}>
              <option value="">すべて</option><option value="member">会員</option><option value="nonmember">非会員</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] mb-1 block" style={{ color: 'var(--color-text-muted)' }}>並び順</label>
            <div className="flex gap-1">
              <select name="sort" defaultValue={s(searchParams.sort) || 'created_at'} className={input}>
                <option value="created_at">登録日時</option><option value="last_login_at">最終ログイン</option>
                <option value="last_payment_at">最終課金</option><option value="total_charged">累計課金額</option>
                <option value="points">ポイント残高</option><option value="age">年齢</option>
              </select>
              <select name="order" defaultValue={s(searchParams.order) || 'desc'} className={input}>
                <option value="desc">降順</option><option value="asc">昇順</option>
              </select>
            </div>
          </div>
          <button className="btn-primary px-5 py-1.5 text-sm">検索</button>
          <Link href="/admin/users" className="text-sm px-2 py-1.5" style={{ color: 'var(--color-text-muted)' }}>クリア</Link>
        </div>

        <details open={advancedOpen}>
          <summary className="text-xs font-semibold cursor-pointer" style={{ color: 'var(--color-text-muted)' }}>詳しい条件</summary>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
            <div>
              <label className="text-[11px] mb-1 block" style={{ color: 'var(--color-text-muted)' }}>性別</label>
              <select name="gender" defaultValue={s(searchParams.gender)} className={input}>
                <option value="">すべて</option><option value="male">男性</option><option value="female">女性</option><option value="other">その他</option>
              </select>
            </div>
            <Range label="年齢" a="age_min" b="age_max" />
            <div>
              <label className="text-[11px] mb-1 block" style={{ color: 'var(--color-text-muted)' }}>流入元（utm_source）</label>
              <input name="utm_source" defaultValue={s(searchParams.utm_source)} className={input} placeholder="例: matchkoi" />
            </div>
            <Range label="登録日" a="registered_from" b="registered_to" type="date" />
            <Range label="最終ログイン日" a="login_from" b="login_to" type="date" />
            <Range label="最終課金日" a="payment_from" b="payment_to" type="date" />
            <Range label="累計課金額（円）" a="charged_min" b="charged_max" />
            <Range label="ポイント残高" a="points_min" b="points_max" />
          </div>
          <div className="mt-3">
            <LabelFilter labels={labels ?? []} selectedIds={labelIds} mode={s(searchParams.label_mode) || 'or'} />
          </div>
        </details>
      </form>

      {error && <p className="text-sm text-red-500 mb-3">エラー: {error.message}</p>}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left" style={{ color: 'var(--color-text-muted)' }}>
              {['ユーザー', '性別・年齢', '残高', '累計課金', '会員', '最終ログイン', '登録', '流入元'].map(h => (
                <th key={h} className="px-3 py-2.5 text-xs font-semibold whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-10" style={{ color: 'var(--color-text-muted)' }}>該当するユーザーはいません</td></tr>
            ) : rows.map(u => {
              const member = u.subscription_status === 'active' || u.subscription_status === 'trialing'
              return (
                <tr key={u.id} className="hover:bg-[var(--color-surface-2)]" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <td className="px-3 py-2">
                    <Link href={`/admin/users/${u.id}`} className="font-semibold hover:underline">{u.display_name ?? '未設定'}</Link>
                    <p className="text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>{u.user_code}</p>
                  </td>
                  <td className="px-3 whitespace-nowrap">{GENDER[u.gender ?? ''] ?? '—'}{u.age ? ` · ${u.age}歳` : ''}</td>
                  <td className="px-3 tabular-nums whitespace-nowrap">{(u.points ?? 0).toLocaleString()}pt</td>
                  <td className="px-3 tabular-nums whitespace-nowrap">
                    {u.total_charged > 0 ? <span className="font-semibold" style={{ color: '#16a34a' }}>¥{Number(u.total_charged).toLocaleString()}</span> : '—'}
                    {u.purchase_count > 0 && <span className="text-[11px] ml-1" style={{ color: 'var(--color-text-muted)' }}>{u.purchase_count}回</span>}
                  </td>
                  <td className="px-3 whitespace-nowrap">{member ? <span className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>{u.subscription_plan}</span> : '—'}</td>
                  <td className="px-3 whitespace-nowrap text-xs">{ago(u.last_login_at)}</td>
                  <td className="px-3 whitespace-nowrap text-xs">{ago(u.created_at)}</td>
                  <td className="px-3 whitespace-nowrap text-xs" style={{ color: 'var(--color-text-muted)' }}>{u.utm_source ?? u.referral_source ?? '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm">
        {page > 1 ? <Link href={qs(page - 1)} className="font-semibold">← 前へ</Link> : <span />}
        <span className="tabular-nums" style={{ color: 'var(--color-text-muted)' }}>{page} / {pages}ページ</span>
        {page < pages ? <Link href={qs(page + 1)} className="font-semibold">次へ →</Link> : <span />}
      </div>
    </div>
  )
}
