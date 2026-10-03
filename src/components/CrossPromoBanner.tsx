'use client'

import { useEffect, useState } from 'react'
import { SISTER_SITE, crossPromoHref, type CrossPromoPlacement } from '@/lib/cross-promo'
import { logAction } from '@/lib/action-log'

/** 姉妹サービスへの送客バナー（非課金ユーザーにのみ表示） */
export function CrossPromoBanner({ placement, className = '' }: { placement: CrossPromoPlacement; className?: string }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    fetch('/api/cross-promo')
      .then(r => (r.ok ? r.json() : { show: false }))
      .then(d => {
        if (!d.show) return
        setShow(true)
        logAction('crosspromo_view', { metadata: { placement, site: SISTER_SITE.name } })
      })
      .catch(() => {})
  }, [placement])

  if (!show) return null

  return (
    <div className={className}>
      <p className="text-[10px] font-bold mb-1.5" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.08em' }}>
        姉妹サービス
      </p>
      <a
        href={crossPromoHref(placement)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => logAction('crosspromo_click', { metadata: { placement, site: SISTER_SITE.name } })}
        className="block overflow-hidden"
        style={{ borderRadius: 'var(--radius-card, 12px)', border: '1px solid var(--color-border)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={SISTER_SITE.image} alt={SISTER_SITE.imageAlt} loading="lazy" className="w-full block" style={{ aspectRatio: '1200 / 501' }} />
      </a>
    </div>
  )
}
