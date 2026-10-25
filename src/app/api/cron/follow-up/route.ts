import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/auto-broadcast'
import { processCharacterFollowUps } from '@/lib/character-follow-up'

export const dynamic = 'force-dynamic'
// LLM 生成をまとめて行うため長めに取る
export const maxDuration = 300

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const token = req.headers.get('authorization')?.replace('Bearer ', '')
    if (token !== cronSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const result = await processCharacterFollowUps(createAdminSupabase())
  return NextResponse.json(result)
}
