export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/service'
import { guessKind } from '@/lib/email-kinds'

/**
 * Resend の Webhook（送信・到達・遅延・開封・クリック・不達・迷惑報告・失敗・送信停止）。matchkoi から。
 * 署名は Svix 方式: HMAC-SHA256( base64decode(whsec_ 以降), `${svix-id}.${svix-timestamp}.${body}` ) を base64 にしたものが
 * svix-signature（"v1,xxx v1,yyy"）のどれかと一致すれば本物。5分より古い通知は捨てる（使い回し対策）。
 * 記録と「迷惑報告・存在しない宛先は以後送らない」は DB の record_email_event（091）でまとめて行う
 */
const TOLERANCE_SEC = 5 * 60

function verify(body: string, id: string, ts: string, sigHeader: string): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET ?? ''
  if (!secret || !id || !ts || !sigHeader) return false
  const t = Number(ts)
  if (!Number.isFinite(t) || Math.abs(Date.now() / 1000 - t) > TOLERANCE_SEC) return false
  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const expected = crypto.createHmac('sha256', key).update(`${id}.${ts}.${body}`).digest()
  return sigHeader.split(' ').some(part => {
    const [ver, sig] = part.split(',')
    if (ver !== 'v1' || !sig) return false
    const got = Buffer.from(sig, 'base64')
    return got.length === expected.length && crypto.timingSafeEqual(got, expected)
  })
}

/** tags は { kind: 'x' } の形と [{ name, value }] の形のどちらでも来うる */
function tagKind(tags: unknown): string | null {
  if (Array.isArray(tags)) return (tags.find((t: { name?: string }) => t?.name === 'kind') as { value?: string } | undefined)?.value ?? null
  if (tags && typeof tags === 'object') return ((tags as { kind?: string }).kind) ?? null
  return null
}

type ResendEventData = {
  email_id?: string
  to?: string | string[]
  subject?: string
  tags?: unknown
  bounce?: unknown
  click?: { link?: string; timestamp?: string }
  failed?: unknown
  reason?: unknown
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const id = req.headers.get('svix-id') ?? ''
  if (!verify(body, id, req.headers.get('svix-timestamp') ?? '', req.headers.get('svix-signature') ?? '')) {
    console.error('[resend-webhook] invalid signature, svix-id:', id)
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  let evt: { type?: string; created_at?: string; data?: ResendEventData }
  try { evt = JSON.parse(body) } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }) }
  const d = evt.data ?? {}
  const to = Array.isArray(d.to) ? d.to[0] : d.to
  const subject = typeof d.subject === 'string' ? d.subject : null

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const { error } = await db.rpc('record_email_event', {
    p_svix_id: id,
    p_type: evt.type ?? 'unknown',
    p_email_id: d.email_id ?? null,
    p_occurred_at: evt.created_at ?? new Date().toISOString(),
    p_to: typeof to === 'string' ? to : null,
    p_subject: subject,
    p_kind: tagKind(d.tags) ?? (subject ? guessKind(subject) : null),
    // 本文やヘッダーは要らないので、集計と原因調査に使う部分だけ残す
    p_data: { bounce: d.bounce ?? null, click: d.click ? { link: d.click.link, timestamp: d.click.timestamp } : null, failed: d.failed ?? null, reason: d.reason ?? null },
  })
  if (error) {
    // 500 を返すと Resend が後で再送してくれる
    console.error('[resend-webhook] record failed:', error.message, 'type:', evt.type)
    return NextResponse.json({ error: 'record failed' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
