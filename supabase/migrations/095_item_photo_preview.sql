-- プレゼントのお礼写真のぼかしプレビュー（data URI。24×36 の極小画像を画面でぼかして見せる）。
-- プレゼント画面で「贈るとこんな写真が届く」と実物をちら見せするのに使う。元 URL はクライアントに渡さない
--
-- ロールバック: ALTER TABLE character_item_photos DROP COLUMN preview;
ALTER TABLE character_item_photos ADD COLUMN IF NOT EXISTS preview text;
