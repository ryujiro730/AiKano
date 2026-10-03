'use client'

import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { TOKEN_PACKAGES } from '@/types'
import { logAction } from '@/lib/action-log'
import { pointsForPackage, isCampaignTarget, type PurchaseCampaign } from '@/lib/point-packages'

/**
 * ポイントパック一覧＋購入ボタン。購入ダイアログと料金プランページで共用。
 * 表示ポイントはサーバーの付与と同じ pointsForPackage で計算する。
 * shortage を渡すと、不足分をカバーできるパックを先頭に並べ、足りないパックを薄く表示する。
 */
export function PointPackageList({ shortage = 0 }: { shortage?: number }) {
  const [purchasing, setPurchasing] = useState<string | null>(null)
  const [campaign, setCampaign] = useState<PurchaseCampaign | null>(null)

  useEffect(() => {
    fetch('/api/campaigns/active?purchase=true')
      .then(r => r.ok ? r.json() : { campaign: null })
      .then(d => {
        const c = d?.campaign
        if (!c) return
        setCampaign({ id: c.id, bonus_rate: Number(c.bonus_rate) || 1, min_price_yen: c.min_price_yen ?? null, max_price_yen: c.max_price_yen ?? null })
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
      alert('決済の開始に失敗しました')
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

  return (
    <div className="flex flex-col gap-2.5">
      {campaign && campaign.bonus_rate > 1 && (
        <div className="rounded-xl px-4 py-2.5 flex items-center gap-2 mb-1"
          style={{ background: 'var(--color-primary-soft)', border: '1px solid var(--color-primary-border)' }}>
          <Sparkles size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
          <p className="text-xs font-bold" style={{ color: 'var(--color-primary)' }}>
            キャンペーン中！ポイント ×{campaign.bonus_rate}倍
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
                      <Sparkles size={9} />×{campaign!.bonus_rate}倍
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
                    style={{ background: 'var(--color-primary)', color: '#fff' }}>{pkg.is_popular ? '人気' : 'おすすめ'}</span>
                )}
              </div>
              {!inCampaign && pkg.bonus_points > 0 && (
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                  {(pkg.tokens - pkg.bonus_points).toLocaleString()}pt + ボーナス{pkg.bonus_points.toLocaleString()}pt
                </p>
              )}
            </div>
            <div className="text-right">
              <span className="font-bold text-sm tabular-nums">¥{pkg.price_yen.toLocaleString()}</span>
              {purchasing === pkg.id && (
                <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>処理中...</p>
              )}
            </div>
          </button>
        )
      })}
    </div>
  )
}
