-- ============================================================
-- 顧客名簿テーブル (customer_registry)
-- 退会・アカウント削除後もデータを永久保持する
-- profiles への外部キー制約を持たせないことで退会後も残る
-- ============================================================

CREATE TABLE IF NOT EXISTS customer_registry (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        UNIQUE,               -- auth.users.id（制約なし：退会後も保持）
  user_code           TEXT,
  email               TEXT,
  display_name        TEXT,
  age                 INTEGER,
  gender              TEXT,
  registration_ip     TEXT,
  referral_source     TEXT,
  referral_article    TEXT,
  stripe_customer_id  TEXT,
  subscription_plan   TEXT,
  registered_at       TIMESTAMPTZ,
  last_login_at       TIMESTAMPTZ,
  withdrawn_at        TIMESTAMPTZ,
  status              TEXT        NOT NULL DEFAULT 'active', -- active / withdrawn / banned
  total_charged       INTEGER     NOT NULL DEFAULT 0,        -- 退会時にスナップショット（円）
  points_at_withdrawal INTEGER,                              -- 退会時のポイント残高
  admin_note          TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_registry_user_id    ON customer_registry(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_registry_email      ON customer_registry(email);
CREATE INDEX IF NOT EXISTS idx_customer_registry_status     ON customer_registry(status);
CREATE INDEX IF NOT EXISTS idx_customer_registry_registered ON customer_registry(registered_at DESC);

-- RLS：管理者・スタッフのみアクセス可
ALTER TABLE customer_registry ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins_all_customer_registry" ON customer_registry
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin','staff'))
  );

-- ============================================================
-- トリガー：profiles INSERT → 名簿に追加
-- ============================================================
CREATE OR REPLACE FUNCTION sync_customer_registry_on_insert()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.customer_registry (
    user_id, user_code, email, display_name, age, gender,
    registration_ip, referral_source, referral_article,
    stripe_customer_id, subscription_plan,
    registered_at, last_login_at, status
  ) VALUES (
    NEW.id, NEW.user_code, NEW.email, NEW.display_name, NEW.age, NEW.gender,
    NEW.registration_ip, NEW.referral_source, NEW.referral_article,
    NEW.stripe_customer_id, NEW.subscription_plan,
    NEW.created_at, NEW.last_login_at, 'active'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_customer_registry_insert ON profiles;
CREATE TRIGGER trg_customer_registry_insert
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_customer_registry_on_insert();

-- ============================================================
-- トリガー：profiles UPDATE → 名簿を同期
-- ============================================================
CREATE OR REPLACE FUNCTION sync_customer_registry_on_update()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.customer_registry SET
    user_code          = NEW.user_code,
    email              = NEW.email,
    display_name       = NEW.display_name,
    age                = NEW.age,
    gender             = NEW.gender,
    last_login_at      = NEW.last_login_at,
    stripe_customer_id = NEW.stripe_customer_id,
    subscription_plan  = NEW.subscription_plan,
    updated_at         = now()
  WHERE user_id = NEW.id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_customer_registry_update ON profiles;
CREATE TRIGGER trg_customer_registry_update
  AFTER UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_customer_registry_on_update();

-- ============================================================
-- トリガー：profiles DELETE 前 → 退会情報をスナップショット
-- ============================================================
CREATE OR REPLACE FUNCTION sync_customer_registry_on_delete()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_total_charged INTEGER;
BEGIN
  -- 退会前に累計課金額（ポイント購入合計）をスナップショット
  SELECT COALESCE(SUM(price_yen), 0) INTO v_total_charged
  FROM public.point_transactions
  WHERE user_id = OLD.id
    AND type = 'purchase'
    AND description NOT LIKE '%ボーナス%';

  UPDATE public.customer_registry SET
    withdrawn_at         = now(),
    status               = 'withdrawn',
    total_charged        = v_total_charged,
    points_at_withdrawal = OLD.points,
    updated_at           = now()
  WHERE user_id = OLD.id;

  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS trg_customer_registry_delete ON profiles;
CREATE TRIGGER trg_customer_registry_delete
  BEFORE DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION sync_customer_registry_on_delete();

-- ============================================================
-- 既存ユーザーを名簿に一括登録（初回マイグレーション時のみ）
-- ============================================================
INSERT INTO customer_registry (
  user_id, user_code, email, display_name, age, gender,
  registration_ip, referral_source, referral_article,
  stripe_customer_id, subscription_plan,
  registered_at, last_login_at, status, total_charged
)
SELECT
  p.id,
  p.user_code,
  p.email,
  p.display_name,
  p.age,
  p.gender,
  p.registration_ip,
  p.referral_source,
  p.referral_article,
  p.stripe_customer_id,
  p.subscription_plan,
  p.created_at,
  p.last_login_at,
  CASE WHEN p.role IN ('admin','staff') THEN 'staff' ELSE 'active' END,
  COALESCE((
    SELECT SUM(price_yen)
    FROM point_transactions
    WHERE user_id = p.id
      AND type = 'purchase'
      AND description NOT LIKE '%ボーナス%'
  ), 0)
FROM profiles p
ON CONFLICT (user_id) DO NOTHING;
