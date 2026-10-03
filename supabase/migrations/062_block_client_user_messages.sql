-- ユーザーメッセージ（sender_role = 'user'）はサーバー API（/api/chat/send-message 等、service role）
-- 経由でのみ作成可能にする。ブラウザから直接 INSERT してポイント消費をすり抜け、
-- ai-reply で無料返信を得る抜け道を塞ぐ。
-- スタッフ画面のクライアント INSERT（sender_role = 'character'）は影響を受けない。

CREATE OR REPLACE FUNCTION block_client_user_messages()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.sender_role = 'user' AND COALESCE(auth.role(), '') IN ('authenticated', 'anon') THEN
    RAISE EXCEPTION 'user messages must be sent via /api/chat/send-message'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_block_client_user_messages ON messages;
CREATE TRIGGER trg_block_client_user_messages
  BEFORE INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION block_client_user_messages();
