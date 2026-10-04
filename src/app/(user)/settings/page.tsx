'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Loader2, Check, LogOut, KeyRound, Trash2, MessageSquare, Twitter, Share2 } from 'lucide-react'
import type { Profile } from '@/types'
import Link from 'next/link'

export default function SettingsPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [supportUnread, setSupportUnread] = useState(0)

  // シェアで枠解放
  const [shareInfo, setShareInfo] = useState<{ activatedCount: number; limit: number; shareCount: number; nextAvailable: string | null; canShareNow: boolean } | null>(null)
  const [shareUrl, setShareUrl] = useState('')
  const [shareSubmitting, setShareSubmitting] = useState(false)
  const [shareResult, setShareResult] = useState<{ ok: boolean; message: string } | null>(null)

  // パスワード変更
  const [showPwForm, setShowPwForm] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  // アカウント削除
  const [showDeleteForm, setShowDeleteForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleting, setDeleting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (data) {
        setProfile(data)
        // profile に display_name がなければ auth メタデータからフォールバック
        const name = data.display_name ?? user.user_metadata?.display_name ?? ''
        setDisplayName(name)
      }
      setLoading(false)
    }
    const fetchSupportUnread = () => {
      fetch('/api/support/unread-count').then(r => r.json()).then(d => setSupportUnread(d.count ?? 0)).catch(() => {})
    }
    load()
    fetchSupportUnread()
    const onVisible = () => { if (document.visibilityState === 'visible') fetchSupportUnread() }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

  useEffect(() => {
    fetch('/api/share/unlock').then(r => r.json()).then(data => {
      if (!data.error) setShareInfo(data)
    }).catch(() => {})
  }, [])

  const handleShareSubmit = async () => {
    if (!shareUrl.trim() || shareSubmitting) return
    setShareSubmitting(true)
    setShareResult(null)
    const res = await fetch('/api/share/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareUrl }),
    })
    const data = await res.json()
    setShareSubmitting(false)
    if (data.ok) {
      setShareResult({ ok: true, message: data.message ?? 'キャラクター枠が解放されました！' })
      setShareUrl('')
      fetch('/api/share/unlock').then(r => r.json()).then(d => { if (!d.error) setShareInfo(d) }).catch(() => {})
    } else {
      const msg = data.message ?? (data.error === 'weekly_limit_reached' ? '今週はすでにシェア済みです。次回は7日後から申請できます。' : '送信に失敗しました')
      setShareResult({ ok: false, message: msg })
    }
  }

  const handleSave = async () => {
    if (!profile || !displayName.trim()) return
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: displayName.trim() }),
    })
    setSaving(false)
    if (!res.ok) {
      const data = await res.json()
      alert('保存に失敗しました: ' + (data.error ?? ''))
      return
    }
    setProfile(prev => prev ? { ...prev, display_name: displayName.trim() } : prev)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleChangePassword = async () => {
    setPwError('')
    if (newPw.length < 8) { setPwError('パスワードは8文字以上にしてください'); return }
    if (newPw !== confirmPw) { setPwError('新しいパスワードが一致しません'); return }
    setPwSaving(true)
    // 現在のパスワードで再認証
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) { setPwError('ユーザー情報を取得できません'); setPwSaving(false); return }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: currentPw })
    if (signInError) { setPwError('現在のパスワードが正しくありません'); setPwSaving(false); return }
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) { setPwError(error.message); setPwSaving(false); return }
    setPwSaving(false)
    setPwSaved(true)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setTimeout(() => { setPwSaved(false); setShowPwForm(false) }, 2000)
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== '削除する') return
    setDeleting(true)
    const res = await fetch('/api/account/delete', { method: 'DELETE' })
    if (!res.ok) {
      alert('削除に失敗しました。しばらくしてから再試行してください。')
      setDeleting(false)
      return
    }
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={22} />
      </div>
    )
  }

  return (
    <div className="pt-2 max-w-sm">
      <h1 className="text-xl font-bold mb-6">設定</h1>

      {/* Profile */}
      <div className="card p-5 mb-4">
        <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-4">プロフィール</p>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">ニックネーム</label>
            <input
              type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="input-warm w-full px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">メールアドレス</label>
            <p className="text-sm text-[var(--color-text-muted)] px-1">{profile?.email}</p>
          </div>
          <button onClick={handleSave} disabled={saving || !displayName.trim()}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-60">
            {saving ? <Loader2 size={13} className="animate-spin" /> : saved ? <Check size={13} /> : null}
            {saved ? '保存しました' : '保存'}
          </button>
        </div>
      </div>

      {/* パスワード変更 */}
      <div className="card p-5 mb-4">
        <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-4">セキュリティ</p>
        <button
          onClick={() => { setShowPwForm(v => !v); setPwError(''); setPwSaved(false) }}
          className="flex items-center gap-2 text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
        >
          <KeyRound size={15} />
          パスワードを変更する
        </button>

        {showPwForm && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">現在のパスワード</label>
              <input
                type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)}
                className="input-warm w-full px-4 py-2.5 text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">新しいパスワード（8文字以上）</label>
              <input
                type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                className="input-warm w-full px-4 py-2.5 text-sm"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">新しいパスワード（確認）</label>
              <input
                type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                className="input-warm w-full px-4 py-2.5 text-sm"
                placeholder="••••••••"
              />
            </div>
            {pwError && <p className="text-red-400 text-xs">{pwError}</p>}
            {pwSaved && <p className="text-emerald-400 text-xs flex items-center gap-1"><Check size={12} />パスワードを変更しました</p>}
            <button
              onClick={handleChangePassword}
              disabled={pwSaving || !currentPw || !newPw || !confirmPw}
              className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-60"
            >
              {pwSaving ? <Loader2 size={13} className="animate-spin" /> : null}
              変更する
            </button>
          </div>
        )}
      </div>

      {/* アカウント削除 */}
      <div className="card p-5 mb-4">
        <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-4">アカウント</p>
        <button
          onClick={() => setShowDeleteForm(v => !v)}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 size={15} />
          アカウントを削除する
        </button>

        {showDeleteForm && (
          <div className="mt-4 space-y-3">
            <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
              削除すると、すべてのデータ（会話履歴・ポイント）が完全に削除されます。この操作は取り消せません。
            </p>
            <div>
              <label className="text-xs text-[var(--color-text-muted)] mb-1.5 block">
                確認のため <span className="text-[var(--color-text)]">「削除する」</span> と入力してください
              </label>
              <input
                type="text" value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
                className="input-warm w-full px-4 py-2.5 text-sm"
                placeholder="削除する"
              />
            </div>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirm !== '削除する'}
              className="w-full py-2.5 rounded-xl text-sm text-red-400 flex items-center justify-center gap-2 border border-red-900/40 hover:bg-red-950/30 transition-colors disabled:opacity-40"
            >
              {deleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
              アカウントを完全に削除する
            </button>
          </div>
        )}
      </div>

      {/* SNSシェアでキャラ解放 */}
      <div className="card p-5 mb-4">
        <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-4">キャラクター枠の解放</p>
        {shareInfo && (
          <p className="text-sm mb-3">
            現在: <strong>{shareInfo.activatedCount} / {shareInfo.limit}人</strong>
            <span className="text-xs text-[var(--color-text-muted)] ml-2">（SNSシェアで+1枠）</span>
          </p>
        )}

        {/* シェアリンク */}
        <div className="space-y-2 mb-4">
          <p className="text-xs text-[var(--color-text-muted)]">下記SNSでシェアして投稿URLを送信してください</p>
          <div className="flex flex-wrap gap-2">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent('AIと本当のカップルみたいに話せる！#アイカノ を試してみたよ → https://aikano.chat')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <Twitter size={13} /> X
            </a>
            <a
              href={`https://www.threads.net/intent/post?text=${encodeURIComponent('AIと本当のカップルみたいに話せる！#アイカノ を試してみたよ → https://aikano.chat')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.473 12.01v-.017c.027-3.579.877-6.43 2.522-8.483C5.845 1.205 8.6.023 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.593 12c.023 3.086.714 5.496 2.052 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.583-1.315-.883-2.378-.894a4.1 4.1 0 0 0-.066.001c-.8 0-2.143.22-2.942 1.614l-1.768-1.013C8.084 4.644 9.953 4 12.066 4c.046 0 .092 0 .139.001 1.64.017 2.913.534 3.785 1.538.747.864 1.14 2.044 1.166 3.51a8.66 8.66 0 0 1 1.56.76c1.063.652 1.822 1.52 2.24 2.515.71 1.629.697 4.223-1.5 6.364C17.752 20.59 15.441 21 12.186 24zm.178-9.662a6.217 6.217 0 0 0-.813.046c-.857.055-1.58.327-2.025.77-.35.347-.5.79-.47 1.355.06 1.147 1.109 1.81 2.76 1.72 1.084-.059 1.874-.435 2.346-1.117.443-.64.618-1.486.622-2.5a12.29 12.29 0 0 0-2.42-.274z"/></svg>
              Threads
            </a>
            <a
              href={`https://www.facebook.com/sharer.php?u=${encodeURIComponent('https://aikano.chat')}&quote=${encodeURIComponent('AIと本当のカップルみたいに話せる！#アイカノ')}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-opacity hover:opacity-80"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </a>
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
              title="Instagramアプリから投稿後、URLをコピーしてください"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              Instagram
            </span>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            ※ Instagramはアプリで投稿後、投稿のURLをコピーして貼り付けてください
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-xs text-[var(--color-text-muted)] block">シェアした投稿のURLを貼り付け</label>
          <input
            type="url"
            value={shareUrl}
            onChange={e => setShareUrl(e.target.value)}
            placeholder="X / Threads / Facebook / Instagram の投稿URL"
            className="input-warm w-full px-4 py-2.5 text-sm"
          />
          {shareInfo && !shareInfo.canShareNow && shareInfo.nextAvailable && (
            <p className="text-xs text-[var(--color-text-muted)]">
              次回申請可能日: {new Date(shareInfo.nextAvailable).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}
            </p>
          )}
          {shareResult && (
            <p className={`text-xs flex items-center gap-1 ${shareResult.ok ? 'text-emerald-400' : 'text-red-400'}`}>
              {shareResult.ok ? <Check size={12} /> : null}
              {shareResult.message}
            </p>
          )}
          <button
            onClick={handleShareSubmit}
            disabled={shareSubmitting || !shareUrl.trim() || (shareInfo ? !shareInfo.canShareNow : false)}
            className="btn-primary px-4 py-2 text-sm flex items-center gap-1.5 disabled:opacity-60"
          >
            {shareSubmitting ? <Loader2 size={13} className="animate-spin" /> : <Share2 size={13} />}
            URLを送信して枠を解放
          </button>
        </div>
      </div>

      {/* お問い合わせ */}
      <div className="card p-5 mb-4">
        <p className="text-xs text-[var(--color-text-muted)] font-medium uppercase tracking-wider mb-4">サポート</p>
        <Link href="/support" className="flex items-center gap-2 text-sm text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
          <MessageSquare size={15} />
          お問い合わせ・サポート
          {supportUnread > 0 && (
            <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[11px] font-bold text-white" style={{ background: 'var(--color-primary)' }}>
              {supportUnread}
            </span>
          )}
        </Link>
      </div>

      {/* Sign out */}
      <button onClick={handleSignOut}
        className="w-full py-2.5 rounded-xl text-sm text-red-400 flex items-center justify-center gap-2 border border-red-900/40 hover:bg-red-950/30 transition-colors">
        <LogOut size={14} />
        ログアウト
      </button>

    </div>
  )
}
