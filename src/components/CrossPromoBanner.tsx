'use client'

import { useEffect } from 'react'
import { SISTER_SITE, crossPromoHref, type CrossPromoPlacement } from '@/lib/cross-promo'
import { logAction } from '@/lib/action-log'
import { STRIPE_REVIEW_MODE } from '@/lib/review-mode'
import { useI18n } from '@/i18n/client'

/** マチコイへの送客バナー */
export function CrossPromoBanner({ placement, className = '' }: { placement: CrossPromoPlacement; className?: string }) {
  // マチコイは日本向けサービスなので日本語ユーザーにだけ出す
  const { locale } = useI18n()
  const hidden = STRIPE_REVIEW_MODE || locale !== 'ja'
  useEffect(() => {
    if (hidden) return
    logAction('crosspromo_view', { metadata: { placement, site: SISTER_SITE.name } })
  }, [placement, hidden])

  if (hidden) return null

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
