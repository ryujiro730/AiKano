'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2, X, Check } from 'lucide-react'

type Campaign = {
  id: string
  name: string
  catchphrase: string
  description: string
  cta_text: string
  bonus_rate: number
  /** 高額パックの倍率（例: 1万円以上は3倍） */
  rate_tiers: { min_yen: number; rate: number }[]
  starts_at: string | null
  ends_at: string | null
  is_active: boolean
  display_frequency: string
  one_time_per_user: boolean
  created_at: string
}

const EMPTY: Omit<Campaign, 'id' | 'created_at'> = {
  name: '',
  catchphrase: '',
  description: '',
  cta_text: 'ポイントを購入する',
  bonus_rate: 1.5,
  rate_tiers: [],
  starts_at: null,
  ends_at: null,
  is_active: false,
  display_frequency: 'once',
  one_time_per_user: true,
}

function toLocalDatetime(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function toISO(local: string): string | null {
  if (!local) return null
  return new Date(local).toISOString()
}

export default function CampaignsPage() {
  const supabase = createClient()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Campaign | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })
    setCampaigns(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setShowForm(true)
  }

  function openEdit(c: Campaign) {
    setEditing(c)
    setForm({
      name: c.name,
      catchphrase: c.catchphrase,
      description: c.description,
      cta_text: c.cta_text,
      bonus_rate: c.bonus_rate,
      rate_tiers: c.rate_tiers ?? [],
      starts_at: c.starts_at,
      ends_at: c.ends_at,
      is_active: c.is_active,
      display_frequency: c.display_frequency,
      one_time_per_user: c.one_time_per_user,
    })
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setEditing(null)
  }

  async function save() {
    if (!form.name.trim()) return
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      catchphrase: form.catchphrase.trim(),
      description: form.description.trim(),
      cta_text: form.cta_text.trim() || 'ポイントを購入する',
      bonus_rate: Number(form.bonus_rate),
      rate_tiers: form.rate_tiers.filter(t => t.min_yen > 0 && t.rate > 0),
      starts_at: form.starts_at,
      ends_at: form.ends_at,
      is_active: form.is_active,
      display_frequency: form.display_frequency,
      one_time_per_user: form.one_time_per_user,
    }
    const { data: saved } = editing
      ? await supabase.from('campaigns').update(payload).eq('id', editing.id).select('id').single()
      : await supabase.from('campaigns').insert(payload).select('id').single()
    // 文言を各言語に自動翻訳（ユーザーの表示言語で出す）
    if (saved?.id) {
      await fetch('/api/admin/content-translate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table: 'campaigns', id: saved.id }),
      }).catch(() => {})
    }
    setSaving(false)
    closeForm()
    load()
  }

  async function toggleActive(c: Campaign) {
    setToggling(c.id)
    await supabase.from('campaigns').update({ is_active: !c.is_active }).eq('id', c.id)
    setToggling(null)
    load()
  }

  async function deleteCampaign(id: string) {
    if (!confirm('このキャンペーンを削除しますか？')) return
    setDeleting(id)
    await supabase.from('campaigns').delete().eq('id', id)
    setDeleting(null)
    load()
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">キャンペーン管理</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
          style={{ background: 'var(--color-primary)', color: '#fff' }}
        >
          <Plus size={16} /> 新規作成
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin" size={24} /></div>
      ) : campaigns.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--color-text-muted)' }}>キャンペーンはありません</div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="glass rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{c.name}</span>
                    {c.is_active ? (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#d1fae5', color: '#065f46' }}>有効</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--color-bg-secondary)', color: 'var(--color-text-muted)' }}>無効</span>
                    )}
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      {c.bonus_rate}倍ボーナス
                      {(c.rate_tiers ?? []).map(t => `・¥${t.min_yen.toLocaleString()}以上は${t.rate}倍`).join('')}
                    </span>
                  </div>
                  {c.catchphrase && (
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>{c.catchphrase}</p>
                  )}
                  {(c.starts_at || c.ends_at) && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                      {c.starts_at ? new Date(c.starts_at).toLocaleString('ja-JP') : '開始なし'}
                      {' 〜 '}
                      {c.ends_at ? new Date(c.ends_at).toLocaleString('ja-JP') : '終了なし'}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(c)}
                    disabled={toggling === c.id}
                    title={c.is_active ? '無効にする' : '有効にする'}
                    style={{ color: c.is_active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                  >
                    {toggling === c.id ? <Loader2 size={20} className="animate-spin" /> : c.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                  </button>
                  <button onClick={() => openEdit(c)} title="編集" style={{ color: 'var(--color-text-muted)' }}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => deleteCampaign(c.id)} disabled={deleting === c.id} title="削除" style={{ color: '#ef4444' }}>
                    {deleting === c.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="glass rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg">{editing ? 'キャンペーン編集' : '新規キャンペーン'}</h2>
              <button onClick={closeForm}><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1">キャンペーン名 *</label>
                <input
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="例: GWポイント3倍キャンペーン"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">キャッチコピー</label>
                <input
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  value={form.catchphrase}
                  onChange={e => setForm(f => ({ ...f, catchphrase: e.target.value }))}
                  placeholder="例: 期間限定！ポイントが3倍になるチャンス！"
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">説明文</label>
                <textarea
                  className="w-full px-3 py-2 rounded-xl text-sm"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  rows={3}
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="キャンペーンの詳細説明..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">CTAテキスト</label>
                  <input
                    className="w-full px-3 py-2 rounded-xl text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                    value={form.cta_text}
                    onChange={e => setForm(f => ({ ...f, cta_text: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">ボーナス倍率</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    className="w-full px-3 py-2 rounded-xl text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                    value={form.bonus_rate}
                    onChange={e => setForm(f => ({ ...f, bonus_rate: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* 高額パックの倍率 */}
              <div>
                <label className="text-xs font-medium block mb-1">高額パックの倍率（上のボーナス倍率より高くしたいとき）</label>
                <div className="space-y-2">
                  {form.rate_tiers.map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span>¥</span>
                      <input type="number" min="0" step="1000" value={t.min_yen}
                        onChange={e => setForm(f => ({ ...f, rate_tiers: f.rate_tiers.map((x, j) => j === i ? { ...x, min_yen: Number(e.target.value) } : x) }))}
                        className="w-28 px-3 py-1.5 rounded-xl text-sm"
                        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }} />
                      <span>以上のパックは</span>
                      <input type="number" min="1" step="0.1" value={t.rate}
                        onChange={e => setForm(f => ({ ...f, rate_tiers: f.rate_tiers.map((x, j) => j === i ? { ...x, rate: Number(e.target.value) } : x) }))}
                        className="w-20 px-3 py-1.5 rounded-xl text-sm"
                        style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }} />
                      <span>倍</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, rate_tiers: f.rate_tiers.filter((_, j) => j !== i) }))}
                        className="p-1 text-[var(--color-text-muted)]"><X size={14} /></button>
                    </div>
                  ))}
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, rate_tiers: [...f.rate_tiers, { min_yen: 10000, rate: Math.max(2, Number(f.bonus_rate) + 1) }] }))}
                    className="text-xs flex items-center gap-1" style={{ color: 'var(--color-primary)' }}>
                    <Plus size={12} />段階を追加
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium block mb-1">開始日時</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 rounded-xl text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                    value={toLocalDatetime(form.starts_at)}
                    onChange={e => setForm(f => ({ ...f, starts_at: toISO(e.target.value) }))}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-1">終了日時</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-2 rounded-xl text-sm"
                    style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                    value={toLocalDatetime(form.ends_at)}
                    onChange={e => setForm(f => ({ ...f, ends_at: toISO(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))}
                  />
                  有効
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={form.one_time_per_user}
                    onChange={e => setForm(f => ({ ...f, one_time_per_user: e.target.checked }))}
                  />
                  1ユーザー1回限り
                </label>
              </div>

              <div>
                <label className="text-xs font-medium block mb-1">表示頻度</label>
                <select
                  className="px-3 py-2 rounded-xl text-sm"
                  style={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}
                  value={form.display_frequency}
                  onChange={e => setForm(f => ({ ...f, display_frequency: e.target.value }))}
                >
                  <option value="once">1回のみ</option>
                  <option value="always">毎回</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={closeForm}
                className="flex-1 py-2 rounded-xl text-sm"
                style={{ background: 'var(--color-bg-secondary)' }}
              >キャンセル</button>
              <button
                onClick={save}
                disabled={saving || !form.name.trim()}
                className="flex-1 py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
                style={{ background: 'var(--color-primary)', color: '#fff', opacity: saving || !form.name.trim() ? 0.6 : 1 }}
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                {editing ? '保存' : '作成'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
