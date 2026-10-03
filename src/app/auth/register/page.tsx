'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2, MailCheck } from 'lucide-react'
import { trackRegisterPageView } from '@/lib/gtag'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref') || params.get('source')
    if (ref) sessionStorage.setItem('referral_source', ref)
    const article = params.get('article')
    if (article) sessionStorage.setItem('referral_article', article)
    const refBy = params.get('ref_by')
    if (refBy) sessionStorage.setItem('referral_by_code', refBy)
    trackRegisterPageView({ ref: ref ?? undefined })

    // UTMパラメータをURL→localStorageの順で読み sessionStorage にも保存
    let storedUtm: Record<string, string> = {}
    try { storedUtm = JSON.parse(localStorage.getItem('utm_attr') ?? '{}') } catch { /* noop */ }
    const utmSource   = params.get('utm_source')   ?? storedUtm.utm_source
    const utmMedium   = params.get('utm_medium')   ?? storedUtm.utm_medium
    const utmCampaign = params.get('utm_campaign') ?? storedUtm.utm_campaign
    const utmContent  = params.get('utm_content')  ?? storedUtm.utm_content
    const utmTerm     = params.get('utm_term')     ?? storedUtm.utm_term
    const fbclid      = params.get('fbclid')       ?? storedUtm.fbclid
    if (utmSource)   sessionStorage.setItem('utm_source',   utmSource)
    if (utmMedium)   sessionStorage.setItem('utm_medium',   utmMedium)
    if (utmCampaign) sessionStorage.setItem('utm_campaign', utmCampaign)
    if (utmContent)  sessionStorage.setItem('utm_content',  utmContent)
    if (utmTerm)     sessionStorage.setItem('utm_term',     utmTerm)
    if (fbclid)      sessionStorage.setItem('fbclid',       fbclid)
    const gclid = params.get('gclid')
    if (gclid) sessionStorage.setItem('gclid', gclid)
  }, [])

  const handleGoogle = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // メールアドレスの重複チェック
    try {
      const checkRes = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const checkData = await checkRes.json()
      if (checkData.exists) {
        setError('このメールアドレスはすでに登録されています')
        setLoading(false)
        return
      }
    } catch {
      // チェック失敗時はそのまま続行
    }

    // user_metadata に UTM を入れておく（メール確認を別ブラウザで開いた場合のフォールバック）
    const utmMeta: Record<string, string> = {}
    ;['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].forEach(k => {
      const v = sessionStorage.getItem(k)
      if (v) utmMeta[k] = v
    })
    const refSource = sessionStorage.getItem('referral_source')
    if (refSource) utmMeta['referral_source'] = refSource

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: Object.keys(utmMeta).length > 0 ? utmMeta : undefined,
      },
    })

    if (error) { setError(error.message); setLoading(false); return }

    setDone(true)
  }

  if (done) {
    return (
      <div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
          <MailCheck size={26} />
        </div>
        <h1 className="text-2xl font-bold mb-3">確認メールを送りました</h1>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed mb-4">
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{email}</span> に確認メールを送りました。
        </p>
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
          メール内の<strong style={{ color: 'var(--color-text)' }}>「メールアドレスを確認する」</strong>ボタンをクリックして登録を完了してください。
        </p>
        <p className="text-[var(--color-text-muted)] text-xs mt-5 leading-relaxed">
          メールが届かない場合は迷惑メールフォルダをご確認ください。
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-[26px] font-bold leading-tight mb-3">AIの女の子と、<br />今すぐ話そう</h1>
      <div className="flex flex-wrap gap-1.5 mb-7">
        {['登録無料', '最初の2通無料', '30秒で完了'].map(t => (
          <span key={t} className="text-[11px] font-bold px-2 py-1 rounded-md"
            style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>{t}</span>
        ))}
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">メールアドレス</label>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)} required
            className="input-warm w-full px-4 text-[16px]" style={{ height: 50 }}
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">パスワード（8文字以上）</label>
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            required minLength={8}
            className="input-warm w-full px-4 text-[16px]" style={{ height: 50 }}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        {/* 同意チェックボックス */}
        <label className="flex items-start gap-3 cursor-pointer select-none rounded-[10px] p-3"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
          <input
            type="checkbox"
            checked={consentChecked}
            onChange={e => setConsentChecked(e.target.checked)}
            className="mt-0.5 flex-shrink-0 accent-[var(--color-primary)]"
            style={{ width: '16px', height: '16px' }}
          />
          <span className="text-xs text-[var(--color-text-muted)] leading-relaxed">
            会話内容はサービス改善・AI学習のためスタッフが確認する場合があります。また、
            <Link href="/legal/terms" className="underline" style={{ color: 'var(--color-primary)' }}>利用規約</Link>・
            <Link href="/legal/privacy" className="underline" style={{ color: 'var(--color-primary)' }}>プライバシーポリシー</Link>
            に同意します。
          </span>
        </label>

        <button type="submit" disabled={loading || !consentChecked}
          className="btn-primary w-full flex items-center justify-center gap-2 font-bold disabled:opacity-60" style={{ height: 52, fontSize: 15 }}>
          {loading && <Loader2 size={15} className="animate-spin" />}
          登録して話しかける
        </button>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
        <span className="text-xs text-[var(--color-text-muted)]">または</span>
        <div className="flex-1 h-px" style={{ background: 'var(--color-border)' }} />
      </div>

      <button type="button" onClick={handleGoogle} disabled={!consentChecked}
        className="w-full flex items-center justify-center gap-2.5 rounded-[10px] text-sm font-semibold transition-opacity hover:opacity-80 disabled:opacity-40"
        style={{ height: 50, background: '#fff', border: '1px solid var(--color-border-warm)', color: 'var(--color-text)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Googleで登録
      </button>

      <p className="text-[var(--color-text-muted)] text-sm mt-5 text-center">
        すでに登録済みの方は{' '}
        <Link href="/auth/login" className="hover:underline" style={{ color: 'var(--color-primary)' }}>
          ログイン
        </Link>
      </p>
    </div>
  )
}
