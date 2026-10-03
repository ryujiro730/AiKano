export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient } from '@supabase/supabase-js'
import { getAuthUser } from '@/lib/supabase/get-auth-user'

const SHARE_COOLDOWN_DAYS = 7
const BASE_CHARACTER_LIMIT = 3

export async function GET() {
  const authClient = createServerClient()
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const [
    { count: activatedCount },
    { count: shareCount },
    { data: latestShare },
  ] = await Promise.all([
    adminClient.from('user_characters').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    adminClient.from('share_logs').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    adminClient.from('share_logs').select('created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1),
  ])

  const limit = BASE_CHARACTER_LIMIT + (shareCount ?? 0)
  const activated = activatedCount ?? 0

  let nextAvailable: string | null = null
  if (latestShare && latestShare.length > 0) {
    const lastDate = new Date(latestShare[0].created_at)
    nextAvailable = new Date(lastDate.getTime() + SHARE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()
  }

  const canShareNow = !nextAvailable || new Date(nextAvailable) <= new Date()

  return NextResponse.json({ activatedCount: activated, limit, shareCount: shareCount ?? 0, nextAvailable, canShareNow })
}

const PLATFORM_PATTERNS: { platform: string; regex: RegExp; label: string }[] = [
  { platform: 'x',        regex: /^https?:\/\/(twitter\.com|x\.com)\/\w+\/status\/\d+/,              label: 'X(Twitter)' },
  { platform: 'threads',  regex: /^https?:\/\/(www\.)?threads\.net\/@[\w.]+\/post\/[A-Za-z0-9_-]+/, label: 'Threads' },
  { platform: 'facebook', regex: /^https?:\/\/(www\.)?(facebook\.com|fb\.com|fb\.watch)\//,          label: 'Facebook' },
  { platform: 'instagram',regex: /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/, label: 'Instagram' },
]

function detectPlatform(url: string): { platform: string; label: string } | null {
  for (const p of PLATFORM_PATTERNS) {
    if (p.regex.test(url)) return { platform: p.platform, label: p.label }
  }
  return null
}

export async function POST(req: NextRequest) {
  const authClient = createServerClient()
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const shareUrl = (body.shareUrl ?? body.tweetUrl ?? '').trim()
  if (!shareUrl) return NextResponse.json({ error: 'shareUrl required' }, { status: 400 })

  const detected = detectPlatform(shareUrl)
  if (!detected) {
    return NextResponse.json({
      ok: false,
      error: 'invalid_url',
      message: '対応していないURLです。X・Threads・Facebook・Instagramの投稿URLを貼り付けてください',
    }, { status: 400 })
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // クールダウンチェック
  const since = new Date(Date.now() - SHARE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()
  const { data: recentShares } = await adminClient
    .from('share_logs')
    .select('created_at')
    .eq('user_id', user.id)
    .gte('created_at', since)
    .order('created_at', { ascending: false })
    .limit(1)

  if (recentShares && recentShares.length > 0) {
    const lastDate = new Date(recentShares[0].created_at)
    const nextAvailable = new Date(lastDate.getTime() + SHARE_COOLDOWN_DAYS * 24 * 60 * 60 * 1000).toISOString()
    return NextResponse.json({ ok: false, error: 'weekly_limit_reached', nextAvailable })
  }

  // URL重複チェック
  const { count: dupCount } = await adminClient
    .from('share_logs')
    .select('id', { count: 'exact', head: true })
    .eq('tweet_url', shareUrl)

  if ((dupCount ?? 0) > 0) {
    return NextResponse.json({ ok: false, error: 'duplicate_url', message: 'このURLはすでに使用されています' }, { status: 400 })
  }

  const { error } = await adminClient.from('share_logs').insert({
    user_id: user.id,
    tweet_url: shareUrl,
    platform: detected.platform,
  })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, message: 'キャラクター枠が1つ解放されました！' })
}
