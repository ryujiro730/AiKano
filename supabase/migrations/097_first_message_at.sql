-- 初めてメッセージを送った時刻（Meta に Contact を1人1回だけ送るため。matchkoi と同じ）
-- ロールバック: ALTER TABLE profiles DROP COLUMN first_message_at;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_message_at timestamptz;
-- 今いる人は送らない（過去の分を今さら送らない）
UPDATE profiles p SET first_message_at = sub.first_at
FROM (SELECT c.user_id, min(m.created_at) AS first_at FROM messages m JOIN conversations c ON c.id = m.conversation_id
      WHERE m.sender_role = 'user' GROUP BY c.user_id) sub
WHERE p.id = sub.user_id AND p.first_message_at IS NULL;
