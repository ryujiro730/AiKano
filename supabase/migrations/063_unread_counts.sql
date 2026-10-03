-- 未読数の算出を DB に一本化する。
-- メッセージ一覧（/conversations）・フッターのバッジ・ホームの未読表示が同じ定義を使う。
-- 「一覧に表示される会話」= キャラあり・直近15日以内にやり取りあり・ブロックしていない

-- サポート返信の既読管理（コードからは参照されていたが列が存在しなかった）
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS support_last_read_at timestamptz;

CREATE OR REPLACE FUNCTION get_conversation_unread(p_user_id uuid)
RETURNS TABLE (conversation_id uuid, character_id uuid, unread integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT c.id, c.character_id, COUNT(m.id)::integer
  FROM conversations c
  JOIN messages m
    ON m.conversation_id = c.id
   AND m.sender_role = 'character'
   AND m.is_read = false
   AND m.is_deleted = false
  WHERE c.user_id = p_user_id
    AND c.character_id IS NOT NULL
    AND c.last_message_at >= now() - interval '15 days'
    AND NOT EXISTS (
      SELECT 1 FROM blocks b WHERE b.user_id = p_user_id AND b.character_id = c.character_id
    )
  GROUP BY c.id, c.character_id
$$;

CREATE OR REPLACE FUNCTION get_badge_counts(p_user_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'unread', COALESCE((SELECT SUM(unread) FROM get_conversation_unread(p_user_id)), 0),
    'support', (
      SELECT COUNT(*)
      FROM inquiry_replies r
      JOIN inquiries i ON i.id = r.inquiry_id
      JOIN profiles p ON p.id = i.user_id
      WHERE i.user_id = p_user_id
        AND r.sender_role = 'staff'
        AND (p.support_last_read_at IS NULL OR r.created_at > p.support_last_read_at)
    )
  )
$$;

-- 任意の user_id を渡せるため service_role（サーバー）からのみ実行可能にする
REVOKE ALL ON FUNCTION get_conversation_unread(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION get_badge_counts(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION get_conversation_unread(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION get_badge_counts(uuid) TO service_role;
