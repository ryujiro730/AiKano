import Link from 'next/link'
import { unstable_noStore as noStore } from 'next/cache'
import { createAdminClientStatic } from '@/lib/supabase/server'
import { EMAIL_KIND_LABEL } from '@/lib/email-kinds'

export const dynamic = 'force-dynamic'

type Row = { sent: number; delivered: number; opened: number; clicked?: number; bounced: number; complained: number; failed: number }
type Stats = {
  total: { sent: number; delivered: number; opened: number; bounced: number; complained: number }
  daily: (Row & { day: string })[]
  kinds: (Row & { kind: string })[]
  domains: (Row & { domain: string; delayed: number })[]
  problems: { to_email: string; kind: string | null; subject: string | null; sent_at: string; problem: string; detail: string | null }[]
  suppressed: Record<string, number>
  notify_today: number
  first_event_at: string | null
}

const RANGES = [7, 14, 30, 90]
const SUPPRESSED_LABEL: Record<string, string> = { complained: '迷惑報告', bounced: '宛先なし', suppressed: 'Resend が停止' }

function pct(n: number, d: number) {
  return d > 0 ? `${Math.round((n / d) * 1000) / 10}%` : '—'
}

// メールの届き方（Resend の Webhook → email_messages。集計は DB 関数 get_email_stats）
export default async function EmailStatsPage({ searchParams }: { searchParams: { days?: string } }) {
  noStore()
  const days = RANGES.includes(Number(searchParams.days)) ? Number(searchParams.days) : 14
  const to = new Date()
  const from = new Date(to.getTime() - days * 86400_000)
  const { data, error } = await createAdminClientStatic().rpc('get_email_stats', { p_from: from.toISOString(), p_to: to.toISOString() })
  if (error) return <p className="text-sm text-red-500">集計に失敗しました: {error.message}</p>
  const s = data as Stats
  const total = s.total
  const complaintRate = total.delivered > 0 ? total.complained / total.delivered : 0

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-lg font-bold">メール</h1>
        <div className="flex gap-1">
          {RANGES.map(r => (
            <Link key={r} href={`/admin/email?days=${r}`} prefetch={false}
              className="px-3 py-1 rounded-lg text-sm"
              style={{ background: r === days ? 'var(--color-surface-2)' : 'transparent', fontWeight: r === days ? 600 : 400 }}>
              {r}日
            </Link>
          ))}
        </div>
      </div>
      {!s.first_event_at && (
        <p className="text-sm p-3 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
          まだ記録がありません。Resend の Webhook（https://aikano.chat/api/webhooks/resend）を登録すると、送ったメールの到達・開封・不達・迷惑報告がここに出ます。
        </p>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card label="送信" value={total.sent.toLocaleString()} />
        <Card label="到達率" value={pct(total.delivered, total.sent)} />
        <Card label="開封率" value={pct(total.opened, total.delivered)} />
        <Card label="迷惑報告率" value={pct(total.complained, total.delivered)} warn={complaintRate >= 0.001}
          note="Gmail の基準は 0.3% 未満（0.1% 未満が目安）" />
        <Card label="今日の新着通知" value={String(s.notify_today)} note="送りすぎ防止を通ったもの" />
      </div>

      <Section title="種類別">
        <StatTable keyLabel="種類" rows={s.kinds.map(k => ({ ...k, key: EMAIL_KIND_LABEL[k.kind] ?? k.kind }))} />
      </Section>

      <Section title="日別（日本時間）">
        <StatTable keyLabel="日付" rows={s.daily.map(d => ({ ...d, key: d.day }))} />
      </Section>

      <Section title="宛先ドメイン別">
        <StatTable keyLabel="ドメイン" rows={s.domains.map(d => ({ ...d, key: d.domain }))} />
      </Section>

      <Section title="以後送らない人">
        {Object.keys(s.suppressed).length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>いません</p>
        ) : (
          <div className="flex gap-4 text-sm">
            {Object.entries(s.suppressed).map(([r, n]) => <span key={r}>{SUPPRESSED_LABEL[r] ?? r}: <b>{n}</b>人</span>)}
          </div>
        )}
      </Section>

      {s.problems.length > 0 && (
        <Section title="届かなかった・迷惑報告されたメール（新しい順 30件）">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-left" style={{ color: 'var(--color-text-muted)' }}>
                <th className="py-1.5 pr-3">日時</th><th className="pr-3">宛先</th><th className="pr-3">種類</th><th className="pr-3">内容</th><th>詳細</th>
              </tr></thead>
              <tbody>
                {s.problems.map((p, i) => (
                  <tr key={i} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                    <td className="py-1.5 pr-3 whitespace-nowrap">{new Date(p.sent_at).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}</td>
                    <td className="pr-3">{p.to_email}</td>
                    <td className="pr-3 whitespace-nowrap">{EMAIL_KIND_LABEL[p.kind ?? 'other'] ?? p.kind}</td>
                    <td className="pr-3 whitespace-nowrap">{p.problem}</td>
                    <td className="max-w-[280px] truncate">{p.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}
    </div>
  )
}

function Card({ label, value, note, warn }: { label: string; value: string; note?: string; warn?: boolean }) {
  return (
    <div className="p-3 rounded-xl border" style={{ borderColor: warn ? '#ef4444' : 'var(--color-border)', background: 'var(--color-surface)' }}>
      <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      <p className="text-xl font-bold tabular-nums" style={warn ? { color: '#ef4444' } : undefined}>{value}</p>
      {note && <p className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{note}</p>}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-sm font-bold mb-2">{title}</h2>
      {children}
    </section>
  )
}

function StatTable({ keyLabel, rows }: { keyLabel: string; rows: (Row & { key: string })[] }) {
  if (rows.length === 0) return <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>記録なし</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs tabular-nums">
        <thead><tr className="text-left" style={{ color: 'var(--color-text-muted)' }}>
          <th className="py-1.5 pr-3">{keyLabel}</th><th className="pr-3 text-right">送信</th><th className="pr-3 text-right">到達</th>
          <th className="pr-3 text-right">開封</th><th className="pr-3 text-right">不達</th><th className="pr-3 text-right">迷惑報告</th><th className="text-right">失敗</th>
        </tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.key} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
              <td className="py-1.5 pr-3 whitespace-nowrap">{r.key}</td>
              <td className="pr-3 text-right">{r.sent}</td>
              <td className="pr-3 text-right">{r.delivered} <span style={{ color: 'var(--color-text-muted)' }}>{pct(r.delivered, r.sent)}</span></td>
              <td className="pr-3 text-right">{r.opened} <span style={{ color: 'var(--color-text-muted)' }}>{pct(r.opened, r.delivered)}</span></td>
              <td className="pr-3 text-right">{r.bounced}</td>
              <td className="pr-3 text-right" style={r.complained > 0 ? { color: '#ef4444', fontWeight: 600 } : undefined}>{r.complained}</td>
              <td className="text-right">{r.failed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
