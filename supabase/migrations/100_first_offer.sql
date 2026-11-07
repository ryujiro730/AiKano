-- 初回限定パック（480円で100pt）を出せる期限。初めてオファーを見せた時点から24時間（本当に切れる）。
-- 課金したことがない人だけが対象（判定は lib/first-offer.ts）
-- ロールバック: ALTER TABLE profiles DROP COLUMN first_offer_expires_at;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_offer_expires_at timestamptz;
