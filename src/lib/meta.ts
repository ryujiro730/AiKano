/**
 * Meta Pixel（ブラウザ側）。ID が空の間は何も読み込まない・送らない。
 * サーバー側（CAPI）は lib/meta-capi.ts。同じイベントは同じ eventID を付けて、Meta 側で二重に数えないようにする
 */
export const META_PIXEL_ID = '948193891474180'

export function trackMeta(event: string, data: Record<string, unknown> = {}, eventID?: string) {
  if (typeof window === 'undefined' || !META_PIXEL_ID) return
  const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq
  if (!fbq) return
  if (eventID) fbq('track', event, data, { eventID })
  else fbq('track', event, data)
}
