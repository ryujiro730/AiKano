-- プロフィールのアルバムで、課金なしで誰でも見られる写真（各キャラ10枚ほど）。
-- is_free の写真は最初から見られる（モザイクにしない）。ガチャの中身・チャットでキャラが自分から送る写真（未所持のもの）には入れない
--
-- ロールバック: ALTER TABLE character_photos DROP COLUMN is_free;
ALTER TABLE character_photos ADD COLUMN IF NOT EXISTS is_free boolean NOT NULL DEFAULT false;
