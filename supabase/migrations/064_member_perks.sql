-- サブスク会員特典: 毎月ボーナスpt・会員限定フォト
-- あわせて character_photos の RLS（誰でも INSERT/UPDATE/DELETE 可能だった）を管理者のみに修正

-- ── 1. 毎月ボーナスpt ─────────────────────────────────────────────
ALTER TABLE point_transactions
  DROP CONSTRAINT IF EXISTS point_transactions_type_check;
ALTER TABLE point_transactions
  ADD CONSTRAINT point_transactions_type_check
  CHECK (type IN ('purchase', 'spend', 'login_bonus', 'admin_adjust', 'registration_bonus', 'referral_bonus', 'subscription_bonus'));

-- 付与履歴（period_key ごとに1回だけ付与。webhook の再送でも二重付与しない）
CREATE TABLE IF NOT EXISTS subscription_bonus_grants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period_key  text NOT NULL,
  plan_id     text NOT NULL,
  amount      integer NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (period_key)
);
ALTER TABLE subscription_bonus_grants ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION grant_subscription_bonus(
  p_user_id    uuid,
  p_period_key text,
  p_plan_id    text,
  p_amount     integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted uuid;
BEGIN
  IF p_amount <= 0 THEN RETURN false; END IF;

  INSERT INTO subscription_bonus_grants (user_id, period_key, plan_id, amount)
  VALUES (p_user_id, p_period_key, p_plan_id, p_amount)
  ON CONFLICT (period_key) DO NOTHING
  RETURNING id INTO v_inserted;

  IF v_inserted IS NULL THEN RETURN false; END IF;  -- 付与済み

  UPDATE profiles SET points = points + p_amount WHERE id = p_user_id;
  INSERT INTO point_transactions (user_id, amount, type, description)
  VALUES (p_user_id, p_amount, 'subscription_bonus', '会員特典 毎月ボーナス');
  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION grant_subscription_bonus(uuid, text, text, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION grant_subscription_bonus(uuid, text, text, integer) TO service_role;

-- ── 2. 会員限定フォト ─────────────────────────────────────────────
ALTER TABLE character_photos ADD COLUMN IF NOT EXISTS members_only boolean NOT NULL DEFAULT false;

-- ── 3. character_photos の RLS 修正 ───────────────────────────────
-- 旧: INSERT/UPDATE/DELETE が誰でも可能、SELECT は全件公開
-- 新: 書き込みは管理者のみ、会員限定フォトはクライアントから直接読めない（サーバー経由で会員判定して返す）
DROP POLICY IF EXISTS photos_admin_insert ON character_photos;
DROP POLICY IF EXISTS photos_admin_update ON character_photos;
DROP POLICY IF EXISTS photos_admin_delete ON character_photos;
DROP POLICY IF EXISTS photos_public_read  ON character_photos;

CREATE POLICY photos_admin_insert ON character_photos FOR INSERT WITH CHECK (is_admin());
CREATE POLICY photos_admin_update ON character_photos FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY photos_admin_delete ON character_photos FOR DELETE USING (is_admin());
CREATE POLICY photos_public_read  ON character_photos FOR SELECT USING (members_only = false OR is_admin());
