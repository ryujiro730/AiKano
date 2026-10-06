export const dynamic = 'force-dynamic'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { logUserAction } from '@/lib/user-action-log'
import { spendPoints, refundPoints } from '@/lib/points'
import { getMessages } from '@/i18n/server'

// POST /api/videos/purchase - 動画購入（ポイント消費）
export async function POST(req: NextRequest) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { videoItemId } = await req.json()
  if (!videoItemId) return NextResponse.json({ error: 'videoItemId required' }, { status: 400 })

  const adminDb = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 動画情報取得
  const { data: video } = await adminDb
    .from('video_items')
    .select('*')
    .eq('id', videoItemId)
    .eq('is_active', true)
    .single()
  if (!video) return NextResponse.json({ error: 'Video not found' }, { status: 404 })

  // 既に購入済みか確認
  const { data: existing } = await adminDb
    .from('video_item_purchases')
    .select('id')
    .eq('user_id', user.id)
    .eq('video_item_id', videoItemId)
    .single()
  if (existing) return NextResponse.json({ error: 'already_purchased' }, { status: 409 })

  // ポイント消費（ボーナス優先・競合に強い共通処理）
  const spend = await spendPoints(adminDb, user.id, video.price_points, `動画購入: ${video.title}`)
  if (!spend.ok) {
    if (spend.status === 402) {
      await logUserAction(adminDb, user.id, 'points_shortage', { context: 'video', title: video.title, current: spend.body.current, required: spend.body.required })
    }
    return NextResponse.json(spend.body, { status: spend.status })
  }

  // 購入レコード追加（失敗したらポイントを戻す）
  const { error: purchaseError } = await adminDb
    .from('video_item_purchases')
    .insert({ user_id: user.id, video_item_id: videoItemId })
  if (purchaseError) {
    await refundPoints(adminDb, user.id, spend, `動画購入失敗による返却: ${video.title}`)
    return NextResponse.json({ error: getMessages().api.purchaseRecordFailed }, { status: 500 })
  }

  await logUserAction(adminDb, user.id, 'video_purchase', { title: video.title, cost: video.price_points })

  return NextResponse.json({
    ok: true,
    newPoints: spend.points + spend.bonus_points,
    videoUrl: video.video_url,
    thumbnailUrl: video.thumbnail_url,
  })
}
