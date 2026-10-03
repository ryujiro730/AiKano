'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'

export type ActionLog = {
  id: string
  action_type: string
  page_path: string | null
  metadata: Record<string, unknown> | null
  created_at: string
  points_delta: number | null
  points_balance: number | null
}

type Category = 'money' | 'message' | 'view' | 'other'

// 行動の表示名・分類・色（マチコイの管理画面を踏襲し、AiKano のイベントに合わせて拡張）
const ACTIONS: Record<string, { label: string; cat: Category; color: string }> = {
  signup_complete:             { label: '会員登録完了',           cat: 'other',   color: '#16a34a' },
  login:                       { label: 'ログイン',               cat: 'view',    color: '#9ca3af' },
  registration_bonus:          { label: '登録ボーナス',           cat: 'other',   color: '#16a34a' },
  referral_bonus:              { label: '紹介ボーナス',           cat: 'other',   color: '#16a34a' },
  bonus_grant:                 { label: 'ボーナス付与',           cat: 'other',   color: '#16a34a' },
  login_bonus:                 { label: 'ログインボーナス',       cat: 'other',   color: '#16a34a' },
  points_spent:                { label: 'ポイント消費',           cat: 'money',   color: '#ef4444' },
  chat_open:                   { label: 'チャットを開いた',       cat: 'message', color: '#d4386f' },
  message_sent:                { label: 'メッセージ送信',         cat: 'message', color: '#d4386f' },
  level_up:                    { label: '好感度レベルアップ',     cat: 'message', color: '#b8862b' },
  item_use:                    { label: 'アイテムを贈った',       cat: 'message', color: '#d4386f' },
  points_shortage:             { label: 'ポイント不足',           cat: 'money',   color: '#ef4444' },
  purchase_dialog_open:        { label: '購入ダイアログ表示',     cat: 'money',   color: '#f59e0b' },
  payment_page:                { label: '料金ページを閲覧',       cat: 'money',   color: '#f59e0b' },
  point_purchase:              { label: 'ポイント購入ボタン',     cat: 'money',   color: '#f59e0b' },
  checkout_start:              { label: '決済画面へ',             cat: 'money',   color: '#f59e0b' },
  point_purchase_complete:     { label: 'ポイント購入完了',       cat: 'money',   color: '#16a34a' },
  subscription_checkout_start: { label: 'サブスク決済画面へ',     cat: 'money',   color: '#f59e0b' },
  subscription_start:          { label: 'サブスク開始',           cat: 'money',   color: '#16a34a' },
  subscription_renew:          { label: 'サブスク更新',           cat: 'money',   color: '#16a34a' },
  subscription_bonus:          { label: '会員ボーナス付与',       cat: 'money',   color: '#16a34a' },
  subscription_cancel:         { label: 'サブスク解約',           cat: 'money',   color: '#6b7280' },
  subscription_payment_failed: { label: 'サブスク支払い失敗',     cat: 'money',   color: '#ef4444' },
  video_purchase:              { label: '動画を購入',             cat: 'money',   color: '#7c3aed' },
  item_purchase:               { label: 'アイテムを購入',         cat: 'money',   color: '#06b6d4' },
  character_search:            { label: 'ホームを閲覧',           cat: 'view',    color: '#3b82f6' },
  conversations_view:          { label: 'メッセージ一覧を閲覧',   cat: 'view',    color: '#3b82f6' },
  settings_view:               { label: '設定を閲覧',             cat: 'view',    color: '#9ca3af' },
  support_view:                { label: 'お問い合わせを閲覧',     cat: 'view',    color: '#9ca3af' },
  shop_open:                   { label: 'ショップを閲覧',         cat: 'view',    color: '#06b6d4' },
  videos_view:                 { label: '動画を閲覧',             cat: 'view',    color: '#7c3aed' },
  points_view:                 { label: 'ポイント履歴を閲覧',     cat: 'view',    color: '#9ca3af' },
  crosspromo_view:             { label: '姉妹サービス広告を表示', cat: 'other',   color: '#9ca3af' },
  crosspromo_click:            { label: '姉妹サービスへ移動',     cat: 'other',   color: '#6366f1' },
  character_block:             { label: 'キャラをブロック',       cat: 'other',   color: '#6b7280' },
  admin_points_adjust:         { label: '管理者がポイント調整',   cat: 'other',   color: '#6b7280' },
  admin_ban:                   { label: '管理者がBAN操作',        cat: 'other',   color: '#ef4444' },
}

const META_LABEL: Record<string, string> = {
  character_name: 'キャラ', title: '対象', cost: '消費pt', tokens: '付与pt', points: 'pt', price_yen: '金額¥',
  plan: 'プラン', method: '決済', current: '残高', required: '必要', context: '場面', via: '支払い',
  level: 'Lv', amount: '増減', reason: '理由', source: '流入元', bonus: 'ボーナス', campaign: 'キャンペーン',
  placement: '場所', site: 'サイト', action: '操作', description: '内容', content: '本文',
}
const META_VALUE: Record<string, string> = {
  message: 'メッセージ', video: '動画', item: 'アイテム', points: 'ポイント', subscription: 'サブスク枠',
}

const FILTERS: { key: 'all' | Category; label: string }[] = [
  { key: 'all', label: 'すべて' },
  { key: 'money', label: '課金' },
  { key: 'message', label: 'メッセージ' },
  { key: 'view', label: '閲覧' },
  { key: 'other', label: 'その他' },
]

const jstDate = (d: Date) => d.toLocaleDateString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' })
const jstTime = (d: Date) => d.toLocaleTimeString('ja-JP', { timeZone: 'Asia/Tokyo', hour: '2-digit', minute: '2-digit' })

export function ActionLogTimeline({ userId, compact = false }: { userId: string; compact?: boolean }) {
  const [logs, setLogs] = useState<ActionLog[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [filter, setFilter] = useState<'all' | Category>('all')

  // 分類で絞り込む場合は対象の action_type をサーバーに渡す（絞り込みはDB側で行う）
  const typesFor = (f: 'all' | Category) =>
    f === 'all' ? '' : Object.entries(ACTIONS).filter(([, d]) => d.cat === f).map(([k]) => k).join(',')

  const load = useCallback(async (before?: string) => {
    const q = new URLSearchParams({ limit: '500' })
    if (before) q.set('before', before)
    const types = typesFor(filter)
    if (types) q.set('types', types)
    const res = await fetch(`/api/admin/user-action-logs/${userId}?${q}`)
    const data = await res.json().catch(() => ({ logs: [] }))
    return { logs: (data.logs ?? []) as ActionLog[], hasMore: !!data.hasMore }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, filter])

  const reload = useCallback(async () => {
    setLoading(true)
    const r = await load()
    setLogs(r.logs); setHasMore(r.hasMore); setLoading(false)
  }, [load])

  useEffect(() => { reload() }, [reload])

  const loadMore = async () => {
    if (!logs.length) return
    setLoadingMore(true)
    const r = await load(logs[logs.length - 1].created_at)
    setLogs(prev => [...prev, ...r.logs]); setHasMore(r.hasMore); setLoadingMore(false)
  }

  const shown = logs

  return (
    <div>
      <div className="flex items-center gap-1.5 flex-wrap mb-3">
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="text-xs font-semibold px-2.5 py-1 rounded-md transition-colors"
            style={filter === f.key
              ? { background: 'var(--color-text)', color: 'var(--color-surface)' }
              : { background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
            {f.label}
          </button>
        ))}
        <button onClick={reload} disabled={loading} className="ml-auto p-1.5 rounded-md" style={{ color: 'var(--color-text-muted)' }} aria-label="再読み込み">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 size={20} className="animate-spin" style={{ color: 'var(--color-primary)' }} /></div>
      ) : shown.length === 0 ? (
        <p className="text-sm py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>ログがありません</p>
      ) : (
        <div>
          {shown.map((log, i) => {
            const prev = shown[i - 1]
            const dt = new Date(log.created_at)
            const showDate = !prev || jstDate(new Date(prev.created_at)) !== jstDate(dt)
            // 新しい順なので、1つ前（より新しい）とのあいだが3時間以上空いていれば「◯時間ぶり」を表示
            const gapH = prev ? (new Date(prev.created_at).getTime() - dt.getTime()) / 3.6e6 : 0
            const showGap = !showDate && gapH >= 3
            // 増減はメッセージ・取引から確定値を使う（行動ログの行は増減なし）
            const delta = log.points_delta
            const def = ACTIONS[log.action_type]
            const content = typeof log.metadata?.content === 'string' ? log.metadata.content : null
            const meta = Object.entries(log.metadata ?? {}).filter(([k, v]) => k !== 'content' && v !== null && v !== undefined && v !== '')
            return (
              <div key={log.id}>
                {showDate && (
                  <div className="flex items-center gap-3 py-2.5">
                    <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
                    <span className="text-[11px] font-semibold" style={{ color: 'var(--color-text-muted)' }}>{jstDate(dt)}</span>
                    <div className="h-px flex-1" style={{ background: 'var(--color-border)' }} />
                  </div>
                )}
                {showGap && (
                  <p className="text-[10px] text-center py-1" style={{ color: 'var(--color-text-muted)' }}>⋯ {Math.round(gapH)}時間 ⋯</p>
                )}
                <div className={`flex items-start gap-2 ${compact ? 'py-1' : 'py-1.5'} px-2 rounded-md hover:bg-[var(--color-surface-2)]`}
                  style={delta ? { boxShadow: `inset 2px 0 0 ${delta < 0 ? '#ef4444' : '#16a34a'}` } : undefined}>
                  <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ background: def?.color ?? '#9ca3af' }} />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-semibold">{def?.label ?? log.action_type}</span>
                    {meta.length > 0 && (
                      <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
                        {meta.map(([k, v]) => `${META_LABEL[k] ?? k}: ${META_VALUE[String(v)] ?? String(v)}`).join(' · ')}
                      </span>
                    )}
                    {content && (
                      <p className="text-xs mt-0.5 break-words" style={{ color: 'var(--color-text)' }}>「{content}」</p>
                    )}
                  </div>
                  <span className="text-[11px] flex-shrink-0 tabular-nums flex items-center gap-1.5" style={{ color: 'var(--color-text-muted)' }}>
                    {delta ? (
                      <span className="font-semibold px-1 rounded" style={{ background: delta < 0 ? '#fef2f2' : '#f0fdf4', color: delta < 0 ? '#ef4444' : '#16a34a' }}>
                        {delta > 0 ? `+${delta}` : delta}pt
                      </span>
                    ) : null}
                    {log.points_balance != null && (delta || def?.cat === 'money') ? <span>残{log.points_balance.toLocaleString()}</span> : null}
                    {jstTime(dt)}
                  </span>
                </div>
              </div>
            )
          })}
          {hasMore && (
            <button onClick={loadMore} disabled={loadingMore} className="w-full mt-3 py-2 text-xs font-semibold rounded-md"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
              {loadingMore ? '読み込み中…' : 'さらに古いログを読み込む'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
