-- サブスクリプション関連カラム
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_plan text CHECK (subscription_plan IN ('standard', 'premium')),
  ADD COLUMN IF NOT EXISTS subscription_status text CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete')),
  ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz,
  ADD COLUMN IF NOT EXISTS monthly_messages_used integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_messages_limit integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_reset_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles (stripe_customer_id);

-- 月次メッセージリセット + 使用量インクリメントを atomic に行う RPC
CREATE OR REPLACE FUNCTION use_subscription_message(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile record;
  v_now timestamptz := now();
  v_needs_reset boolean;
  v_under_limit boolean;
BEGIN
  SELECT subscription_plan, subscription_status, monthly_messages_used,
         monthly_messages_limit, monthly_reset_at, points, bonus_points, bonus_points_expires_at
  INTO v_profile
  FROM profiles
  WHERE id = p_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'user_not_found');
  END IF;

  -- アクティブなサブスクがなければポイント消費パスへ
  IF v_profile.subscription_status IS DISTINCT FROM 'active' AND v_profile.subscription_status IS DISTINCT FROM 'trialing' THEN
    RETURN jsonb_build_object('ok', false, 'reason', 'no_subscription');
  END IF;

  -- 月次リセット判定
  v_needs_reset := v_profile.monthly_reset_at IS NOT NULL AND v_profile.monthly_reset_at < v_now;

  IF v_needs_reset THEN
    UPDATE profiles
    SET monthly_messages_used = 1,
        monthly_reset_at = monthly_reset_at + interval '1 month'
    WHERE id = p_user_id;
    RETURN jsonb_build_object('ok', true, 'used', 1, 'limit', v_profile.monthly_messages_limit, 'model', v_profile.subscription_plan);
  END IF;

  v_under_limit := v_profile.monthly_messages_used < v_profile.monthly_messages_limit;

  IF v_under_limit THEN
    UPDATE profiles
    SET monthly_messages_used = monthly_messages_used + 1
    WHERE id = p_user_id;
    RETURN jsonb_build_object(
      'ok', true,
      'used', v_profile.monthly_messages_used + 1,
      'limit', v_profile.monthly_messages_limit,
      'model', v_profile.subscription_plan
    );
  ELSE
    -- 超過 → ポイント消費パスへ
    RETURN jsonb_build_object('ok', false, 'reason', 'over_limit', 'model', v_profile.subscription_plan);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION use_subscription_message(uuid) TO service_role;
