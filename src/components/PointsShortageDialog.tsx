'use client'

import { TOKEN_PACKAGES } from '@/types'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import { X, Sparkles } from 'lucide-react'
import { logAction } from '@/lib/action-log'

interface Props {
  currentPoints: number
  requiredPoints: number
  onClose: () => void
}

export function PointsShortageDialog({ currentPoints, requiredPoints, onClose }: Props) {
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [campaignBonusRate, setCampaignBonusRate] = useState<number>(1.0)
  const [campaignMinPrice, setCampaignMinPrice] = useState<number | null>(null)
  const [campaignMaxPrice, setCampaignMaxPrice] = useState<number | null>(null)
  const shortage = requiredPoints - currentPoints

  useEffect(() => {
    fetch('/api/campaigns/active')
      .then(r => r.ok ? r.json() : { campaign: null })
      .then(d => {
        const rate = d?.campaign?.bonus_rate ?? 1.0
        setCampaignBonusRate(typeof rate === 'number' ? rate : parseFloat(rate) || 1.0)
        setCampaignMinPrice(d?.campaign?.min_price_yen ?? null)
        setCampaignMaxPrice(d?.campaign?.max_price_yen ?? null)
      })
      .catch(() => {})
  }, [])

  const getCampaignPoints = (pkg: typeof TOKEN_PACKAGES[0]): number | null => {
    if (campaignBonusRate <= 1.0) return null
    const inRange =
      (campaignMinPrice == null || pkg.price_yen >= campaignMinPrice) &&
      (campaignMaxPrice == null || pkg.price_yen <= campaignMaxPrice)
    if (!inRange) return null
    return Math.floor(Math.floor(pkg.price_yen / 10) * campaignBonusRate)
  }

  const handlePurchase = async (pkg: typeof TOKEN_PACKAGES[0]) => {
    setPurchasing(pkg.id)
    logAction('point_purchase', { metadata: { price_yen: pkg.price_yen, tokens: pkg.tokens } })
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: pkg.id, userId: user.id, tokens: pkg.tokens, priceYen: pkg.price_yen }),
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

  const covering = TOKEN_PACKAGES.filter(p => p.tokens >= shortage)
  const featuredId = (covering.find(p => p.is_popular) ?? covering[0])?.id

  // 不足分をカバーできる最小パックを先頭に
  const sorted = [...TOKEN_PACKAGES].sort((a, b) => {
    const aCover = a.tokens >= shortage
    const bCover = b.tokens >= shortage
    if (aCover && !bCover) return -1
    if (!aCover && bCover) return 1
    return a.price_yen - b.price_yen
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-lg rounded-t-2xl pb-safe"
        style={{ background: 'var(--color-surface)', maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <div>
            <p className="font-bold text-base">続けて話すにはポイントが必要です</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              残高 <strong>{currentPoints.toLocaleString()}pt</strong>
              　 必要 <strong style={{ color: 'var(--color-primary)' }}>{requiredPoints}pt</strong>
              　 不足 <strong style={{ color: '#ef4444' }}>{shortage}pt</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--color-text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <div className="h-px mx-5" style={{ background: 'var(--color-border)' }} />

        {/* パック一覧 */}
        <div className="px-4 pt-3 pb-6 flex flex-col gap-2.5">
          {campaignBonusRate > 1.0 && (
            <div className="rounded-xl px-4 py-2.5 flex items-center gap-2 mb-1"
              style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
              <Sparkles size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
              <p className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
                キャンペーン中！ポイント ×{campaignBonusRate}倍
              </p>
            </div>
          )}
          {sorted.map((pkg) => {
            const covers = pkg.tokens >= shortage
            // 不足分をカバーできるパックのうち「人気」を1つだけ強調（なければ最小のカバーパック）
            const highlight = pkg.id === featuredId
            const campaignPoints = getCampaignPoints(pkg)
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
                    {campaignPoints ? (
                      <>
                        <span className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>{campaignPoints.toLocaleString()}pt</span>
                        <span className="text-xs line-through" style={{ color: 'var(--color-text-muted)' }}>{pkg.tokens.toLocaleString()}pt</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                          style={{ background: 'rgba(232,67,127,0.15)', color: 'var(--color-primary)' }}>
                          <Sparkles size={9} />×{campaignBonusRate}倍
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold text-sm">{pkg.tokens.toLocaleString()}pt</span>
                        {pkg.bonus_points > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                            style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                            <Sparkles size={9} />+{bonusPct}%
                          </span>
                        )}
                      </>
                    )}
                    {highlight && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: 'var(--color-primary)', color: '#fff' }}>{pkg.is_popular ? '人気' : 'おすすめ'}</span>
                    )}
                  </div>
                  {!campaignPoints && pkg.bonus_points > 0 && (
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                      {(pkg.tokens - pkg.bonus_points).toLocaleString()}pt + ボーナス{pkg.bonus_points.toLocaleString()}pt
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className="font-bold text-sm">¥{pkg.price_yen.toLocaleString()}</span>
                  {purchasing === pkg.id && (
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>処理中...</p>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
