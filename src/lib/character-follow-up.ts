import type { SupabaseClient } from '@supabase/supabase-js'
import { generateFollowUp, type LLMMessage } from './llm-service'
import { getActivePlan } from './plans'
import { checkSexualContent } from './moderation'
import { sendNotificationEmail } from './send-notification-email'
import { localizedCharacter } from './character-i18n'
import { isLocale, type Locale } from '@/i18n/config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminSupabase = SupabaseClient<any, any, any>

interface FollowUpTarget {
  conversation_id: string
  user_id: string
  character_id: string
  /** これまでに送った追いLINEの数（ユーザーが最後に送ってから） */
  follow_up_count: number
  idle_since: string
  last_sender_role: string | null
}

/** 1回の cron で送る最大数（LLM 生成に数秒かかるため少なめ。次の cron で続きを送る） */
const BATCH_LIMIT = 20
const CONCURRENCY = 5

/**
 * キャラからの追いLINE。ユーザーが数時間戻ってこないとき、会話の中身を踏まえた一言をキャラから送り、メールで知らせる。
 * 対象の選び方・間隔・送信時間帯は DB 関数 claim_character_follow_ups（082）。
 */
export async function processCharacterFollowUps(db: AdminSupabase): Promise<{ claimed: number; sent: number; failed: number }> {
  const { data, error } = await db.rpc('claim_character_follow_ups', { p_limit: BATCH_LIMIT })
  if (error) {
    console.error('[follow-up] claim error:', error.message)
    return { claimed: 0, sent: 0, failed: 0 }
  }
  const targets = (data ?? []) as FollowUpTarget[]

  let sent = 0
  let failed = 0
  for (let i = 0; i < targets.length; i += CONCURRENCY) {
    const results = await Promise.allSettled(targets.slice(i, i + CONCURRENCY).map(t => sendFollowUp(db, t)))
    results.forEach((r, j) => {
      if (r.status === 'fulfilled') { sent++; return }
      failed++
      console.error('[follow-up] send error:', targets[i + j].conversation_id, r.reason instanceof Error ? r.reason.message : r.reason)
    })
  }
  return { claimed: targets.length, sent, failed }
}

async function sendFollowUp(db: AdminSupabase, t: FollowUpTarget): Promise<void> {
  const [{ data: character }, { data: msgs }, { data: mem }, { data: prof }, { data: uc }] = await Promise.all([
    db.from('characters').select('id, name, age, description, personality, system_prompt, i18n').eq('id', t.character_id).single(),
    db.from('messages')
      .select('sender_role, content, metadata')
      .eq('conversation_id', t.conversation_id)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false })
      .limit(30),
    db.from('user_character_memories').select('memory_text').eq('user_id', t.user_id).eq('character_id', t.character_id).maybeSingle(),
    db.from('profiles')
      .select('display_name, age, email, email_opt_out, locale, subscription_plan, subscription_status, subscription_period_end')
      .eq('id', t.user_id)
      .single(),
    db.from('user_characters').select('affection_level').eq('user_id', t.user_id).eq('character_id', t.character_id).maybeSingle(),
  ])
  if (!character) throw new Error('character not found')

  const history: LLMMessage[] = ((msgs ?? []) as { sender_role: string; content: string | null; metadata?: { image_url?: string; media?: string } | null }[])
    .reverse()
    .map(m => ({
      role: (m.sender_role === 'user' ? 'user' : 'assistant') as LLMMessage['role'],
      content: m.content?.trim() ? m.content : m.metadata?.image_url || m.metadata?.media ? '［写真を送った］' : '',
    }))
    .filter(m => m.content)

  const generate = (extra?: string) => generateFollowUp(character, history, {
    modelOverride: getActivePlan(prof)?.model,
    memoryText: mem?.memory_text ?? null,
    user: {
      name: prof?.display_name,
      age: prof?.age,
      affectionLevel: uc?.affection_level ?? 1,
      situation: [followUpSituation(t), extra].filter(Boolean).join('\n'),
    },
  })
  let text = (await generate()).text.trim()
  if ((await checkSexualContent(text)).flagged) {
    text = (await generate('性的な表現や体の描写は一切使わない。')).text.trim()
    if ((await checkSexualContent(text)).flagged) throw new Error('moderation flagged twice')
  }
  if (!text) throw new Error('empty follow-up')

  const now = new Date().toISOString()
  const { error: insertErr } = await db.from('messages').insert({
    conversation_id: t.conversation_id,
    sender_role: 'character',
    content: text,
    points_used: 0,
    is_read: false,
    metadata: { source: 'follow_up', follow_up_number: t.follow_up_count + 1 },
  })
  if (insertErr) throw new Error('insert failed: ' + insertErr.message)
  await db.from('conversations').update({ last_message_at: now, is_unread_staff: false }).eq('id', t.conversation_id)

  // メールで呼び戻す（配信停止したユーザーには送らない）
  if (prof?.email && !prof.email_opt_out) {
    const locale: Locale = isLocale(prof.locale) ? prof.locale : 'ja'
    await sendNotificationEmail({
      toEmail: prof.email,
      locale,
      characterName: localizedCharacter(character, locale).name,
      messageContent: text,
      conversationId: t.conversation_id,
      userId: t.user_id,
    })
  }
}

/** 追いLINEを書くときの指示。何通目か・何時間たったか・最後に話したのがどちらかで変える */
export function followUpSituation(t: FollowUpTarget): string {
  const hours = Math.max(1, Math.round((Date.now() - new Date(t.idle_since).getTime()) / 3600000))
  const elapsed = hours < 24 ? `${hours}時間` : `${Math.round(hours / 24)}日`
  const lines = [
    `ユーザーとのやり取りが${elapsed}止まっている。あなたから「追いLINE」を1通送って、ユーザーが思わず返信したくなるようにする。`,
  ]
  if (t.last_sender_role === 'user') {
    lines.push('- 最後のユーザーのメッセージに、まだ返事をしていなかった。返事が遅くなったことをキャラらしく軽く謝ってから、その内容にちゃんと返事をする。')
  } else if (t.follow_up_count === 0) {
    lines.push('- これまでの会話の中身（ユーザーが話していたこと・予定・好きなもの・途中で終わった話題）を具体的に1つ拾って、その続きを自分から振る。「元気？」「何してる？」だけの、誰にでも送れるメッセージにしない。')
  } else if (t.follow_up_count <= 2) {
    lines.push('- 前に自分から送ったメッセージにも、まだ返事がない。少しだけ寂しさや「話したいな」という気持ちをにじませつつ、前の追いLINEとは違う切り口で話しかける（ユーザーの話していたことの続き、または自分の小さな出来事）。')
  } else {
    lines.push('- しばらく話せていない。久しぶりに連絡する感じで、新しい話題（自分の最近の出来事・ユーザーに聞いてほしいこと・ユーザーに見せたいもの）を明るく振る。会話の中で知ったユーザーのことに一言ふれると、なおよい。')
  }
  lines.push(
    '- 答えやすい問いかけか、続きが気になる一言で終える。',
    '- 責めたり重くしたりしない。「なんで返信くれないの」「無視しないで」のように問い詰めない。',
    '- 直前に自分が送ったメッセージと同じ内容・言い回しを繰り返さない。',
    '- 今の時間帯（朝・昼・夜）に合った内容にする。1〜3文で短く。',
  )
  return lines.join('\n')
}
