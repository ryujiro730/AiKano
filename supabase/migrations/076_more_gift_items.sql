-- プレゼントアイテム追加（074 の後に実行）。画像は public/items/（Kenney CC0 の3Dモデルを描画 + 自作SVG）
-- 好感度 = 価格。翻訳は実行後に scripts/translate-content.ts で埋める（未翻訳の行だけ訳す）

-- 新カテゴリ（074 のカテゴリは名前で参照する）
INSERT INTO item_categories (name, sort_order)
SELECT v.name, v.sort FROM (VALUES ('ごはん', 14), ('冬の贈りもの', 15)) AS v(name, sort)
WHERE NOT EXISTS (SELECT 1 FROM item_categories c WHERE c.name = v.name);

INSERT INTO items (name, description, image_url, price_points, affection_points, sort_order, is_active, category_id)
SELECT v.name, v.description, v.image_url, v.price, v.price, v.sort, true,
       (SELECT c.id FROM item_categories c WHERE c.name = v.category ORDER BY c.sort_order DESC LIMIT 1)
FROM (VALUES
  -- スイーツ
  ('ロリポップ',         'くるくる模様の、かわいいキャンディ。',           '/items/lollypop.webp',         10,   110, 'スイーツ'),
  ('クッキー',           'サクサクのチョコクッキーを、はんぶんこ。',       '/items/cookie-chocolate.webp', 15,   111, 'スイーツ'),
  ('さくらんぼ',         'ふたつ並んだ、なかよしのさくらんぼ。',           '/items/cherries.webp',         15,   112, 'スイーツ'),
  ('アイスキャンディー', '暑い日にうれしい、ひんやりおやつ。',             '/items/popsicle.webp',         15,   113, 'スイーツ'),
  ('クロワッサン',       '焼きたての香りと一緒に、おはようを。',           '/items/croissant.webp',        20,   114, 'スイーツ'),
  ('チョコドーナツ',     'チョコがけの、ちょっと大人なドーナツ。',         '/items/donut-chocolate.webp',  25,   115, 'スイーツ'),
  ('プリン',             'カラメルたっぷり、とろける定番スイーツ。',       '/items/pudding.webp',          30,   116, 'スイーツ'),
  ('ぶどう',             'ひと粒ずつ食べさせてあげたくなる。',             '/items/grapes.webp',           30,   117, 'スイーツ'),
  ('ワッフル',           'こんがり焼けた、休日の朝ごはん。',               '/items/waffle.webp',           40,   118, 'スイーツ'),
  ('パンケーキ',         'バターがとろける、ふわふわの3段重ね。',          '/items/pancakes.webp',         50,   119, 'スイーツ'),
  ('すいか',             '夏といえばこれ。一緒にかぶりつこう。',           '/items/watermelon.webp',       60,   120, 'スイーツ'),
  ('アップルパイ',       '手作りみたいな、あったかいパイ。',               '/items/pie.webp',              70,   121, 'スイーツ'),
  ('ホールケーキ',       'いちごがのった、まるごとのごほうびケーキ。',     '/items/cake.webp',             150,  122, 'スイーツ'),
  -- ドリンク
  ('コーヒー',           'ひと息つきたいときの、いれたての一杯。',         '/items/cup-coffee.webp',       20,   210, 'ドリンク'),
  ('紅茶',               'ゆっくり話したい夜の、あたたかい紅茶。',         '/items/cup-tea.webp',          20,   211, 'ドリンク'),
  ('ソーダ',             'しゅわっと弾ける、元気の出る一杯。',             '/items/soda-glass.webp',       30,   212, 'ドリンク'),
  ('白ワイン',           'すっきり爽やか、乾杯したい夜に。',               '/items/wine-white.webp',       120,  213, 'ドリンク'),
  -- ごはん
  ('おにぎり',           '心をこめてにぎった、手作りの味。',               '/items/rice-ball.webp',        15,   500, 'ごはん'),
  ('フライドポテト',     'ついつい手がのびる、揚げたてポテト。',           '/items/fries.webp',            20,   501, 'ごはん'),
  ('ホットドッグ',       'デートの屋台で食べたい、定番の味。',             '/items/hot-dog.webp',          30,   502, 'ごはん'),
  ('タコス',             'ちょっと冒険したい日の、スパイシーなひと品。',   '/items/taco.webp',             40,   503, 'ごはん'),
  ('ハンバーガー',       'ボリューム満点、がっつり食べたい日に。',         '/items/burger.webp',           50,   504, 'ごはん'),
  ('サーモン寿司',       'とろけるサーモンの、ちょっと贅沢なお寿司。',     '/items/sushi-salmon.webp',     60,   505, 'ごはん'),
  ('ピザ',               'ふたりでシェアしたい、焼きたてピザ。',           '/items/pizza.webp',            80,   506, 'ごはん'),
  -- ギフト
  ('ラブレター',         '言葉にできない気持ちを、手紙にこめて。',         '/items/love-letter.webp',      50,   310, 'ギフト'),
  ('ハートの風船',       'ふわっと浮かぶ、大きなハート。',                 '/items/heart-balloon.webp',    80,   311, 'ギフト'),
  ('一輪のバラ',         'たった一輪に、ありったけの想いを。',             '/items/rose.webp',             100,  312, 'ギフト'),
  ('ひまわり',           '元気な笑顔みたいな、まっすぐな花。',             '/items/sunflower.webp',        100,  313, 'ギフト'),
  ('まるいプレゼント',   'リボンをほどくのが楽しみな、まんまるの箱。',     '/items/present-b-round.webp',  120,  314, 'ギフト'),
  ('ヘッドホン',         '同じ音楽を聴いていたくなる、ピンクのヘッドホン。', '/items/headphones.webp',     500,  315, 'ギフト'),
  ('ハンドバッグ',       'お出かけが楽しくなる、かわいいバッグ。',         '/items/handbag.webp',          800,  316, 'ギフト'),
  -- アクセサリー
  ('ヘアリボン',         '髪に結べば、今日はちょっと特別な日。',           '/items/hair-ribbon.webp',      150,  410, 'アクセサリー'),
  ('リップ',             'あなた好みの色を、そっと選んで。',               '/items/lipstick.webp',         300,  411, 'アクセサリー'),
  ('ブレスレット',       'ハートのチャームが揺れる、細いブレスレット。',   '/items/bracelet.webp',         700,  412, 'アクセサリー'),
  ('イヤリング',         '揺れるたびにきらめく、しずく型のイヤリング。',   '/items/earrings.webp',         800,  413, 'アクセサリー'),
  ('腕時計',             'これからの時間を、一緒に刻んでいこう。',         '/items/watch.webp',            1500, 414, 'アクセサリー'),
  ('ティアラ',           'きみは、ぼくだけのお姫さま。',                   '/items/tiara.webp',            2000, 415, 'アクセサリー'),
  -- 冬の贈りもの
  ('キャンディケーン',   'しましま模様の、冬のキャンディ。',               '/items/candy-cane-red.webp',   20,   600, '冬の贈りもの'),
  ('ジンジャーマン',     'にっこり笑った、しょうがのクッキー。',           '/items/gingerbread-man.webp',  30,   601, '冬の贈りもの'),
  ('雪だるま',           '寒い日も、心はぽかぽか。',                       '/items/snowman.webp',          80,   602, '冬の贈りもの'),
  ('クリスマスブーツ',   'お菓子をつめこんだ、赤いブーツ。',               '/items/sock-red-cane.webp',    100,  603, '冬の贈りもの'),
  ('リース',             'ドアに飾りたい、にぎやかなリース。',             '/items/wreath-decorated.webp', 150,  604, '冬の贈りもの'),
  ('くるみ割り人形',     'おとぎ話から出てきた、小さな兵隊さん。',         '/items/nutcracker.webp',       300,  605, '冬の贈りもの'),
  ('トナカイ',           '赤い鼻がチャームポイントの、冬の相棒。',         '/items/reindeer.webp',         400,  606, '冬の贈りもの'),
  ('クリスマスツリー',   'ふたりで飾りつけたい、きらきらのツリー。',       '/items/tree-decorated.webp',   600,  607, '冬の贈りもの')
) AS v(name, description, image_url, price, sort, category)
WHERE NOT EXISTS (SELECT 1 FROM items i WHERE i.image_url = v.image_url);
