/**
 * Meta Pixel（ブラウザ側）。ID が空の間は何も読み込まない・送らない。
 * サーバー側（CAPI）は lib/meta-capi.ts。同じイベントは同じ eventID を付けて、Meta 側で二重に数えないようにする
 */
export const META_PIXEL_ID = '948193891474180'

/** 購入ダイアログ・決済ページを開いた: ブラウザの Pixel とサーバー（CAPI）に同じ eventID で InitiateCheckout を送る */
export function trackViewCheckout() {
  if (typeof window === 'undefined' || !META_PIXEL_ID) return
  const eventId = `vc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  trackMeta('InitiateCheckout', {}, eventId)
  fetch('/api/meta/event', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: 'view_checkout', eventId, url: location.href }),
  }).catch(() => {})
}

export function trackMeta(event: string, data: Record<string, unknown> = {}, eventID?: string) {
  if (typeof window === 'undefined' || !META_PIXEL_ID) return
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  if (!fbq) return
  if (eventID) fbq('track', event, data, { eventID })
  else fbq('track', event, data)
}

/** 独自イベント（標準イベントにない行動。最適化の目標には使わず、離脱の分析用） */
export function trackMetaCustom(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !META_PIXEL_ID) return
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  fbq?.('trackCustom', event, data)
}
