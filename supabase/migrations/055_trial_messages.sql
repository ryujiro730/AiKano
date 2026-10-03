-- 毎日無料分を廃止し、登録ボーナスポイントのみで4通分の試用とする
-- daily free limit: 2 → 0

CREATE OR REPLACE FUNCTION use_daily_free_message(
  p_user_id      UUID,
  p_character_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_today DATE;
  v_used  INTEGER;
  v_limit CONSTANT INTEGER := 0;
BEGIN
  v_today := (now() AT TIME ZONE 'Asia/Tokyo')::DATE;

  INSERT INTO daily_message_usage (user_id, character_id, usage_date, free_used)
  VALUES (p_user_id, p_character_id, v_today, 0)
  ON CONFLICT (user_id, character_id, usage_date) DO NOTHING;

  UPDATE daily_message_usage
  SET free_used = free_used + 1
  WHERE user_id      = p_user_id
    AND character_id = p_character_id
    AND usage_date   = v_today
    AND free_used    < v_limit
  RETURNING free_used INTO v_used;

  IF v_used IS NULL THEN
    SELECT free_used INTO v_used
    FROM daily_message_usage
    WHERE user_id = p_user_id AND character_id = p_character_id AND usage_date = v_today;
    RETURN jsonb_build_object('ok', false, 'used', v_used, 'limit', v_limit);
  END IF;

  RETURN jsonb_build_object('ok', true, 'used', v_used, 'limit', v_limit);
END;
$$;

CREATE OR REPLACE FUNCTION get_daily_free_usage(
  p_user_id      UUID,
  p_character_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_today DATE;
  v_used  INTEGER;
  v_limit CONSTANT INTEGER := 0;
BEGIN
  v_today := (now() AT TIME ZONE 'Asia/Tokyo')::DATE;
  SELECT free_used INTO v_used
  FROM daily_message_usage
  WHERE user_id = p_user_id AND character_id = p_character_id AND usage_date = v_today;

  RETURN jsonb_build_object('used', COALESCE(v_used, 0), 'limit', v_limit);
END;
$$;
