-- ログインイベントテーブル（last_login_at は上書きされるため日別ユニーク集計不可→別テーブルで蓄積）
CREATE TABLE IF NOT EXISTS login_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES profiles(id) ON DELETE CASCADE,
  logged_in_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_events_logged_in_at ON login_events (logged_in_at);
CREATE INDEX IF NOT EXISTS idx_login_events_user_id     ON login_events (user_id);

GRANT ALL ON TABLE login_events TO service_role;

-- 既存の last_login_at を種として1件ずつ移行
INSERT INTO login_events (user_id, logged_in_at)
SELECT id, last_login_at
FROM profiles
WHERE last_login_at IS NOT NULL
  AND role NOT IN ('admin', 'staff', 'owner')
ON CONFLICT DO NOTHING;

-- 集計RPC
CREATE OR REPLACE FUNCTION get_analytics_stats(
  p_from_iso    TIMESTAMPTZ,
  p_to_iso      TIMESTAMPTZ,
  p_period      TEXT,
  p_exclude_ids TEXT[] DEFAULT '{}'
)
RETURNS TABLE (
  bucket                    TEXT,
  revenue                   BIGINT,
  all_points_spent          BIGINT,
  paying_points_spent       BIGINT,
  free_points_spent         BIGINT,
  payer_user_count          BIGINT,
  purchase_count            BIGINT,
  registration_count        BIGINT,
  first_time_payer_count    BIGINT,
  login_user_count          BIGINT,
  total_period_login_users  BIGINT,
  total_period_payer_users  BIGINT
)
LANGUAGE sql STABLE
AS $$
WITH
  fmt(pattern, suffix) AS (
    VALUES (
      CASE p_period
        WHEN 'hourly'  THEN 'YYYY-MM-DD HH24'
        WHEN 'daily'   THEN 'YYYY-MM-DD'
        ELSE                'YYYY-MM'
      END,
      CASE p_period WHEN 'hourly' THEN ':00' ELSE '' END
    )
  ),

  all_time_payers AS (
    SELECT DISTINCT user_id
    FROM point_transactions
    WHERE type = 'purchase'
      AND NOT (user_id::text = ANY(p_exclude_ids))
  ),

  ptxs AS (
    SELECT
      pt.user_id,
      pt.amount,
      pt.type,
      pt.price_yen,
      to_char(pt.created_at AT TIME ZONE 'Asia/Tokyo', fmt.pattern) || fmt.suffix AS bkt,
      (atp.user_id IS NOT NULL) AS is_payer
    FROM point_transactions pt
    CROSS JOIN fmt
    LEFT JOIN all_time_payers atp ON atp.user_id = pt.user_id
    WHERE pt.created_at >= p_from_iso
      AND (p_to_iso IS NULL OR pt.created_at < p_to_iso)
      AND NOT (pt.user_id::text = ANY(p_exclude_ids))
  ),

  tx_agg AS (
    SELECT
      bkt,
      SUM(CASE WHEN type = 'purchase' THEN COALESCE(price_yen, 0) ELSE 0 END)::BIGINT    AS revenue,
      SUM(CASE WHEN type = 'spend'    THEN ABS(amount)            ELSE 0 END)::BIGINT    AS all_pts,
      SUM(CASE WHEN type = 'spend' AND     is_payer THEN ABS(amount) ELSE 0 END)::BIGINT AS paying_pts,
      SUM(CASE WHEN type = 'spend' AND NOT is_payer THEN ABS(amount) ELSE 0 END)::BIGINT AS free_pts,
      COUNT(DISTINCT CASE WHEN type = 'purchase' THEN user_id END)::BIGINT               AS payer_users,
      COUNT(*) FILTER (WHERE type = 'purchase')::BIGINT                                  AS purchase_cnt
    FROM ptxs
    GROUP BY bkt
  ),

  first_buys AS (
    SELECT fp.user_id, MIN(fp.created_at) AS first_at
    FROM point_transactions fp
    WHERE fp.type = 'purchase'
      AND fp.created_at >= p_from_iso
      AND (p_to_iso IS NULL OR fp.created_at < p_to_iso)
      AND NOT (fp.user_id::text = ANY(p_exclude_ids))
    GROUP BY fp.user_id
    HAVING NOT EXISTS (
      SELECT 1 FROM point_transactions prev
      WHERE prev.user_id = fp.user_id
        AND prev.type = 'purchase'
        AND prev.created_at < p_from_iso
    )
  ),
  ftp_agg AS (
    SELECT
      to_char(first_at AT TIME ZONE 'Asia/Tokyo', fmt.pattern) || fmt.suffix AS bkt,
      COUNT(*)::BIGINT AS ftp_cnt
    FROM first_buys CROSS JOIN fmt
    GROUP BY 1
  ),

  reg_agg AS (
    SELECT
      to_char(created_at AT TIME ZONE 'Asia/Tokyo', fmt.pattern) || fmt.suffix AS bkt,
      COUNT(*)::BIGINT AS reg_cnt
    FROM profiles CROSS JOIN fmt
    WHERE created_at >= p_from_iso
      AND (p_to_iso IS NULL OR created_at < p_to_iso)
      AND role NOT IN ('admin', 'staff', 'owner')
      AND NOT (id::text = ANY(p_exclude_ids))
    GROUP BY 1
  ),

  login_agg AS (
    SELECT
      to_char(logged_in_at AT TIME ZONE 'Asia/Tokyo', fmt.pattern) || fmt.suffix AS bkt,
      COUNT(DISTINCT user_id)::BIGINT AS login_cnt
    FROM login_events CROSS JOIN fmt
    WHERE logged_in_at >= p_from_iso
      AND (p_to_iso IS NULL OR logged_in_at < p_to_iso)
      AND (user_id IS NULL OR NOT (user_id::text = ANY(p_exclude_ids)))
    GROUP BY 1
  ),

  period_totals AS (
    SELECT
      (SELECT COUNT(DISTINCT user_id) FROM login_events
       WHERE logged_in_at >= p_from_iso
         AND (p_to_iso IS NULL OR logged_in_at < p_to_iso)
         AND (user_id IS NULL OR NOT (user_id::text = ANY(p_exclude_ids)))
      )::BIGINT AS total_login_users,
      (SELECT COUNT(DISTINCT user_id) FROM point_transactions
       WHERE type = 'purchase'
         AND created_at >= p_from_iso
         AND (p_to_iso IS NULL OR created_at < p_to_iso)
         AND NOT (user_id::text = ANY(p_exclude_ids))
      )::BIGINT AS total_payer_users
  ),

  all_bkts AS (
    SELECT bkt FROM tx_agg
    UNION SELECT bkt FROM ftp_agg
    UNION SELECT bkt FROM reg_agg
    UNION SELECT bkt FROM login_agg
  )

SELECT
  ab.bkt                        AS bucket,
  COALESCE(ta.revenue,      0)  AS revenue,
  COALESCE(ta.all_pts,      0)  AS all_points_spent,
  COALESCE(ta.paying_pts,   0)  AS paying_points_spent,
  COALESCE(ta.free_pts,     0)  AS free_points_spent,
  COALESCE(ta.payer_users,  0)  AS payer_user_count,
  COALESCE(ta.purchase_cnt, 0)  AS purchase_count,
  COALESCE(ra.reg_cnt,      0)  AS registration_count,
  COALESCE(fa.ftp_cnt,      0)  AS first_time_payer_count,
  COALESCE(la.login_cnt,    0)  AS login_user_count,
  pt.total_login_users,
  pt.total_payer_users
FROM all_bkts ab
CROSS JOIN period_totals pt
LEFT JOIN tx_agg    ta  ON ta.bkt  = ab.bkt
LEFT JOIN ftp_agg   fa  ON fa.bkt  = ab.bkt
LEFT JOIN reg_agg   ra  ON ra.bkt  = ab.bkt
LEFT JOIN login_agg la  ON la.bkt  = ab.bkt
ORDER BY ab.bkt;
$$;

GRANT EXECUTE ON FUNCTION get_analytics_stats(TIMESTAMPTZ, TIMESTAMPTZ, TEXT, TEXT[]) TO service_role;
