export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'

export const fetchCache = 'force-no-store'

// キャンペーンの画像バナー。Storage avatars/campaigns/ に置く（キャラ写真と同じ公開バケット）
export async function POST(req: NextRequest) {
  const auth = await requireAdmin()
  if ('res' in auth) return auth.res

  const file = (await req.formData()).get('file') as File | null
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 })
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return NextResponse.json({ error: '画像（jpg / png / webp / gif）を選んでください' }, { status: 400 })

  const ext = file.type.split('/')[1].replace('jpeg', 'jpg')
  const path = `campaigns/${Date.now()}.${ext}`
  const { error } = await auth.db.storage.from('avatars')
    .upload(path, Buffer.from(await file.arrayBuffer()), { cacheControl: '31536000', contentType: file.type, upsert: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ url: auth.db.storage.from('avatars').getPublicUrl(path).data.publicUrl })
}
