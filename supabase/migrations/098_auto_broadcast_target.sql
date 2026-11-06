-- 自動同報を「誰に送るか」で分ける。これまでは登録した全員に全シーケンスを送っていて、キャラを増やすと登録直後にメッセージが殺到した
--   target = 'all'         … 全員（これまでどおり）
--            'partner'     … 登録時にそのキャラを選んだ人だけ（profiles.partner_character_id）
--            'non_partner' … 選ばなかった人だけ（ほかのキャラからのあいさつ用）
-- partner_character_id は登録の最後（onboarding 完了）で入るので、'partner' の1通目は登録から10分以上あけること
--
-- ロールバック: 086 の schedule_auto_broadcasts() を流し直し、ALTER TABLE auto_broadcast_sequences DROP COLUMN target;

ALTER TABLE auto_broadcast_sequences
  ADD COLUMN IF NOT EXISTS target text NOT NULL DEFAULT 'all' CHECK (target IN ('all', 'partner', 'non_partner'));

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
      AND (seq.target = 'all'
        OR (seq.target = 'partner' AND u.partner_character_id = seq.character_id)
        OR (seq.target = 'non_partner' AND u.partner_character_id IS DISTINCT FROM seq.character_id))
      -- ブロックしたキャラからは送らない
      AND NOT EXISTS (SELECT 1 FROM blocks b WHERE b.user_id = u.id AND b.character_id = seq.character_id)
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
