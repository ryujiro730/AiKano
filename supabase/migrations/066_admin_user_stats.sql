-- 管理画面: ユーザー詳細の集計を DB 側で一括計算する
CREATE OR REPLACE FUNCTION admin_user_stats(p_user_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'total_charged',    COALESCE((SELECT SUM(price_yen) FROM point_transactions WHERE user_id = p_user_id AND type = 'purchase'), 0),
    'purchase_count',   (SELECT COUNT(*) FROM point_transactions WHERE user_id = p_user_id AND type = 'purchase'),
    'last_purchase_at', (SELECT MAX(created_at) FROM point_transactions WHERE user_id = p_user_id AND type = 'purchase'),
    'points_spent',     COALESCE((SELECT SUM(-amount) FROM point_transactions WHERE user_id = p_user_id AND type = 'spend'), 0),
    'messages_sent',    (SELECT COUNT(*) FROM messages m JOIN conversations c ON c.id = m.conversation_id
                          WHERE c.user_id = p_user_id AND m.sender_role = 'user' AND m.is_deleted = false),
    'last_message_at',  (SELECT MAX(m.created_at) FROM messages m JOIN conversations c ON c.id = m.conversation_id
                          WHERE c.user_id = p_user_id AND m.sender_role = 'user'),
    'banned_until',     (SELECT banned_until FROM auth.users WHERE id = p_user_id),
    'conversations', COALESCE((
      SELECT jsonb_agg(row_to_json(t) ORDER BY t.last_message_at DESC NULLS LAST)
      FROM (
        SELECT c.id, c.last_message_at, ch.id AS character_id, ch.name AS character_name, ch.avatar_url,
               (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_role = 'user' AND m.is_deleted = false) AS user_messages,
               (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.is_deleted = false) AS total_messages,
               uc.affection_level, uc.affection_points
        FROM conversations c
        LEFT JOIN characters ch ON ch.id = c.character_id
        LEFT JOIN user_characters uc ON uc.user_id = c.user_id AND uc.character_id = c.character_id
        WHERE c.user_id = p_user_id
      ) t
    ), '[]'::jsonb)
  )
$$;

REVOKE ALL ON FUNCTION admin_user_stats(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_user_stats(uuid) TO service_role;
