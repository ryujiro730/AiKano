-- 管理画面: 会話一覧（ユーザー名/IDやキャラで絞り込み、件数・最終メッセージ付き）
CREATE OR REPLACE FUNCTION admin_conversation_list(
  p_character_id uuid DEFAULT NULL,
  p_query        text DEFAULT NULL,
  p_payers_only  boolean DEFAULT false,
  p_limit        integer DEFAULT 50,
  p_offset       integer DEFAULT 0
)
RETURNS TABLE (
  id uuid, last_message_at timestamptz,
  user_id uuid, display_name text, user_code text,
  character_id uuid, character_name text, avatar_url text,
  user_messages bigint, total_messages bigint,
  last_content text, last_sender text,
  affection_level integer, total_charged bigint
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.last_message_at,
         p.id, p.display_name, p.user_code,
         ch.id, ch.name, ch.avatar_url,
         (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.sender_role = 'user' AND m.is_deleted = false),
         (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.id AND m.is_deleted = false),
         lm.content, lm.sender_role,
         uc.affection_level,
         COALESCE((SELECT SUM(price_yen) FROM point_transactions t WHERE t.user_id = p.id AND t.type = 'purchase'), 0)
  FROM conversations c
  JOIN profiles p ON p.id = c.user_id
  LEFT JOIN characters ch ON ch.id = c.character_id
  LEFT JOIN user_characters uc ON uc.user_id = c.user_id AND uc.character_id = c.character_id
  LEFT JOIN LATERAL (
    SELECT m.content, m.sender_role FROM messages m
    WHERE m.conversation_id = c.id AND m.is_deleted = false
    ORDER BY m.created_at DESC LIMIT 1
  ) lm ON true
  WHERE c.last_message_at IS NOT NULL
    AND (p_character_id IS NULL OR c.character_id = p_character_id)
    AND (p_query IS NULL OR p_query = '' OR p.display_name ILIKE '%' || p_query || '%' OR p.user_code ILIKE '%' || p_query || '%' OR p.email ILIKE '%' || p_query || '%')
    AND (NOT p_payers_only OR EXISTS (SELECT 1 FROM point_transactions t WHERE t.user_id = p.id AND t.type = 'purchase'))
    AND EXISTS (SELECT 1 FROM messages m WHERE m.conversation_id = c.id AND m.sender_role = 'user')
  ORDER BY c.last_message_at DESC
  LIMIT LEAST(p_limit, 200) OFFSET p_offset
$$;

REVOKE ALL ON FUNCTION admin_conversation_list(uuid, text, boolean, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_conversation_list(uuid, text, boolean, integer, integer) TO service_role;
