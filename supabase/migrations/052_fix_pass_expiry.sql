-- コンビニ/銀行振込パスの期限切れチェックを追加
-- subscription_period_end を過ぎたら no_subscription 扱いにする

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
  SELECT subscription_plan, subscription_status, subscription_period_end,
         monthly_messages_used, monthly_messages_limit, monthly_reset_at,
         points, bonus_points, bonus_points_expires_at
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

  -- 有効期限切れチェック（コンビニ/銀行振込パス等）
  -- クレカ定期はStripe webhookで status が変わるので period_end は常に未来だが、
  -- 一回払いパスは status='active' のまま期限だけ過ぎる
  IF v_profile.subscription_period_end IS NOT NULL AND v_profile.subscription_period_end < v_now THEN
    -- 期限切れなので status を expired に更新してから返す
    UPDATE profiles
    SET subscription_status = 'canceled'
    WHERE id = p_user_id;
    RETURN jsonb_build_object('ok', false, 'reason', 'subscription_expired');
  END IF;

  -- 月次リセット判定
  v_needs_reset := v_profile.monthly_reset_at IS NOT NULL AND v_profile.monthly_reset_at < v_now;

  IF v_needs_reset THEN
    -- リセット後も期限内か確認（subscription_period_end は変えない）
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
    RETURN jsonb_build_object('ok', false, 'reason', 'over_limit', 'model', v_profile.subscription_plan);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION use_subscription_message(uuid) TO service_role;
