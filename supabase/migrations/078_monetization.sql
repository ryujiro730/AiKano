-- 課金導線まとめ（077 の後に実行）
-- 1) キャンペーン文言の多言語化（campaigns.i18n。管理画面で保存すると自動翻訳）
-- 2) 初回購入ボーナス（初めての購入だけ、全パックでポイント2倍・1万円以上のパックは3倍）
--    campaigns.rate_tiers: 高額パックの段階倍率 [{"min_yen": 10000, "rate": 3}]
-- 3) 好感度レベル限定フォト（character_photos.required_level。そのレベルに達したら無料で見られる）

ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS i18n jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.campaigns ADD COLUMN IF NOT EXISTS rate_tiers jsonb NOT NULL DEFAULT '[]'::jsonb;

INSERT INTO public.campaigns (name, catchphrase, description, cta_text, display_frequency, is_active, bonus_rate, rate_tiers, one_time_per_user, i18n)
SELECT '初回購入ボーナス',
       'はじめての購入はポイント最大3倍！',
       '初回だけ、どのパックもポイント2倍。1万円以上のパックなら3倍になります',
       'ポイントを購入する',
       'once', true, 2.0, '[{"min_yen": 10000, "rate": 3}]'::jsonb, true,
       '{
         "en": {"catchphrase": "Up to 3x points on your first purchase!", "description": "Your first purchase gets 2x points on any pack, and 3x on packs of ¥10,000 or more", "cta_text": "Buy points"},
         "es": {"catchphrase": "¡Hasta el triple de puntos en tu primera compra!", "description": "En tu primera compra, cualquier paquete da el doble de puntos, y los de ¥10.000 o más, el triple", "cta_text": "Comprar puntos"},
         "pt": {"catchphrase": "Até o triplo de pontos na primeira compra!", "description": "Na primeira compra, qualquer pacote dá o dobro de pontos, e os de ¥10.000 ou mais dão o triplo", "cta_text": "Comprar pontos"},
         "de": {"catchphrase": "Bis zu 3× Punkte beim ersten Kauf!", "description": "Beim ersten Kauf gibt es auf jedes Paket doppelte Punkte, ab ¥10.000 sogar dreifache", "cta_text": "Punkte kaufen"},
         "fr": {"catchphrase": "Jusqu''à 3x plus de points sur ton premier achat !", "description": "Pour ton premier achat, chaque pack donne 2x plus de points, et 3x à partir de 10 000 ¥", "cta_text": "Acheter des points"}
       }'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.campaigns WHERE name = '初回購入ボーナス');

ALTER TABLE public.character_photos ADD COLUMN IF NOT EXISTS required_level integer;
