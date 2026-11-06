-- Meta CAPI のマッチング用ブラウザ情報（fbp / fbc / IP / UA）。matchkoi から。
-- 課金は Stripe の webhook から送るのでブラウザ情報が取れない。登録・決済開始（本人のリクエスト中）に保存しておき、送るときに読む
--
-- ロールバック: DROP TABLE meta_attribution;
CREATE TABLE IF NOT EXISTS meta_attribution (
  user_id    uuid PRIMARY KEY,
  fbp        text,
  fbc        text,
  client_ip  text,
  client_ua  text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE meta_attribution ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON meta_attribution FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON meta_attribution TO service_role;
