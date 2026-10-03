-- conversations(user_id) 複合インデックス（ホーム画面クエリ高速化）
CREATE INDEX IF NOT EXISTS idx_conversations_user_id
  ON conversations (user_id, last_message_at DESC);

-- user_characters の (user_id, character_id) インデックス
CREATE INDEX IF NOT EXISTS idx_user_characters_user_char
  ON user_characters (user_id, character_id);

-- 未読キャラID一括取得 RPC
-- 「最新メッセージがキャラ送信かつ未読」な会話のキャラIDをまとめて返す
-- 従来: messages 2クエリ直列 → これ1本に置換
CREATE OR REPLACE FUNCTION get_unread_char_ids(p_user_id uuid)
RETURNS uuid[]
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(ARRAY_AGG(DISTINCT c.character_id), '{}')
  FROM conversations c
  CROSS JOIN LATERAL (
    SELECT sender_role, is_read
    FROM messages m
    WHERE m.conversation_id = c.id
    ORDER BY m.created_at DESC
    LIMIT 1
  ) latest
  WHERE c.user_id = p_user_id
    AND latest.sender_role = 'character'
    AND latest.is_read = false
$$;

GRANT EXECUTE ON FUNCTION get_unread_char_ids(uuid) TO service_role, authenticated, anon;
