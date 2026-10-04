'use client'

import { useEffect } from 'react'
import { SISTER_SITE, crossPromoHref, type CrossPromoPlacement } from '@/lib/cross-promo'
import { logAction } from '@/lib/action-log'

/** マチコイへの送客バナー */
export function CrossPromoBanner({ placement, className = '' }: { placement: CrossPromoPlacement; className?: string }) {
  useEffect(() => {
    logAction('crosspromo_view', { metadata: { placement, site: SISTER_SITE.name } })
  }, [placement])

  return (
    <a
      href={crossPromoHref(placement)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => logAction('crosspromo_click', { metadata: { placement, site: SISTER_SITE.name } })}
      className={`block overflow-hidden ${className}`}
      style={{ borderRadius: 'var(--radius-card, 12px)', border: '1px solid var(--color-border)' }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={SISTER_SITE.image} alt={SISTER_SITE.imageAlt} width={1200} height={501} className="w-full h-auto block" />
    </a>
  )
}
