import { createHmac, timingSafeEqual } from 'crypto'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aikano.chat'

// 配信停止リンクの署名。専用の秘密鍵は置かず、サーバーにしかない service role key を鍵に使う
function sign(userId: string): string {
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY ?? '').update(`unsubscribe:${userId}`).digest('base64url')
}

export function unsubscribeUrl(userId: string): string {
  return `${APP_URL}/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${sign(userId)}`
}

export function verifyUnsubscribe(userId: string, token: string): boolean {
  const expected = Buffer.from(sign(userId))
  const given = Buffer.from(token)
  return expected.length === given.length && timingSafeEqual(expected, given)
}
