-- Stripeのセッション重複処理防止用カラム
ALTER TABLE point_transactions ADD COLUMN IF NOT EXISTS stripe_session_id text UNIQUE;

-- ポイントをアトミックに加算するRPC
CREATE OR REPLACE FUNCTION add_points(p_user_id uuid, p_amount int)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE profiles
  SET points = points + p_amount
  WHERE id = p_user_id;
$$;

GRANT EXECUTE ON FUNCTION add_points(uuid, int) TO service_role;
