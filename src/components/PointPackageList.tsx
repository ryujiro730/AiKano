'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { CardBrands, FamilyMartBadge, LawsonBadge, MinistopBadge, SeicomartBadge } from '@/components/icons/payment-brands'
import { TOKEN_PACKAGES, FIRST_PACKAGE } from '@/types'
import { POINTS_PER_MESSAGE } from '@/lib/pricing'
import { logAction } from '@/lib/action-log'
import { pointsForPackage, isCampaignTarget, type PurchaseCampaign, toPurchaseCampaign, campaignRateFor, campaignMaxRate } from '@/lib/point-packages'
import { useI18n } from '@/i18n/client'
import { fmt } from '@/i18n/fmt'

/**
 * ポイントパック一覧＋購入ボタン。購入ダイアログと料金プランページで共用。
 * 表示ポイントはサーバーの付与と同じ pointsForPackage で計算する。
 * shortage を渡すと、不足分をカバーできるパックを先頭に並べ、足りないパックを薄く表示する。
 */
export function PointPackageList({ shortage = 0 }: { shortage?: number }) {
  const { m } = useI18n()
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<PurchaseCampaign | null>(null)
  // 初回限定パック（課金したことがない人だけ・見せてから24時間。期限はサーバーで決まり、本当に切れる）
  const [offerEnds, setOfferEnds] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    fetch('/api/points/first-offer', { method: 'POST' })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.eligible && d.expiresAt) setOfferEnds(new Date(d.expiresAt).getTime()) })
      .catch(() => {})
  }, [])
  useEffect(() => {
    if (!offerEnds) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [offerEnds])
  const offerLeft = offerEnds ? offerEnds - now : 0

  useEffect(() => {
    fetch('/api/campaigns/active?purchase=true')
      .then(r => r.ok ? r.json() : { campaign: null })
      .then(d => {
        const c = d?.campaign
        if (!c) return
        setCampaign(toPurchaseCampaign(c))
      })
      .catch(() => {})
  }, [])

  const handlePurchase = async (pkg: typeof TOKEN_PACKAGES[0]) => {
    setPurchasing(pkg.id)
    logAction('point_purchase', { metadata: { price_yen: pkg.price_yen, tokens: pointsForPackage(pkg, campaign) } })
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id }),
      })
      if (!res.ok) throw new Error()
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      alert(m.packages.checkoutFailed)
    } finally {
      setPurchasing(null)
    }
  }

  const covering = TOKEN_PACKAGES.filter(p => pointsForPackage(p, campaign) >= shortage)
  const featuredId = (covering.find(p => p.is_popular) ?? covering[0])?.id

  // 不足分をカバーできる最小パックを先頭に
  const sorted = [...TOKEN_PACKAGES].sort((a, b) => {
    const aCover = pointsForPackage(a, campaign) >= shortage
    const bCover = pointsForPackage(b, campaign) >= shortage
    if (aCover && !bCover) return -1
    if (!aCover && bCover) return 1
    return a.price_yen - b.price_yen
  })

  const hms = (ms: number) => {
    const s = Math.max(0, Math.floor(ms / 1000))
    return `${String(Math.floor(s / 3600)).padStart(2, '0')}:${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-2.5">
      {offerLeft > 0 && (
        <button onClick={() => handlePurchase(FIRST_PACKAGE)} disabled={!!purchasing}
          className="relative w-full text-left px-4 py-3.5 rounded-xl overflow-hidden disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #ff7aa8 0%, #d93a72 100%)', color: '#fff', boxShadow: '0 6px 18px rgba(217,58,114,0.35)' }}>
          <span className="absolute top-2 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums" style={{ background: 'rgba(255,255,255,0.25)' }}>
            {fmt(m.packages.firstOfferEnds, { time: hms(offerLeft) })}
          </span>
          <p className="text-[11px] font-black tracking-wider opacity-95">{m.packages.firstOffer}</p>
          <p className="text-lg font-black mt-0.5">
            {fmt(m.packages.firstOfferDesc, { price: FIRST_PACKAGE.price_yen.toLocaleString(), pt: FIRST_PACKAGE.tokens, n: Math.floor(FIRST_PACKAGE.tokens / POINTS_PER_MESSAGE) })}
          </p>
          <p className="text-[11px] opacity-90 mt-0.5">{m.packages.firstOfferNote}</p>
          {purchasing === FIRST_PACKAGE.id && <p className="text-[11px] mt-1">{m.packages.processing}</p>}
        </button>
      )}
      {campaign && campaignMaxRate(campaign) > 1 && (
        <div className="rounded-xl px-4 py-2.5 flex items-center gap-2 mb-1"
          style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
          <Sparkles size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <p className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
            {campaignMaxRate(campaign) > campaign.bonus_rate
              ? fmt(m.packages.campaignUpTo, { rate: campaignMaxRate(campaign) })
              : fmt(m.packages.campaign, { rate: campaign.bonus_rate })}
          </p>
        </div>
      )}
      {sorted.map((pkg) => {
        const points = pointsForPackage(pkg, campaign)
        const inCampaign = isCampaignTarget(pkg, campaign) && points > pkg.tokens
        const covers = points >= shortage
        const highlight = pkg.id === featuredId
        const bonusPct = pkg.bonus_points > 0
          ? Math.round(pkg.bonus_points / (pkg.tokens - pkg.bonus_points) * 100)
          : 0
        return (
          <button
            key={pkg.id}
            onClick={() => handlePurchase(pkg)}
            disabled={!!purchasing}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all disabled:opacity-60"
            style={{
              background: highlight ? 'var(--color-primary-soft)' : 'var(--color-surface)',
              border: highlight ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
              opacity: covers ? 1 : 0.6,
            }}
          >
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm" style={inCampaign ? { color: 'var(--color-primary)' } : undefined}>
                  {points.toLocaleString()}pt
                </span>
                {inCampaign ? (
                  <>
                    <span className="text-xs line-through" style={{ color: 'var(--color-text-muted)' }}>{pkg.tokens.toLocaleString()}pt</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                      style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                      <Sparkles size={9} />{fmt(m.packages.rate, { rate: campaignRateFor(pkg, campaign) })}
                    </span>
                  </>
                ) : pkg.bonus_points > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                    style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                    <Sparkles size={9} />+{bonusPct}%
                  </span>
                )}
                {highlight && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                    style={{ background: 'var(--color-primary)', color: '#fff' }}>{pkg.is_popular ? m.packages.popular : m.packages.recommended}</span>
                )}
              </div>
              <p className="text-[11px] mt-0.5 font-semibold" style={{ color: 'var(--color-primary)' }}>
                {fmt(m.packages.messagesApprox, { n: Math.floor(points / POINTS_PER_MESSAGE).toLocaleString() })}
              </p>
              {!inCampaign && pkg.bonus_points > 0 && (
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {fmt(m.packages.breakdown, { base: (pkg.tokens - pkg.bonus_points).toLocaleString(), bonus: pkg.bonus_points.toLocaleString() })}
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="font-bold text-sm tabular-nums">¥{pkg.price_yen.toLocaleString()}</span>
              {purchasing === pkg.id && (
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{m.packages.processing}</p>
              )}
            </div>
          </button>
        )
      })}
      {/* カードが無い人も買えることを伝える（Checkout でカード・コンビニから選べる） */}
      <div className="mt-1 flex flex-col items-center gap-1.5">
        <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>{m.packages.methods}</p>
        <div className="flex items-center gap-1 flex-wrap justify-center">
          <CardBrands />
          <FamilyMartBadge />
          <LawsonBadge />
          <MinistopBadge />
          <SeicomartBadge />
        </div>
      </div>
    </div>
  )
}
