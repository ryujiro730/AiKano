-- キャンペーン管理
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text,
  catchphrase text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  cta_text text NOT NULL DEFAULT 'ポイントを購入する',
  cta_url text,
  display_frequency text NOT NULL DEFAULT 'once' CHECK (display_frequency IN ('once', 'always')),
  is_active boolean NOT NULL DEFAULT false,
  starts_at timestamptz,
  ends_at timestamptz,
  bonus_rate numeric NOT NULL DEFAULT 1.0,
  min_price_yen integer,
  max_price_yen integer,
  one_time_per_user boolean NOT NULL DEFAULT false,
  style_config jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- キャンペーン表示条件
CREATE TABLE IF NOT EXISTS campaign_conditions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  condition_type text NOT NULL CHECK (condition_type IN ('registered_at', 'purchase_count', 'purchase_amount', 'hours_since_registration')),
  operator text NOT NULL CHECK (operator IN ('gte', 'lte', 'lt')),
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- キャンペーン表示ログ
CREATE TABLE IF NOT EXISTS campaign_displays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  shown_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(campaign_id, user_id)
);

ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_displays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin/staff can manage campaigns"
  ON campaigns FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'owner')));

CREATE POLICY "users can read active campaigns"
  ON campaigns FOR SELECT
  USING (is_active = true);

CREATE POLICY "admin/staff can manage campaign_conditions"
  ON campaign_conditions FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'owner')));

CREATE POLICY "users can read campaign_conditions"
  ON campaign_conditions FOR SELECT
  USING (true);

CREATE POLICY "users can insert own display log"
  ON campaign_displays FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users can read own display log"
  ON campaign_displays FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "admin can read all display logs"
  ON campaign_displays FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'staff', 'owner')));

GRANT ALL ON TABLE campaigns TO anon, authenticated, service_role;
GRANT ALL ON TABLE campaign_conditions TO anon, authenticated, service_role;
GRANT ALL ON TABLE campaign_displays TO anon, authenticated, service_role;
