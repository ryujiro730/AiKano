-- 自動同報・同報のスケール対応
-- 旧: 毎分 全ユーザーを JS に取得（PostgREST の上限1000件で1001人目以降に届かない）→ 全件 upsert
-- 新: 予約は SQL 1文で、送信対象は件数を区切って取り出す（同時実行でも二重送信しない）

CREATE INDEX IF NOT EXISTS idx_auto_broadcast_logs_pending
  ON auto_broadcast_logs (scheduled_at) WHERE status = 'pending';

-- 有効なシーケンスの全ステップについて、一般ユーザー全員の送信予定を作る（既にあれば何もしない）
CREATE OR REPLACE FUNCTION schedule_auto_broadcasts()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH ins AS (
    INSERT INTO auto_broadcast_logs (user_id, step_id, scheduled_at, status)
    SELECT u.id, s.id,
           GREATEST(u.created_at, seq.created_at) + make_interval(mins => s.delay_minutes),
           'pending'
    FROM auto_broadcast_steps s
    JOIN auto_broadcast_sequences seq ON seq.id = s.sequence_id AND seq.is_active = true
    CROSS JOIN profiles u
    WHERE u.role NOT IN ('admin', 'staff', 'owner')
    ON CONFLICT (user_id, step_id) DO NOTHING
    RETURNING 1
  )
  SELECT COUNT(*)::integer FROM ins
$$;

-- 送信時刻を過ぎた予定を最大 p_limit 件、processing にして取り出す（SKIP LOCKED で重複取得しない）
CREATE OR REPLACE FUNCTION claim_auto_broadcast_logs(p_limit integer DEFAULT 300)
RETURNS SETOF uuid
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE auto_broadcast_logs l
  SET status = 'processing'
  WHERE l.id IN (
    SELECT id FROM auto_broadcast_logs
    WHERE status = 'pending' AND scheduled_at <= now()
    ORDER BY scheduled_at
    LIMIT LEAST(GREATEST(p_limit, 1), 1000)
    FOR UPDATE SKIP LOCKED
  )
  RETURNING l.id
$$;

REVOKE ALL ON FUNCTION schedule_auto_broadcasts() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION claim_auto_broadcast_logs(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION schedule_auto_broadcasts() TO service_role;
GRANT EXECUTE ON FUNCTION claim_auto_broadcast_logs(integer) TO service_role;

-- admin_users_view の total_charged が「付与ポイント数」の合計になっていたのを「円」に修正
CREATE OR REPLACE VIEW admin_users_view AS
SELECT p.id, p.user_code, p.email, p.display_name, p.age, p.gender, p.role, p.points, p.created_at,
       CASE WHEN p.last_login_at > p.created_at THEN p.last_login_at ELSE NULL::timestamptz END AS last_login_at,
       COALESCE(pt.total_charged, 0::bigint) AS total_charged,
       pt.last_payment_at,
       p.referral_source, p.referral_article
FROM profiles p
LEFT JOIN (
  SELECT user_id, SUM(price_yen)::bigint AS total_charged, MAX(created_at) AS last_payment_at
  FROM point_transactions
  WHERE type = 'purchase' AND price_yen > 0
  GROUP BY user_id
) pt ON p.id = pt.user_id
WHERE p.role = 'user';
