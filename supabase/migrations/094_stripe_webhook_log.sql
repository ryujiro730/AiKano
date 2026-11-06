-- Stripe webhook で受け取った通知と、アプリがどう処理したか（誰に結びついたか・何をしたか）。
-- 本番のログを見なくても「届いたのに反映されない」を追えるようにする（2026-11-06 署名の鍵の差し替え漏れで本番の通知が1か月落ちていた）
--
-- ロールバック: DROP TABLE stripe_webhook_log;

CREATE TABLE IF NOT EXISTS stripe_webhook_log (
  event_id    text PRIMARY KEY,
  type        text NOT NULL,
  user_id     uuid,
  outcome     text NOT NULL,      -- ok / no_profile / ignored / error
  detail      jsonb,
  received_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS stripe_webhook_log_received_idx ON stripe_webhook_log (received_at DESC);
ALTER TABLE stripe_webhook_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON stripe_webhook_log FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON stripe_webhook_log TO service_role;
