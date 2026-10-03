'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Sparkles, History, Gift, Copy, Check, Crown, Zap, CheckCircle2, Settings } from 'lucide-react'
import { TOKEN_PACKAGES } from '@/types'
import { PLANS } from '@/lib/plans'
import type { Profile, PointTransaction } from '@/types'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const isSuccess = searchParams.get('success') === 'true'
  const isCanceled = searchParams.get('canceled') === 'true'
  const justSubscribed = searchParams.get('subscribed') === 'true'
  const subscribedPlan = searchParams.get('plan')

  const [profile, setProfile] = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<PointTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [openingPortal, setOpeningPortal] = useState(false)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const [profRes, txRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('point_transactions').select('*').eq('user_id', user.id)
          .order('created_at', { ascending: false }).limit(20),
      ])
      setProfile(profRes.data)
      setTransactions(txRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId)
    try {
      const res = await fetch('/api/stripe/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      if (!res.ok) {
        const err = await res.json()
        if (err.error === 'Plan not configured') {
          alert('このプランはまだ準備中です。しばらくお待ちください。')
          return
        }
        throw new Error()
      }
      let data: any
      try { data = await res.json() } catch { data = {} }
      if (!res.ok) {
        alert(`エラー ${res.status}: ${data.error ?? 'unknown'}`)
        return
      }
      if (data.url) window.location.href = data.url
    } catch (e) {
      alert('fetch失敗: ' + String(e))
    } finally {
      setSubscribing(null)
    }
  }

  const handleManageSubscription = async () => {
    setOpeningPortal(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      alert('管理ページへのアクセスに失敗しました')
    } finally {
      setOpeningPortal(false)
    }
  }

  const handlePurchase = async (pkg: typeof TOKEN_PACKAGES[0]) => {
    setPurchasing(pkg.id)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id, tokens: pkg.tokens, priceYen: pkg.price_yen }),
      })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      alert('決済の開始に失敗しました')
    } finally {
      setPurchasing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[var(--color-primary)]" size={24} />
      </div>
    )
  }

  const isSubscribed = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'
  const currentPlan = profile?.subscription_plan ? PLANS[profile.subscription_plan as keyof typeof PLANS] : null
  const balance = (profile?.points ?? 0) + (profile?.bonus_points ?? 0)
  const messagesUsed = profile?.monthly_messages_used ?? 0
  const messagesLimit = profile?.monthly_messages_limit ?? 0
  const periodEnd = profile?.subscription_period_end ? new Date(profile.subscription_period_end) : null

  return (
    <div className="pt-2 max-w-lg">
      <h1 className="text-xl font-bold mb-6">料金プラン</h1>

      {/* 決済結果 */}
      {justSubscribed && (
        <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: 'rgba(125,186,132,0.12)', border: '1px solid rgba(125,186,132,0.3)' }}>
          <p className="font-semibold mb-0.5" style={{ color: '#7ec850' }}>サブスクリプションが有効になりました！</p>
          <p className="text-[var(--color-text-muted)]">
            {subscribedPlan === 'standard' ? 'スタンダード' : subscribedPlan === 'premium' ? 'プレミアム' : ''}プランへようこそ。
          </p>
        </div>
      )}
      {isSuccess && (
        <div className="rounded-xl p-4 mb-6 text-sm" style={{ background: 'rgba(125,186,132,0.12)', border: '1px solid rgba(125,186,132,0.3)' }}>
          <p className="font-semibold" style={{ color: '#7ec850' }}>ポイント購入が完了しました！</p>
        </div>
      )}
      {isCanceled && (
        <div className="card p-4 mb-6 text-sm text-[var(--color-text-muted)]">購入をキャンセルしました</div>
      )}

      {/* ── サブスクリプション ── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">サブスクリプション</h2>

        {isSubscribed && currentPlan ? (
          /* 加入中の状態表示 */
          <div className="card p-5" style={{ border: '1px solid var(--color-primary)' }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Crown size={18} style={{ color: 'var(--color-primary)' }} />
                <span className="font-bold">{currentPlan.name}プラン</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(125,186,132,0.15)', color: '#7ec850' }}>
                有効
              </span>
            </div>

            {/* 月次使用量バー */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                <span>今月のメッセージ</span>
                <span>{messagesUsed} / {messagesLimit}通</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                <div className="h-full rounded-full transition-all"
                  style={{
                    width: `${messagesLimit > 0 ? Math.min(100, messagesUsed / messagesLimit * 100) : 0}%`,
                    background: messagesUsed >= messagesLimit ? '#f87171' : 'var(--color-primary)',
                  }} />
              </div>
              {messagesUsed >= messagesLimit && (
                <p className="text-xs mt-1" style={{ color: '#f87171' }}>
                  月間上限に達しました。超過分はポイント（{currentPlan.overage_points}pt/通）で利用できます。
                </p>
              )}
            </div>

            {periodEnd && (
              <p className="text-xs text-[var(--color-text-muted)] mb-4">
                次回更新: {format(periodEnd, 'yyyy年M月d日', { locale: ja })}
              </p>
            )}

            <button
              onClick={handleManageSubscription}
              disabled={openingPortal}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-opacity"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
            >
              {openingPortal ? <Loader2 size={15} className="animate-spin" /> : <Settings size={15} />}
              プランを管理する
            </button>
          </div>
        ) : (
          /* プランカード（未加入） */
          <div className="flex flex-col gap-3">
            {(Object.values(PLANS) as typeof PLANS[keyof typeof PLANS][]).map((plan) => (
              <div
                key={plan.id}
                className="card p-5"
                style={plan.id === 'premium' ? { border: '1px solid var(--color-primary)' } : {}}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    {plan.id === 'premium' && (
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles size={11} style={{ color: 'var(--color-primary)' }} />
                        <span className="text-[11px] font-bold" style={{ color: 'var(--color-primary)' }}>おすすめ</span>
                      </div>
                    )}
                    <p className="font-bold">{plan.name}</p>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-2xl font-bold">¥{plan.price_yen.toLocaleString()}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">/月</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribing !== null}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}
                  >
                    {subscribing === plan.id
                      ? <Loader2 size={14} className="animate-spin" />
                      : <Zap size={14} />}
                    加入する
                  </button>
                </div>

                <ul className="space-y-1.5">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                      <CheckCircle2 size={13} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="text-xs text-center text-[var(--color-text-muted)]">
              サブスクなしでも10pt/通でチャット可能
            </p>
          </div>
        )}
      </section>

      {/* ── ポイント購入 ── */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-3">ポイント購入</h2>

        {/* 現在の残高 */}
        <div className="card p-5 mb-4" style={{ background: 'linear-gradient(135deg, var(--color-surface-2), var(--color-surface))' }}>
          <p className="text-xs text-[var(--color-text-muted)] mb-1">現在の残高</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {balance.toLocaleString()}
            </span>
            <span className="text-sm text-[var(--color-text-muted)] mb-0.5">ポイント</span>
          </div>
          {isSubscribed && currentPlan && (
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              超過時: {currentPlan.overage_points}pt/通
            </p>
          )}
        </div>

        {/* プレリリース告知 */}
        <div className="rounded-2xl p-4 mb-4 flex gap-3"
          style={{ background: 'rgba(255,200,0,0.1)', border: '1px solid rgba(255,200,0,0.35)' }}>
          <span className="text-lg flex-shrink-0">🚀</span>
          <div>
            <p className="text-sm font-bold mb-1" style={{ color: '#b45309' }}>現在プレリリース中です</p>
            <p className="text-xs leading-relaxed" style={{ color: '#92400e' }}>
              以下の料金は正式リリース時の予定価格です。プレリリース期間中はすべての機能を<span className="font-bold">無料</span>でお使いいただけます。
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {TOKEN_PACKAGES.map((pkg) => {
            const bonusPct = pkg.bonus_points > 0 ? Math.round(pkg.bonus_points / (pkg.tokens - pkg.bonus_points) * 100) : 0
            return (
              <div
                key={pkg.id}
                className="card p-4 flex items-center gap-4 opacity-60"
                style={pkg.is_popular ? { borderColor: 'var(--color-primary)' } : {}}
              >
                <div className="flex-1 min-w-0">
                  {pkg.is_popular && (
                    <div className="flex items-center gap-1 mb-1">
                      <Sparkles size={11} style={{ color: 'var(--color-primary)' }} />
                      <span className="text-[11px] font-bold" style={{ color: 'var(--color-primary)' }}>人気No.1</span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span className="text-xl font-bold">{pkg.tokens.toLocaleString()}</span>
                    <span className="text-sm text-[var(--color-text-muted)]">pt</span>
                    {pkg.bonus_points > 0 && (
                      <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: 'rgba(232,121,160,0.15)', color: 'var(--color-primary)' }}>
                        +{bonusPct}% ボーナス
                      </span>
                    )}
                  </div>
                  {pkg.bonus_points > 0 && (
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      {(pkg.tokens - pkg.bonus_points).toLocaleString()}pt + ボーナス{pkg.bonus_points.toLocaleString()}pt
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right">
                    <p className="text-[10px] text-[var(--color-text-muted)]">予定価格</p>
                    <span className="text-lg font-bold">¥{pkg.price_yen.toLocaleString()}</span>
                  </div>
                  <button
                    disabled
                    className="px-4 py-2 text-sm rounded-[10px] font-semibold"
                    style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)', minWidth: '68px' }}
                  >
                    準備中
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 紹介プログラム */}
      {profile?.user_code && (() => {
        const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref_by=${profile.user_code}`
        const handleCopy = () => {
          navigator.clipboard.writeText(referralUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
        return (
          <div className="card p-5 mb-8" style={{ border: '1px solid var(--color-border-warm)', background: 'linear-gradient(135deg, rgba(249,168,184,0.08), rgba(232,121,160,0.05))' }}>
            <div className="flex items-center gap-2 mb-2">
              <Gift size={16} style={{ color: 'var(--color-primary)' }} />
              <p className="font-bold text-sm">友達紹介プログラム</p>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mb-4 leading-relaxed">
              あなたの紹介URLから友達が登録すると、<br />
              <span className="font-semibold" style={{ color: 'var(--color-primary)' }}>あなたも友達も1,000ポイント</span>もらえます！
            </p>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 rounded-xl text-xs font-mono truncate"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                {referralUrl}
              </div>
              <button
                onClick={handleCopy}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
                style={{ background: copied ? 'rgba(125,186,132,0.15)' : 'var(--color-primary)', color: copied ? '#7ec850' : '#fff' }}
              >
                {copied ? <><Check size={13} />コピー済み</> : <><Copy size={13} />URLをコピー</>}
              </button>
            </div>
          </div>
        )
      })()}

      {/* 注意書き */}
      <div className="text-xs text-[var(--color-text-muted)] space-y-1 mb-8 leading-relaxed">
        <p>・サブスクリプションはいつでもキャンセルできます</p>
        <p>・ポイントは購入日から有効で、有効期限はありません</p>
        <p>・購入したポイントの返金はできません</p>
        <p>・現在テストモードで動作しています（実際の請求は発生しません）</p>
        <p>・テストカード: 4242 4242 4242 4242 / 任意の有効期限 / 任意のCVC</p>
      </div>

      {/* 取引履歴 */}
      {transactions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <History size={15} className="text-[var(--color-text-muted)]" />
            <p className="text-sm font-semibold">購入・利用履歴</p>
          </div>
          <div className="card overflow-hidden">
            {transactions.map((tx, i) => (
              <div
                key={tx.id}
                className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: i < transactions.length - 1 ? '1px solid var(--color-border)' : 'none' }}
              >
                <div>
                  <p className="text-sm">{tx.description}</p>
                  <p className="text-[var(--color-text-muted)] text-xs">
                    {format(new Date(tx.created_at), 'yyyy/MM/dd HH:mm', { locale: ja })}
                  </p>
                </div>
                <span className="text-sm font-semibold"
                  style={{ color: tx.amount > 0 ? '#7ec850' : 'var(--color-text-muted)' }}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}pt
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
