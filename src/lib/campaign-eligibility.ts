import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * キャンペーンの対象判定を1箇所にまとめる。
 * 以前は /api/campaigns/active・決済Webhook・バナー・告知メール・cron がそれぞれ条件を評価していて、
 * 「未満」が「以下」扱いになる／「登録経過時間 ≤」が常に不一致／登録日が UTC 0時で切れる、などのズレがあった。
 *
 * 条件の意味（管理画面の表示と一致させる）:
 *   registered_at            登録日。値は 'YYYY-MM-DD'（JST）。gte = その日の 00:00 JST 以降、lte = その日の 23:59:59 JST まで
 *   hours_since_registration 登録からの経過時間。gte / lte / lt
 *   purchase_count           購入回数（price_yen のある purchase 行。ポイント購入・サブスク・パスの支払い。ボーナス付与行は数えない）。gte / lte / lt
 *   purchase_amount          購入額の合計（円）。gte / lte / lt
 * 条件は AND。条件なし = 全員対象。
 */

export type CampaignCondition = { condition_type: string; operator: string; value: string }

export type CampaignRow = {
  id: string
  is_active?: boolean
  starts_at: string | null
  ends_at: string | null
  bonus_rate: number | string | null
  one_time_per_user: boolean | null
  min_price_yen: number | null
  max_price_yen: number | null
  target_gender?: string | null
  rate_tiers?: { min_yen: number; rate: number }[] | null
  display_frequency?: string
  campaign_conditions?: CampaignCondition[] | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  i18n?: unknown
  [key: string]: any
}

export type PurchaseRow = { price_yen: number | null; created_at: string; campaign_id?: string | null }   // campaign_id = そのキャンペーンの倍率で買った

export type UserCampaignCtx = {
  registeredAt: Date | null
  gender?: string | null
  purchases: PurchaseRow[]     // price_yen のある purchase 行（新しい順）
  now?: Date
}

/** 'YYYY-MM-DD' を JST の日付境界に変換。それ以外の文字列はそのまま Date にする */
export function registeredAtBound(value: string, op: string): Date {
  const v = (value ?? '').trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    return op === 'gte' ? new Date(`${v}T00:00:00+09:00`) : new Date(`${v}T23:59:59.999+09:00`)
  }
  return new Date(v)
}

function compare(op: string, left: number, right: number): boolean {
  if (op === 'gte') return left >= right
  if (op === 'lte') return left <= right
  if (op === 'lt') return left < right
  if (op === 'gt') return left > right
  return false
}

export function purchaseStats(purchases: PurchaseRow[]) {
  const paid = purchases.filter(p => p.price_yen != null && p.price_yen > 0)
  return {
    count: paid.length,
    amount: paid.reduce((s, p) => s + (p.price_yen ?? 0), 0),
    latestAt: paid[0]?.created_at ? new Date(paid[0].created_at) : null,
  }
}

export function matchesCondition(cond: CampaignCondition, ctx: UserCampaignCtx): boolean {
  const now = ctx.now ?? new Date()
  const op = cond.operator
  const stats = purchaseStats(ctx.purchases)

  if (cond.condition_type === 'registered_at') {
    if (!ctx.registeredAt) return false
    const bound = registeredAtBound(cond.value, op)
    if (isNaN(bound.getTime())) return false
    return op === 'gte' ? ctx.registeredAt >= bound : ctx.registeredAt <= bound
  }
  if (cond.condition_type === 'hours_since_registration') {
    if (!ctx.registeredAt) return false
    const hours = (now.getTime() - ctx.registeredAt.getTime()) / 3600000
    const n = parseFloat(cond.value)
    return isNaN(n) ? false : compare(op, hours, n)
  }
  if (cond.condition_type === 'purchase_count') {
    const n = parseInt(cond.value, 10)
    return isNaN(n) ? false : compare(op, stats.count, n)
  }
  if (cond.condition_type === 'purchase_amount') {
    const n = parseInt(cond.value, 10)
    return isNaN(n) ? false : compare(op, stats.amount, n)
  }
  return true
}

export function matchesAllConditions(conds: CampaignCondition[] | null | undefined, ctx: UserCampaignCtx): boolean {
  return (conds ?? []).every(c => matchesCondition(c, ctx))
}

export function isWithinPeriod(c: Pick<CampaignRow, 'starts_at' | 'ends_at'>, now = new Date()): boolean {
  const start = c.starts_at ? new Date(c.starts_at) : null
  const end = c.ends_at ? new Date(c.ends_at) : null
  return (start === null || start <= now) && (end === null || end >= now)
}

/** 一人一回限り: このキャンペーンの倍率で1回買ったら対象外（point_transactions.campaign_id）。
 *  2026-10-23 まで「開始日時以降に何か買っていれば対象外」だったので、入金者向けキャンペーン中に初めて入金した人
 *  （新規向けの倍率や通常で買った人）が、2回目でも倍率を受け取れなかった */
export function isBlockedByOneTime(c: Pick<CampaignRow, 'id' | 'one_time_per_user'>, purchases: PurchaseRow[]): boolean {
  if (!c.one_time_per_user) return false
  return purchases.some(p => p.campaign_id === c.id)
}

/** 対象性別（campaigns.target_gender）: 未設定なら全員。設定があれば性別が一致する人だけ（性別未登録の人は対象外） */
export function matchesTargetGender(c: Pick<CampaignRow, 'target_gender'>, gender: string | null | undefined): boolean {
  return !c.target_gender || c.target_gender === gender
}

export function isInPriceRange(c: Pick<CampaignRow, 'min_price_yen' | 'max_price_yen'>, priceYen: number): boolean {
  return (c.min_price_yen == null || priceYen >= c.min_price_yen) && (c.max_price_yen == null || priceYen <= c.max_price_yen)
}

export function bonusRateOf(c: Pick<CampaignRow, 'bonus_rate'>): number {
  const r = typeof c.bonus_rate === 'number' ? c.bonus_rate : parseFloat(String(c.bonus_rate ?? '1'))
  return isNaN(r) ? 1.0 : r
}

/** 倍率の付くキャンペーンか（基本倍率か、高額パックの段階倍率のどちらか） */
export function hasBonus(c: Pick<CampaignRow, 'bonus_rate' | 'rate_tiers'>): boolean {
  return bonusRateOf(c) > 1 || (c.rate_tiers ?? []).some(t => Number(t.rate) > 1)
}

/** 判定に必要なユーザー情報を取る（登録日時・購入履歴）。userId が無ければ空のコンテキスト */
export async function loadUserCampaignCtx(db: SupabaseClient, userId: string | null | undefined): Promise<UserCampaignCtx> {
  if (!userId) return { registeredAt: null, gender: null, purchases: [] }
  const [{ data: profile }, { data: purchases }] = await Promise.all([
    db.from('profiles').select('created_at, gender').eq('id', userId).maybeSingle(),
    db.from('point_transactions')
      .select('price_yen, created_at, campaign_id')
      .eq('user_id', userId)
      .eq('type', 'purchase')
      .not('price_yen', 'is', null)
      .order('created_at', { ascending: false })
      .limit(500),
  ])
  return {
    registeredAt: profile?.created_at ? new Date(profile.created_at) : null,
    gender: profile?.gender ?? null,
    purchases: (purchases ?? []) as PurchaseRow[],
  }
}

export type ResolveOptions = {
  /** true = 購入ボーナス判定（「1回のみ表示」の既表示スキップをしない） */
  purchaseContext?: boolean
  /** 指定すると価格帯（min/max_price_yen）で絞る */
  priceYen?: number
  /** true = 倍率の付くキャンペーンだけ（bonus_rate > 1 か段階倍率あり） */
  requireBonus?: boolean
  /** display_frequency='once' で既に表示済みのキャンペーン ID */
  displayedIds?: Set<string>
  /** true = 画像のあるキャンペーンだけ（バナー用） */
  requireImage?: boolean
  now?: Date
}

/**
 * ユーザーに適用されるキャンペーンを1件返す（倍率の高い順に見て最初に条件を満たしたもの）。
 * 公開中・期間内・一人一回限り・対象条件・価格帯をすべて見る。
 */
export async function resolveCampaignForUser(
  db: SupabaseClient,
  userId: string | null | undefined,
  opts: ResolveOptions = {},
): Promise<CampaignRow | null> {
  const now = opts.now ?? new Date()
  let q = db
    .from('campaigns')
    .select('*, campaign_conditions(*)')
    .eq('is_active', true)
    .order('bonus_rate', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)
  if (opts.requireImage) q = q.not('image_url', 'is', null)
  const { data, error } = await q
  if (error) {
    console.error('[campaign-eligibility] campaigns query error:', error.message)
    return null
  }
  const candidates = ((data ?? []) as CampaignRow[]).filter(c => isWithinPeriod(c, now) && (!opts.requireBonus || hasBonus(c)))
  if (!candidates.length) return null

  const needsUser = candidates.some(c => c.one_time_per_user || c.target_gender || (c.campaign_conditions ?? []).length > 0)
  const ctx: UserCampaignCtx = needsUser ? await loadUserCampaignCtx(db, userId) : { registeredAt: null, gender: null, purchases: [] }
  ctx.now = now

  for (const c of candidates) {
    if (!opts.purchaseContext && c.display_frequency === 'once' && opts.displayedIds?.has(c.id)) continue
    if (opts.priceYen != null && !isInPriceRange(c, opts.priceYen)) continue
    if (!matchesTargetGender(c, ctx.gender)) continue
    if (isBlockedByOneTime(c, ctx.purchases)) continue
    if (!matchesAllConditions(c.campaign_conditions, ctx)) continue
    return c
  }
  return null
}
