-- ── 日次無料メッセージ ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS daily_message_usage (
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  usage_date   DATE NOT NULL DEFAULT (now() AT TIME ZONE 'Asia/Tokyo')::DATE,
  free_used    INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, character_id, usage_date)
);

ALTER TABLE daily_message_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own_daily_usage" ON daily_message_usage
  FOR SELECT USING (auth.uid() = user_id);

-- 無料メッセージ atomic 使用 RPC
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
  v_limit CONSTANT INTEGER := 2;
BEGIN
  v_today := (now() AT TIME ZONE 'Asia/Tokyo')::DATE;

  -- 行がなければ初期化
  INSERT INTO daily_message_usage (user_id, character_id, usage_date, free_used)
  VALUES (p_user_id, p_character_id, v_today, 0)
  ON CONFLICT (user_id, character_id, usage_date) DO NOTHING;

  -- 上限未満のときだけインクリメント
  UPDATE daily_message_usage
  SET free_used = free_used + 1
  WHERE user_id      = p_user_id
    AND character_id = p_character_id
    AND usage_date   = v_today
    AND free_used    < v_limit
  RETURNING free_used INTO v_used;

  IF v_used IS NULL THEN
    -- 上限に達していた → 現在値を取得して ok: false
    SELECT free_used INTO v_used
    FROM daily_message_usage
    WHERE user_id = p_user_id AND character_id = p_character_id AND usage_date = v_today;
    RETURN jsonb_build_object('ok', false, 'used', v_used, 'limit', v_limit);
  END IF;

  RETURN jsonb_build_object('ok', true, 'used', v_used, 'limit', v_limit);
END;
$$;

GRANT EXECUTE ON FUNCTION use_daily_free_message(UUID, UUID) TO service_role;

-- 今日の使用状況を確認するだけのRPC（デクリメントしない）
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
  v_limit CONSTANT INTEGER := 2;
BEGIN
  v_today := (now() AT TIME ZONE 'Asia/Tokyo')::DATE;
  SELECT free_used INTO v_used
  FROM daily_message_usage
  WHERE user_id = p_user_id AND character_id = p_character_id AND usage_date = v_today;

  RETURN jsonb_build_object('used', COALESCE(v_used, 0), 'limit', v_limit);
END;
$$;

GRANT EXECUTE ON FUNCTION get_daily_free_usage(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION get_daily_free_usage(UUID, UUID) TO authenticated;

-- ── キャラ解放システム ────────────────────────────────────────────────
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS requires_unlock BOOLEAN NOT NULL DEFAULT false;

-- プロモーション申請テーブル
CREATE TABLE IF NOT EXISTS promo_submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  character_id   UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  post_url       TEXT NOT NULL,
  screenshot_url TEXT,
  status         TEXT NOT NULL DEFAULT 'pending', -- pending/approved/rejected
  reviewed_by    UUID REFERENCES profiles(id),
  reviewed_at    TIMESTAMPTZ,
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_promo_submissions_user   ON promo_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_submissions_status ON promo_submissions(status);

ALTER TABLE promo_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own_promo_submissions" ON promo_submissions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own_promo_submissions" ON promo_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- キャラ解放記録テーブル
CREATE TABLE IF NOT EXISTS character_unlocks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  unlocked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  unlock_type  TEXT NOT NULL DEFAULT 'promo', -- promo/admin/bonus
  UNIQUE(user_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_character_unlocks_user ON character_unlocks(user_id);

ALTER TABLE character_unlocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own_unlocks" ON character_unlocks
  FOR SELECT USING (auth.uid() = user_id);
