-- 管理画面のスケール対応（ユーザー数千〜数万人を想定）
-- 1. 時間範囲・ユーザー別の集計に必要なインデックス
-- 2. ユーザー検索 RPC（絞り込み・ラベル・並び替え・ページングを DB 側で。総件数付き）
-- 3. ユーザーの行動タイムライン RPC（行動ログ＋メッセージ＋ポイント取引＋ログインを合成）

-- ── 1. インデックス ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_messages_user_created ON messages (created_at DESC) WHERE sender_role = 'user';
CREATE INDEX IF NOT EXISTS idx_point_transactions_type_created ON point_transactions (type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_point_transactions_user_purchase ON point_transactions (user_id, created_at DESC) WHERE type = 'purchase' AND price_yen > 0;
CREATE INDEX IF NOT EXISTS idx_profiles_created ON profiles (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON profiles (last_login_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_action_logs_user_created ON user_action_logs (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_login_events_user_time ON login_events (user_id, logged_in_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_label_assignments_label ON user_label_assignments (label_id, user_id);

-- ── 2. ユーザー検索 ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION search_admin_users(
  p_q               text        DEFAULT NULL,   -- 名前・ユーザーID・メール
  p_gender          text        DEFAULT NULL,
  p_age_min         int         DEFAULT NULL,
  p_age_max         int         DEFAULT NULL,
  p_registered_from timestamptz DEFAULT NULL,
  p_registered_to   timestamptz DEFAULT NULL,
  p_login_from      timestamptz DEFAULT NULL,
  p_login_to        timestamptz DEFAULT NULL,
  p_payment_from    timestamptz DEFAULT NULL,
  p_payment_to      timestamptz DEFAULT NULL,
  p_charged_min     bigint      DEFAULT NULL,   -- 円
  p_charged_max     bigint      DEFAULT NULL,
  p_points_min      int         DEFAULT NULL,
  p_points_max      int         DEFAULT NULL,
  p_payer           text        DEFAULT NULL,   -- 'payer' | 'nonpayer'
  p_member          text        DEFAULT NULL,   -- 'member' | 'nonmember'
  p_utm_source      text        DEFAULT NULL,
  p_label_ids       uuid[]      DEFAULT NULL,
  p_label_mode      text        DEFAULT 'or',   -- 'or' | 'and' | 'not'
  p_sort            text        DEFAULT 'created_at',
  p_order           text        DEFAULT 'desc',
  p_limit           int         DEFAULT 50,
  p_offset          int         DEFAULT 0
)
RETURNS TABLE (
  id uuid, user_code text, email text, display_name text, age int, gender text,
  points int, bonus_points int, total_charged bigint, purchase_count bigint, last_payment_at timestamptz,
  last_login_at timestamptz, created_at timestamptz, utm_source text, referral_source text,
  subscription_status text, subscription_plan text, total_count bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH base AS (
    SELECT u.*, COALESCE(pt.total_charged, 0)::bigint AS charged, COALESCE(pt.cnt, 0) AS cnt, pt.last_payment_at AS last_paid,
           (COALESCE(u.points, 0) + CASE WHEN u.bonus_points_expires_at > now() THEN COALESCE(u.bonus_points, 0) ELSE 0 END) AS pts,
           (u.subscription_status IN ('active', 'trialing') AND (u.subscription_period_end IS NULL OR u.subscription_period_end > now())) AS is_member
    FROM profiles u
    LEFT JOIN LATERAL (
      SELECT SUM(t.price_yen) AS total_charged, COUNT(*) AS cnt, MAX(t.created_at) AS last_payment_at
      FROM point_transactions t
      WHERE t.user_id = u.id AND t.type = 'purchase' AND t.price_yen > 0
    ) pt ON true
    WHERE u.role = 'user'
      AND (p_q IS NULL OR p_q = '' OR u.display_name ILIKE '%' || p_q || '%' OR u.user_code ILIKE '%' || p_q || '%' OR u.email ILIKE '%' || p_q || '%')
      AND (p_gender IS NULL OR p_gender = '' OR u.gender = p_gender)
      AND (p_age_min IS NULL OR u.age >= p_age_min)
      AND (p_age_max IS NULL OR u.age <= p_age_max)
      AND (p_registered_from IS NULL OR u.created_at >= p_registered_from)
      AND (p_registered_to   IS NULL OR u.created_at <= p_registered_to)
      AND (p_login_from IS NULL OR u.last_login_at >= p_login_from)
      AND (p_login_to   IS NULL OR u.last_login_at <= p_login_to)
      AND (p_utm_source IS NULL OR p_utm_source = '' OR u.utm_source ILIKE '%' || p_utm_source || '%')
      AND (p_label_ids IS NULL OR cardinality(p_label_ids) = 0 OR CASE p_label_mode
            WHEN 'and' THEN (SELECT COUNT(DISTINCT a.label_id) FROM user_label_assignments a WHERE a.user_id = u.id AND a.label_id = ANY(p_label_ids)) = cardinality(p_label_ids)
            WHEN 'not' THEN NOT EXISTS (SELECT 1 FROM user_label_assignments a WHERE a.user_id = u.id AND a.label_id = ANY(p_label_ids))
            ELSE EXISTS (SELECT 1 FROM user_label_assignments a WHERE a.user_id = u.id AND a.label_id = ANY(p_label_ids))
          END)
  ),
  filtered AS (
    SELECT * FROM base b
    WHERE (p_payment_from IS NULL OR b.last_paid >= p_payment_from)
      AND (p_payment_to   IS NULL OR b.last_paid <= p_payment_to)
      AND (p_charged_min IS NULL OR b.charged >= p_charged_min)
      AND (p_charged_max IS NULL OR b.charged <= p_charged_max)
      AND (p_points_min IS NULL OR b.pts >= p_points_min)
      AND (p_points_max IS NULL OR b.pts <= p_points_max)
      AND (p_payer IS NULL OR (p_payer = 'payer' AND b.cnt > 0) OR (p_payer = 'nonpayer' AND b.cnt = 0))
      AND (p_member IS NULL OR (p_member = 'member' AND b.is_member) OR (p_member = 'nonmember' AND NOT b.is_member))
  )
  SELECT f.id, f.user_code, f.email, f.display_name, f.age, f.gender,
         f.points, f.bonus_points, f.charged, f.cnt, f.last_paid,
         f.last_login_at, f.created_at, f.utm_source, f.referral_source,
         f.subscription_status, f.subscription_plan,
         COUNT(*) OVER () AS total_count
  FROM filtered f
  ORDER BY
    CASE WHEN p_order = 'asc' THEN
      CASE p_sort
        WHEN 'last_login_at'   THEN extract(epoch FROM f.last_login_at)
        WHEN 'last_payment_at' THEN extract(epoch FROM f.last_paid)
        WHEN 'total_charged'   THEN f.charged
        WHEN 'points'          THEN f.pts
        WHEN 'age'             THEN f.age
        ELSE extract(epoch FROM f.created_at)
      END
    END ASC NULLS LAST,
    CASE WHEN p_order <> 'asc' THEN
      CASE p_sort
        WHEN 'last_login_at'   THEN extract(epoch FROM f.last_login_at)
        WHEN 'last_payment_at' THEN extract(epoch FROM f.last_paid)
        WHEN 'total_charged'   THEN f.charged
        WHEN 'points'          THEN f.pts
        WHEN 'age'             THEN f.age
        ELSE extract(epoch FROM f.created_at)
      END
    END DESC NULLS LAST,
    f.created_at DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 200) OFFSET GREATEST(p_offset, 0)
$$;

REVOKE ALL ON FUNCTION search_admin_users FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION search_admin_users TO service_role;

-- ── 3. 行動タイムライン ─────────────────────────────────────────
-- 行動ログ（閲覧・決済開始など）＋ 送信メッセージ ＋ ポイント取引 ＋ ログイン を時系列で合成する。
-- メッセージ・取引から復元できる種類は行動ログ側からは除外して二重表示を防ぐ。
CREATE OR REPLACE FUNCTION admin_user_timeline(
  p_user_id uuid,
  p_before  timestamptz DEFAULT NULL,
  p_types   text[]      DEFAULT NULL,
  p_limit   int         DEFAULT 300
)
RETURNS TABLE (id text, created_at timestamptz, action_type text, metadata jsonb, points_delta int, points_balance int)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM (
    SELECT 'l:' || l.id::text, l.created_at, l.action_type, l.metadata, NULL::int, l.points_balance
    FROM user_action_logs l
    WHERE l.user_id = p_user_id
      AND l.action_type NOT IN ('message_sent', 'login_bonus', 'point_purchase_complete', 'subscription_bonus',
                                'admin_points_adjust', 'video_purchase', 'item_purchase', 'signup_complete')
      AND (p_before IS NULL OR l.created_at < p_before)
    UNION ALL
    SELECT 'm:' || m.id::text, m.created_at, 'message_sent',
           jsonb_build_object('character_name', ch.name, 'content', left(m.content, 80)),
           CASE WHEN m.points_used > 0 THEN -m.points_used END, NULL
    FROM messages m
    JOIN conversations c ON c.id = m.conversation_id
    LEFT JOIN characters ch ON ch.id = c.character_id
    WHERE c.user_id = p_user_id AND m.sender_role = 'user' AND m.is_deleted = false
      AND (p_before IS NULL OR m.created_at < p_before)
    UNION ALL
    SELECT 't:' || t.id::text, t.created_at,
           CASE t.type
             WHEN 'purchase' THEN CASE WHEN t.price_yen > 0 THEN 'point_purchase_complete' ELSE 'bonus_grant' END
             WHEN 'spend' THEN 'points_spent'
             WHEN 'admin_adjust' THEN 'admin_points_adjust'
             ELSE t.type
           END,
           jsonb_build_object('description', t.description, 'price_yen', t.price_yen),
           t.amount, NULL
    FROM point_transactions t
    WHERE t.user_id = p_user_id
      AND NOT (t.type = 'spend' AND t.description = 'メッセージ送信')   -- 送信はメッセージ側で表示
      AND (p_before IS NULL OR t.created_at < p_before)
    UNION ALL
    SELECT 'g:' || e.id::text, e.logged_in_at, 'login', NULL, NULL, NULL
    FROM login_events e
    WHERE e.user_id = p_user_id AND (p_before IS NULL OR e.logged_in_at < p_before)
  ) x (id, created_at, action_type, metadata, points_delta, points_balance)
  WHERE p_types IS NULL OR x.action_type = ANY(p_types)
  ORDER BY x.created_at DESC
  LIMIT LEAST(GREATEST(p_limit, 1), 1000)
$$;

REVOKE ALL ON FUNCTION admin_user_timeline(uuid, timestamptz, text[], int) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_user_timeline(uuid, timestamptz, text[], int) TO service_role;
