'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, Save, Loader2, Tag, X, Ban, ShieldCheck, ChevronRight } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { ActionLogTimeline } from '@/components/admin/ActionLogTimeline'
import { PLANS, type PlanId } from '@/lib/plans'

type Profile = {
  id: string; user_code: string; email: string; display_name: string | null; age: number | null; gender: string | null
  role: string; points: number; bonus_points: number | null; bonus_points_expires_at: string | null
  last_login_at: string | null; created_at: string
  referral_source: string | null; referral_article: string | null; registration_ip: string | null; registration_ua: string | null
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_content: string | null; utm_term: string | null
  fbclid: string | null; gclid: string | null
  subscription_status: string | null; subscription_plan: string | null; subscription_period_end: string | null
  monthly_messages_used: number | null; monthly_messages_limit: number | null
}
type ConvStat = {
  id: string; last_message_at: string | null; character_id: string; character_name: string; avatar_url: string
  user_messages: number; total_messages: number; affection_level: number | null; affection_points: number | null
}
type Stats = {
  total_charged: number; purchase_count: number; last_purchase_at: string | null; points_spent: number
  messages_sent: number; last_message_at: string | null; banned_until: string | null; conversations: ConvStat[]
}
type Transaction = { id: string; amount: number; type: string; description: string; price_yen: number | null; created_at: string }
type Label = { id: string; name: string; color: string }
type Tab = 'info' | 'logs' | 'conversations' | 'payments'

const TX_TYPE: Record<string, string> = {
  purchase: '購入', spend: '消費', login_bonus: 'ログインボーナス', admin_adjust: '管理者調整',
  registration_bonus: '登録ボーナス', referral_bonus: '紹介ボーナス', subscription_bonus: '会員ボーナス',
}
const fmt = (d: string | null) => d ? new Date(d).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'
const ago = (d: string | null) => d ? formatDistanceToNow(new Date(d), { addSuffix: true, locale: ja }) : '—'

export default function AdminUserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const supabase = createClient()

  const [tab, setTab] = useState<Tab>('info')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [labels, setLabels] = useState<Label[]>([])
  const [assigned, setAssigned] = useState<Set<string>>(new Set())
  const [note, setNote] = useState('')
  const [noteState, setNoteState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [newLabel, setNewLabel] = useState('')
  const [adjustAmount, setAdjustAmount] = useState('')
  const [adjustDesc, setAdjustDesc] = useState('')
  const [adjusting, setAdjusting] = useState(false)
  const [banBusy, setBanBusy] = useState(false)
  const [banConfirm, setBanConfirm] = useState(false)

  const loadAll = useCallback(async () => {
    const [detailRes, labelsRes, assignRes, noteRes] = await Promise.all([
      fetch(`/api/admin/user-detail/${id}`).then(r => r.json()),
      supabase.from('admin_labels').select('*').order('name'),
      supabase.from('user_label_assignments').select('label_id').eq('user_id', id),
      fetch(`/api/admin/profile-note?userId=${id}`).then(r => r.json()),
    ])
    if (detailRes.error) { setLoadError(detailRes.error); return }
    setProfile(detailRes.profile); setStats(detailRes.stats); setTransactions(detailRes.transactions)
    setLabels(labelsRes.data ?? [])
    setAssigned(new Set((assignRes.data ?? []).map((a: { label_id: string }) => a.label_id)))
    setNote(noteRes.admin_note ?? '')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => { loadAll() }, [loadAll])

  const saveNote = async () => {
    setNoteState('saving')
    const res = await fetch('/api/admin/profile-note', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id, note }),
    })
    if (!res.ok) { alert('保存に失敗しました'); setNoteState('idle'); return }
    setNoteState('saved'); setTimeout(() => setNoteState('idle'), 1500)
  }

  const toggleLabel = async (labelId: string) => {
    if (assigned.has(labelId)) {
      await supabase.from('user_label_assignments').delete().eq('user_id', id).eq('label_id', labelId)
      setAssigned(prev => { const s = new Set(prev); s.delete(labelId); return s })
    } else {
      await supabase.from('user_label_assignments').insert({ user_id: id, label_id: labelId })
      setAssigned(prev => new Set(prev).add(labelId))
    }
  }

  const createLabel = async () => {
    if (!newLabel.trim()) return
    const { data } = await supabase.from('admin_labels').insert({ name: newLabel.trim(), color: '#6366f1' }).select().single()
    if (data) setLabels(prev => [...prev, data as Label].sort((a, b) => a.name.localeCompare(b.name)))
    setNewLabel('')
  }

  const adjustPoints = async (sign: 1 | -1) => {
    const amt = parseInt(adjustAmount, 10)
    if (!amt || amt <= 0) return
    setAdjusting(true)
    const res = await fetch('/api/admin/adjust-points', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: id, amount: amt * sign, description: adjustDesc.trim() || undefined }),
    })
    const data = await res.json()
    setAdjusting(false)
    if (!res.ok) { alert(data.error ?? 'エラー'); return }
    setAdjustAmount(''); setAdjustDesc('')
    loadAll()
  }

  const isBanned = !!stats?.banned_until && new Date(stats.banned_until) > new Date()
  const toggleBan = async () => {
    setBanBusy(true)
    const res = await fetch('/api/admin/ban-user', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId: id, ban: !isBanned }),
    })
    const data = await res.json()
    setBanBusy(false); setBanConfirm(false)
    if (!res.ok) { alert(data.error ?? 'エラー'); return }
    loadAll()
  }

  if (loadError) return <p className="text-sm text-red-500 py-10 text-center">エラー: {loadError}</p>
  if (!profile || !stats) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" style={{ color: 'var(--color-primary)' }} size={22} /></div>
  }

  const bonusValid = profile.bonus_points_expires_at && new Date(profile.bonus_points_expires_at) > new Date()
  const plan = profile.subscription_plan ? PLANS[profile.subscription_plan as PlanId] : null
  const isMember = (profile.subscription_status === 'active' || profile.subscription_status === 'trialing') && !!plan

  return (
    <div className="max-w-4xl space-y-4">
      {/* ── ヘッダー ── */}
      <div className="flex items-start gap-3">
        <Link href="/admin/users" className="mt-1" style={{ color: 'var(--color-text-muted)' }}><ChevronLeft size={20} /></Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold">{profile.display_name ?? '未設定'}</h1>
            {isBanned && <Badge color="#ef4444">BAN中</Badge>}
            {isMember && <Badge color="#d4386f">{plan!.name}会員</Badge>}
            {stats.purchase_count > 0 && <Badge color="#16a34a">課金ユーザー</Badge>}
            {profile.role !== 'user' && <Badge color="#6b7280">{profile.role}</Badge>}
          </div>
          <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{profile.user_code} · {profile.email}</p>
        </div>
      </div>

      {/* ── サマリー ── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <Stat label="累計課金" value={`¥${stats.total_charged.toLocaleString()}`} sub={`${stats.purchase_count}回`} />
        <Stat label="ポイント残高" value={`${(profile.points + (bonusValid ? profile.bonus_points ?? 0 : 0)).toLocaleString()}pt`} sub={bonusValid && profile.bonus_points ? `うちボーナス${profile.bonus_points}` : undefined} />
        <Stat label="送信メッセージ" value={`${stats.messages_sent.toLocaleString()}通`} sub={`消費 ${stats.points_spent.toLocaleString()}pt`} />
        <Stat label="最終送信" value={ago(stats.last_message_at)} />
        <Stat label="最終ログイン" value={ago(profile.last_login_at)} sub={`登録 ${ago(profile.created_at)}`} />
      </div>

      {/* ── タブ ── */}
      <div className="flex gap-1 p-1 rounded-lg" style={{ background: 'var(--color-surface-2)' }}>
        {([['info', '基本情報'], ['logs', 'アクションログ'], ['conversations', `会話 (${stats.conversations.length})`], ['payments', '決済・ポイント']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className="flex-1 py-2 text-sm font-semibold rounded-md transition-colors"
            style={tab === t ? { background: 'var(--color-surface)', color: 'var(--color-text)', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' } : { color: 'var(--color-text-muted)' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'info' && (
        <div className="grid md:grid-cols-2 gap-4">
          <Card title="プロフィール">
            <Rows rows={[
              ['年齢', profile.age != null ? `${profile.age}歳` : '—'],
              ['性別', { male: '男性', female: '女性', other: 'その他' }[profile.gender ?? ''] ?? '—'],
              ['登録日時', fmt(profile.created_at)],
              ['最終ログイン', fmt(profile.last_login_at)],
              ['最終課金', fmt(stats.last_purchase_at)],
            ]} />
          </Card>

          <Card title="会員プラン">
            {isMember ? (
              <Rows rows={[
                ['プラン', `${plan!.name}（¥${plan!.price_yen.toLocaleString()}/月）`],
                ['今月の利用', `${profile.monthly_messages_used ?? 0} / ${profile.monthly_messages_limit ?? 0}通`],
                ['有効期限', fmt(profile.subscription_period_end)],
              ]} />
            ) : (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {profile.subscription_status ? `非会員（${profile.subscription_status}）` : '非会員'}
              </p>
            )}
          </Card>

          <Card title="流入元">
            <Rows rows={[
              ['utm_source', profile.utm_source], ['utm_medium', profile.utm_medium], ['utm_campaign', profile.utm_campaign],
              ['utm_content', profile.utm_content], ['紹介元', profile.referral_source], ['記事', profile.referral_article],
              ['gclid / fbclid', profile.gclid || profile.fbclid ? '有' : null], ['登録IP', profile.registration_ip],
            ]} />
          </Card>

          <Card title="管理メモ">
            <textarea value={note} onChange={e => setNote(e.target.value)} rows={5}
              className="input-warm w-full px-3 py-2 text-sm" placeholder="対応履歴や注意点など" />
            <button onClick={saveNote} disabled={noteState === 'saving'} className="btn-primary mt-2 px-3 py-1.5 text-xs flex items-center gap-1.5">
              {noteState === 'saving' ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
              {noteState === 'saved' ? '保存しました' : '保存'}
            </button>
          </Card>

          <Card title="ラベル">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {labels.map(l => (
                <button key={l.id} onClick={() => toggleLabel(l.id)} className="text-xs px-2 py-1 rounded-md flex items-center gap-1"
                  style={assigned.has(l.id) ? { background: l.color, color: '#fff' } : { background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                  <Tag size={10} />{l.name}{assigned.has(l.id) && <X size={10} />}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="新しいラベル" className="input-warm flex-1 px-2 py-1 text-xs" />
              <button onClick={createLabel} className="btn-primary px-3 text-xs">追加</button>
            </div>
          </Card>

          <Card title="アカウント操作">
            {!banConfirm ? (
              <button onClick={() => setBanConfirm(true)} disabled={profile.role === 'admin'}
                className="flex items-center gap-1.5 text-sm font-semibold px-3 py-2 rounded-md disabled:opacity-40"
                style={isBanned ? { background: 'var(--color-surface-2)', color: 'var(--color-text)' } : { background: '#fef2f2', color: '#ef4444' }}>
                {isBanned ? <ShieldCheck size={14} /> : <Ban size={14} />}
                {isBanned ? 'BANを解除する' : 'このユーザーをBANする'}
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm">{isBanned ? 'BANを解除しますか？' : 'BANするとログインできなくなります。よろしいですか？'}</span>
                <button onClick={toggleBan} disabled={banBusy} className="text-sm font-bold px-3 py-1.5 rounded-md" style={{ background: isBanned ? 'var(--color-text)' : '#ef4444', color: '#fff' }}>
                  {banBusy ? '処理中…' : isBanned ? '解除する' : 'BANする'}
                </button>
                <button onClick={() => setBanConfirm(false)} className="text-sm px-2" style={{ color: 'var(--color-text-muted)' }}>キャンセル</button>
              </div>
            )}
            {isBanned && <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>BAN期限: {fmt(stats.banned_until)}</p>}
          </Card>
        </div>
      )}

      {tab === 'logs' && (
        <Card title="アクションログ"><ActionLogTimeline userId={id} /></Card>
      )}

      {tab === 'conversations' && (
        <Card title="会話">
          {stats.conversations.length === 0 ? (
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>会話はまだありません</p>
          ) : (
            <div className="-mx-2">
              {stats.conversations.map(c => (
                <Link key={c.id} href={`/admin/conversations/${c.id}`} className="flex items-center gap-3 px-2 py-2.5 rounded-md hover:bg-[var(--color-surface-2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" style={{ objectPosition: 'top center' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold">{c.character_name}
                      {c.affection_level ? <span className="ml-2 text-xs font-normal" style={{ color: 'var(--color-text-muted)' }}>Lv.{c.affection_level}（{c.affection_points}pt）</span> : null}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>送信 {c.user_messages}通 / 全 {c.total_messages}通 · {ago(c.last_message_at)}</p>
                  </div>
                  <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                </Link>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'payments' && (
        <div className="space-y-4">
          <Card title="ポイント調整">
            <div className="flex gap-2 flex-wrap">
              <input type="number" min={1} value={adjustAmount} onChange={e => setAdjustAmount(e.target.value)} placeholder="ポイント" className="input-warm w-28 px-2 py-1.5 text-sm" />
              <input value={adjustDesc} onChange={e => setAdjustDesc(e.target.value)} placeholder="理由（任意）" className="input-warm flex-1 min-w-[140px] px-2 py-1.5 text-sm" />
              <button onClick={() => adjustPoints(1)} disabled={adjusting} className="px-3 py-1.5 text-sm font-semibold rounded-md" style={{ background: '#f0fdf4', color: '#16a34a' }}>付与</button>
              <button onClick={() => adjustPoints(-1)} disabled={adjusting} className="px-3 py-1.5 text-sm font-semibold rounded-md" style={{ background: '#fef2f2', color: '#ef4444' }}>減算</button>
            </div>
          </Card>
          <Card title="ポイント履歴（直近200件）">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead><tr style={{ color: 'var(--color-text-muted)' }}><th className="text-left py-1.5 font-semibold">日時</th><th className="text-left font-semibold">種別</th><th className="text-left font-semibold">内容</th><th className="text-right font-semibold">pt</th><th className="text-right font-semibold">金額</th></tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                      <td className="py-1.5 whitespace-nowrap tabular-nums">{fmt(t.created_at)}</td>
                      <td className="whitespace-nowrap">{TX_TYPE[t.type] ?? t.type}</td>
                      <td>{t.description}</td>
                      <td className="text-right tabular-nums font-semibold" style={{ color: t.amount < 0 ? '#ef4444' : '#16a34a' }}>{t.amount > 0 ? `+${t.amount}` : t.amount}</td>
                      <td className="text-right tabular-nums">{t.price_yen != null ? `¥${t.price_yen.toLocaleString()}` : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  return <span className="text-[11px] font-bold px-1.5 py-0.5 rounded" style={{ background: `${color}1a`, color }}>{children}</span>
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card px-3 py-2.5">
      <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{label}</p>
      <p className="text-base font-bold tabular-nums">{value}</p>
      {sub && <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{sub}</p>}
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4">
      <h2 className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-muted)' }}>{title}</h2>
      {children}
    </div>
  )
}

function Rows({ rows }: { rows: [string, string | null | undefined][] }) {
  return (
    <dl className="text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-1">
          <dt style={{ color: 'var(--color-text-muted)' }}>{k}</dt>
          <dd className="text-right break-all">{v || '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
