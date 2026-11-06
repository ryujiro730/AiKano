import { createHash } from 'crypto'
import { cookies, headers } from 'next/headers'
import type { SupabaseClient } from '@supabase/supabase-js'
import { META_PIXEL_ID } from './meta'
import { INTERNAL_EMAILS } from './internal-accounts'

/**
 * Meta コンバージョンAPI（CAPI）。matchkoi の meta-capi.ts / meta-attribution.ts から。
 * トークンは環境変数 META_CAPI_TOKEN（GitHub Secret）。ID かトークンが無い間は何も送らない。
 * 課金は Stripe の webhook から送る（コンビニ払いのように後から払われる分も取りこぼさないため）。
 * webhook ではブラウザ情報が取れないので、登録・決済開始のときに meta_attribution（096）へ保存しておいて使う
 */
const GRAPH_API_VERSION = 'v21.0'
const SITE = 'https://aikano.chat'

type EventName = 'CompleteRegistration' | 'InitiateCheckout' | 'Purchase' | 'FirstPurchase'

function sha256(value: string) {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex')
}

type Attribution = { fbp: string | null; fbc: string | null; ipAddress: string | null; userAgent: string | null }

/** 本人のリクエスト中に呼ぶ（登録・決済開始）。取れた項目だけ上書きする。失敗しても本来の処理は止めない */
export async function captureMetaAttribution(admin: SupabaseClient, userId: string): Promise<void> {
  try {
    const c = cookies()
    const h = headers()
    const row: Record<string, string> = { user_id: userId, updated_at: new Date().toISOString() }
    const fbp = c.get('_fbp')?.value
    const fbc = c.get('_fbc')?.value
    // Cloudflare 経由なので cf-connecting-ip を優先
    const ip = h.get('cf-connecting-ip') || (h.get('x-forwarded-for') ?? '').split(',')[0].trim() || h.get('x-real-ip')
    const ua = h.get('user-agent')
    if (fbp) row.fbp = fbp
    if (fbc) row.fbc = fbc
    if (ip) row.client_ip = ip
    if (ua) row.client_ua = ua
    const { error } = await admin.from('meta_attribution').upsert(row, { onConflict: 'user_id' })
    if (error) console.error('[meta-capi] attribution save error:', error.message)
  } catch (e) {
    console.error('[meta-capi] attribution capture failed:', e instanceof Error ? e.message : e)
  }
}

/** _fbc クッキーが無ければ、登録時に保存した fbclid から fbc を組み立てる */
async function getAttribution(admin: SupabaseClient, userId: string): Promise<Attribution & { email: string | null; gender: string | null }> {
  const [{ data: attr }, { data: prof }] = await Promise.all([
    admin.from('meta_attribution').select('fbp, fbc, client_ip, client_ua').eq('user_id', userId).maybeSingle(),
    admin.from('profiles').select('email, gender, fbclid, created_at').eq('id', userId).maybeSingle(),
  ])
  const fbcFromClid = prof?.fbclid ? `fb.1.${new Date(prof.created_at).getTime()}.${prof.fbclid}` : null
  return {
    fbp: attr?.fbp ?? null,
    fbc: attr?.fbc ?? fbcFromClid,
    ipAddress: attr?.client_ip ?? null,
    userAgent: attr?.client_ua ?? null,
    email: prof?.email ?? null,
    gender: prof?.gender ?? null,
  }
}

async function send(event: {
  eventName: EventName
  eventId: string
  eventSourceUrl: string
  userId: string
  attr: Attribution & { email: string | null; gender: string | null }
  value?: number
  numItems?: number
  contentName?: string
}) {
  const token = process.env.META_CAPI_TOKEN
  if (!META_PIXEL_ID || !token) return
  // 社内アカウントの登録・課金は広告の学習に混ぜない
  if (event.attr.email && (INTERNAL_EMAILS as readonly string[]).includes(event.attr.email)) return

  const u: Record<string, string> = { external_id: sha256(event.userId), country: sha256('jp') }
  if (event.attr.email) u.em = sha256(event.attr.email)
  if (event.attr.fbp) u.fbp = event.attr.fbp
  if (event.attr.fbc) u.fbc = event.attr.fbc
  if (event.attr.ipAddress) u.client_ip_address = event.attr.ipAddress
  if (event.attr.userAgent) u.client_user_agent = event.attr.userAgent
  if (event.attr.gender === 'male') u.ge = sha256('m')
  else if (event.attr.gender === 'female') u.ge = sha256('f')

  const payload: Record<string, unknown> = {
    event_name: event.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: event.eventId,
    action_source: 'website',
    event_source_url: event.eventSourceUrl,
    user_data: u,
  }
  if (event.value != null) {
    payload.custom_data = { value: event.value, currency: 'JPY', ...(event.numItems != null ? { num_items: event.numItems } : {}), ...(event.contentName ? { content_name: event.contentName } : {}) }
  } else if (event.contentName) {
    payload.custom_data = { content_name: event.contentName }
  }
  try {
    const res = await fetch(`https://graph.facebook.com/${GRAPH_API_VERSION}/${META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [payload], access_token: token }),
    })
    if (!res.ok) console.error('[meta-capi] error:', event.eventName, (await res.text()).slice(0, 300))
  } catch (e) {
    console.error('[meta-capi] fetch failed:', e instanceof Error ? e.message : e)
  }
}

/** 登録完了。ブラウザ側も同じ eventId（reg_<userId>）で送る */
export async function metaRegistration(admin: SupabaseClient, userId: string, source?: string | null) {
  await captureMetaAttribution(admin, userId)
  await send({ eventName: 'CompleteRegistration', eventId: `reg_${userId}`, eventSourceUrl: `${SITE}/onboarding`, userId, attr: await getAttribution(admin, userId), contentName: source ?? 'organic' })
}

/** 決済画面へ進んだ（本人のリクエスト中に呼ぶ） */
export async function metaInitiateCheckout(admin: SupabaseClient, userId: string, eventId: string, valueYen: number) {
  await captureMetaAttribution(admin, userId)
  await send({ eventName: 'InitiateCheckout', eventId, eventSourceUrl: `${SITE}/payment`, userId, attr: await getAttribution(admin, userId), value: valueYen })
}

/**
 * 課金（webhook から。取引を記録できたときだけ呼ぶ）。初めての課金なら FirstPurchase も送る。
 * eventId は Checkout のセッションID（ポイント・パス。決済ページに戻ってきたときブラウザ側も同じIDで送る）か請求書ID（サブスク）
 */
export async function metaPurchase(admin: SupabaseClient, userId: string, eventId: string, valueYen: number, contentName: string) {
  const [attr, { count }] = await Promise.all([
    getAttribution(admin, userId),
    admin.from('point_transactions').select('id', { count: 'exact', head: true }).eq('user_id', userId).eq('type', 'purchase').gt('price_yen', 0),
  ])
  const base = { eventSourceUrl: `${SITE}/payment`, userId, attr, value: valueYen, contentName }
  await send({ ...base, eventName: 'Purchase', eventId, numItems: count ?? undefined })
  if (count === 1) await send({ ...base, eventName: 'FirstPurchase', eventId: `first_${eventId}` })
}
