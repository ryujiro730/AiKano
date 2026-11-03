-- 管理者のポイント手動調整を1つの関数で行う（残高の更新と取引の記録を同時に）
-- 以前は「残高を読む → 計算して update」だったので、その間にユーザーが送信してポイントを使うと上書きで消えていた。
-- 減算でマイナスにはしない（0 で止める）。記録する amount は実際に増減した量。
-- ロールバック: DROP FUNCTION admin_adjust_points(uuid, int, text);

CREATE OR REPLACE FUNCTION admin_adjust_points(p_user_id uuid, p_amount int, p_description text)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_before int;
  v_after int;
BEGIN
  SELECT points INTO v_before FROM profiles WHERE id = p_user_id FOR UPDATE;
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  v_after := GREATEST(0, v_before + p_amount);
  UPDATE profiles SET points = v_after WHERE id = p_user_id;
  INSERT INTO point_transactions (user_id, amount, type, description, price_yen)
  VALUES (p_user_id, v_after - v_before, 'admin_adjust', p_description, NULL);
  RETURN v_after;
END;
$$;

REVOKE EXECUTE ON FUNCTION admin_adjust_points(uuid, int, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_adjust_points(uuid, int, text) TO service_role;
