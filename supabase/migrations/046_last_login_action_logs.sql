-- profiles に last_login_at カラムを追加
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login_at timestamptz;

-- ユーザー行動ログ
CREATE TABLE IF NOT EXISTS user_action_logs (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action_type  text        NOT NULL,
  page_path    text,
  metadata     jsonb,
  points_balance integer,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_action_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own action logs" ON user_action_logs
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can read all action logs" ON user_action_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'owner'))
  );

CREATE INDEX IF NOT EXISTS idx_user_action_logs_user_id ON user_action_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_user_action_logs_created_at ON user_action_logs (created_at DESC);

GRANT ALL ON TABLE user_action_logs TO anon, authenticated, service_role;
