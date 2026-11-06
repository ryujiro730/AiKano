-- 未解錠メディアのモザイク用極小画像（data URI）を行に持たせる。
-- これまでは表示のたびに /api/media/preview が Supabase の画像変換を呼んでいて、1枚あたり約1秒かかっていた。
-- 一度作ったものを保存し、写真一覧ではページに直接埋め込む（リクエストもいらなくなる）。
-- 空のものは /api/media/preview が初回に作って保存する。サイズは p=6×6 / m=6×5 / v=6×4（元 URL を推測できない粗さ）
--
-- ロールバック: ALTER TABLE character_photos DROP COLUMN preview; ALTER TABLE message_media DROP COLUMN preview; ALTER TABLE video_items DROP COLUMN preview;

ALTER TABLE character_photos ADD COLUMN IF NOT EXISTS preview text;
ALTER TABLE message_media    ADD COLUMN IF NOT EXISTS preview text;
ALTER TABLE video_items      ADD COLUMN IF NOT EXISTS preview text;
