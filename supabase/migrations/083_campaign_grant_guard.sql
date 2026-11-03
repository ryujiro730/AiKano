-- キャンペーン倍率の付与を取引に紐づけ、「一人一回限り」を DB 制約で保証する（matchkoi 207・220 から）
--
-- 以前は一人一回限りを「開始日時以降に何か買っていれば対象外」とアプリ側で判定していて、
-- 決済が短時間に続くとすり抜けて倍率が2回付きうる。サブスクの支払いがあるだけで初回購入ボーナスから外れることもあった。
-- point_transactions に campaign_id（どのキャンペーンの倍率で買ったか）と once_campaign_id（一人一回限りのときだけ入れる）を持たせ、
-- (user_id, once_campaign_id) にユニーク制約を張る。2回目の挿入は 23505 で失敗するので、Webhook は倍率なしで入れ直す。
--
-- ロールバック: DROP INDEX uq_point_transactions_once_campaign; ALTER TABLE point_transactions DROP COLUMN campaign_id, DROP COLUMN once_campaign_id;
--              ALTER TABLE campaigns DROP COLUMN target_gender;

ALTER TABLE point_transactions
  ADD COLUMN IF NOT EXISTS campaign_id      UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS once_campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_point_transactions_once_campaign
  ON point_transactions(user_id, once_campaign_id) WHERE once_campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_point_transactions_campaign ON point_transactions(campaign_id) WHERE campaign_id IS NOT NULL;

-- 対象性別。NULL = 全員、'male' / 'female' = その性別のユーザーだけにバナー・倍率・告知メールを出す
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS target_gender text CHECK (target_gender IN ('male', 'female'));

-- 一人一回限りが「そのキャンペーンの倍率で買ったか」に変わるので、条件のない初回購入ボーナスに「購入0回」の条件を付ける
-- （付けないと「誰でも1回は倍率」になる）
INSERT INTO campaign_conditions (campaign_id, condition_type, operator, value)
SELECT c.id, 'purchase_count', 'lt', '1'
FROM campaigns c
WHERE c.name = '初回購入ボーナス'
  AND NOT EXISTS (SELECT 1 FROM campaign_conditions cc WHERE cc.campaign_id = c.id AND cc.condition_type = 'purchase_count');
