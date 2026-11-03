import type { SupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { MESSAGES } from '@/i18n/messages'
import { fmt } from '@/i18n/fmt'
import { isLocale, type Locale } from '@/i18n/config'
import { INTERNAL_EMAILS } from './internal-accounts'
import { unsubscribeUrl } from './email-unsubscribe'
import { localizedText } from './content-i18n'
import { isWithinPeriod, type CampaignRow } from './campaign-eligibility'

/**
 * キャンペーンのお知らせメール（matchkoi の notify-message / campaign-reminder / campaign-auto-reminder から）。
 *   公開したとき（開始日時が未来なら cron がその時刻に）: 対象者へ1回 … sendCampaignLaunch
 *   「登録から◯時間」の条件があるキャンペーン: 条件に入った人へ1回 … cron（sendCampaignThreshold）
 *   最初のメールから24時間後・72時間後: まだ買っていない人へ追いメール … cron（sendCampaignAutoReminders）
 *   管理画面の ✉ から手動の追いメール（step 9）… sendCampaignManualReminder
 * 対象の絞り込みは DB 関数（campaign_email_targets / campaign_reminder_targets、088）。条件は campaign-eligibility.ts と同じ。
 * 配信停止した人・BAN 中の人・社内アカウントには送らない。日本時間 9〜22時台だけ送る（公開時の手動送信も含む）。
 */

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://aikano.chat'
const FROM = 'AiKano <noreply@aikano.chat>'
const AUTO_STEPS = [
  { step: 1, afterHours: 24 },
  { step: 2, afterHours: 72 },
] as const
export const MANUAL_REMINDER_STEP = 9

type Target = { user_id: string; email: string; locale: string | null }
export type ReminderText = { subject?: string; body?: string; ctaUrl?: string; ctaLabel?: string }

/** 日本時間 9〜22時台か（追いLINE と同じ時間帯） */
export function isSendingHours(now = new Date()): boolean {
  const h = Number(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Tokyo', hour: 'numeric', hourCycle: 'h23' }).format(now))
  return h >= 9 && h < 23
}

async function loadCampaign(db: SupabaseClient, id: string): Promise<CampaignRow | null> {
  const { data } = await db.from('campaigns').select('*, campaign_conditions(*)').eq('id', id).maybeSingle()
  return (data as CampaignRow | null) ?? null
}

function localeOf(t: Target): Locale {
  return isLocale(t.locale) ? t.locale : 'ja'
}

function remainingText(endsAt: string | null, locale: Locale, now = new Date()): string | null {
  if (!endsAt) return null
  const diff = new Date(endsAt).getTime() - now.getTime()
  if (diff <= 0) return null
  const m = MESSAGES[locale].campaignEmail
  const h = Math.floor(diff / 3600000)
  if (h >= 24) return fmt(m.days, { n: Math.floor(h / 24) })
  if (h > 0) return fmt(m.hours, { n: h })
  return fmt(m.minutes, { n: Math.max(1, Math.floor(diff / 60000)) })
}

function absoluteUrl(path: string | null | undefined): string {
  const p = path || '/payment'
  return p.startsWith('http') ? p : `${APP_URL}${p.startsWith('/') ? p : `/${p}`}`
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

/** 通知メール（send-notification-email.ts）と同じ見た目の枠 */
function emailHtml(opts: { locale: Locale; label: string; title: string; body: string; ctaUrl: string; ctaLabel: string; imageUrl?: string | null; userId: string }): string {
  const m = MESSAGES[opts.locale]
  const unsubscribe = unsubscribeUrl(opts.userId)
  return `<!DOCTYPE html>
<html lang="${opts.locale}">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#fdf6f0;font-family:'Hiragino Kaku Gothic ProN','Hiragino Sans','Meiryo',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f0;padding:40px 0;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#fff8f5;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);">
        <tr><td style="background:linear-gradient(135deg,#f9a8b8,#e879a0);padding:24px 32px;">
          <p style="margin:0;color:#fff;font-size:20px;font-weight:700;letter-spacing:.04em;">AiKano</p>
        </td></tr>
        ${opts.imageUrl ? `<tr><td style="padding:0;line-height:0;"><img src="${escapeHtml(opts.imageUrl)}" alt="" width="520" style="display:block;width:100%;height:auto;"></td></tr>` : ''}
        <tr><td style="padding:32px;">
          <p style="margin:0 0 8px;font-size:14px;color:#9b6f7a;">${escapeHtml(opts.label)}</p>
          ${opts.title ? `<p style="margin:0 0 16px;font-size:22px;font-weight:700;color:#3d1a26;line-height:1.4;">${escapeHtml(opts.title)}</p>` : ''}
          ${opts.body ? `<p style="margin:0 0 28px;font-size:15px;color:#3d1a26;line-height:1.8;white-space:pre-wrap;">${escapeHtml(opts.body)}</p>` : ''}
          <div style="text-align:center;">
            <a href="${escapeHtml(opts.ctaUrl)}" style="display:inline-block;background:linear-gradient(135deg,#f9a8b8,#e879a0);color:#fff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:100px;letter-spacing:.04em;">${escapeHtml(opts.ctaLabel)}</a>
          </div>
        </td></tr>
        <tr><td style="padding:16px 32px 24px;border-top:1px solid #f0dde5;">
          <p style="margin:0;font-size:11px;color:#c8a0a8;text-align:center;line-height:1.6;">${escapeHtml(m.email.footer).replace(/\n/g, '<br>')}</p>
          <p style="margin:8px 0 0;font-size:11px;color:#c8a0a8;text-align:center;line-height:1.6;">
            <a href="${unsubscribe}" style="color:#c8a0a8;">${escapeHtml(m.email.unsubscribe)}</a><br>
            合同会社TJYM ／ info@tjym.org
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function headers(userId: string) {
  return { 'List-Unsubscribe': `<${unsubscribeUrl(userId)}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' }
}

/** お知らせ（開始・条件達成）の1通 */
function launchEmail(campaign: CampaignRow, t: Target) {
  const locale = localeOf(t)
  const m = MESSAGES[locale].campaignEmail
  const c = localizedText(campaign, locale, ['catchphrase', 'description', 'cta_text'])
  const copy = (c.catchphrase as string | null)?.trim() || ''
  return {
    from: FROM,
    to: t.email,
    subject: copy ? fmt(m.subject, { copy }) : m.subjectDefault,
    headers: headers(t.user_id),
    html: emailHtml({
      locale, userId: t.user_id, label: m.label, title: copy, body: (c.description as string | null) ?? '',
      ctaUrl: absoluteUrl(c.cta_url), ctaLabel: (c.cta_text as string | null) || m.cta, imageUrl: c.image_url,
    }),
  }
}

/** 追いメールの1通。text を渡すと（管理画面で手で書いたとき）その文面をそのまま使う */
function reminderEmail(campaign: CampaignRow, t: Target, text?: ReminderText) {
  const locale = localeOf(t)
  const m = MESSAGES[locale].campaignEmail
  const c = localizedText(campaign, locale, ['catchphrase', 'description', 'cta_text'])
  const copy = (c.catchphrase as string | null)?.trim() || ''
  const left = remainingText(campaign.ends_at, locale)
  const subject = text?.subject?.trim() || (left ? fmt(m.reminderSubjectLeft, { left, copy }) : fmt(m.reminderSubjectOpen, { copy })).trim()
  const body = text?.body?.trim()
    || [left ? fmt(m.reminderLeftLine, { left }) : '', m.reminderBody, copy, (c.description as string | null) ?? ''].filter(Boolean).join('\n\n')
  return {
    from: FROM,
    to: t.email,
    subject,
    headers: headers(t.user_id),
    html: emailHtml({
      locale, userId: t.user_id, label: m.label, title: '', body,
      ctaUrl: absoluteUrl(text?.ctaUrl || c.cta_url), ctaLabel: text?.ctaLabel?.trim() || m.reminderCta, imageUrl: c.image_url,
    }),
  }
}

/** 100通ずつまとめて送る。送れた人の user_id を返す */
async function sendBatches(emails: { userId: string; payload: Parameters<Resend['batch']['send']>[0][number] }[]): Promise<string[]> {
  if (!process.env.RESEND_API_KEY || !emails.length) return []
  const resend = new Resend(process.env.RESEND_API_KEY)
  const sent: string[] = []
  for (let i = 0; i < emails.length; i += 100) {
    const chunk = emails.slice(i, i + 100)
    const res = await resend.batch.send(chunk.map(e => e.payload)).catch(e => ({ error: e as { message?: string } }))
    if ('error' in res && res.error) {
      console.error('[campaign-email] batch error:', res.error.message)
      continue
    }
    sent.push(...chunk.map(e => e.userId))
  }
  return sent
}

/** お知らせメールの対象（まだ送っていない人） */
async function emailTargets(db: SupabaseClient, campaignId: string): Promise<Target[]> {
  const { data, error } = await db.rpc('campaign_email_targets', { p_campaign_id: campaignId, p_exclude_emails: [...INTERNAL_EMAILS] })
  if (error) throw new Error('campaign_email_targets: ' + error.message)
  return (data ?? []) as Target[]
}

/** 公開前の確認用: 今公開したら何人にお知らせが届くか */
export async function countCampaignLaunchTargets(db: SupabaseClient, campaignId: string): Promise<number> {
  return (await emailTargets(db, campaignId)).length
}

/**
 * 開始のお知らせ。送ったら campaigns.launch_notified_at を入れる（もう一度は送らない）。
 * 期間外・非公開・送信時間外なら何もしない（時間外なら cron があとで送る）
 */
export async function sendCampaignLaunch(db: SupabaseClient, campaignId: string): Promise<number> {
  const campaign = await loadCampaign(db, campaignId)
  if (!campaign?.is_active || campaign.launch_notified_at || !isWithinPeriod(campaign) || !isSendingHours()) return 0
  // 先に「送った」にする（cron と同時に動いても二重に送らない）
  const { data: claimed } = await db.from('campaigns').update({ launch_notified_at: new Date().toISOString() })
    .eq('id', campaignId).is('launch_notified_at', null).select('id')
  if (!claimed?.length) return 0
  return sendToTargets(db, campaign, 'launch')
}

async function sendToTargets(db: SupabaseClient, campaign: CampaignRow, trigger: 'launch' | 'threshold'): Promise<number> {
  const targets = await emailTargets(db, campaign.id)
  const sent = await sendBatches(targets.map(t => ({ userId: t.user_id, payload: launchEmail(campaign, t) })))
  if (sent.length) {
    await db.from('campaign_email_logs').upsert(
      sent.map(user_id => ({ campaign_id: campaign.id, user_id, trigger_type: trigger })),
      { onConflict: 'campaign_id,user_id', ignoreDuplicates: true },
    )
  }
  return sent.length
}

/** 自動の追いメール（最初のメールから24時間後・72時間後に、まだ買っていない人へ） */
async function sendAutoReminders(db: SupabaseClient, campaign: CampaignRow): Promise<number> {
  let total = 0
  for (const { step, afterHours } of AUTO_STEPS) {
    const { data, error } = await db.rpc('campaign_reminder_targets', {
      p_campaign_id: campaign.id, p_step: step, p_after_hours: afterHours, p_exclude_emails: [...INTERNAL_EMAILS],
    })
    // 記録が読めないときは送らない（読めないまま送ると毎回同じ人に送ってしまう）
    if (error) { console.error('[campaign-email] reminder targets error:', error.message); return total }
    const targets = (data ?? []) as Target[]
    const sent = await sendBatches(targets.map(t => ({ userId: t.user_id, payload: reminderEmail(campaign, t) })))
    if (sent.length) {
      await db.from('campaign_reminder_logs').upsert(
        sent.map(user_id => ({ campaign_id: campaign.id, user_id, step })),
        { onConflict: 'campaign_id,user_id,step', ignoreDuplicates: true },
      )
    }
    total += sent.length
  }
  return total
}

/** 管理画面の ✉ から。まだ買っていない対象者へ1回だけ（1キャンペーン1人1回） */
export async function sendCampaignManualReminder(db: SupabaseClient, campaignId: string, text: ReminderText): Promise<{ sentCount: number }> {
  const campaign = await loadCampaign(db, campaignId)
  if (!campaign) throw new Error('campaign not found')
  const { data, error } = await db.rpc('campaign_reminder_targets', {
    p_campaign_id: campaignId, p_step: MANUAL_REMINDER_STEP, p_after_hours: 0, p_exclude_emails: [...INTERNAL_EMAILS],
  })
  if (error) throw new Error(error.message)
  const targets = (data ?? []) as Target[]
  const sent = await sendBatches(targets.map(t => ({ userId: t.user_id, payload: reminderEmail(campaign, t, text) })))
  if (sent.length) {
    await db.from('campaign_reminder_logs').upsert(
      sent.map(user_id => ({ campaign_id: campaignId, user_id, step: MANUAL_REMINDER_STEP })),
      { onConflict: 'campaign_id,user_id,step', ignoreDuplicates: true },
    )
  }
  return { sentCount: sent.length }
}

/**
 * cron（/api/cron/campaigns、5分おき）:
 *   開始日時が来たキャンペーンのお知らせ → 「登録から◯時間」の条件に入った人へのお知らせ → 自動の追いメール
 */
export async function processCampaignEmails(db: SupabaseClient): Promise<{ launched: number; threshold: number; reminders: number }> {
  const result = { launched: 0, threshold: 0, reminders: 0 }
  if (!isSendingHours() || !process.env.RESEND_API_KEY) return result

  const { data } = await db.from('campaigns').select('*, campaign_conditions(*)').eq('is_active', true).limit(50)
  const campaigns = ((data ?? []) as CampaignRow[]).filter(c => isWithinPeriod(c))

  for (const c of campaigns) {
    if (!c.launch_notified_at) {
      result.launched += await sendCampaignLaunch(db, c.id)
      continue
    }
    // 登録からの経過時間が条件のキャンペーンは、条件に入った人へ順次お知らせする
    if ((c.campaign_conditions ?? []).some(x => x.condition_type === 'hours_since_registration')) {
      result.threshold += await sendToTargets(db, c, 'threshold')
    }
    result.reminders += await sendAutoReminders(db, c)
  }
  return result
}
