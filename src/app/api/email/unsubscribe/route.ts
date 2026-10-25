export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { verifyUnsubscribe } from '@/lib/email-unsubscribe'

// メール配信停止。メール内のリンク（GET）と、メールアプリのワンクリック配信停止（POST, List-Unsubscribe-Post）の両方を受ける
async function unsubscribe(req: NextRequest): Promise<boolean> {
  const userId = req.nextUrl.searchParams.get('u') ?? ''
  const token = req.nextUrl.searchParams.get('t') ?? ''
  if (!userId || !token || !verifyUnsubscribe(userId, token)) return false
  const { error } = await createAdminClient().from('profiles').update({ email_opt_out: true }).eq('id', userId)
  if (error) console.error('[email/unsubscribe] error:', error.message)
  return !error
}

export async function POST(req: NextRequest) {
  const ok = await unsubscribe(req)
  return NextResponse.json({ ok }, { status: ok ? 200 : 400 })
}

export async function GET(req: NextRequest) {
  const ok = await unsubscribe(req)
  const message = ok
    ? 'AiKanoからのメール通知を停止しました。<br>アプリ内のメッセージはこれまでどおり届きます。'
    : 'リンクが正しくないため、配信停止できませんでした。<br>お手数ですが info@tjym.org までご連絡ください。'
  return new NextResponse(
    `<!DOCTYPE html><html lang="ja"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>メール配信停止 | AiKano</title></head>
<body style="margin:0;background:#fff;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Meiryo',sans-serif;color:#1a1a1a;">
<div style="max-width:480px;margin:80px auto;padding:0 24px;text-align:center;">
<p style="font-size:18px;font-weight:700;margin:0 0 16px;">AiKano</p>
<p style="font-size:14px;line-height:1.8;color:#444;margin:0 0 32px;">${message}</p>
<a href="/" style="font-size:13px;color:#888;">AiKanoへ戻る</a>
</div></body></html>`,
    { status: ok ? 200 : 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}
