'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ChevronLeft, Copy, Check, Building2, AlertCircle, ImageIcon, X, CheckCircle2, Loader2 } from 'lucide-react'
import { PLANS, type PlanId } from '@/lib/plans'
import { createClient } from '@/lib/supabase/client'

const BANK = {
  bank: '三井住友銀行',
  branch: 'トランクNORTH支店',
  type: '普通',
  accountNumber: '0808359',
  name: '合同会社　ＴＪＹＭ',
}

async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const MAX = 1200
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX }
        else { width = Math.round(width * MAX / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width; canvas.height = height
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height)
      canvas.toBlob(b => resolve(b ?? file), 'image/webp', 0.85)
    }
    img.src = url
  })
}

function BankTransferContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get('plan') as PlanId | null
  const plan = planId ? PLANS[planId] : null

  const [copied, setCopied] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    if (!plan) { router.replace('/payment'); return }
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id)
    })
  }, [])

  useEffect(() => {
    if (!selectedImage) { setPreviewUrl(null); return }
    const url = URL.createObjectURL(selectedImage)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [selectedImage])

  if (!plan) return null

  const copy = async (value: string, key: string) => {
    await navigator.clipboard.writeText(value).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const uploadReceipt = async (file: File): Promise<string | null> => {
    if (!userId) return null
    const compressed = await compressImage(file)
    const path = `receipts/${userId}/${Date.now()}.webp`
    const { error } = await supabase.storage.from('avatars').upload(path, compressed, { contentType: 'image/webp' })
    if (error) return null
    return supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl
  }

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    setError(null)

    let receiptUrl: string | null = null
    if (selectedImage) {
      receiptUrl = await uploadReceipt(selectedImage)
      if (!receiptUrl) {
        setError('画像のアップロードに失敗しました。再度お試しください。')
        setSubmitting(false)
        return
      }
    }

    const res = await fetch('/api/bank-transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan_id: planId, receipt_url: receiptUrl }),
    })

    setSubmitting(false)
    if (res.ok) { setDone(true) }
    else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? '送信に失敗しました。再度お試しください。')
    }
  }

  const CopyBtn = ({ value, id }: { value: string; id: string }) => (
    <button
      onClick={() => copy(value, id)}
      className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all flex-shrink-0"
      style={{
        background: copied === id ? 'rgba(125,186,132,0.15)' : 'var(--color-surface-2)',
        color: copied === id ? '#7ec850' : 'var(--color-text-muted)',
        border: '1px solid var(--color-border)',
      }}
    >
      {copied === id ? <Check size={11} /> : <Copy size={11} />}
      {copied === id ? 'コピー済み' : 'コピー'}
    </button>
  )

  if (done) {
    return (
      <div className="pt-2 max-w-lg flex flex-col items-center text-center py-16 gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(125,186,132,0.15)' }}>
          <CheckCircle2 size={36} style={{ color: '#7ec850' }} />
        </div>
        <h1 className="text-xl font-bold">申請を受け付けました</h1>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          スタッフが着金を確認次第（通常1〜2営業日以内）、<br />プランを有効化します。
        </p>
        <button
          onClick={() => router.push('/payment')}
          className="mt-4 px-6 py-3 rounded-2xl font-bold text-white"
          style={{ background: 'var(--color-primary)' }}
        >
          プランページへ戻る
        </button>
      </div>
    )
  }

  return (
    <div className="pt-2 max-w-lg pb-16">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 mb-5 text-sm transition-colors"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <ChevronLeft size={16} />
        戻る
      </button>

      <h1 className="text-xl font-bold mb-6 flex items-center gap-2">
        <Building2 size={20} style={{ color: 'var(--color-primary)' }} />
        銀行振込
      </h1>

      {/* 購入内容 */}
      <div className="card p-4 mb-6">
        <p className="text-xs mb-1" style={{ color: 'var(--color-text-muted)' }}>お申し込み内容</p>
        <p className="text-lg font-bold">{plan.name}プラン（1ヶ月）</p>
        <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--color-primary)' }}>
          ¥{plan.price_yen.toLocaleString()}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
          振込確認後30日間有効 · {plan.monthly_messages}通/月
        </p>
      </div>

      {/* 振込先 */}
      <div className="mb-6">
        <h2 className="text-sm font-bold mb-3">振込先口座</h2>
        <div className="card overflow-hidden">
          {[
            { label: '銀行名', value: BANK.bank, key: 'bank' },
            { label: '支店名', value: BANK.branch, key: 'branch' },
            { label: '科目', value: BANK.type, key: null },
            { label: '口座番号', value: BANK.accountNumber, key: 'accountNumber', large: true },
            { label: '口座名義', value: BANK.name, key: 'name' },
          ].map(({ label, value, key, large }) => (
            <div key={label} className="flex items-center justify-between py-3 px-4"
              style={{ borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-xs w-20 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }}>{label}</span>
              <span className={`flex-1 font-${large ? 'bold text-xl' : 'semibold text-sm'}`}
                style={large ? { color: 'var(--color-primary)' } : {}}>
                {value}
              </span>
              {key && <CopyBtn value={value} id={key} />}
            </div>
          ))}
        </div>
      </div>

      {/* 注意 */}
      <div className="flex gap-2.5 p-4 rounded-xl mb-6"
        style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}>
        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: '#ca8a04' }} />
        <div className="text-xs leading-relaxed" style={{ color: '#92400e' }}>
          <p className="font-semibold mb-1" style={{ color: '#b45309' }}>ご注意</p>
          <p>・振込金額はちょうど ¥{plan.price_yen.toLocaleString()} でお願いします</p>
          <p>・振込手数料はお客様負担です</p>
          <p>・振込人名義は確認に使用します。正確に入力してください</p>
        </div>
      </div>

      {/* 明細アップロード */}
      <div className="mb-6">
        <h2 className="text-sm font-bold mb-1">振込完了後の申告</h2>
        <p className="text-xs mb-4 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
          振込が完了したら、振込明細のスクリーンショットを添付して申告してください。<br />
          スタッフが確認後にプランを有効化します（通常1〜2営業日）。
        </p>

        <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) setSelectedImage(f); e.target.value = '' }} />

        {previewUrl ? (
          <div className="relative inline-block mb-4 w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="振込明細" className="w-full max-h-64 object-contain rounded-xl border"
              style={{ borderColor: 'var(--color-border)' }} />
            <button onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-white"
              style={{ background: 'rgba(0,0,0,0.6)' }}>
              <X size={13} />
            </button>
          </div>
        ) : (
          <button onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-2 py-6 rounded-xl border-2 border-dashed mb-4 transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
            <ImageIcon size={24} />
            <span className="text-sm">振込明細の画像を添付（推奨）</span>
            <span className="text-xs">タップして選択</span>
          </button>
        )}

        {error && (
          <div className="mb-3 p-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#dc2626' }}>
            {error}
          </div>
        )}

        <button onClick={handleSubmit} disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white disabled:opacity-60"
          style={{ background: 'var(--color-primary)' }}>
          {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
          {submitting ? '送信中...' : '振込完了を申告する'}
        </button>
      </div>
    </div>
  )
}

export default function BankTransferPage() {
  return <Suspense><BankTransferContent /></Suspense>
}
