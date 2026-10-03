'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { useCampaign } from './CampaignProvider'

export function CampaignBanner() {
  const { campaign: rawCampaign } = useCampaign()
  const [visible, setVisible] = useState(false)
  const dismissedIdRef = useRef<string | null>(null)

  const campaign = rawCampaign
    ? { id: rawCampaign.id, catchphrase: rawCampaign.catchphrase ?? '', description: rawCampaign.description ?? '' }
    : null

  useEffect(() => {
    if (campaign && campaign.id !== dismissedIdRef.current) {
      setVisible(true)
    } else if (!campaign) {
      setVisible(false)
    }
  }, [campaign?.id])

  // メインコンテンツのpadding-topとヘッダー高さをCSS変数で動的調整
  useEffect(() => {
    const root = document.documentElement
    const hasBanner = visible && !!campaign
    root.style.setProperty('--main-pt', hasBanner ? '108px' : '72px')
    root.style.setProperty('--header-h', hasBanner ? '88px' : '52px')
    return () => {
      root.style.setProperty('--main-pt', '72px')
      root.style.setProperty('--header-h', '52px')
    }
  }, [visible, campaign])

  const handleDismiss = () => {
    if (campaign) dismissedIdRef.current = campaign.id
    setVisible(false)
  }

  if (!visible || !campaign) return null

  const parts = [
    '🎉 キャンペーン開催中！',
    campaign.catchphrase,
    campaign.description ? `✦ ${campaign.description}` : '',
    '✨ 今すぐチェック！',
    '💖',
  ].filter(Boolean).join('  　  ')

  return (
    <div
      className="fixed left-0 right-0 z-[49] overflow-hidden select-none"
      style={{
        top: '52px',
        height: '36px',
        background: 'linear-gradient(90deg, #c0255f 0%, #e8438f 25%, #ff7043 50%, #ffb300 65%, #e8438f 80%, #c0255f 100%)',
        backgroundSize: '300% 100%',
        animation: 'campaign-banner-bg 5s ease-in-out infinite, campaign-banner-glow 3s ease-in-out infinite',
      }}
    >
      {/* 光沢オーバーレイ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.22) 0%, transparent 60%)',
        }}
      />

      {/* マーキーテキスト（2コピーでシームレスループ） */}
      <div className="flex items-center h-full overflow-hidden">
        <div
          style={{
            display: 'flex',
            whiteSpace: 'nowrap',
            animation: 'campaign-banner-scroll 22s linear infinite',
            willChange: 'transform',
          }}
        >
          {[0, 1].map(i => (
            <span
              key={i}
              style={{
                flexShrink: 0,
                color: '#fff',
                fontSize: '13px',
                fontWeight: 800,
                letterSpacing: '0.06em',
                paddingRight: '120px',
                textShadow: '0 1px 6px rgba(0,0,0,0.3), 0 0 12px rgba(255,255,255,0.2)',
              }}
            >
              {parts}
            </span>
          ))}
        </div>
      </div>

      {/* 閉じるボタン */}
      <button
        onClick={handleDismiss}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center transition-opacity hover:opacity-80 active:opacity-60"
        style={{ background: 'rgba(0,0,0,0.28)', color: '#fff', flexShrink: 0 }}
        aria-label="バナーを閉じる"
      >
        <X size={12} strokeWidth={2.5} />
      </button>
    </div>
  )
}
