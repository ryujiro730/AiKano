import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { resolveVariables } from './message-variables'
import { sendNotificationEmail } from './send-notification-email'
import { translateChatText } from './translate'
import { isLocale, type Locale } from '@/i18n/config'
import { localizedCharacter } from './character-i18n'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AdminSupabase = SupabaseClient<any, any, any>

export function createAdminSupabase(): AdminSupabase {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function processAutoBroadcast(): Promise<{ scheduled: number; sent: number; skipped: number; cancelled: number; failed: number }> {
  const adminClient = createAdminSupabase()
  let scheduled = 0

  // アクティブなシーケンスのステップを取得
  // 送信予定の作成は DB 側で一括（全ユーザー × 有効ステップ。既存の予定はそのまま）
  const { data: scheduledCount, error: schedErr } = await adminClient.rpc('schedule_auto_broadcasts')
  if (schedErr) console.error('auto broadcast schedule error:', schedErr.message)
  scheduled = Number(scheduledCount ?? 0)

  // 送信時刻を過ぎた予定を最大300件ずつ取り出す（processing に更新済み・同時実行でも重複しない）
  const { data: claimedIds } = await adminClient.rpc('claim_auto_broadcast_logs', { p_limit: 300 })
  const ids = ((claimedIds ?? []) as unknown[]).map(r => (typeof r === 'string' ? r : (r as { claim_auto_broadcast_logs: string }).claim_auto_broadcast_logs))
  const { data: pendingLogs } = ids.length > 0
    ? await adminClient
        .from('auto_broadcast_logs')
        .select(`
          id, user_id,
          auto_broadcast_steps!inner(
            id, message, i18n, image_url, step_number,
            auto_broadcast_sequences!inner(character_id)
          )
        `)
        .in('id', ids)
    : { data: [] as never[] }

  let sent = 0
  let skipped = 0
  let cancelled = 0
  let failed = 0

  if (!pendingLogs || pendingLogs.length === 0) {
    return { scheduled, sent, skipped, cancelled, failed }
  }

  // ── バッチ判定：pending なユーザーの会話・メッセージをまとめて取得 ──────────
  const pendingUserIds = Array.from(new Set(pendingLogs.map(l => l.user_id)))

  // 該当ユーザーの全会話（返信済みかどうかは has_user_reply で判定。メッセージ全件は読まない）
  const { data: conversations } = await adminClient
    .from('conversations')
    .select('id, user_id, character_id, has_user_reply')
    .in('user_id', pendingUserIds)
    .limit(10000)

  // userRepliedToChar: `${userId}:${characterId}` → そのキャラに返信済み
  const userRepliedToChar = new Set<string>(
    (conversations ?? []).filter(c => c.has_user_reply).map(c => `${c.user_id}:${c.character_id}`),
  )

  // ユーザー起点の会話（ウェルカム送信済み = source='user'）を取得
  // → step1 はスキップするが step2 以降は送信する
  const { data: userInitConvs } = await adminClient
    .from('conversations')
    .select('user_id, character_id')
    .eq('source', 'user')
    .in('user_id', pendingUserIds)

  const userInitiatedKeys = new Set(
    (userInitConvs ?? []).map(c => `${c.user_id}:${c.character_id}`)
  )
  // ──────────────────────────────────────────────────────────────────────────

  for (const log of pendingLogs) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const step = (log as any).auto_broadcast_steps
      const characterId: string = step.auto_broadcast_sequences.character_id
      const stepNumber: number = step.step_number

      // ① ユーザーがこのキャラに返信済み → 全ステップキャンセル
      if (userRepliedToChar.has(`${log.user_id}:${characterId}`)) {
        await adminClient.from('auto_broadcast_logs')
          .update({ status: 'cancelled' }).eq('id', log.id)
        cancelled++
        continue
      }

      // ② ウェルカムメッセージ送信済み（source='user'）かつ step1 → スキップ
      //    step2 以降はウェルカムの「フォロー」として送信する
      if (stepNumber === 1 && userInitiatedKeys.has(`${log.user_id}:${characterId}`)) {
        await adminClient.from('auto_broadcast_logs')
          .update({ status: 'skipped' }).eq('id', log.id)
        skipped++
        continue
      }

      // ③ 通常送信
      const msgTime = new Date().toISOString()

      const { data: userProfile } = await adminClient
        .from('profiles').select('display_name, age, gender, locale').eq('id', log.user_id).single()
      const locale: Locale = isLocale(userProfile?.locale) ? userProfile.locale : 'ja'
      const template = locale === 'ja' ? step.message : await localizedStepMessage(adminClient, step, locale)
      const message = resolveVariables(template, userProfile ?? {})

      const existingConv = (conversations ?? []).find(
        c => c.user_id === log.user_id && c.character_id === characterId
      )

      let conversationId: string

      if (existingConv) {
        conversationId = existingConv.id
      } else {
        const { data: newConv, error: convError } = await adminClient
          .from('conversations')
          .insert({ user_id: log.user_id, character_id: characterId, last_message_at: msgTime, is_unread_staff: false, source: 'auto_broadcast' })
          .select('id').single()
        if (convError || !newConv) throw new Error('conv create failed: ' + convError?.message)
        conversationId = newConv.id
        // 同バッチ内の後続ステップが同じ会話を再利用できるようにキャッシュに追加
        ;(conversations as { id: string; user_id: string; character_id: string; has_user_reply: boolean }[]).push({
          id: conversationId,
          user_id: log.user_id,
          character_id: characterId,
          has_user_reply: false,
        })
      }

      const imageUrl: string | null = step.image_url ?? null
      const { error: msgError } = await adminClient.from('messages').insert({
        conversation_id: conversationId,
        sender_role: 'character',
        content: message,
        points_used: 0,
        is_read: false,
        metadata: imageUrl ? { image_url: imageUrl } : null,
      })
      if (msgError) throw new Error('msg insert failed: ' + msgError.message)

      await adminClient.from('conversations')
        .update({ last_message_at: msgTime, is_unread_staff: false }).eq('id', conversationId)

      await adminClient.from('auto_broadcast_logs')
        .update({ status: 'sent', sent_at: msgTime, conversation_id: conversationId })
        .eq('id', log.id)

      // メール通知（非クリティカル）
      Promise.all([
        adminClient.from('characters').select('name, i18n').eq('id', characterId).single(),
        adminClient.auth.admin.getUserById(log.user_id),
      ]).then(([{ data: charData }, { data: authData }]) => {
        const toEmail = authData?.user?.email
        if (toEmail && charData?.name) {
          sendNotificationEmail({
            toEmail,
            locale,
            characterName: localizedCharacter(charData, locale).name,
            messageContent: message,
            conversationId,
          })
        }
      }).catch(() => {/* 無視 */})

      sent++
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      await adminClient.from('auto_broadcast_logs')
        .update({ status: 'failed', error_message: msg })
        .eq('id', log.id)
      failed++
      console.error('auto broadcast send error:', msg)
    }
  }

  return { scheduled, sent, skipped, cancelled, failed }
}

// 同報メッセージの翻訳。auto_broadcast_steps.i18n にキャッシュし、同じステップ・言語は一度だけ訳す
const stepTranslationCache = new Map<string, Promise<string>>()

function localizedStepMessage(db: AdminSupabase, step: { id: string; message: string; i18n?: Record<string, string> | null }, locale: Locale): Promise<string> {
  const cached = step.i18n?.[locale]
  if (cached) return Promise.resolve(cached)
  const key = `${step.id}:${locale}`
  if (!stepTranslationCache.has(key)) {
    stepTranslationCache.set(key, (async () => {
      const translated = await translateChatText(step.message, locale)
      if (!translated) { stepTranslationCache.delete(key); return step.message }
      const { data } = await db.from('auto_broadcast_steps').select('i18n').eq('id', step.id).single()
      await db.from('auto_broadcast_steps').update({ i18n: { ...(data?.i18n ?? {}), [locale]: translated } }).eq('id', step.id)
      return translated
    })())
  }
  return stepTranslationCache.get(key)!
}
