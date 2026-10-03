-- 通報テーブル
CREATE TABLE IF NOT EXISTS reports (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id  uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  character_id uuid        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  reason       text        NOT NULL,
  reviewed_at  timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own reports" ON reports
  FOR INSERT WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can read all reports" ON reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'owner'))
  );

-- ブロック（お断り）テーブル
CREATE TABLE IF NOT EXISTS blocks (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  character_id uuid        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, character_id)
);

ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own blocks" ON blocks
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all blocks" ON blocks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'owner'))
  );

CREATE INDEX IF NOT EXISTS idx_blocks_user_id ON blocks (user_id);

GRANT ALL ON TABLE reports TO anon, authenticated, service_role;
GRANT ALL ON TABLE blocks TO anon, authenticated, service_role;
