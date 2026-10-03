-- profiles に UTM / 広告クリック追跡カラムを追加
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS utm_source   text,
  ADD COLUMN IF NOT EXISTS utm_medium   text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content  text,
  ADD COLUMN IF NOT EXISTS utm_term     text,
  ADD COLUMN IF NOT EXISTS fbclid       text,
  ADD COLUMN IF NOT EXISTS gclid        text;

-- customer_registry にも同じカラムを追加（プロフィール→レジストリ同期トリガーのため）
ALTER TABLE customer_registry
  ADD COLUMN IF NOT EXISTS utm_source   text,
  ADD COLUMN IF NOT EXISTS utm_medium   text,
  ADD COLUMN IF NOT EXISTS utm_campaign text,
  ADD COLUMN IF NOT EXISTS utm_content  text,
  ADD COLUMN IF NOT EXISTS utm_term     text,
  ADD COLUMN IF NOT EXISTS fbclid       text,
  ADD COLUMN IF NOT EXISTS gclid        text;

-- sync_to_customer_registry トリガー関数を再定義してUTMカラムを含める
CREATE OR REPLACE FUNCTION sync_to_customer_registry()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO customer_registry (
    user_id, email, display_name, age, gender,
    registration_ip, referral_source, referral_article,
    utm_source, utm_medium, utm_campaign, utm_content, utm_term, fbclid, gclid,
    created_at, status
  ) VALUES (
    NEW.id, NEW.email, NEW.display_name, NEW.age, NEW.gender,
    NEW.registration_ip, NEW.referral_source, NEW.referral_article,
    NEW.utm_source, NEW.utm_medium, NEW.utm_campaign, NEW.utm_content, NEW.utm_term, NEW.fbclid, NEW.gclid,
    NEW.created_at, 'active'
  )
  ON CONFLICT (user_id) DO UPDATE SET
    display_name    = EXCLUDED.display_name,
    age             = EXCLUDED.age,
    gender          = EXCLUDED.gender,
    referral_source = EXCLUDED.referral_source,
    referral_article= EXCLUDED.referral_article,
    utm_source      = EXCLUDED.utm_source,
    utm_medium      = EXCLUDED.utm_medium,
    utm_campaign    = EXCLUDED.utm_campaign,
    utm_content     = EXCLUDED.utm_content,
    utm_term        = EXCLUDED.utm_term,
    fbclid          = EXCLUDED.fbclid,
    gclid           = EXCLUDED.gclid;
  RETURN NEW;
END;
$$;
