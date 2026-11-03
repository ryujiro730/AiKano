-- 自動同報の予約に安全策を入れる（matchkoi の lib/auto-broadcast.ts と同じルール）
-- 070 は profiles 全員 × 全ステップを総当たりし、送信時刻を GREATEST(登録日時, シーケンス作成日時) + 遅延にしていたため、
-- シーケンスを新しく作る（または止めていたものを再開する）と、既存ユーザー全員に一斉に送られていた。
--   - シーケンス作成より後に登録した人だけ
--   - 送信予定が30分以上前に過ぎたステップは予約しない（cron が止まっていた分をまとめて送らない）
--   - そのシーケンスの1通目を逃した人には、続きのステップも予約しない
--   - BAN 中の人は予約しない
-- ロールバック: 070 の schedule_auto_broadcasts() を流し直す

CREATE OR REPLACE FUNCTION schedule_auto_broadcasts()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  WITH first_step AS (
    SELECT DISTINCT ON (sequence_id) sequence_id, id, delay_minutes
    FROM auto_broadcast_steps
    ORDER BY sequence_id, step_number, delay_minutes
  ),
  ins AS (
    INSERT INTO auto_broadcast_logs (user_id, step_id, scheduled_at, status)
    SELECT u.id, s.id, u.created_at + make_interval(mins => s.delay_minutes), 'pending'
    FROM auto_broadcast_steps s
    JOIN auto_broadcast_sequences seq ON seq.id = s.sequence_id AND seq.is_active = true
    JOIN first_step f ON f.sequence_id = s.sequence_id
    JOIN profiles u ON u.created_at >= seq.created_at
    JOIN auth.users au ON au.id = u.id
    WHERE u.role NOT IN ('admin', 'staff', 'owner')
      AND (au.banned_until IS NULL OR au.banned_until < now())
      AND u.created_at + make_interval(mins => s.delay_minutes) >= now() - interval '30 minutes'
      -- 1通目を逃した（予約されないまま30分以上過ぎた）人には続きも送らない
      AND (
        u.created_at + make_interval(mins => f.delay_minutes) >= now() - interval '30 minutes'
        OR EXISTS (SELECT 1 FROM auto_broadcast_logs l WHERE l.user_id = u.id AND l.step_id = f.id)
      )
    ON CONFLICT (user_id, step_id) DO NOTHING
    RETURNING 1
  )
  SELECT COUNT(*)::integer FROM ins
$$;

REVOKE ALL ON FUNCTION schedule_auto_broadcasts() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION schedule_auto_broadcasts() TO service_role;
