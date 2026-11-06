-- コンビニ払いなど「あとで払う」決済の払い待ち。
-- Checkout を終えた時点（払込番号の発行）で webhook が入れ、入金で paid、期限切れで expired にする。
-- 決済ページに「お支払い待ち（払込票を開く）」を出すのに使う（画面を閉じると払込番号が分からなくなっていた）
--
-- ロールバック: DROP TABLE pending_payments;

CREATE TABLE IF NOT EXISTS pending_payments (
  session_id  text PRIMARY KEY,               -- Stripe Checkout のセッションID
  user_id     uuid NOT NULL,
  kind        text NOT NULL CHECK (kind IN ('points', 'pass')),
  amount_yen  int NOT NULL,
  points      int,                            -- ポイント購入のとき付与予定のpt
  plan_id     text,                           -- パスのとき
  method      text,                           -- konbini など
  voucher_url text,                           -- 払込票（Stripe のページ）
  expires_at  timestamptz,                    -- 支払い期限
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS pending_payments_user_idx ON pending_payments (user_id, status);

ALTER TABLE pending_payments ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON pending_payments FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON pending_payments TO service_role;
