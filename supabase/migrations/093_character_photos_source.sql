-- フォトの出どころ。'gacha' はガチャ専用の写真（水着・下着のグラビア。2026-11-06 追加）で、チャットでキャラから送る写真には使わない
-- （lib/photo-request.ts の pickCharacterPhoto / pickSpontaneousPhoto が除く）。ガチャの中身・アルバム表示は両方を含む
--
-- ロールバック: ALTER TABLE character_photos DROP COLUMN source;

ALTER TABLE character_photos ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'album' CHECK (source IN ('album', 'gacha'));
