-- ── キャラクターステータス ───────────────────────────────────────
ALTER TABLE characters
  ADD COLUMN IF NOT EXISTS stats JSONB DEFAULT '{"kindness":3,"intelligence":3,"passion":3,"mysterious":3,"cuteness":3}';

-- ── 好感度システム ────────────────────────────────────────────────
ALTER TABLE user_characters
  ADD COLUMN IF NOT EXISTS affection_points  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS affection_level   INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS message_count     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_chat_at      TIMESTAMPTZ;

-- ── 実績テーブル ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_achievements (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  character_id   UUID REFERENCES characters(id) ON DELETE CASCADE,
  unlocked_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_key, character_id)
);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own_achievements" ON user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- ── 好感度加算 RPC ────────────────────────────────────────────────
-- 呼び出すたびに affection_points を加算し、レベル計算・実績解除を行う。
-- 返却: {affection_points, affection_level, message_count, leveled_up, new_achievements[]}
CREATE OR REPLACE FUNCTION add_affection(
  p_user_id      UUID,
  p_character_id UUID,
  p_points       INTEGER DEFAULT 3
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  v_rec              RECORD;
  v_new_points       INTEGER;
  v_new_level        INTEGER;
  v_old_level        INTEGER;
  v_leveled_up       BOOLEAN := false;
  v_new_achievements TEXT[]  := ARRAY[]::TEXT[];
  v_thresholds       INTEGER[] := ARRAY[0, 50, 200, 500, 1000, 2500, 5000];
BEGIN
  INSERT INTO user_characters (
    user_id, character_id, activated_at,
    affection_points, affection_level, message_count, last_chat_at
  )
  VALUES (
    p_user_id, p_character_id, now(),
    p_points, 1, 1, now()
  )
  ON CONFLICT (user_id, character_id) DO UPDATE SET
    affection_points = user_characters.affection_points + p_points,
    message_count    = user_characters.message_count + 1,
    last_chat_at     = now()
  RETURNING affection_points, affection_level, message_count
  INTO v_rec;

  v_new_points := v_rec.affection_points;
  v_old_level  := v_rec.affection_level;

  -- レベル計算（最高7）
  v_new_level := 1;
  FOR i IN 2..7 LOOP
    IF v_new_points >= v_thresholds[i] THEN
      v_new_level := i;
    END IF;
  END LOOP;

  -- レベルアップ処理
  IF v_new_level <> v_old_level THEN
    UPDATE user_characters
      SET affection_level = v_new_level
      WHERE user_id = p_user_id AND character_id = p_character_id;
    v_leveled_up := true;

    -- レベルアップ実績
    INSERT INTO user_achievements (user_id, achievement_key, character_id)
    VALUES (p_user_id, 'level_' || v_new_level, p_character_id)
    ON CONFLICT DO NOTHING;

    v_new_achievements := v_new_achievements || ('level_' || v_new_level);
  END IF;

  -- メッセージ数マイルストーン実績
  IF v_rec.message_count IN (1, 10, 50, 100, 300) THEN
    INSERT INTO user_achievements (user_id, achievement_key, character_id)
    VALUES (p_user_id, 'messages_' || v_rec.message_count, p_character_id)
    ON CONFLICT DO NOTHING;

    v_new_achievements := v_new_achievements || ('messages_' || v_rec.message_count);
  END IF;

  RETURN jsonb_build_object(
    'affection_points',  v_new_points,
    'affection_level',   v_new_level,
    'message_count',     v_rec.message_count,
    'leveled_up',        v_leveled_up,
    'new_achievements',  to_jsonb(v_new_achievements)
  );
END;
$$;

GRANT EXECUTE ON FUNCTION add_affection(UUID, UUID, INTEGER) TO service_role;
