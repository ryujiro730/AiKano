'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Crown, Settings, Gift, Copy, Check, CreditCard, Store, Building2, RefreshCw } from 'lucide-react'
import { CardBrands, FamilyMartBadge, LawsonBadge, MinistopBadge, SeicomartBadge, PayPayBadge } from '@/components/icons/payment-brands'

// Stripe本番でコンビニ・PayPayの審査が通るまで非表示
const KONBINI_PAYPAY_ENABLED = false
import { PLANS } from '@/lib/plans'
import { PointPackageList } from '@/components/PointPackageList'
import type { Profile } from '@/types'
import { format } from 'date-fns'
import { DATE_FNS_LOCALE } from '@/i18n/date-locale'
import { logAction } from '@/lib/action-log'
import { useI18n } from '@/i18n/client'
import { fmt, gap } from '@/i18n/fmt'
import { planFeatures } from '@/lib/plan-i18n'
import { REFERRAL_BONUS, POINTS_PER_MESSAGE } from '@/lib/pricing'

export default function PaymentPage() {
  const { m, locale } = useI18n()
  const searchParams = useSearchParams()
  const justSubscribed = searchParams.get('subscribed') === 'true'
  const subscribedPlan = searchParams.get('plan')
  const isCanceled = searchParams.get('canceled') === 'true'
  const isPassPending = searchParams.get('pass') === 'pending'
  const pointsPurchased = searchParams.get('success') === 'true' ? Number(searchParams.get('points')) || null : null

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [buyingPass, setBuyingPass] = useState<string | null>(null)
  const [openingPortal, setOpeningPortal] = useState(false)
  const [copied, setCopied] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => { logAction('payment_page') }, [])

  // /payment#points で来たら、読み込み完了後にポイント購入欄へスクロール
  useEffect(() => {
    if (!loading && window.location.hash === '#points') {
      document.getElementById('points')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [loading])

  const handleSubscribe = async (planId: string) => {
    setSubscribing(planId)
    try {
      const res = await fetch('/api/stripe/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (!res.ok) { alert(fmt(m.payment.errorPrefix, { error: data.error ?? 'unknown' })); return }
      if (data.url) window.location.href = data.url
    } catch (e) { alert(fmt(m.payment.networkError, { error: String(e) })) }
    finally { setSubscribing(null) }
  }

  const handleBuyPass = async (planId: string) => {
    setBuyingPass(planId)
    try {
      const res = await fetch('/api/stripe/buy-pass', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
      const data = await res.json()
      if (!res.ok) { alert(fmt(m.payment.errorPrefix, { error: data.error ?? 'unknown' })); return }
      if (data.url) window.location.href = data.url
    } catch (e) { alert(fmt(m.payment.networkError, { error: String(e) })) }
    finally { setBuyingPass(null) }
  }

  const handleManageSubscription = async () => {
    setOpeningPortal(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch { alert(m.payment.portalFailed) }
    finally { setOpeningPortal(false) }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <Loader2 className="animate-spin text-[var(--color-primary)]" size={24} />
    </div>
  }

  const isSubscribed = (profile as any)?.subscription_status === 'active' || (profile as any)?.subscription_status === 'trialing'
  const currentPlan = (profile as any)?.subscription_plan ? PLANS[(profile as any).subscription_plan as keyof typeof PLANS] : null
  const messagesUsed = (profile as any)?.monthly_messages_used ?? 0
  const messagesLimit = (profile as any)?.monthly_messages_limit ?? 0
  const periodEnd = (profile as any)?.subscription_period_end ? new Date((profile as any).subscription_period_end) : null
  const usagePct = messagesLimit > 0 ? Math.min(100, messagesUsed / messagesLimit * 100) : 0
  const isOverLimit = messagesUsed >= messagesLimit && messagesLimit > 0
  const bonusValid = (profile as any)?.bonus_points_expires_at && new Date((profile as any).bonus_points_expires_at) > new Date()
  const pointBalance = (profile?.points ?? 0) + (bonusValid ? ((profile as any)?.bonus_points ?? 0) : 0)

  return (
    <div className="pt-2 max-w-lg">
      <h1 className="text-xl font-bold mb-2">{m.payment.title}</h1>
      <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
        {m.payment.lead}
      </p>

      {/* ─── 通知バナー ─── */}
      {justSubscribed && (
        <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: 'rgba(125,186,132,0.12)', border: '1px solid rgba(125,186,132,0.3)' }}>
          <p className="font-semibold mb-0.5" style={{ color: '#7ec850' }}>{m.payment.activated}</p>
          <p style={{ color: 'var(--color-text-muted)' }}>{fmt(m.payment.welcome, { name: subscribedPlan === 'standard' ? m.plans.standard : m.plans.premium })}</p>
        </div>
      )}
      {isPassPending && (
        <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
          <p className="font-semibold mb-0.5" style={{ color: '#f59e0b' }}>{m.payment.passPendingTitle}</p>
          <p style={{ color: 'var(--color-text-muted)' }}>{m.payment.passPendingBody}</p>
        </div>
      )}
      {pointsPurchased && (
        <div className="rounded-xl p-4 mb-5 text-sm" style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
          <p className="font-semibold mb-0.5" style={{ color: 'var(--color-primary)' }}>{fmt(m.payment.pointsThanks, { pt: pointsPurchased.toLocaleString() })}</p>
          <p style={{ color: 'var(--color-text-muted)' }}>{m.payment.pointsNote}</p>
        </div>
      )}
      {isCanceled && (
        <div className="card p-4 mb-5 text-sm" style={{ color: 'var(--color-text-muted)' }}>{m.payment.canceled}</div>
      )}

      {/* ─── 加入中：使用量表示 ─── */}
      {isSubscribed && currentPlan && (
        <div className="card p-5 mb-6" style={{ border: '1px solid var(--color-primary)' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown size={18} style={{ color: 'var(--color-primary)' }} />
              <span className="font-bold text-base">{fmt(m.plans.planSuffix, { name: m.plans[currentPlan.id] })}</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(125,186,132,0.15)', color: '#7ec850' }}>{m.payment.active}</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold" style={{ color: 'var(--color-text-muted)' }}>{m.payment.usageThisMonth}</span>
              <span className="text-xs font-bold" style={{ color: isOverLimit ? '#f87171' : 'var(--color-text)' }}>
                {fmt(m.payment.usage, { used: messagesUsed.toLocaleString(), limit: messagesLimit.toLocaleString() })}
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
              <div className="h-full rounded-full transition-all" style={{
                width: `${usagePct}%`,
                background: isOverLimit
                  ? 'linear-gradient(to right, #f87171, #ef4444)'
                  : 'var(--color-primary)',
              }} />
            </div>
            {isOverLimit && (
              <p className="text-xs mt-1.5" style={{ color: '#f87171' }}>
                {fmt(m.payment.overLimit, { pt: currentPlan.overage_points })}
              </p>
            )}
          </div>

          {periodEnd && (
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
              {fmt(m.payment.validUntil, { date: format(periodEnd, m.payment.datePattern, { locale: DATE_FNS_LOCALE[locale] }) })}
            </p>
          )}

          <button onClick={handleManageSubscription} disabled={openingPortal}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold disabled:opacity-60"
            style={{ background: 'var(--color-surface-2)', color: 'var(--color-text)' }}>
            {openingPortal ? <Loader2 size={15} className="animate-spin" /> : <Settings size={15} />}
            {m.payment.manage}
          </button>
        </div>
      )}

      {/* ─── プラン選択 ─── */}
      <div className="space-y-4 mb-6">
        {(Object.values(PLANS) as typeof PLANS[keyof typeof PLANS][]).map((plan) => (
          <div key={plan.id} className="card overflow-hidden"
            style={plan.id === 'premium' ? { border: '2px solid var(--color-primary)' } : {}}>

            {/* プランヘッダー */}
            <div className="p-5 pb-4">
              {plan.id === 'premium' && (
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md mb-2" style={{ background: 'var(--color-primary)', color: '#fff', letterSpacing: '0.04em' }}>{m.payment.recommended}</span>
              )}
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-bold text-base">{m.plans[plan.id]}</p>
                <p className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold tabular-nums">¥{plan.price_yen.toLocaleString()}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{m.payment.perMonth}</span>
                </p>
              </div>
              <ul className="space-y-1.5 mt-3">
                {planFeatures(plan.id, m).map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-[13px]" style={{ color: 'var(--color-text)' }}>
                    <Check size={14} strokeWidth={2.5} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* 支払い方法 */}
            {(profile as any)?.subscription_plan !== plan.id && (
              <div style={{ borderTop: '1px solid var(--color-border)' }}>
                <p className="text-[11px] font-bold px-5 pt-3 pb-2" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                  {m.payment.choosePayment}
                </p>

                {/* クレカ（自動更新） */}
                <button onClick={() => handleSubscribe(plan.id)} disabled={subscribing !== null || buyingPass !== null}
                  className="w-full flex items-start gap-3 px-5 py-3.5 transition-colors disabled:opacity-60"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      {subscribing === plan.id
                        ? <Loader2 size={14} className="animate-spin" style={{ color: '#6366f1' }} />
                        : <CreditCard size={14} style={{ color: '#6366f1' }} />}
                      <p className="text-sm font-semibold">{m.payment.card}</p>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      <RefreshCw size={9} className="inline mr-1" />{m.payment.cardNote}
                    </p>
                    <CardBrands />
                  </div>
                  <span className="text-xs font-bold mt-1 flex-shrink-0" style={{ color: 'var(--color-primary)' }}>→</span>
                </button>

                {/* コンビニ/PayPay（1回払い） */}
                {KONBINI_PAYPAY_ENABLED && <button onClick={() => handleBuyPass(plan.id)} disabled={subscribing !== null || buyingPass !== null}
                  className="w-full flex items-start gap-3 px-5 py-3.5 transition-colors disabled:opacity-60"
                  style={{ borderTop: '1px solid var(--color-border)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      {buyingPass === plan.id
                        ? <Loader2 size={14} className="animate-spin" style={{ color: '#22c55e' }} />
                        : <Store size={14} style={{ color: '#22c55e' }} />}
                      <p className="text-sm font-semibold">{m.payment.konbini}</p>
                    </div>
                    <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
                      {m.payment.konbiniNote}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap">
                      <FamilyMartBadge />
                      <LawsonBadge />
                      <MinistopBadge />
                      <SeicomartBadge />
                      <PayPayBadge />
                    </div>
                  </div>
                  <span className="text-xs font-bold mt-1 flex-shrink-0" style={{ color: 'var(--color-primary)' }}>→</span>
                </button>}

                {/* 銀行振込（1回払い）。日本の口座への振込なので日本語ユーザーのみ */}
                {locale === 'ja' && <a href={`/payment/bank-transfer?plan=${plan.id}`}
                  className="w-full flex items-center gap-3 px-5 py-3.5 transition-colors"
                  style={{ borderTop: '1px solid var(--color-border)', display: 'flex' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-surface-2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <Building2 size={14} style={{ color: '#ca8a04' }} />
                      <p className="text-sm font-semibold">{m.payment.bank}</p>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {m.payment.bankNote}
                    </p>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0" style={{ color: 'var(--color-primary)' }}>→</span>
                </a>}
              </div>
            )}

            {/* 加入中なら更新ボタン */}
            {isSubscribed && (profile as any)?.subscription_plan === plan.id && (
              <div className="px-5 py-3" style={{ borderTop: '1px solid var(--color-border)', background: 'rgba(125,186,132,0.06)' }}>
                <p className="text-xs font-semibold" style={{ color: '#16a34a' }}>✓ {m.payment.currentPlan}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ─── ポイント購入（会員・非会員とも）─── */}
      <div id="points" className="mb-6 scroll-mt-20">
        <div className="flex items-baseline justify-between mb-1">
          <h2 className="text-base font-bold">{m.payment.buyPoints}</h2>
          <span className="text-xs tabular-nums" style={{ color: 'var(--color-text-muted)' }}>
            {m.payment.balance} <strong style={{ color: 'var(--color-text)' }}>{pointBalance.toLocaleString()}pt</strong>
          </span>
        </div>
        <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
          {isSubscribed
            ? fmt(m.payment.pointsUseMember, { pt: PLANS.standard.overage_points })
            : fmt(m.payment.pointsUse, { pt: POINTS_PER_MESSAGE })}
        </p>
        <PointPackageList />
      </div>

      {/* 支払い方法比較表 */}
      <div className="card p-4 mb-6">
        <p className="text-xs font-bold mb-3" style={{ color: 'var(--color-text-muted)' }}>{m.payment.methodsTitle}</p>
        <table className="w-full text-xs">
          <thead>
            <tr style={{ color: 'var(--color-text-muted)' }}>
              <th className="text-left pb-2 font-semibold"></th>
              <th className="text-center pb-2 font-semibold">{m.payment.renewal}</th>
              <th className="text-center pb-2 font-semibold">{m.payment.activation}</th>
            </tr>
          </thead>
          <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            <tr>
              <td className="py-2 flex items-center gap-1.5"><CreditCard size={12} style={{ color: '#6366f1' }} />{m.payment.cardShort}</td>
              <td className="py-2 text-center">{m.payment.autoMonthly}</td>
              <td className="py-2 text-center">{m.payment.instant}</td>
            </tr>
            {KONBINI_PAYPAY_ENABLED && (
              <tr>
                <td className="py-2 flex items-center gap-1.5"><Store size={12} style={{ color: '#22c55e' }} />{m.payment.konbini}</td>
                <td className="py-2 text-center">{m.payment.manualMonth}</td>
                <td className="py-2 text-center">{m.payment.afterPayment}</td>
              </tr>
            )}
            <tr>
              <td className="py-2 flex items-center gap-1.5"><Building2 size={12} style={{ color: '#ca8a04' }} />{m.payment.bank}</td>
              <td className="py-2 text-center">{m.payment.manualMonth}</td>
              <td className="py-2 text-center">{m.payment.afterConfirm}</td>
            </tr>
          </tbody>
        </table>
      </div>



      {/* 友達紹介 */}
      {profile?.user_code && (() => {
        const referralUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/register?ref_by=${profile.user_code}`
        const handleCopy = () => {
          navigator.clipboard.writeText(referralUrl)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
        return (
          <div className="card p-5" style={{ border: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Gift size={16} style={{ color: 'var(--color-primary)' }} />
              <p className="font-bold text-sm">{m.payment.referralTitle}</p>
            </div>
            <p className="text-xs mb-3 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
              {m.payment.referralA.trim()}{gap(locale, 'x')}<span className="font-semibold" style={{ color: 'var(--color-primary)' }}>{fmt(m.payment.referralB, { pt: REFERRAL_BONUS }).trim()}</span>{gap(locale, m.payment.referralC.trim())}{m.payment.referralC.trim()}
            </p>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 rounded-xl text-xs font-mono truncate"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                {referralUrl}
              </div>
              <button onClick={handleCopy}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                style={{ background: copied ? 'rgba(125,186,132,0.15)' : 'var(--color-primary)', color: copied ? '#7ec850' : '#fff' }}>
                {copied ? <><Check size={13} />{m.payment.copied}</> : <><Copy size={13} />{m.payment.copy}</>}
              </button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
