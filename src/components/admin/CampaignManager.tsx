'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Loader2, ToggleLeft, ToggleRight, ImageIcon, Mail, Megaphone, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react'
import { compressImage, isHeic, heicToBlob } from '@/lib/compress-image'

type Condition = {
  id?: string
  condition_type: 'registered_at' | 'purchase_count' | 'purchase_amount' | 'hours_since_registration'
  operator: 'gte' | 'lte' | 'lt'
  value: string
  value_to?: string  // registered_at 範囲終端
}

type Campaign = {
  id: string
  name: string
  image_url: string | null
  catchphrase: string
  description: string
  cta_text: string
  cta_url: string
  display_frequency: 'once' | 'always'
  is_active: boolean
  starts_at: string | null
  ends_at: string | null
  campaign_conditions: Condition[]
  display_count: number
  bonus_rate: number
  /** 高額パックの倍率（例: 1万円以上は3倍） */
  rate_tiers: { min_yen: number; rate: number }[] | null
  one_time_per_user: boolean
  min_price_yen: number | null
  max_price_yen: number | null
  target_gender: 'male' | 'female' | null
}

const CONDITION_UNITS: Record<string, string> = {
  hours_since_registration: '時間',
}

// 条件を「登録から72時間以上たった人」のような文にする（一覧・フォーム共通）
function describeCondition(cond: { condition_type: string; operator: string; value: string; value_to?: string }): string {
  const op = cond.operator === 'gte' ? '以上' : cond.operator === 'lt' ? '未満' : '以下'
  switch (cond.condition_type) {
    case 'registered_at': {
      const from = cond.value?.trim(); const to = cond.value_to?.trim()
      if (from && to) return `${from} 〜 ${to} に登録した人`
      if (from) return `${from} 以降に登録した人`
      if (to) return `${to} までに登録した人`
      return '登録日（未入力）'
    }
    case 'hours_since_registration': return `登録から ${cond.value || '?'} 時間${op}たった人`
    case 'purchase_count': return cond.value === '0' && cond.operator !== 'gte' ? 'まだ一度も購入していない人' : `これまでの購入回数が ${cond.value || '?'} 回${op}の人`
    case 'purchase_amount': return `これまでの購入額が ${Number(cond.value || 0).toLocaleString()} 円${op}の人`
    default: return ''
  }
}

function getRemainingText(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) return '終了'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (h >= 24) return `${Math.floor(h / 24)}日`
  if (h > 0) return `${h}時間${m > 0 ? `${m}分` : ''}`
  return `${m}分`
}

// DBのUTC文字列 → datetime-local用のローカル時刻文字列（JST表示）
function utcToLocalInput(utcStr: string | null): string | null {
  if (!utcStr) return null
  const d = new Date(utcStr)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

// datetime-localのローカル時刻文字列 → UTCのISO文字列（DB保存用）
function localInputToUtc(localStr: string | null): string | null {
  if (!localStr) return null
  return new Date(localStr).toISOString()
}

type FormState = Omit<Campaign, 'id' | 'campaign_conditions' | 'display_count'> & { conditions: Condition[] }

const emptyForm = (): FormState => ({
  name: '',
  image_url: null,
  catchphrase: '',
  description: '',
  cta_text: 'ポイントを購入する',
  cta_url: '/payment',
  display_frequency: 'once',
  is_active: false,
  starts_at: null,
  ends_at: null,
  conditions: [],
  bonus_rate: 1.0,
  rate_tiers: [],
  one_time_per_user: false,
  min_price_yen: null,
  max_price_yen: null,
  target_gender: null,
})

export default function CampaignManager({ initialCampaigns }: { initialCampaigns: Campaign[] }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  // 未保存チェック: 開いた時点のフォームを JSON で控えておき、閉じるときに比較する
  const [openedSnapshot, setOpenedSnapshot] = useState<string>('')
  const isDirty = showForm && JSON.stringify(form) !== openedSnapshot
  // 下書き（localStorage）: 編集中は自動で残し、同じキャンペーンを次に開いたときに復元を提案する
  const draftKey = (id: string | null) => `campaign-draft:${id ?? 'new'}`
  const [pendingDraft, setPendingDraft] = useState<FormState | null>(null)

  useEffect(() => {
    if (!showForm) return
    if (!isDirty) return
    try { localStorage.setItem(draftKey(editingId), JSON.stringify({ form, savedAt: Date.now() })) } catch {}
  }, [form, showForm, isDirty, editingId])   // eslint-disable-line react-hooks/exhaustive-deps

  // ブラウザを閉じる・リロードするときの警告
  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  // Esc で閉じる（未保存なら確認）
  useEffect(() => {
    if (!showForm) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') requestClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const loadDraft = (id: string | null, current: FormState) => {
    try {
      const raw = localStorage.getItem(draftKey(id))
      if (!raw) return
      const { form: draft } = JSON.parse(raw) as { form: FormState }
      if (JSON.stringify(draft) !== JSON.stringify(current)) setPendingDraft(draft)
    } catch {}
  }
  const clearDraft = (id: string | null) => { try { localStorage.removeItem(draftKey(id)) } catch {} }

  // 追いメール送信
  const [reminderCampaign, setReminderCampaign] = useState<Campaign | null>(null)
  const [reminderSubject, setReminderSubject] = useState('')
  const [reminderBody, setReminderBody] = useState('')
  const [reminderCtaUrl, setReminderCtaUrl] = useState('')
  const [reminderCtaLabel, setReminderCtaLabel] = useState('')
  const [sendingReminder, setSendingReminder] = useState(false)
  const [reminderResult, setReminderResult] = useState<{ sentCount: number; alreadySent?: number } | null>(null)

  // 件名・本文を空のまま送ると、ユーザーの表示言語の定型文（残り時間・キャッチコピー・説明）になる（lib/campaign-email.ts）。
  // 書いた場合はその文面を全員にそのまま送る（日本語で書けば外国語のユーザーにも日本語で届く）
  const openReminderModal = (c: Campaign) => {
    setReminderCampaign(c)
    setReminderSubject('')
    setReminderBody('')
    setReminderCtaUrl(c.cta_url || '/payment')
    setReminderCtaLabel('')
    setReminderResult(null)
  }

  const closeReminderModal = () => {
    setReminderCampaign(null)
    setReminderResult(null)
  }

  const sendReminder = async () => {
    if (!reminderCampaign) return
    if (!confirm(`未購入ユーザーに追いメールを送信します。よろしいですか？\n\n※前にこのボタンで送った人には送りません（1キャンペーンにつき1人1回）`)) return
    setSendingReminder(true)
    try {
      const res = await fetch(`/api/admin/campaigns/${reminderCampaign.id}/send-reminder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailSubject: reminderSubject,
          emailBody: reminderBody,
          emailCtaUrl: reminderCtaUrl,
          emailCtaLabel: reminderCtaLabel,
        }),
      })
      const data = await res.json()
      if (!res.ok) { alert('送信失敗: ' + (data.error ?? res.status)); return }
      setReminderResult({ sentCount: data.sentCount, alreadySent: data.alreadySent })
    } catch (e) {
      alert('エラー: ' + String(e))
    } finally {
      setSendingReminder(false)
    }
  }

  const openCreate = () => {
    const initial = emptyForm()
    setEditingId(null)
    setForm(initial)
    setOpenedSnapshot(JSON.stringify(initial))
    setPreviewUrl(null)
    setPendingDraft(null)
    loadDraft(null, initial)
    setShowForm(true)
  }

  const openEdit = (c: Campaign) => {
    setEditingId(c.id)
    const initial: FormState = {
      name: c.name,
      image_url: c.image_url,
      catchphrase: c.catchphrase,
      description: c.description,
      cta_text: c.cta_text,
      cta_url: c.cta_url || '/payment',
      display_frequency: c.display_frequency,
      is_active: c.is_active,
      starts_at: utcToLocalInput(c.starts_at),
      ends_at: utcToLocalInput(c.ends_at),
      conditions: (() => {
        const raw = c.campaign_conditions
        const gteReg = raw.find(x => x.condition_type === 'registered_at' && x.operator === 'gte')
        const lteReg = raw.find(x => x.condition_type === 'registered_at' && x.operator === 'lte')
        const others = raw.filter(x => x.condition_type !== 'registered_at').map(x => ({ ...x }))
        const merged: Condition[] = [...others]
        if (gteReg || lteReg) {
          merged.unshift({ condition_type: 'registered_at', operator: 'gte', value: gteReg?.value ?? '', value_to: lteReg?.value ?? '' })
        }
        return merged
      })(),
      bonus_rate: c.bonus_rate ?? 1.0,
      rate_tiers: c.rate_tiers ?? [],
      one_time_per_user: c.one_time_per_user ?? false,
      min_price_yen: c.min_price_yen ?? null,
      max_price_yen: c.max_price_yen ?? null,
      target_gender: c.target_gender ?? null,
    }
    setForm(initial)
    setOpenedSnapshot(JSON.stringify(initial))
    setPreviewUrl(c.image_url)
    setPendingDraft(null)
    loadDraft(c.id, initial)
    setShowForm(true)
  }

  // 完全に閉じる（下書きも消す）。保存成功時と「破棄して閉じる」で使う
  const closeForm = () => { clearDraft(editingId); setShowForm(false); setEditingId(null); setPreviewUrl(null); setPendingDraft(null) }

  // 閉じる操作の入口。未保存なら確認し、キャンセルなら何もしない。「閉じる」を選んだときは下書きは残す（次に開いたとき復元できる）
  const requestClose = () => {
    if (isDirty) {
      const ok = confirm('保存していない変更があります。閉じてもよろしいですか？\n（内容は下書きとして残り、次にこのキャンペーンを開いたときに復元できます）')
      if (!ok) return
      setShowForm(false); setEditingId(null); setPreviewUrl(null); setPendingDraft(null)
      return
    }
    closeForm()
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploadingImage(true)
    try {
      let uploadFile: File | Blob = file
      let ext = file.name.split('.').pop() ?? 'jpg'
      let mimeType = file.type
      if (isHeic(file)) {
        uploadFile = await heicToBlob(file)
        ext = 'jpg'
        mimeType = 'image/jpeg'
      } else {
        const compressed = await compressImage(file)
        uploadFile = compressed.blob
        ext = compressed.ext
        mimeType = `image/${ext}`
      }
      const formData = new FormData()
      formData.append('file', new File([uploadFile], `image.${ext}`, { type: mimeType }))
      const res = await fetch('/api/admin/campaigns/upload', { method: 'POST', body: formData })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        alert('画像アップロード失敗: ' + (errData.error ?? res.status))
        return null
      }
      const { url } = await res.json()
      return url
    } catch (e) {
      alert('画像処理エラー: ' + String(e))
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    const uploaded = await uploadImage(file)
    if (uploaded) {
      setForm(f => ({ ...f, image_url: uploaded }))
      setPreviewUrl(uploaded)
    } else {
      setPreviewUrl(form.image_url)
    }
  }

  const addCondition = () => {
    setForm(f => ({
      ...f,
      conditions: [...f.conditions, { condition_type: 'registered_at', operator: 'gte', value: '', value_to: '' }],
    }))
  }

  const updateCondition = (i: number, patch: Partial<Condition>) => {
    setForm(f => {
      const conditions = [...f.conditions]
      conditions[i] = { ...conditions[i], ...patch }
      return { ...f, conditions }
    })
  }

  const removeCondition = (i: number) => {
    setForm(f => ({ ...f, conditions: f.conditions.filter((_, idx) => idx !== i) }))
  }

  const reloadCampaigns = async () => {
    const listRes = await fetch('/api/admin/campaigns')
    if (listRes.ok) {
      const { campaigns: updated } = await listRes.json()
      setCampaigns(updated ?? [])
    }
  }

  const save = async () => {
    if (!form.name.trim()) { alert('キャンペーン名は必須です'); return }
    // 非公開 → 公開で保存すると、保存した瞬間（開始日時が未来ならその時刻）に対象者全員へお知らせメールが飛ぶので確認する
    const wasActive = editingId ? !!campaigns.find(c => c.id === editingId)?.is_active : false
    if (form.is_active && !wasActive) {
      const startsUtc = localInputToUtc(form.starts_at)
      const immediate = !startsUtc || new Date(startsUtc) <= new Date()
      const msg = immediate
        ? '公開すると、保存した瞬間に対象のユーザー全員へキャンペーンのお知らせメールが送られます（取り消せません）。\n\n公開して保存しますか？\n\n※人数を確かめたいときは「非公開（下書き）」で保存し、一覧のスイッチで公開すると送る人数が出ます'
        : `開始日時（${new Date(startsUtc!).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}）になると、対象のユーザー全員へお知らせメールが自動で送られます。\n\n公開して保存しますか？`
      if (!confirm(msg)) return
    }
    setSaving(true)
    const expandedConditions = form.conditions.flatMap(cond => {
      if (cond.condition_type === 'registered_at') {
        const res: { condition_type: string; operator: string; value: string }[] = []
        if (cond.value.trim()) res.push({ condition_type: 'registered_at', operator: 'gte', value: cond.value })
        if (cond.value_to?.trim()) res.push({ condition_type: 'registered_at', operator: 'lte', value: cond.value_to })
        return res
      }
      return cond.value.trim() ? [{ condition_type: cond.condition_type, operator: cond.operator, value: cond.value }] : []
    })
    const body = {
      ...form,
      starts_at: localInputToUtc(form.starts_at),
      ends_at: localInputToUtc(form.ends_at),
      conditions: expandedConditions,
      bonus_rate: form.bonus_rate ?? 1.0,
      one_time_per_user: form.one_time_per_user ?? false,
    }
    const url = editingId ? `/api/admin/campaigns/${editingId}` : '/api/admin/campaigns'
    const method = editingId ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      alert('保存失敗: ' + (errData.error ?? res.status))
      setSaving(false)
      return
    }

    await reloadCampaigns()
    setSaving(false)
    closeForm()
  }

  const toggleActive = async (id: string, current: boolean) => {
    const c = campaigns.find(c => c.id === id)
    if (!c) return
    // 公開にすると、その瞬間（開始日時が未来ならその時刻）に対象者全員へお知らせメールが飛ぶ。送る人数を出して確認する
    if (!current) {
      const count = await fetch(`/api/admin/campaigns/${id}/launch-preview`).then(r => r.ok ? r.json() : null).then(d => typeof d?.count === 'number' ? d.count : null).catch(() => null)
      const immediate = !c.starts_at || new Date(c.starts_at) <= new Date()
      const who = count == null ? '対象のユーザー全員' : `${count.toLocaleString()}人`
      const msg = immediate
        ? `公開すると、今すぐ ${who} にキャンペーンのお知らせメールが送られます（取り消せません）。\n\n公開しますか？`
        : `開始日時（${new Date(c.starts_at!).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}）に、その時点の対象者（今なら${who}）へお知らせメールが送られます。\n\n公開しますか？`
      if (!confirm(msg)) return
    }
    const res = await fetch(`/api/admin/campaigns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: c.name,
        image_url: c.image_url,
        catchphrase: c.catchphrase,
        description: c.description,
        cta_text: c.cta_text,
        cta_url: c.cta_url || '/payment',
        display_frequency: c.display_frequency,
        is_active: !current,
        starts_at: c.starts_at,
        ends_at: c.ends_at,
        conditions: c.campaign_conditions ?? [],
        bonus_rate: c.bonus_rate ?? 1.0,
        rate_tiers: c.rate_tiers ?? [],
        one_time_per_user: c.one_time_per_user ?? false,
        min_price_yen: c.min_price_yen ?? null,
        max_price_yen: c.max_price_yen ?? null,
        target_gender: c.target_gender ?? null,
      }),
    })
    if (res.ok) {
      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c))
    }
  }

  const deleteCampaign = async (id: string) => {
    if (!confirm('このキャンペーンを削除しますか？')) return
    setDeletingId(id)
    await fetch(`/api/admin/campaigns/${id}`, { method: 'DELETE' })
    setCampaigns(prev => prev.filter(c => c.id !== id))
    setDeletingId(null)
  }

  const conditionValueInput = (cond: Condition, i: number) => {
    if (cond.condition_type === 'registered_at') {
      return (
        <div className="flex items-center gap-1.5 flex-1">
          <input
            type="date"
            value={cond.value}
            onChange={e => updateCondition(i, { value: e.target.value })}
            className="input-warm text-xs px-2 py-1.5 flex-1 min-w-0"
          />
          <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">〜</span>
          <input
            type="date"
            value={cond.value_to ?? ''}
            onChange={e => updateCondition(i, { value_to: e.target.value })}
            className="input-warm text-xs px-2 py-1.5 flex-1 min-w-0"
          />
        </div>
      )
    }
    const placeholder = cond.condition_type === 'hours_since_registration' ? '例: 24' : cond.condition_type === 'purchase_count' ? '例: 3' : '例: 5000'
    const unit = CONDITION_UNITS[cond.condition_type]
    return (
      <div className="flex items-center gap-1.5 flex-1">
        <input
          type="number"
          min={0}
          placeholder={placeholder}
          value={cond.value}
          onChange={e => updateCondition(i, { value: e.target.value })}
          className="input-warm text-sm px-3 py-1.5 flex-1"
        />
        {unit && <span className="text-xs text-[var(--color-text-muted)] flex-shrink-0">{unit}</span>}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">キャンペーン管理</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-0.5">公開中のキャンペーンは、対象のユーザーに「上部の帯」「画像バナー」「購入画面の倍率表示」として出て、お知らせメールも送られます（日本時間 9〜22時）</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-1.5 px-4 py-2 text-sm">
          <Plus size={15} /> 新規作成
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="card p-10 text-center text-sm text-[var(--color-text-muted)]">
          キャンペーンがありません
        </div>
      ) : (
        <div className="space-y-3">
          {campaigns.map(c => (
            <div key={c.id} className="card p-4 flex gap-4 items-start">
              {c.image_url && (
                <img src={c.image_url} alt="" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm">{c.name}</p>
                    {c.catchphrase && <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{c.catchphrase}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-[var(--color-surface-2)] text-[var(--color-text-muted)]'}`}>
                      {c.is_active ? '公開中' : '非公開'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-[var(--color-text-muted)]">
                  {c.target_gender && (
                    <span className="font-medium" style={{ color: c.target_gender === 'female' ? '#db2777' : '#2563eb' }}>{c.target_gender === 'female' ? '女性のみ' : '男性のみ'}</span>
                  )}
                  {c.one_time_per_user && (
                    <span className="font-medium" style={{ color: '#f59e0b' }}>一人一回限り</span>
                  )}
                  {((c.bonus_rate ?? 1.0) > 1.0 || (c.rate_tiers ?? []).length > 0) && (
                    <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>
                      ×{c.bonus_rate}倍ボーナス
                      {(c.rate_tiers ?? []).map(t => `・¥${t.min_yen.toLocaleString()}以上は×${t.rate}`).join('')}
                      {(c.min_price_yen != null || c.max_price_yen != null) && (
                        <span className="font-normal text-[var(--color-text-muted)]">
                          {' '}(¥{(c.min_price_yen ?? 0).toLocaleString()}〜{c.max_price_yen != null ? `¥${c.max_price_yen.toLocaleString()}` : ''})
                        </span>
                      )}
                    </span>
                  )}
                  {c.image_url && <span>画像バナーの移動先: {c.cta_url || '/payment'}</span>}
                  <span>表示 {c.display_count.toLocaleString()}人</span>
                  {c.starts_at && <span>開始: {new Date(c.starts_at).toLocaleDateString('ja-JP')}</span>}
                  {c.ends_at && <span>終了: {new Date(c.ends_at).toLocaleDateString('ja-JP')}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(() => {
                    const gteReg = c.campaign_conditions.find(x => x.condition_type === 'registered_at' && x.operator === 'gte')
                    const lteReg = c.campaign_conditions.find(x => x.condition_type === 'registered_at' && x.operator === 'lte')
                    const others = c.campaign_conditions.filter(x => x.condition_type !== 'registered_at')
                    const items = [
                      ...((gteReg || lteReg) ? [describeCondition({ condition_type: 'registered_at', operator: 'gte', value: gteReg?.value ?? '', value_to: lteReg?.value ?? '' })] : []),
                      ...others.map(describeCondition),
                    ]
                    if (!items.length) return <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>対象: 全ユーザー</span>
                    return items.map((t, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>{t}</span>
                    ))
                  })()}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(c.id, c.is_active)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors">
                  {c.is_active
                    ? <ToggleRight size={20} style={{ color: 'var(--color-primary)' }} />
                    : <ToggleLeft size={20} style={{ color: 'var(--color-text-muted)' }} />}
                </button>
                <button onClick={() => openReminderModal(c)} title="未購入ユーザーに追いメール送信" className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors">
                  <Mail size={15} style={{ color: 'var(--color-text-muted)' }} />
                </button>
                <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg hover:bg-[var(--color-surface-2)] transition-colors">
                  <Pencil size={15} style={{ color: 'var(--color-text-muted)' }} />
                </button>
                <button onClick={() => deleteCampaign(c.id)} disabled={deletingId === c.id} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors">
                  {deletingId === c.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} className="text-red-400" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 作成・編集フォーム */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          {/* 背景クリックでは閉じない（誤タップで入力が消えるのを防ぐ）。閉じるのは × / キャンセル / Esc */}
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full sm:max-w-xl rounded-t-2xl sm:rounded-2xl z-10 overflow-y-auto"
            style={{ background: 'var(--color-surface)', maxHeight: '90vh' }}
          >
            <div className="sticky top-0 flex items-center justify-between px-5 py-4" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <h2 className="font-semibold flex items-center gap-2">
                {editingId ? 'キャンペーンを編集' : '新規キャンペーン'}
                {isDirty && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">未保存</span>}
              </h2>
              <button onClick={requestClose} title="閉じる"><X size={18} /></button>
            </div>

            {pendingDraft && (
              <div className="mx-5 mt-4 rounded-xl px-4 py-3 text-xs flex items-center gap-3 flex-wrap" style={{ background: '#fffbeb', border: '1px solid #fcd34d', color: '#92400e' }}>
                <span className="flex-1 min-w-[12rem]">前回保存せずに閉じた下書きがあります。</span>
                <button onClick={() => { setForm(pendingDraft); setPreviewUrl(pendingDraft.image_url); setPendingDraft(null) }} className="px-3 py-1 rounded-lg text-white text-xs font-medium" style={{ background: '#d97706' }}>下書きを復元</button>
                <button onClick={() => { clearDraft(editingId); setPendingDraft(null) }} className="px-3 py-1 rounded-lg text-xs border" style={{ borderColor: '#fcd34d' }}>破棄</button>
              </div>
            )}

            <div className="px-5 py-4 space-y-5">

              {/* ── 1. 内容 ── */}
              <Section no={1} title="内容" help="ユーザーに見える文言です。下のプレビューが実際の見え方です">
                <div>
                  <label className="block text-xs font-medium mb-1">キャンペーン名 <span className="text-red-400">*</span> <span className="font-normal text-[var(--color-text-muted)]">（管理用。ユーザーには見えません）</span></label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="例: 10月 新規ポイント2倍" className="input-warm w-full text-sm px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">キャッチコピー <span className="font-normal text-[var(--color-text-muted)]">（帯バナー・下部ナビの吹き出し・告知メールの件名）</span></label>
                  <input value={form.catchphrase} onChange={e => setForm(f => ({ ...f, catchphrase: e.target.value }))} placeholder="例: 今だけ！ポイント2倍" className="input-warm w-full text-sm px-3 py-2" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">ひとこと説明 <span className="font-normal text-[var(--color-text-muted)]">（帯バナーの続きと告知メールの本文）</span></label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="例: 10/15までに購入すると全ポイント2倍" rows={2} className="input-warm w-full text-sm px-3 py-2 resize-none" />
                </div>
                {/* 帯バナーのプレビュー（src/components/CampaignBanner.tsx と同じ文言の組み立て） */}
                <div>
                  <p className="text-[11px] text-[var(--color-text-muted)] mb-1 flex items-center gap-1"><Smartphone size={11} /> アプリ上部の帯バナー（プレビュー）</p>
                  <div className="rounded-lg overflow-hidden" style={{ background: 'linear-gradient(90deg, #c0255f 0%, #e8438f 25%, #ff7043 50%, #ffb300 65%, #e8438f 80%, #c0255f 100%)', height: 36 }}>
                    <div className="h-full flex items-center px-3 overflow-hidden whitespace-nowrap" style={{ color: '#fff', fontSize: 13, fontWeight: 800, letterSpacing: '0.06em', textShadow: '0 1px 6px rgba(0,0,0,0.3)' }}>
                      {['キャンペーン開催中', form.catchphrase, form.description, '今すぐチェック'].filter(Boolean).join('  　  ')}
                    </div>
                  </div>
                </div>
              </Section>

              {/* ── 2. 画像 ── */}
              <Section no={2} title="画像バナー（任意）" help="入れるとメッセージ一覧の上に画像バナーが出て、お知らせメールにも載ります。押すと下の移動先に飛びます">
                {previewUrl ? (
                  <div className="relative inline-block">
                    <img src={previewUrl} alt="" className="w-full max-h-40 object-cover rounded-xl" />
                    <button onClick={() => { setPreviewUrl(null); setForm(f => ({ ...f, image_url: null })) }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"><X size={12} /></button>
                  </div>
                ) : (
                  <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                    className="w-full h-24 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 text-sm transition-colors"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
                    {uploadingImage ? <Loader2 size={18} className="animate-spin" /> : <ImageIcon size={18} />}
                    <span className="text-xs">{uploadingImage ? 'アップロード中...' : '画像を選択'}</span>
                  </button>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                <div>
                  <label className="block text-xs font-medium mb-1">画像を押したときの移動先</label>
                  <select value={['/payment', '/shop', '/characters'].includes(form.cta_url) ? form.cta_url : '__custom'} onChange={e => { if (e.target.value !== '__custom') setForm(f => ({ ...f, cta_url: e.target.value })); else setForm(f => ({ ...f, cta_url: '' })) }} className="input-warm w-full text-sm px-3 py-2">
                    <option value="/payment">ポイント購入画面（/payment）</option>
                    <option value="/shop">ショップ（/shop）</option>
                    <option value="/characters">キャラ一覧（/characters）</option>
                    <option value="__custom">その他のURL</option>
                  </select>
                  {!['/payment', '/shop', '/characters'].includes(form.cta_url) && (
                    <input value={form.cta_url} onChange={e => setForm(f => ({ ...f, cta_url: e.target.value }))} placeholder="/payment" className="input-warm w-full text-sm px-3 py-2 mt-1.5" />
                  )}
                </div>
              </Section>

              {/* ── 3. 特典 ── */}
              <Section no={3} title="特典（ポイント倍率）" help="購入画面に「×2倍」と出て、実際の付与も倍になります。1.0 なら告知だけのキャンペーンになります">
                <div className="flex items-center gap-3">
                  <input type="number" min={1.0} max={10.0} step={0.1} value={form.bonus_rate ?? 1.0}
                    onChange={e => setForm(f => ({ ...f, bonus_rate: parseFloat(e.target.value) || 1.0 }))}
                    className="input-warm text-sm px-3 py-2 w-24" />
                  <span className="text-sm">倍</span>
                  <span className="text-xs text-[var(--color-text-muted)]">
                    {(form.bonus_rate ?? 1.0) > 1.0
                      ? `例: 3,000円の購入 → 基本300pt が ${Math.floor(300 * (form.bonus_rate ?? 1)).toLocaleString()}pt（パック固有のおまけより多いとき）`
                      : '倍率なし（告知のみ）'}
                  </span>
                </div>
                {(form.bonus_rate ?? 1.0) > 1.0 && (
                  <div className="rounded-lg p-3 space-y-2" style={{ background: 'var(--color-surface-2)' }}>
                    <p className="text-xs font-medium flex items-center gap-1"><CreditCard size={12} /> 倍率を付ける金額の範囲 <span className="font-normal text-[var(--color-text-muted)]">（空欄 = 全部の金額）</span></p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs">¥</span>
                      <input type="number" min={0} step={1000} placeholder="下限なし" value={form.min_price_yen ?? ''} onChange={e => setForm(f => ({ ...f, min_price_yen: e.target.value ? parseInt(e.target.value) : null }))} className="input-warm text-sm px-3 py-2 w-32" />
                      <span className="text-xs">〜 ¥</span>
                      <input type="number" min={0} step={1000} placeholder="上限なし" value={form.max_price_yen ?? ''} onChange={e => setForm(f => ({ ...f, max_price_yen: e.target.value ? parseInt(e.target.value) : null }))} className="input-warm text-sm px-3 py-2 w-32" />
                    </div>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      {(form.min_price_yen != null || form.max_price_yen != null)
                        ? `¥${(form.min_price_yen ?? 0).toLocaleString()} 〜 ${form.max_price_yen != null ? `¥${form.max_price_yen.toLocaleString()}` : '上限なし'} の購入だけ倍率が付きます（範囲外は通常ポイント）`
                        : 'いくらの購入でも倍率が付きます'}
                    </p>
                  </div>
                )}
                <div className="rounded-lg p-3 space-y-2" style={{ background: 'var(--color-surface-2)' }}>
                  <p className="text-xs font-medium">高額パックの倍率 <span className="font-normal text-[var(--color-text-muted)]">（上の倍率より高くしたいとき。例: 1万円以上は3倍）</span></p>
                  {(form.rate_tiers ?? []).map((t, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-xs">¥</span>
                      <input type="number" min={0} step={1000} value={t.min_yen}
                        onChange={e => setForm(f => ({ ...f, rate_tiers: (f.rate_tiers ?? []).map((x, j) => j === i ? { ...x, min_yen: Number(e.target.value) } : x) }))}
                        className="input-warm text-sm px-3 py-1.5 w-28" />
                      <span className="text-xs">以上のパックは</span>
                      <input type="number" min={1} step={0.1} value={t.rate}
                        onChange={e => setForm(f => ({ ...f, rate_tiers: (f.rate_tiers ?? []).map((x, j) => j === i ? { ...x, rate: Number(e.target.value) } : x) }))}
                        className="input-warm text-sm px-3 py-1.5 w-20" />
                      <span className="text-xs">倍</span>
                      <button type="button" onClick={() => setForm(f => ({ ...f, rate_tiers: (f.rate_tiers ?? []).filter((_, j) => j !== i) }))} className="text-red-400"><X size={14} /></button>
                    </div>
                  ))}
                  <button type="button" onClick={() => setForm(f => ({ ...f, rate_tiers: [...(f.rate_tiers ?? []), { min_yen: 10000, rate: Math.max(2, Number(f.bonus_rate) + 1) }] }))}
                    className="text-xs flex items-center gap-1" style={{ color: 'var(--color-primary)' }}><Plus size={12} /> 段階を追加</button>
                </div>
                <label className="flex items-start gap-3 cursor-pointer">
                  <div className="relative mt-0.5">
                    <input type="checkbox" className="sr-only" checked={form.one_time_per_user} onChange={e => setForm(f => ({ ...f, one_time_per_user: e.target.checked }))} />
                    <div className="w-10 h-6 rounded-full transition-colors" style={{ background: form.one_time_per_user ? 'var(--color-primary)' : 'var(--color-border)' }} />
                    <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform" style={{ left: form.one_time_per_user ? '22px' : '4px' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">一人一回限り</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {form.one_time_per_user
                        ? 'ON：このキャンペーンの倍率で1回買ったら、その人にはバナーも倍率も告知メールも出なくなります（ほかのキャンペーンや通常の購入は数えません）'
                        : 'OFF：終了まで何回買っても倍率が付き、バナーも出続けます'}
                    </p>
                  </div>
                </label>
              </Section>

              {/* ── 4. 対象 ── */}
              <Section no={4} title="対象にする人" help="条件を足すと、すべてに当てはまる人だけに出ます。条件なし = 全員">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-xs font-medium">性別</span>
                  {([[null, '全員'], ['male', '男性のみ'], ['female', '女性のみ']] as const).map(([v, label]) => (
                    <button key={label} type="button" onClick={() => setForm(f => ({ ...f, target_gender: v }))}
                      className="px-3 py-1.5 text-xs rounded-lg border transition-colors"
                      style={(form.target_gender ?? null) === v
                        ? { background: 'var(--color-primary)', color: '#fff', borderColor: 'var(--color-primary)' }
                        : { borderColor: 'var(--color-border)' }}>
                      {label}
                    </button>
                  ))}
                  <span className="text-[11px] text-[var(--color-text-muted)]">（バナー・倍率・告知メールすべてに効きます。性別未登録の人には「全員」以外は出ません）</span>
                </div>
                {form.conditions.length === 0 ? (
                  <p className="text-xs text-[var(--color-text-muted)]">条件なし → 全ユーザーが対象</p>
                ) : (
                  <div className="space-y-2">
                    {form.conditions.map((cond, i) => (
                      <div key={i} className="rounded-lg p-2.5 space-y-1.5" style={{ background: 'var(--color-surface-2)' }}>
                        <div className="flex items-center gap-2">
                          <select value={cond.condition_type} onChange={e => updateCondition(i, { condition_type: e.target.value as any, value: '', value_to: '' })} className="input-warm text-sm px-2 py-1.5 flex-shrink-0">
                            <option value="hours_since_registration">登録からの経過時間</option>
                            <option value="registered_at">登録日</option>
                            <option value="purchase_count">これまでの購入回数</option>
                            <option value="purchase_amount">これまでの購入額</option>
                          </select>
                          {conditionValueInput(cond, i)}
                          {cond.condition_type !== 'registered_at' && (
                            <select value={cond.operator} onChange={e => updateCondition(i, { operator: e.target.value as 'gte' | 'lte' | 'lt' })} className="input-warm text-sm px-2 py-1.5 flex-shrink-0">
                              <option value="gte">以上</option>
                              <option value="lte">以下</option>
                              <option value="lt">未満</option>
                            </select>
                          )}
                          <button onClick={() => removeCondition(i)} className="flex-shrink-0 text-red-400 hover:text-red-600"><X size={15} /></button>
                        </div>
                        <p className="text-[11px] text-[var(--color-text-muted)]">→ {describeCondition(cond) || '値を入力してください'}</p>
                      </div>
                    ))}
                  </div>
                )}
                <button onClick={addCondition} className="text-xs flex items-center gap-1" style={{ color: 'var(--color-primary)' }}><Plus size={12} /> 条件を追加</button>
                <p className="text-[11px] text-[var(--color-text-muted)]">よく使う例：「登録からの経過時間 24 以上」＋「登録からの経過時間 72 未満」＋「購入回数 0 以下」= 登録1〜3日目でまだ買っていない人</p>
              </Section>

              {/* ── 5. 期間と公開 ── */}
              <Section no={5} title="期間と公開" help="公開にすると、期間内の対象ユーザーに出ます。公開にした時点（開始日時が未来ならその時刻）で対象者へ告知メールが1回送られます">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">開始日時 <span className="font-normal text-[var(--color-text-muted)]">（空欄 = すぐ）</span></label>
                    <input type="datetime-local" value={form.starts_at ?? ''} onChange={e => setForm(f => ({ ...f, starts_at: e.target.value || null }))} className="input-warm w-full text-sm px-3 py-2" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">終了日時 <span className="font-normal text-[var(--color-text-muted)]">（空欄 = 止めるまで）</span></label>
                    <input type="datetime-local" value={form.ends_at ?? ''} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value || null }))} className="input-warm w-full text-sm px-3 py-2" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">上部の帯を出す回数</label>
                  <select value={form.display_frequency} onChange={e => setForm(f => ({ ...f, display_frequency: e.target.value as 'once' | 'always' }))} className="input-warm w-full text-sm px-3 py-2">
                    <option value="once">1人1回だけ（閉じたら次から出ない）</option>
                    <option value="always">毎回</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">公開状態</label>
                  <select value={form.is_active ? 'true' : 'false'} onChange={e => setForm(f => ({ ...f, is_active: e.target.value === 'true' }))} className="input-warm w-full text-sm px-3 py-2">
                    <option value="false">非公開（下書き）</option>
                    <option value="true">公開</option>
                  </select>
                </div>
              </Section>

              {/* ── どこに出るか ── */}
              <div className="rounded-xl p-3 text-[11px] space-y-1" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                <p className="font-medium text-[var(--color-text)] flex items-center gap-1"><Megaphone size={12} /> このキャンペーンが出る場所</p>
                <p>・アプリ上部の帯バナーと下部ナビの吹き出し：キャッチコピー＋ひとこと説明</p>
                <p>・メッセージ一覧の上：画像バナー（画像を入れたとき）</p>
                <p>・購入画面：「×◯倍」の表示と倍率付きのポイント数（倍率が 1.0 より大きいとき）</p>
                <p>・メール：公開時のお知らせ、登録からの経過時間を条件にした場合はその時刻になった人へ自動送信、24時間後・72時間後にまだ買っていない人へ追いメール、一覧の✉から手動の追いメール</p>
                <p>・文言は保存すると自動で各言語に訳され、ユーザーの表示言語で出ます</p>
              </div>
            </div>

            <div className="sticky bottom-0 px-5 py-4 flex gap-2 justify-end" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
              <button onClick={requestClose} className="btn-ghost px-4 py-2 text-sm">キャンセル</button>
              <button onClick={save} disabled={saving} className="btn-primary px-5 py-2 text-sm flex items-center gap-1.5">
                {saving && <Loader2 size={14} className="animate-spin" />}
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 追いメール送信モーダル */}
      {reminderCampaign && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl z-10 overflow-y-auto"
            style={{ background: 'var(--color-surface)', maxHeight: '90vh' }}
          >
            <div className="sticky top-0 flex items-center justify-between px-5 py-4" style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <div>
                <h2 className="font-semibold">追いメール送信</h2>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">キャンペーン期間中に未購入のユーザーへ一括送信</p>
              </div>
              <button onClick={closeReminderModal}><X size={18} /></button>
            </div>

            {reminderResult ? (
              <div className="px-5 py-10 text-center">
                <CheckCircle2 size={40} className="mx-auto mb-3" style={{ color: 'var(--color-primary)' }} />
                <p className="font-semibold text-lg">{reminderResult.sentCount}件 送信完了</p>
                {(reminderResult.alreadySent ?? 0) > 0 && <p className="text-xs text-[var(--color-text-muted)]">前に送った {reminderResult.alreadySent}人 には送っていません</p>}
                <p className="text-sm text-[var(--color-text-muted)] mt-1">購入済みユーザーは自動的に除外されました</p>
                <button onClick={closeReminderModal} className="btn-primary mt-6 px-6 py-2 text-sm">閉じる</button>
              </div>
            ) : (
              <>
                <div className="px-5 py-4 space-y-4">
                  <div>
                    <p className="text-[11px] text-[var(--color-text-muted)] mb-3">件名・本文を空欄のまま送ると、ユーザーの表示言語の定型文（終了までの残り時間・キャッチコピー・説明）で届きます。書いた場合はその文面がそのまま全員に届きます。</p>
                    <label className="block text-xs font-medium mb-1.5">件名 <span className="font-normal text-[var(--color-text-muted)]">（空欄 = 定型文）</span></label>
                    <input
                      type="text"
                      value={reminderSubject}
                      onChange={e => setReminderSubject(e.target.value)}
                      className="input-warm w-full text-sm px-3 py-2"
                      placeholder="例: あと4時間！キャンペーン終了まであとわずか！"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5">本文 <span className="font-normal text-[var(--color-text-muted)]">（空欄 = 定型文）</span></label>
                    <textarea
                      value={reminderBody}
                      onChange={e => setReminderBody(e.target.value)}
                      rows={6}
                      className="input-warm w-full text-sm px-3 py-2 resize-y"
                      placeholder="メール本文を入力..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1.5">CTAボタンのURL</label>
                      <input
                        type="text"
                        value={reminderCtaUrl}
                        onChange={e => setReminderCtaUrl(e.target.value)}
                        className="input-warm w-full text-sm px-3 py-2"
                        placeholder="/payment"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5">CTAボタンのテキスト</label>
                      <input
                        type="text"
                        value={reminderCtaLabel}
                        onChange={e => setReminderCtaLabel(e.target.value)}
                        className="input-warm w-full text-sm px-3 py-2"
                        placeholder="ポイントを購入する"
                      />
                    </div>
                  </div>
                  <div className="rounded-xl p-3 text-xs" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                    <span className="font-medium">対象：</span>
                    {reminderCampaign.starts_at || reminderCampaign.ends_at
                      ? `キャンペーンの対象者のうち、最初のお知らせメール（無ければキャンペーン作成）のあとに購入していない人（期間: ${reminderCampaign.starts_at ? new Date(reminderCampaign.starts_at).toLocaleDateString('ja-JP') : '開始〜'}${reminderCampaign.ends_at ? `〜${new Date(reminderCampaign.ends_at).toLocaleDateString('ja-JP')}` : ''}）`
                      : 'キャンペーンの対象者のうち、最初のお知らせメール（無ければキャンペーン作成）のあとに購入していない人'}
                  </div>
                </div>
                <div className="sticky bottom-0 px-5 py-4 flex gap-2 justify-end" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
                  <button onClick={closeReminderModal} className="btn-ghost px-4 py-2 text-sm">キャンセル</button>
                  <button
                    onClick={sendReminder}
                    disabled={sendingReminder}
                    className="btn-primary px-5 py-2 text-sm flex items-center gap-1.5"
                  >
                    {sendingReminder ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                    {sendingReminder ? '送信中...' : '送信する'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// フォームの区切り（番号・見出し・説明）
function Section({ no, title, help, children }: { no: number; title: string; help?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: 'var(--color-border)' }}>
      <div>
        <p className="text-sm font-semibold flex items-center gap-2">
          <span className="w-5 h-5 rounded-full text-[11px] flex items-center justify-center text-white" style={{ background: 'var(--color-primary)' }}>{no}</span>
          {title}
        </p>
        {help && <p className="text-[11px] text-[var(--color-text-muted)] mt-1 ml-7">{help}</p>}
      </div>
      {children}
    </div>
  )
}
