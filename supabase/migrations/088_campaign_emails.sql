-- キャンペーンのお知らせメール（matchkoi 142・231 から。対象の絞り込みは DB 関数にした）
--   公開したとき（開始日時が未来ならその時刻）: 対象者へ1回（trigger_type = 'launch'）
--   「登録から◯時間」の条件があるキャンペーン: 条件に入った人へ1回（'threshold'。cron）
--   最初のメールから24時間後・72時間後: まだ買っていない人へ追いメール（campaign_reminder_logs の step 1 / 2）
--   管理画面の ✉ から手動の追いメール（step 9。1キャンペーン1人1回）
-- 対象の条件は src/lib/campaign-eligibility.ts と同じ（期間・性別・一人一回限り・登録日・登録からの経過時間・購入回数・購入額）
--
-- ロールバック: DROP FUNCTION campaign_email_targets(uuid, text[]); DROP FUNCTION campaign_reminder_targets(uuid, int, int, text[]);
--              DROP FUNCTION campaign_display_counts(); DROP TABLE campaign_reminder_logs; DROP TABLE campaign_email_logs;
--              ALTER TABLE campaigns DROP COLUMN launch_notified_at;

CREATE TABLE IF NOT EXISTS campaign_email_logs (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id  uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id      uuid NOT NULL,
  trigger_type text NOT NULL CHECK (trigger_type IN ('launch', 'threshold')),
  sent_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, user_id)
);
CREATE INDEX IF NOT EXISTS campaign_email_logs_sent_idx ON campaign_email_logs (campaign_id, sent_at);

CREATE TABLE IF NOT EXISTS campaign_reminder_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL,
  step        int NOT NULL,
  sent_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (campaign_id, user_id, step)
);

ALTER TABLE campaign_email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_reminder_logs ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON campaign_email_logs, campaign_reminder_logs FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON campaign_email_logs, campaign_reminder_logs TO service_role;

-- 開始のお知らせを送ったか（開始日時が未来のキャンペーンは cron が開始時刻に送る）
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS launch_notified_at timestamptz;
-- 今公開中のキャンペーンは「送り済み」にする（入れた瞬間に全員へ送らないように）
UPDATE campaigns SET launch_notified_at = now() WHERE is_active AND launch_notified_at IS NULL;

/**
 * いまこのキャンペーンの対象で、まだお知らせメールを送っていない人（メールを送ってよい人だけ）。
 * p_exclude_emails: 社内アカウント（lib/internal-accounts.ts）
 */
CREATE OR REPLACE FUNCTION campaign_email_targets(p_campaign_id uuid, p_exclude_emails text[] DEFAULT '{}')
RETURNS TABLE (user_id uuid, email text, locale text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT p.id, p.email, p.locale
  FROM campaigns c
  JOIN profiles p ON p.role = 'user'
  JOIN auth.users u ON u.id = p.id
  LEFT JOIN LATERAL (
    SELECT COUNT(*) AS cnt, COALESCE(SUM(t.price_yen), 0) AS amount,
           bool_or(t.campaign_id = c.id) AS used_this
    FROM point_transactions t
    WHERE t.user_id = p.id AND t.type = 'purchase' AND t.price_yen > 0
  ) pur ON true
  WHERE c.id = p_campaign_id
    AND p.email IS NOT NULL AND p.email <> ''
    AND NOT p.email_opt_out
    AND NOT (p.email = ANY (p_exclude_emails))
    AND (u.banned_until IS NULL OR u.banned_until < now())
    AND (c.target_gender IS NULL OR c.target_gender = p.gender)
    AND NOT (c.one_time_per_user AND COALESCE(pur.used_this, false))
    AND NOT EXISTS (SELECT 1 FROM campaign_email_logs l WHERE l.campaign_id = c.id AND l.user_id = p.id)
    AND NOT EXISTS (
      SELECT 1 FROM campaign_conditions cc
      WHERE cc.campaign_id = c.id AND NOT (
        CASE cc.condition_type
          WHEN 'registered_at' THEN
            CASE WHEN cc.operator = 'gte' THEN p.created_at >= (cc.value::date)::timestamp AT TIME ZONE 'Asia/Tokyo'
                 ELSE p.created_at < ((cc.value::date) + 1)::timestamp AT TIME ZONE 'Asia/Tokyo' END
          WHEN 'hours_since_registration' THEN
            CASE cc.operator
              WHEN 'gte' THEN extract(epoch FROM now() - p.created_at) / 3600 >= cc.value::numeric
              WHEN 'lte' THEN extract(epoch FROM now() - p.created_at) / 3600 <= cc.value::numeric
              WHEN 'lt'  THEN extract(epoch FROM now() - p.created_at) / 3600 <  cc.value::numeric
              ELSE false END
          WHEN 'purchase_count' THEN
            CASE cc.operator
              WHEN 'gte' THEN pur.cnt >= cc.value::numeric
              WHEN 'lte' THEN pur.cnt <= cc.value::numeric
              WHEN 'lt'  THEN pur.cnt <  cc.value::numeric
              ELSE false END
          WHEN 'purchase_amount' THEN
            CASE cc.operator
              WHEN 'gte' THEN pur.amount >= cc.value::numeric
              WHEN 'lte' THEN pur.amount <= cc.value::numeric
              WHEN 'lt'  THEN pur.amount <  cc.value::numeric
              ELSE false END
          ELSE true
        END
      )
    )
$$;

/**
 * 追いメールの対象: 最初のメール（campaign_email_logs）から p_after_hours 以上たち（7日以内）、
 * そのあと1回も買っておらず、この回（p_step）をまだ送っていない人。条件・性別・一人一回限りは送る直前にもう一度確かめる。
 * 手動（step 9）は p_after_hours = 0。最初のメールを送っていない人も、キャンペーンの対象なら含める。
 */
CREATE OR REPLACE FUNCTION campaign_reminder_targets(p_campaign_id uuid, p_step int, p_after_hours int, p_exclude_emails text[] DEFAULT '{}')
RETURNS TABLE (user_id uuid, email text, locale text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH eligible AS (
    -- お知らせメールの対象判定から「送り済みを除く」を外したもの
    SELECT p.id, p.email, p.locale, p.created_at
    FROM campaigns c
    JOIN profiles p ON p.role = 'user'
    JOIN auth.users u ON u.id = p.id
    LEFT JOIN LATERAL (
      SELECT COUNT(*) AS cnt, COALESCE(SUM(t.price_yen), 0) AS amount, bool_or(t.campaign_id = c.id) AS used_this
      FROM point_transactions t
      WHERE t.user_id = p.id AND t.type = 'purchase' AND t.price_yen > 0
    ) pur ON true
    WHERE c.id = p_campaign_id
      AND p.email IS NOT NULL AND p.email <> ''
      AND NOT p.email_opt_out
      AND NOT (p.email = ANY (p_exclude_emails))
      AND (u.banned_until IS NULL OR u.banned_until < now())
      AND (c.target_gender IS NULL OR c.target_gender = p.gender)
      AND NOT (c.one_time_per_user AND COALESCE(pur.used_this, false))
      AND NOT EXISTS (
        SELECT 1 FROM campaign_conditions cc
        WHERE cc.campaign_id = c.id AND NOT (
          CASE cc.condition_type
            WHEN 'registered_at' THEN
              CASE WHEN cc.operator = 'gte' THEN p.created_at >= (cc.value::date)::timestamp AT TIME ZONE 'Asia/Tokyo'
                   ELSE p.created_at < ((cc.value::date) + 1)::timestamp AT TIME ZONE 'Asia/Tokyo' END
            WHEN 'hours_since_registration' THEN
              CASE cc.operator
                WHEN 'gte' THEN extract(epoch FROM now() - p.created_at) / 3600 >= cc.value::numeric
                WHEN 'lte' THEN extract(epoch FROM now() - p.created_at) / 3600 <= cc.value::numeric
                WHEN 'lt'  THEN extract(epoch FROM now() - p.created_at) / 3600 <  cc.value::numeric
                ELSE false END
            WHEN 'purchase_count' THEN
              CASE cc.operator
                WHEN 'gte' THEN pur.cnt >= cc.value::numeric
                WHEN 'lte' THEN pur.cnt <= cc.value::numeric
                WHEN 'lt'  THEN pur.cnt <  cc.value::numeric
                ELSE false END
            WHEN 'purchase_amount' THEN
              CASE cc.operator
                WHEN 'gte' THEN pur.amount >= cc.value::numeric
                WHEN 'lte' THEN pur.amount <= cc.value::numeric
                WHEN 'lt'  THEN pur.amount <  cc.value::numeric
                ELSE false END
            ELSE true
          END
        )
      )
  )
  SELECT e.id, e.email, e.locale
  FROM eligible e
  LEFT JOIN campaign_email_logs l ON l.campaign_id = p_campaign_id AND l.user_id = e.id
  WHERE NOT EXISTS (SELECT 1 FROM campaign_reminder_logs r WHERE r.campaign_id = p_campaign_id AND r.user_id = e.id AND r.step = p_step)
    AND (
      (p_after_hours = 0)
      OR (l.sent_at <= now() - make_interval(hours => p_after_hours) AND l.sent_at >= now() - interval '7 days')
    )
    -- 最初のメール（無ければキャンペーン作成）のあとに買った人には送らない
    AND NOT EXISTS (
      SELECT 1 FROM point_transactions t
      WHERE t.user_id = e.id AND t.type = 'purchase' AND t.price_yen > 0
        AND t.created_at >= COALESCE(l.sent_at, (SELECT created_at FROM campaigns WHERE id = p_campaign_id))
    )
  LIMIT 1000
$$;

-- 管理画面の一覧に出す、キャンペーンごとの表示数
CREATE OR REPLACE FUNCTION campaign_display_counts()
RETURNS TABLE (campaign_id uuid, display_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT campaign_id, COUNT(*) FROM campaign_displays GROUP BY campaign_id
$$;

REVOKE ALL ON FUNCTION campaign_email_targets(uuid, text[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION campaign_reminder_targets(uuid, int, int, text[]) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION campaign_display_counts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION campaign_email_targets(uuid, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION campaign_reminder_targets(uuid, int, int, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION campaign_display_counts() TO service_role;
