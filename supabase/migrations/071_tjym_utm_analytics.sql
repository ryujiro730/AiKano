-- tjym（広告評価ダッシュボード）用の流入元別集計。マチコイ（sakura）の同名関数と引数・戻り値を揃えている。
-- 対象ユーザー: オンボーディング完了（age が入っている）・一般ユーザー。売上は point_transactions の purchase（price_yen あり）。
-- service_role 専用（tjym はサーバーから service role key で呼ぶ）。
--
-- ロールバック:
--   DROP FUNCTION IF EXISTS get_utm_ltv_stats_grouped(text, text, text[]);
--   DROP FUNCTION IF EXISTS get_utm_ltv_stats_windowed(text, text, int, text[]);
--   DROP FUNCTION IF EXISTS get_utm_purchase_counts(text, text, int, text[]);
--   DROP FUNCTION IF EXISTS get_utm_age_stats(text, text, text[]);
--   DROP FUNCTION IF EXISTS get_utm_ltv_curve(text, text, text[]);
--   DROP FUNCTION IF EXISTS get_source_ltv_stats(text, text, text);
--   DROP FUNCTION IF EXISTS get_source_breakdown(text, text);

CREATE OR REPLACE FUNCTION get_utm_ltv_stats_grouped(
  p_from_iso text,
  p_to_iso text,
  p_exclude_ids text[]
)
RETURNS TABLE(utm_campaign text, utm_content text, user_count bigint, paying_user_count bigint, ltv_total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH base AS (
    SELECT
      COALESCE(p.utm_campaign, '—') AS utm_campaign,
      COALESCE(p.utm_content, '—') AS utm_content,
      COUNT(DISTINCT p.id) AS user_count,
      COUNT(DISTINCT CASE WHEN pt.price_yen IS NOT NULL THEN p.id END) AS paying_user_count,
      COALESCE(SUM(pt.price_yen), 0)::bigint AS ltv_total
    FROM profiles p
    LEFT JOIN point_transactions pt
      ON pt.user_id = p.id AND pt.type = 'purchase' AND pt.price_yen IS NOT NULL
    WHERE p.created_at >= p_from_iso::timestamptz
      AND p.created_at < p_to_iso::timestamptz
      AND p.age IS NOT NULL
      AND p.role = 'user'
      AND NOT (p.id::text = ANY(p_exclude_ids))
    GROUP BY p.utm_campaign, p.utm_content
  ),
  campaign_totals AS (SELECT utm_campaign, SUM(ltv_total) AS campaign_ltv FROM base GROUP BY utm_campaign)
  SELECT b.utm_campaign, b.utm_content, b.user_count, b.paying_user_count, b.ltv_total
  FROM base b JOIN campaign_totals ct ON b.utm_campaign = ct.utm_campaign
  ORDER BY ct.campaign_ltv DESC, b.utm_campaign, b.ltv_total DESC, b.utm_content
$$;

CREATE OR REPLACE FUNCTION get_utm_ltv_stats_windowed(
  p_from_iso text,
  p_to_iso text,
  p_window_days int,
  p_exclude_ids text[]
)
RETURNS TABLE(utm_campaign text, utm_content text, user_count bigint, paying_user_count bigint, ltv_total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH base AS (
    SELECT
      COALESCE(p.utm_campaign, '—') AS utm_campaign,
      COALESCE(p.utm_content, '—') AS utm_content,
      COUNT(DISTINCT p.id) AS user_count,
      COUNT(DISTINCT CASE
        WHEN pt.price_yen IS NOT NULL
         AND (p_window_days = 0 OR pt.created_at < p.created_at + make_interval(days => p_window_days))
        THEN p.id END) AS paying_user_count,
      COALESCE(SUM(CASE
        WHEN p_window_days = 0 OR pt.created_at < p.created_at + make_interval(days => p_window_days)
        THEN pt.price_yen END), 0)::bigint AS ltv_total
    FROM profiles p
    LEFT JOIN point_transactions pt
      ON pt.user_id = p.id AND pt.type = 'purchase' AND pt.price_yen IS NOT NULL
    WHERE p.created_at >= p_from_iso::timestamptz
      AND p.created_at < p_to_iso::timestamptz
      AND p.age IS NOT NULL
      AND p.role = 'user'
      AND NOT (p.id::text = ANY(p_exclude_ids))
    GROUP BY p.utm_campaign, p.utm_content
  ),
  campaign_totals AS (SELECT utm_campaign, SUM(ltv_total) AS campaign_ltv FROM base GROUP BY utm_campaign)
  SELECT b.utm_campaign, b.utm_content, b.user_count, b.paying_user_count, b.ltv_total
  FROM base b JOIN campaign_totals ct ON b.utm_campaign = ct.utm_campaign
  ORDER BY ct.campaign_ltv DESC, b.utm_campaign, b.ltv_total DESC, b.utm_content
$$;

CREATE OR REPLACE FUNCTION get_utm_purchase_counts(
  p_from_iso text,
  p_to_iso text,
  p_window_days int DEFAULT 0,
  p_exclude_ids text[] DEFAULT '{}'
)
RETURNS TABLE(utm_source text, utm_campaign text, utm_content text, purchase_count bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    p.utm_source,
    COALESCE(p.utm_campaign, '—') AS utm_campaign,
    COALESCE(p.utm_content, '—') AS utm_content,
    COUNT(pt.id)::bigint AS purchase_count
  FROM profiles p
  JOIN point_transactions pt
    ON pt.user_id = p.id AND pt.type = 'purchase' AND pt.price_yen IS NOT NULL
   AND (p_window_days = 0 OR pt.created_at < p.created_at + make_interval(days => p_window_days))
  WHERE p.created_at >= p_from_iso::timestamptz
    AND p.created_at < p_to_iso::timestamptz
    AND p.age IS NOT NULL
    AND p.role = 'user'
    AND NOT (p.id::text = ANY(p_exclude_ids))
  GROUP BY p.utm_source, p.utm_campaign, p.utm_content
$$;

CREATE OR REPLACE FUNCTION get_utm_age_stats(
  p_from_iso text,
  p_to_iso text,
  p_exclude_ids text[]
)
RETURNS TABLE(utm_campaign text, utm_content text, age_group text, user_count bigint, paying_user_count bigint, ltv_total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    COALESCE(p.utm_campaign, '—') AS utm_campaign,
    COALESCE(p.utm_content, '—') AS utm_content,
    CASE
      WHEN p.age BETWEEN 18 AND 24 THEN '18-24'
      WHEN p.age BETWEEN 25 AND 29 THEN '25-29'
      WHEN p.age BETWEEN 30 AND 34 THEN '30-34'
      WHEN p.age BETWEEN 35 AND 39 THEN '35-39'
      WHEN p.age BETWEEN 40 AND 49 THEN '40-49'
      ELSE '50+'
    END AS age_group,
    COUNT(DISTINCT p.id) AS user_count,
    COUNT(DISTINCT CASE WHEN pt.price_yen IS NOT NULL THEN p.id END) AS paying_user_count,
    COALESCE(SUM(pt.price_yen), 0)::bigint AS ltv_total
  FROM profiles p
  LEFT JOIN point_transactions pt
    ON pt.user_id = p.id AND pt.type = 'purchase' AND pt.price_yen IS NOT NULL
  WHERE p.created_at >= p_from_iso::timestamptz
    AND p.created_at < p_to_iso::timestamptz
    AND p.age IS NOT NULL
    AND p.role = 'user'
    AND NOT (p.id::text = ANY(p_exclude_ids))
  GROUP BY p.utm_campaign, p.utm_content, age_group
  ORDER BY utm_campaign, age_group
$$;

CREATE OR REPLACE FUNCTION get_utm_ltv_curve(
  p_from_iso text,
  p_to_iso text,
  p_exclude_ids text[]
)
RETURNS TABLE(
  utm_campaign text, utm_content text,
  user_count bigint, paying_user_count bigint, repeat_payer_count bigint,
  ltv_d1 bigint, ltv_d7 bigint, ltv_d7_capped bigint, max_user_d7_yen bigint,
  ltv_d14 bigint, ltv_d30 bigint, ltv_d60 bigint, ltv_total bigint
)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  WITH tx_counts AS (
    SELECT user_id, COUNT(*) AS tx_count
    FROM point_transactions
    WHERE type = 'purchase' AND price_yen IS NOT NULL
    GROUP BY user_id
  ),
  user_ltv AS (
    SELECT
      COALESCE(p.utm_campaign, '—') AS utm_campaign,
      COALESCE(p.utm_content, '—') AS utm_content,
      p.id AS user_id,
      COALESCE(tc.tx_count, 0) AS tx_count,
      COALESCE(SUM(CASE WHEN pt.created_at < p.created_at + INTERVAL '1 day'   THEN pt.price_yen END), 0) AS d1,
      COALESCE(SUM(CASE WHEN pt.created_at < p.created_at + INTERVAL '7 days'  THEN pt.price_yen END), 0) AS d7,
      COALESCE(SUM(CASE WHEN pt.created_at < p.created_at + INTERVAL '14 days' THEN pt.price_yen END), 0) AS d14,
      COALESCE(SUM(CASE WHEN pt.created_at < p.created_at + INTERVAL '30 days' THEN pt.price_yen END), 0) AS d30,
      COALESCE(SUM(CASE WHEN pt.created_at < p.created_at + INTERVAL '60 days' THEN pt.price_yen END), 0) AS d60,
      COALESCE(SUM(pt.price_yen), 0) AS total
    FROM profiles p
    LEFT JOIN point_transactions pt
      ON pt.user_id = p.id AND pt.type = 'purchase' AND pt.price_yen IS NOT NULL
    LEFT JOIN tx_counts tc ON tc.user_id = p.id
    WHERE p.created_at >= p_from_iso::timestamptz
      AND p.created_at < p_to_iso::timestamptz
      AND p.age IS NOT NULL
      AND p.role = 'user'
      AND NOT (p.id::text = ANY(p_exclude_ids))
    GROUP BY p.utm_campaign, p.utm_content, p.id, tc.tx_count
  ),
  base AS (
    SELECT
      utm_campaign, utm_content,
      COUNT(*) AS user_count,
      COUNT(*) FILTER (WHERE d7 > 0) AS paying_user_count,
      COUNT(*) FILTER (WHERE tx_count >= 2) AS repeat_payer_count,
      SUM(d1)::bigint AS ltv_d1,
      SUM(d7)::bigint AS ltv_d7,
      SUM(LEAST(d7, 50000))::bigint AS ltv_d7_capped,
      MAX(d7)::bigint AS max_user_d7_yen,
      SUM(d14)::bigint AS ltv_d14,
      SUM(d30)::bigint AS ltv_d30,
      SUM(d60)::bigint AS ltv_d60,
      SUM(total)::bigint AS ltv_total
    FROM user_ltv
    GROUP BY utm_campaign, utm_content
  ),
  campaign_totals AS (SELECT utm_campaign, SUM(ltv_total) AS campaign_ltv FROM base GROUP BY utm_campaign)
  SELECT b.utm_campaign, b.utm_content, b.user_count, b.paying_user_count, b.repeat_payer_count,
         b.ltv_d1, b.ltv_d7, b.ltv_d7_capped, b.max_user_d7_yen, b.ltv_d14, b.ltv_d30, b.ltv_d60, b.ltv_total
  FROM base b JOIN campaign_totals ct ON b.utm_campaign = ct.utm_campaign
  ORDER BY ct.campaign_ltv DESC, b.utm_campaign, b.ltv_total DESC, b.utm_content
$$;

CREATE OR REPLACE FUNCTION get_source_ltv_stats(
  p_source text,
  p_from_iso text,
  p_to_iso text
)
RETURNS TABLE(user_count bigint, paying_user_count bigint, ltv_total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    COUNT(DISTINCT p.id)::bigint,
    COUNT(DISTINCT CASE WHEN pt.price_yen IS NOT NULL THEN p.id END)::bigint,
    COALESCE(SUM(pt.price_yen), 0)::bigint
  FROM profiles p
  LEFT JOIN point_transactions pt
    ON pt.user_id = p.id AND pt.type = 'purchase' AND pt.price_yen IS NOT NULL
  WHERE LOWER(p.utm_source) = LOWER(p_source)
    AND p.created_at >= p_from_iso::timestamptz
    AND p.created_at < p_to_iso::timestamptz
    AND p.age IS NOT NULL
    AND p.role = 'user'
$$;

-- 流入元（utm_source）別の集計。広告費のない自社チャネル（マチコイ送客・SEO・メール・流入元なし）の評価用
CREATE OR REPLACE FUNCTION get_source_breakdown(
  p_from_iso text,
  p_to_iso text
)
RETURNS TABLE(utm_source text, user_count bigint, paying_user_count bigint, purchase_count bigint, ltv_total bigint)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT
    COALESCE(LOWER(p.utm_source), '—') AS utm_source,
    COUNT(DISTINCT p.id)::bigint,
    COUNT(DISTINCT pt.user_id)::bigint,
    COUNT(pt.id)::bigint,
    COALESCE(SUM(pt.price_yen), 0)::bigint
  FROM profiles p
  LEFT JOIN point_transactions pt
    ON pt.user_id = p.id AND pt.type = 'purchase' AND pt.price_yen IS NOT NULL
  WHERE p.created_at >= p_from_iso::timestamptz
    AND p.created_at < p_to_iso::timestamptz
    AND p.age IS NOT NULL
    AND p.role = 'user'
  GROUP BY 1
  ORDER BY 2 DESC
$$;

REVOKE EXECUTE ON FUNCTION get_utm_ltv_stats_grouped(text, text, text[]) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION get_utm_ltv_stats_windowed(text, text, int, text[]) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION get_utm_purchase_counts(text, text, int, text[]) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION get_utm_age_stats(text, text, text[]) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION get_utm_ltv_curve(text, text, text[]) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION get_source_ltv_stats(text, text, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION get_source_breakdown(text, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_utm_ltv_stats_grouped(text, text, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION get_utm_ltv_stats_windowed(text, text, int, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION get_utm_purchase_counts(text, text, int, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION get_utm_age_stats(text, text, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION get_utm_ltv_curve(text, text, text[]) TO service_role;
GRANT EXECUTE ON FUNCTION get_source_ltv_stats(text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION get_source_breakdown(text, text) TO service_role;
