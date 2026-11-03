import type { SupabaseClient } from '@supabase/supabase-js'
import { translateContent, CONTENT_CONTEXT } from './content-translate'
import { sendCampaignLaunch } from './campaign-email'

const CONDITION_TYPES = ['registered_at', 'purchase_count', 'purchase_amount', 'hours_since_registration']
const OPERATORS = ['gte', 'lte', 'lt']

/** 管理画面のキャンペーン一覧（条件・表示数つき） */
export async function listCampaigns(db: SupabaseClient) {
  const [{ data: campaigns }, { data: counts }] = await Promise.all([
    db.from('campaigns').select('*, campaign_conditions(*)').order('created_at', { ascending: false }).limit(200),
    db.rpc('campaign_display_counts'),
  ])
  const countMap = new Map(((counts ?? []) as { campaign_id: string; display_count: number }[]).map(c => [c.campaign_id, Number(c.display_count)]))
  return (campaigns ?? []).map(c => ({ ...c, display_count: countMap.get(c.id) ?? 0 }))
}

/**
 * キャンペーンの追加・更新（id があれば更新）。条件は全部入れ直す。
 * 保存した日本語を各言語に訳してから、非公開 → 公開になったら開始のお知らせメールを送る（開始日時が未来なら cron が送る）
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function saveCampaign(db: SupabaseClient, id: string | null, body: any): Promise<{ id: string } | { error: string }> {
  const name = typeof body.name === 'string' ? body.name.trim() : ''
  if (!name) return { error: 'キャンペーン名は必須です' }
  const num = (v: unknown) => (v === '' || v == null || isNaN(Number(v)) ? null : Number(v))
  const tiers = Array.isArray(body.rate_tiers)
    ? body.rate_tiers.map((t: { min_yen: unknown; rate: unknown }) => ({ min_yen: Number(t.min_yen), rate: Number(t.rate) })).filter((t: { min_yen: number; rate: number }) => t.min_yen > 0 && t.rate > 0)
    : []
  const row = {
    name,
    image_url: body.image_url || null,
    catchphrase: (body.catchphrase ?? '').trim(),
    description: (body.description ?? '').trim(),
    cta_text: (body.cta_text ?? '').trim() || 'ポイントを購入する',
    cta_url: (body.cta_url ?? '').trim() || '/payment',
    display_frequency: body.display_frequency === 'always' ? 'always' : 'once',
    is_active: body.is_active === true,
    starts_at: body.starts_at || null,
    ends_at: body.ends_at || null,
    bonus_rate: Math.max(1, num(body.bonus_rate) ?? 1),
    rate_tiers: tiers,
    one_time_per_user: body.one_time_per_user === true,
    min_price_yen: num(body.min_price_yen),
    max_price_yen: num(body.max_price_yen),
    target_gender: body.target_gender === 'male' || body.target_gender === 'female' ? body.target_gender : null,
  }

  let wasActive = false
  let campaignId = id
  if (id) {
    const { data: before } = await db.from('campaigns').select('is_active').eq('id', id).maybeSingle()
    if (!before) return { error: 'キャンペーンが見つかりません' }
    wasActive = before.is_active
    // 公開し直したら、開始のお知らせをもう一度送れるようにする（送った人には送らない）
    const { error } = await db.from('campaigns').update({ ...row, ...(!wasActive && row.is_active ? { launch_notified_at: null } : {}) }).eq('id', id)
    if (error) return { error: error.message }
  } else {
    const { data, error } = await db.from('campaigns').insert(row).select('id').single()
    if (error || !data) return { error: error?.message ?? 'insert failed' }
    campaignId = data.id
  }

  const conditions = (Array.isArray(body.conditions) ? body.conditions : [])
    .filter((c: { condition_type: string; operator: string; value: unknown }) => CONDITION_TYPES.includes(c.condition_type) && OPERATORS.includes(c.operator) && String(c.value ?? '').trim())
    .map((c: { condition_type: string; operator: string; value: unknown }) => ({ campaign_id: campaignId, condition_type: c.condition_type, operator: c.operator, value: String(c.value).trim() }))
  await db.from('campaign_conditions').delete().eq('campaign_id', campaignId)
  if (conditions.length) {
    const { error } = await db.from('campaign_conditions').insert(conditions)
    if (error) return { error: '条件の保存に失敗しました: ' + error.message }
  }

  // ユーザーの表示言語で出すために訳す（お知らせメールも訳文で送るので、送る前に済ませる）
  try {
    const i18n = await translateContent({ catchphrase: row.catchphrase, description: row.description, cta_text: row.cta_text }, CONTENT_CONTEXT.campaigns)
    await db.from('campaigns').update({ i18n }).eq('id', campaignId)
  } catch (e) {
    console.error('[admin-campaigns] translate error:', e instanceof Error ? e.message : e)
  }

  if (!wasActive && row.is_active) {
    sendCampaignLaunch(db, campaignId!).catch(e => console.error('[admin-campaigns] launch email error:', e instanceof Error ? e.message : e))
  }
  return { id: campaignId! }
}
