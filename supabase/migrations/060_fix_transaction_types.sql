-- 登録ボーナス・紹介ボーナスを 'purchase' から専用 type に変更
-- 'purchase' = 実際に課金した取引のみに絞る

-- 1. type チェック制約を拡張
ALTER TABLE point_transactions
  DROP CONSTRAINT IF EXISTS point_transactions_type_check;

ALTER TABLE point_transactions
  ADD CONSTRAINT point_transactions_type_check
  CHECK (type IN ('purchase', 'spend', 'login_bonus', 'admin_adjust', 'registration_bonus', 'referral_bonus'));

-- 2. 既存の誤分類レコードを修正
UPDATE point_transactions
  SET type = 'registration_bonus'
  WHERE type = 'purchase'
    AND description IN ('新規登録ボーナス', '登録ボーナス')
    AND price_yen IS NULL;

UPDATE point_transactions
  SET type = 'referral_bonus'
  WHERE type = 'purchase'
    AND description IN ('友達紹介ボーナス', '紹介登録ボーナス')
    AND price_yen IS NULL;
