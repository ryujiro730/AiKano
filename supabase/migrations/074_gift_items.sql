-- プレゼント機能: アイテムをキャラに贈ると好感度が上がる
-- items.affection_points: 贈ったときに上がる好感度（会員は好感度倍率を掛ける）
-- items.i18n / item_categories.i18n: 言語別の名前・説明（scripts/translate-content.ts が生成）
-- 既存のアダルト系アイテムは 2026-10-05 に is_active=false にしてある（削除はしていない）

ALTER TABLE items ADD COLUMN IF NOT EXISTS affection_points integer NOT NULL DEFAULT 0;
ALTER TABLE items ADD COLUMN IF NOT EXISTS i18n jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE item_categories ADD COLUMN IF NOT EXISTS i18n jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE video_items ADD COLUMN IF NOT EXISTS i18n jsonb NOT NULL DEFAULT '{}'::jsonb;

WITH cats AS (
  INSERT INTO item_categories (name, sort_order) VALUES
    ('スイーツ', 10), ('ドリンク', 11), ('ギフト', 12), ('アクセサリー', 13)
  RETURNING id, name
)
INSERT INTO items (name, description, image_url, price_points, affection_points, sort_order, is_active, category_id)
SELECT v.name, v.description, v.image_url, v.price, v.price, v.sort, true, cats.id
FROM (VALUES
  ('いちご',           '甘酸っぱい、ちょっとしたおすそわけ。',           '/items/strawberry.webp',    10,   100, 'スイーツ'),
  ('チョコレート',     '疲れた日にうれしい、ひとかけらのごほうび。',     '/items/chocolate.webp',     20,   101, 'スイーツ'),
  ('ドーナツ',         'カラフルなトッピングで気分も明るく。',           '/items/donut.webp',         20,   102, 'スイーツ'),
  ('アイスクリーム',   'ひんやり甘い、ふたりのおやつタイム。',           '/items/ice-cream.webp',     30,   103, 'スイーツ'),
  ('カップケーキ',     'さくらんぼをのせた、小さなお祝い。',             '/items/cupcake.webp',       40,   104, 'スイーツ'),
  ('パフェ',           'いろんな味をいっしょに楽しめる特別なデザート。', '/items/sundae.webp',        60,   105, 'スイーツ'),
  ('バースデーケーキ', '記念日に贈りたい、ろうそくつきのケーキ。',       '/items/cake-birthday.webp', 200,  106, 'スイーツ'),
  ('フラペチーノ',     'クリームたっぷり、カフェ気分の一杯。',           '/items/frappe.webp',        40,   200, 'ドリンク'),
  ('カクテル',         'ふたりで乾杯したい、おしゃれな一杯。',           '/items/cocktail.webp',      80,   201, 'ドリンク'),
  ('赤ワイン',         '大人の夜にぴったりの、とっておきの一本。',       '/items/wine-red.webp',      120,  202, 'ドリンク'),
  ('プレゼント箱',     '中身はひみつ。開けるときのワクワクも贈りもの。', '/items/present.webp',       150,  300, 'ギフト'),
  ('バラの花束',       '気持ちをまっすぐ伝える、真っ赤なバラ。',         '/items/bouquet.webp',       300,  301, 'ギフト'),
  ('くまのぬいぐるみ', 'ぎゅっと抱きしめたくなる、ふわふわの相棒。',     '/items/teddy.webp',         400,  302, 'ギフト'),
  ('香水',             'あなたを思い出す、やさしい香り。',               '/items/perfume.webp',       600,  400, 'アクセサリー'),
  ('ネックレス',       'ハートのペンダントがきらめく、特別なプレゼント。', '/items/necklace.webp',    1000, 401, 'アクセサリー'),
  ('ダイヤの指輪',     'いちばん大切な人に贈る、永遠の約束。',           '/items/ring.webp',          3000, 402, 'アクセサリー')
) AS v(name, description, image_url, price, sort, category)
JOIN cats ON cats.name = v.category;
