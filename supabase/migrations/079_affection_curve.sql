-- 好感度レベルの後半を遠くする（Lv4 以降のしきい値を引き上げ）
-- 旧: 0 / 50 / 200 / 500 / 1000 / 2500 / 5000
-- 新: 0 / 50 / 200 / 600 / 1500 / 6000 / 25000（src/lib/affection.ts と同じ値）
-- すでに上のレベルにいるユーザーは下げない（GREATEST）

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
  v_thresholds       INTEGER[] := ARRAY[0, 50, 200, 600, 1500, 6000, 25000];
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
  -- しきい値を上げてもレベルは下げない
  v_new_level := GREATEST(v_new_level, v_old_level);

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
