export const dynamic = 'force-dynamic'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { unstable_cache } from 'next/cache'
import Link from 'next/link'
import { INTERNAL_EMAILS } from '@/lib/internal-accounts'
import { RefreshOnMount } from '@/components/RefreshOnMount'

function adminDb() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

const getCachedExcludeIds = unstable_cache(
  async () => {
    const admin = adminDb()
    const { data } = await admin.from('profiles').select('id')
      .or(`role.in.(admin,staff,owner),email.in.(${INTERNAL_EMAILS.join(',')})`)
    return (data ?? []).map((p: any) => p.id) as string[]
  },
  ['analytics-exclude-ids'],
  { revalidate: 3600 },
)

const getCachedStats = unstable_cache(
  async (fromISO: string, toISO: string | null, period: string, excludeIds: string[]) => {
    const admin = adminDb()
    const { data, error } = await admin.rpc('get_analytics_stats', {
      p_from_iso: fromISO,
      p_to_iso: toISO,
      p_period: period,
      p_exclude_ids: excludeIds,
    })
    return { data: data as any[] | null, error }
  },
  ['analytics-stats'],
  { revalidate: 300 },
)

type Period = 'hourly' | 'daily' | 'monthly'
type SearchParams = { period?: string; month?: string; date?: string }

const JST_OFFSET = 9 * 60 * 60 * 1000

function toJST(date: Date): Date {
  return new Date(date.getTime() + JST_OFFSET)
}

function generateHourlyBuckets(dateStr: string, isToday: boolean): string[] {
  const buckets: string[] = []
  const nowJST = toJST(new Date())
  const maxHour = isToday ? nowJST.getUTCHours() : 23
  for (let h = 0; h <= maxHour; h++) {
    buckets.push(`${dateStr} ${String(h).padStart(2, '0')}:00`)
  }
  return buckets
}

function generateDailyBuckets(year: number, month: number): string[] {
  const daysInMonth = new Date(year, month, 0).getDate()
  const buckets: string[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    buckets.push(`${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }
  return buckets
}

const LAUNCH_YEAR = 2026
const LAUNCH_MONTH = 1

function generateMonthlyBuckets(): string[] {
  const buckets: string[] = []
  const nowJST = toJST(new Date())
  let y = LAUNCH_YEAR, m = LAUNCH_MONTH
  const endY = nowJST.getUTCFullYear()
  const endM = nowJST.getUTCMonth() + 1
  while (y < endY || (y === endY && m <= endM)) {
    buckets.push(`${y}-${String(m).padStart(2, '0')}`)
    m++; if (m > 12) { m = 1; y++ }
  }
  return buckets
}

function formatLabel(bucket: string, period: Period): string {
  if (period === 'hourly') return bucket.slice(5).replace('-', '/')
  if (period === 'daily') {
    const [, m, d] = bucket.split('-')
    return `${parseInt(m)}/${parseInt(d)}`
  }
  const [y, m] = bucket.split('-')
  return `${y}/${parseInt(m)}月`
}

function addMonth(year: number, month: number, delta: number): { year: number; month: number } {
  let m = month + delta
  let y = year
  while (m > 12) { m -= 12; y++ }
  while (m < 1)  { m += 12; y-- }
  return { year: y, month: m }
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + days)
  return d.toISOString().slice(0, 10)
}

type BucketData = {
  revenue: number
  allPointsSpent: number
  payingPointsSpent: number
  freePointsSpent: number
  payerUserCount: number
  purchaseCount: number
  registrations: number
  firstTimePayers: number
  loginCount: number
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: SearchParams }) {
  const period: Period = (searchParams.period as Period) ?? 'daily'

  const nowJST = toJST(new Date())
  const currentYear = nowJST.getUTCFullYear()
  const currentMonth = nowJST.getUTCMonth() + 1
  const jstTodayStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(nowJST.getUTCDate()).padStart(2, '0')}`

  let selYear = currentYear
  let selMonth = currentMonth
  if (period === 'daily' && searchParams.month) {
    const parts = searchParams.month.split('-')
    if (parts.length === 2) {
      selYear = parseInt(parts[0])
      selMonth = parseInt(parts[1])
    }
  }

  let selDateStr = jstTodayStr
  let isToday = true
  if (period === 'hourly' && searchParams.date && /^\d{4}-\d{2}-\d{2}$/.test(searchParams.date)) {
    selDateStr = searchParams.date
    isToday = selDateStr === jstTodayStr
  }

  let fromISO: string
  let toISO: string | null = null
  if (period === 'hourly') {
    fromISO = new Date(`${selDateStr}T00:00:00+09:00`).toISOString()
    if (!isToday) {
      toISO = new Date(new Date(`${selDateStr}T00:00:00+09:00`).getTime() + 86400000).toISOString()
    }
  } else if (period === 'daily') {
    const f = new Date(`${selYear}-${String(selMonth).padStart(2, '0')}-01T00:00:00+09:00`)
    const { year: ny, month: nm } = addMonth(selYear, selMonth, 1)
    const t = new Date(`${ny}-${String(nm).padStart(2, '0')}-01T00:00:00+09:00`)
    fromISO = f.toISOString()
    toISO = t.toISOString()
  } else {
    fromISO = new Date(`${LAUNCH_YEAR}-${String(LAUNCH_MONTH).padStart(2, '0')}-01T00:00:00+09:00`).toISOString()
  }

  const excludeIds = await getCachedExcludeIds()
  const { data: statsRows, error: rpcError } = await getCachedStats(fromISO, toISO, period, excludeIds)

  if (rpcError) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-base font-bold mb-4">集計</h1>
        <div className="border border-red-300 rounded p-4 bg-red-50">
          <p className="text-red-700 font-semibold mb-1">RPC エラー</p>
          <pre className="text-xs text-red-600 whitespace-pre-wrap">{JSON.stringify(rpcError, null, 2)}</pre>
        </div>
      </div>
    )
  }

  const buckets = period === 'hourly'
    ? generateHourlyBuckets(selDateStr, isToday)
    : period === 'daily'
      ? generateDailyBuckets(selYear, selMonth)
      : generateMonthlyBuckets()

  const emptyBucket = (): BucketData => ({
    revenue: 0, allPointsSpent: 0, payingPointsSpent: 0, freePointsSpent: 0,
    payerUserCount: 0, purchaseCount: 0, registrations: 0, firstTimePayers: 0, loginCount: 0,
  })

  const bucketMap = new Map<string, BucketData>()
  buckets.forEach(b => bucketMap.set(b, emptyBucket()))

  let totalLoginUsers = 0
  let totalPayerUsers = 0

  for (const row of statsRows ?? []) {
    const d = bucketMap.get(row.bucket)
    if (!d) continue
    d.revenue             = Number(row.revenue)
    d.allPointsSpent      = Number(row.all_points_spent)
    d.payingPointsSpent   = Number(row.paying_points_spent)
    d.freePointsSpent     = Number(row.free_points_spent)
    d.payerUserCount      = Number(row.payer_user_count)
    d.purchaseCount       = Number(row.purchase_count)
    d.registrations       = Number(row.registration_count)
    d.firstTimePayers     = Number(row.first_time_payer_count)
    d.loginCount          = Number(row.login_user_count)
    totalLoginUsers = Number(row.total_period_login_users)
    totalPayerUsers = Number(row.total_period_payer_users)
  }

  const totals = buckets.reduce((acc, b) => {
    const d = bucketMap.get(b)!
    return {
      revenue:           acc.revenue           + d.revenue,
      allPointsSpent:    acc.allPointsSpent    + d.allPointsSpent,
      payingPointsSpent: acc.payingPointsSpent + d.payingPointsSpent,
      freePointsSpent:   acc.freePointsSpent   + d.freePointsSpent,
      purchaseCount:     acc.purchaseCount     + d.purchaseCount,
      registrations:     acc.registrations     + d.registrations,
      firstTimePayers:   acc.firstTimePayers   + d.firstTimePayers,
    }
  }, {
    revenue: 0, allPointsSpent: 0, payingPointsSpent: 0, freePointsSpent: 0,
    purchaseCount: 0, registrations: 0, firstTimePayers: 0,
  })

  const periodTabs: { value: Period; label: string }[] = [
    { value: 'hourly',  label: '時間別' },
    { value: 'daily',   label: '日別' },
    { value: 'monthly', label: '月別' },
  ]

  const prevDayStr = addDays(selDateStr, -1)
  const nextDayStr = addDays(selDateStr, 1)
  const isFutureDay = selDateStr > jstTodayStr

  const prev = addMonth(selYear, selMonth, -1)
  const next = addMonth(selYear, selMonth, 1)
  const isCurrentMonth = selYear === currentYear && selMonth === currentMonth
  const isFutureMonth  = selYear > currentYear  || (selYear === currentYear && selMonth > currentMonth)
  const isLaunchMonth  = selYear === LAUNCH_YEAR && selMonth === LAUNCH_MONTH

  const th = 'px-3 py-2 text-right text-xs font-semibold text-gray-500 border-b border-gray-200 whitespace-nowrap'
  const td = 'px-3 py-1.5 text-right text-sm tabular-nums whitespace-nowrap'

  return (
    <div className="p-6 space-y-4">
      <RefreshOnMount />
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h1 className="text-base font-bold">集計</h1>
        <div className="flex gap-1">
          {periodTabs.map(tab => (
            <Link key={tab.value}
              href={tab.value === 'daily' ? `?period=daily&month=${selYear}-${String(selMonth).padStart(2, '0')}` : `?period=${tab.value}`}
              className="px-3 py-1 rounded text-xs font-medium border"
              style={{
                background:  period === tab.value ? '#111' : '#fff',
                color:       period === tab.value ? '#fff' : '#555',
                borderColor: period === tab.value ? '#111' : '#ddd',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>

      {period === 'hourly' && (
        <div className="flex items-center gap-2">
          <Link href={`?period=hourly&date=${prevDayStr}`} className="px-2 py-1 text-xs border rounded hover:bg-gray-50">← 前日</Link>
          <span className="text-sm font-semibold px-2">{selDateStr.slice(5).replace('-', '/')}（JST）</span>
          <Link href="?period=hourly"
            className={`px-2 py-1 text-xs border rounded ${isToday ? 'bg-gray-100 font-semibold pointer-events-none' : 'hover:bg-gray-50'}`}>
            当日
          </Link>
          <Link href={isToday ? '#' : `?period=hourly&date=${nextDayStr}`}
            className={`px-2 py-1 text-xs border rounded ${isToday || isFutureDay ? 'text-gray-300 pointer-events-none' : 'hover:bg-gray-50'}`}>
            次日 →
          </Link>
        </div>
      )}

      {period === 'daily' && (
        <div className="flex items-center gap-2">
          <Link
            href={isLaunchMonth ? '#' : `?period=daily&month=${prev.year}-${String(prev.month).padStart(2, '0')}`}
            className={`px-2 py-1 text-xs border rounded ${isLaunchMonth ? 'text-gray-300 pointer-events-none' : 'hover:bg-gray-50'}`}>
            ← 前月
          </Link>
          <span className="text-sm font-semibold px-2">{selYear}年{selMonth}月</span>
          <Link
            href={isFutureMonth ? '#' : `?period=daily&month=${next.year}-${String(next.month).padStart(2, '0')}`}
            className={`px-2 py-1 text-xs border rounded ${isFutureMonth || isCurrentMonth ? 'text-gray-300 pointer-events-none' : 'hover:bg-gray-50'}`}>
            次月 →
          </Link>
        </div>
      )}

      <div className="overflow-x-auto border border-gray-200 rounded">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 border-b border-gray-200 whitespace-nowrap">
                期間（JST）
              </th>
              <th className={th}>課金額</th>
              <th className={th}>入金者数</th>
              <th className={th}>入金件数</th>
              <th className={th}>新規登録</th>
              <th className={th}>初回入金率</th>
              <th className={th}>ログイン</th>
              <th className={th}>PT消費（全体）</th>
              <th className={th}>PT消費（課金）</th>
              <th className={th}>PT消費（無料）</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50 font-semibold border-b-2 border-gray-300">
              <td className="px-3 py-1.5 text-sm">合計</td>
              <td className={td}>¥{totals.revenue.toLocaleString()}</td>
              <td className={td}>{totalPayerUsers > 0 ? `${totalPayerUsers}人` : '—'}</td>
              <td className={td}>{totals.purchaseCount > 0 ? `${totals.purchaseCount}件` : '—'}</td>
              <td className={td}>{totals.registrations > 0 ? `${totals.registrations}人` : '—'}</td>
              <td className={td}>{totals.registrations > 0 ? `${Math.round(totals.firstTimePayers / totals.registrations * 100)}%` : '—'}</td>
              <td className={td}>{totalLoginUsers > 0 ? `${totalLoginUsers}人` : '—'}</td>
              <td className={td}>{totals.allPointsSpent    > 0 ? `${totals.allPointsSpent.toLocaleString()}pt`    : '—'}</td>
              <td className={td}>{totals.payingPointsSpent > 0 ? `${totals.payingPointsSpent.toLocaleString()}pt` : '—'}</td>
              <td className={td}>{totals.freePointsSpent   > 0 ? `${totals.freePointsSpent.toLocaleString()}pt`   : '—'}</td>
            </tr>
            {buckets.map((bucket, i) => {
              const d = bucketMap.get(bucket)!
              const hasData = d.revenue > 0 || d.allPointsSpent > 0 || d.registrations > 0 || d.loginCount > 0
              return (
                <tr
                  key={bucket}
                  className={`border-b border-gray-100 ${hasData ? '' : 'text-gray-300'}`}
                  style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }}
                >
                  <td className="px-3 py-1.5 text-sm font-mono">{formatLabel(bucket, period)}</td>
                  <td className={td}>{d.revenue         > 0 ? `¥${d.revenue.toLocaleString()}`             : '—'}</td>
                  <td className={td}>{d.payerUserCount  > 0 ? `${d.payerUserCount}人`                      : '—'}</td>
                  <td className={td}>{d.purchaseCount   > 0 ? `${d.purchaseCount}件`                       : '—'}</td>
                  <td className={td}>{d.registrations   > 0 ? `${d.registrations}人`                       : '—'}</td>
                  <td className={td}>{d.registrations   > 0 ? `${Math.round(d.firstTimePayers / d.registrations * 100)}%` : '—'}</td>
                  <td className={td}>{d.loginCount      > 0 ? `${d.loginCount}人`                          : '—'}</td>
                  <td className={td}>{d.allPointsSpent    > 0 ? `${d.allPointsSpent.toLocaleString()}pt`    : '—'}</td>
                  <td className={td}>{d.payingPointsSpent > 0 ? `${d.payingPointsSpent.toLocaleString()}pt` : '—'}</td>
                  <td className={td}>{d.freePointsSpent   > 0 ? `${d.freePointsSpent.toLocaleString()}pt`   : '—'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
