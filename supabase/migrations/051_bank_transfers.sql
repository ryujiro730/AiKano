CREATE TABLE IF NOT EXISTS bank_transfer_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('standard', 'premium')),
  amount_yen INTEGER NOT NULL,
  receipt_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected')),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  admin_note TEXT
);

CREATE INDEX IF NOT EXISTS idx_bank_transfer_user ON bank_transfer_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_bank_transfer_status ON bank_transfer_requests(status, requested_at DESC);

ALTER TABLE bank_transfer_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service role full access" ON bank_transfer_requests USING (true) WITH CHECK (true);
