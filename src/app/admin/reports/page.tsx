export const dynamic = 'force-dynamic'
import { createAdminClientStatic } from '@/lib/supabase/server'
import Link from 'next/link'
import { ReviewButton } from './ReviewButton'

async function getReports(reviewed: boolean) {
  const admin = createAdminClientStatic()
  const q = admin
    .from('reports')
    .select('id, reason, reviewed_at, created_at, reporter:profiles!reporter_id(id, display_name, user_code), character:characters!character_id(id, name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(200)

  const { data } = reviewed
    ? await q.not('reviewed_at', 'is', null)
    : await q.is('reviewed_at', null)

  return data ?? []
}

async function getUnreviewedCount() {
  const admin = createAdminClientStatic()
  const { count } = await admin
    .from('reports')
    .select('id', { count: 'exact', head: true })
    .is('reviewed_at', null)
  return count ?? 0
}

function toJST(dateStr: string) {
  const d = new Date(new Date(dateStr).getTime() + 9 * 60 * 60 * 1000)
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${String(d.getUTCDate()).padStart(2, '0')} ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

export default async function ReportsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const tab = searchParams.tab === 'reviewed' ? 'reviewed' : 'pending'
  const [reports, unreviewedCount] = await Promise.all([
    getReports(tab === 'reviewed'),
    getUnreviewedCount(),
  ])

  const tdL = 'px-3 py-3 text-sm text-left align-top'
  const tdR = 'px-3 py-3 text-sm text-right align-top whitespace-nowrap'

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <h1 className="text-base font-bold">通報一覧</h1>

      <div className="flex gap-1 border-b border-gray-200">
        <Link
          href="/admin/reports"
          className="px-4 py-2 text-sm font-medium transition-colors"
          style={tab === 'pending'
            ? { borderBottom: '2px solid var(--color-primary)', color: 'var(--color-primary)', marginBottom: '-1px' }
            : { color: 'var(--color-text-muted)' }}
        >
          未対応
          {unreviewedCount > 0 && (
            <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: '#fee2e2', color: '#dc2626' }}>
              {unreviewedCount}
            </span>
          )}
        </Link>
        <Link
          href="/admin/reports?tab=reviewed"
          className="px-4 py-2 text-sm font-medium transition-colors"
          style={tab === 'reviewed'
            ? { borderBottom: '2px solid var(--color-primary)', color: 'var(--color-primary)', marginBottom: '-1px' }
            : { color: 'var(--color-text-muted)' }}
        >
          対応済み
        </Link>
      </div>

      {reports.length === 0 ? (
        <p className="text-sm text-gray-400 py-8">
          {tab === 'pending' ? '未対応の通報はありません' : '対応済みの通報はありません'}
        </p>
      ) : (
        <div className="border border-gray-200 rounded-xl overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">日時（JST）</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">通報者</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">対象キャラ</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">内容</th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 whitespace-nowrap">操作</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r: any, i: number) => (
                <tr key={r.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafafa' }} className="border-b border-gray-100">
                  <td className={`${tdL} font-mono text-xs text-gray-400 whitespace-nowrap`}>{toJST(r.created_at)}</td>
                  <td className={tdL}>
                    {r.reporter ? (
                      <Link href={`/admin/users/${r.reporter.id}`} className="text-blue-600 hover:underline text-xs">
                        {r.reporter.display_name ?? '—'}
                        <span className="text-gray-400 ml-1">{r.reporter.user_code}</span>
                      </Link>
                    ) : <span className="text-gray-400 text-xs">退会済み</span>}
                  </td>
                  <td className={tdL}>
                    {r.character ? (
                      <Link href="/admin/characters" className="text-blue-600 hover:underline text-xs">
                        {r.character.name}
                      </Link>
                    ) : <span className="text-gray-400 text-xs">—</span>}
                  </td>
                  <td className={tdL}>
                    <p className="text-sm whitespace-pre-wrap break-words max-w-sm">{r.reason}</p>
                  </td>
                  <td className={tdR}>
                    {tab === 'pending' ? (
                      <ReviewButton reportId={r.id} />
                    ) : (
                      <span className="text-xs text-gray-400">{toJST(r.reviewed_at)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
