-- メールの届き方の記録（Resend の Webhook）と、新着通知メールの送りすぎ防止（matchkoi 229・235・208・228・255 から）
--
-- Resend → /api/webhooks/resend に、送信・到達・遅延・開封・クリック・不達（バウンス）・迷惑報告・失敗・送信停止 が届く。
--   email_webhook_events … 届いた通知そのもの（svix-id で重複を捨てる）
--   email_messages       … メール1通ごとの状態。集計はこちらを見る
-- 迷惑報告・宛先が存在しない（Permanent バウンス）・Resend が送信停止にした人は profiles.email_opt_out を立てて以後送らない。
--   理由は email_suppressed_reason に残す。メールアドレスを変えたら、不達・送信停止による停止は外す（迷惑報告は外さない）
--
-- 新着通知（自動同報・追いLINE・スタッフ返信・個別送信）は claim_notify_email() が宛先を返したときだけ送る:
--   配信停止・0〜7時（JST）・最後に画面を開いてから15分以内（サイトにいる）・前の通知から60分以内・今日（JST）5通 は送らない
--   Gmail 宛は 3日以上来ていない人へは前の通知から7日以上たったときだけ、登録3日以内の人へは1日2通まで
--   （matchkoi で Gmail の迷惑報告率が 0.3% を超え、Gmail 宛がほぼ全部止められたため）
--
-- ロールバック: DROP FUNCTION record_email_event, get_email_stats, claim_notify_email; DROP TABLE email_messages, email_webhook_events, email_notify_log;
--               DROP TRIGGER trg_profiles_email_changed_unsuppress ON profiles; DROP FUNCTION fn_profiles_email_changed_unsuppress;
--               ALTER TABLE profiles DROP COLUMN email_suppressed_at, DROP COLUMN email_suppressed_reason;

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS email_suppressed_at     timestamptz,
  ADD COLUMN IF NOT EXISTS email_suppressed_reason text;   -- complained / bounced / suppressed
CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles (email);

CREATE TABLE IF NOT EXISTS email_webhook_events (
  svix_id     text PRIMARY KEY,
  email_id    text,
  type        text NOT NULL,
  occurred_at timestamptz NOT NULL,
  data        jsonb,
  received_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_webhook_events_email_idx ON email_webhook_events (email_id);

CREATE TABLE IF NOT EXISTS email_messages (
  email_id       text PRIMARY KEY,           -- Resend のメールID
  user_id        uuid,
  to_email       text,
  to_domain      text,
  subject        text,
  kind           text,                       -- 送ったときのタグ（follow_up など）。無ければ件名から推定
  sent_at        timestamptz,
  delivered_at   timestamptz,
  delayed_at     timestamptz,
  opened_at      timestamptz,
  open_count     int NOT NULL DEFAULT 0,
  clicked_at     timestamptz,
  click_count    int NOT NULL DEFAULT 0,
  bounced_at     timestamptz,
  bounce_type    text,                       -- Permanent / Transient / Undetermined
  bounce_message text,
  complained_at  timestamptz,
  failed_at      timestamptz,
  failed_reason  text,
  suppressed_at  timestamptz,
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_messages_sent_idx ON email_messages (sent_at);
CREATE INDEX IF NOT EXISTS email_messages_user_idx ON email_messages (user_id);

-- 新着通知メールを送った記録（送りすぎ防止の判定に使う）
CREATE TABLE IF NOT EXISTS email_notify_log (
  id      bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  kind    text NOT NULL,
  sent_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS email_notify_log_user_idx ON email_notify_log (user_id, sent_at DESC);

ALTER TABLE email_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_notify_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON email_webhook_events, email_messages, email_notify_log FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON email_webhook_events, email_messages, email_notify_log TO service_role;
GRANT USAGE, SELECT ON SEQUENCE email_notify_log_id_seq TO service_role;

-- Webhook 1件を記録する。同じ svix-id は2回目以降なにもしない（Resend は届くまで再送してくる）
CREATE OR REPLACE FUNCTION record_email_event(
  p_svix_id text, p_type text, p_email_id text, p_occurred_at timestamptz,
  p_to text, p_subject text, p_kind text, p_data jsonb
) RETURNS boolean
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_inserted int;
  v_uid uuid;
  v_to text := lower(trim(p_to));
  v_bounce_type text := p_data #>> '{bounce,type}';
  v_reason text;
BEGIN
  INSERT INTO email_webhook_events (svix_id, email_id, type, occurred_at, data)
  VALUES (p_svix_id, p_email_id, p_type, p_occurred_at, p_data)
  ON CONFLICT (svix_id) DO NOTHING;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  IF v_inserted = 0 OR p_email_id IS NULL THEN RETURN v_inserted > 0; END IF;

  SELECT id INTO v_uid FROM profiles WHERE lower(email) = v_to LIMIT 1;

  INSERT INTO email_messages (email_id, user_id, to_email, to_domain, subject, kind, sent_at)
  VALUES (p_email_id, v_uid, v_to, split_part(v_to, '@', 2), p_subject, p_kind,
          CASE WHEN p_type = 'email.sent' THEN p_occurred_at END)
  ON CONFLICT (email_id) DO UPDATE SET
    user_id = coalesce(email_messages.user_id, EXCLUDED.user_id),
    subject = coalesce(email_messages.subject, EXCLUDED.subject),
    kind    = coalesce(email_messages.kind, EXCLUDED.kind);

  UPDATE email_messages SET
    sent_at        = coalesce(sent_at, p_occurred_at),
    -- 開封・クリック・迷惑報告が来たものは届いている（到達の通知を取りこぼしていても数える）
    delivered_at   = CASE WHEN p_type IN ('email.delivered', 'email.opened', 'email.clicked', 'email.complained') THEN coalesce(delivered_at, p_occurred_at) ELSE delivered_at END,
    delayed_at     = CASE WHEN p_type = 'email.delivery_delayed' THEN coalesce(delayed_at, p_occurred_at) ELSE delayed_at END,
    opened_at      = CASE WHEN p_type = 'email.opened' THEN least(coalesce(opened_at, p_occurred_at), p_occurred_at) ELSE opened_at END,
    open_count     = open_count + CASE WHEN p_type = 'email.opened' THEN 1 ELSE 0 END,
    clicked_at     = CASE WHEN p_type = 'email.clicked' THEN least(coalesce(clicked_at, p_occurred_at), p_occurred_at) ELSE clicked_at END,
    click_count    = click_count + CASE WHEN p_type = 'email.clicked' THEN 1 ELSE 0 END,
    bounced_at     = CASE WHEN p_type = 'email.bounced' THEN p_occurred_at ELSE bounced_at END,
    bounce_type    = CASE WHEN p_type = 'email.bounced' THEN v_bounce_type ELSE bounce_type END,
    bounce_message = CASE WHEN p_type = 'email.bounced' THEN left(p_data #>> '{bounce,message}', 500) ELSE bounce_message END,
    complained_at  = CASE WHEN p_type = 'email.complained' THEN p_occurred_at ELSE complained_at END,
    failed_at      = CASE WHEN p_type = 'email.failed' THEN p_occurred_at ELSE failed_at END,
    failed_reason  = CASE WHEN p_type = 'email.failed' THEN left(coalesce(p_data #>> '{failed,reason}', p_data #>> '{reason}'), 500) ELSE failed_reason END,
    suppressed_at  = CASE WHEN p_type = 'email.suppressed' THEN p_occurred_at ELSE suppressed_at END,
    updated_at     = now()
  WHERE email_id = p_email_id;

  -- 迷惑報告・存在しない宛先・Resend の送信停止 → 以後このユーザーには送らない
  v_reason := CASE
    WHEN p_type = 'email.complained' THEN 'complained'
    WHEN p_type = 'email.bounced' AND v_bounce_type = 'Permanent' THEN 'bounced'
    WHEN p_type = 'email.suppressed' THEN 'suppressed'
  END;
  IF v_reason IS NOT NULL AND v_to <> '' THEN
    UPDATE profiles SET email_opt_out = true, email_suppressed_at = p_occurred_at, email_suppressed_reason = v_reason
     WHERE lower(email) = v_to AND (email_suppressed_reason IS DISTINCT FROM 'complained');
  END IF;
  RETURN true;
END;
$$;

-- メールアドレスを変えたら、不達・送信停止による停止を外す（迷惑報告は本人の意思なので外さない）
CREATE OR REPLACE FUNCTION fn_profiles_email_changed_unsuppress() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.email IS DISTINCT FROM OLD.email AND OLD.email_suppressed_reason IN ('bounced', 'suppressed') THEN
    NEW.email_opt_out := false;
    NEW.email_suppressed_at := NULL;
    NEW.email_suppressed_reason := NULL;
  END IF;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_profiles_email_changed_unsuppress ON profiles;
CREATE TRIGGER trg_profiles_email_changed_unsuppress BEFORE UPDATE OF email ON profiles
  FOR EACH ROW EXECUTE FUNCTION fn_profiles_email_changed_unsuppress();

/**
 * 新着通知メールを今送ってよいか判定し、よければ送信記録を入れて宛先と言語を返す（だめなら0行）。
 * 同じユーザーへの判定は順番に行う（同時に呼ばれても上限を超えない）
 */
CREATE OR REPLACE FUNCTION claim_notify_email(p_user_id uuid, p_kind text)
RETURNS TABLE (email text, locale text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  p record;
  v_now timestamptz := now();
  v_today timestamptz := date_trunc('day', now() AT TIME ZONE 'Asia/Tokyo') AT TIME ZONE 'Asia/Tokyo';
  v_hour int := extract(hour FROM now() AT TIME ZONE 'Asia/Tokyo');
  v_last timestamptz;
  v_today_count int;
  v_seen timestamptz;
  v_gmail boolean;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext('notify_email:' || p_user_id::text));

  SELECT pr.email, pr.locale, pr.email_opt_out, pr.created_at, pr.last_login_at, u.banned_until INTO p
  FROM profiles pr JOIN auth.users u ON u.id = pr.id
  WHERE pr.id = p_user_id;
  IF NOT FOUND OR p.email IS NULL OR p.email = '' OR p.email_opt_out THEN RETURN; END IF;
  IF p.banned_until IS NOT NULL AND p.banned_until > v_now THEN RETURN; END IF;
  IF v_hour < 7 THEN RETURN; END IF;                                              -- 夜中は送らない
  IF p.last_login_at > v_now - interval '15 minutes' THEN RETURN; END IF;         -- 画面を開いている

  SELECT max(sent_at), count(*) FILTER (WHERE sent_at >= v_today)
    INTO v_last, v_today_count
  FROM email_notify_log WHERE user_id = p_user_id AND sent_at >= v_now - interval '8 days';
  IF v_last > v_now - interval '60 minutes' THEN RETURN; END IF;
  IF v_today_count >= 5 THEN RETURN; END IF;

  v_gmail := lower(split_part(p.email, '@', 2)) IN ('gmail.com', 'googlemail.com');
  IF v_gmail THEN
    v_seen := greatest(p.created_at, coalesce(p.last_login_at, p.created_at));
    IF v_seen < v_now - interval '3 days' THEN
      IF v_last > v_now - interval '7 days' THEN RETURN; END IF;               -- 来ていない人へは週1通
    ELSIF p.created_at > v_now - interval '3 days' AND v_today_count >= 2 THEN
      RETURN;                                                                    -- 登録3日以内は1日2通
    END IF;
  END IF;

  INSERT INTO email_notify_log (user_id, kind) VALUES (p_user_id, p_kind);
  RETURN QUERY SELECT p.email::text, p.locale::text;
END;
$$;

-- 管理画面「メール」の集計（期間 [p_from, p_to)、日付は JST）
CREATE OR REPLACE FUNCTION get_email_stats(p_from timestamptz, p_to timestamptz)
RETURNS jsonb
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  WITH m AS (
    SELECT * FROM email_messages WHERE sent_at >= p_from AND sent_at < p_to
  ),
  daily AS (
    SELECT d::date AS day,
      count(m.email_id) sent, count(m.delivered_at) delivered, count(m.opened_at) opened, count(m.clicked_at) clicked,
      count(m.bounced_at) bounced, count(m.complained_at) complained,
      count(m.email_id) FILTER (WHERE m.failed_at IS NOT NULL OR m.suppressed_at IS NOT NULL) failed
    FROM generate_series((p_from AT TIME ZONE 'Asia/Tokyo')::date, ((p_to - interval '1 second') AT TIME ZONE 'Asia/Tokyo')::date, interval '1 day') d
    LEFT JOIN m ON (m.sent_at AT TIME ZONE 'Asia/Tokyo')::date = d::date
    GROUP BY 1
  ),
  kinds AS (
    SELECT coalesce(kind, 'other') AS kind, count(*) sent, count(delivered_at) delivered, count(opened_at) opened, count(clicked_at) clicked,
      count(bounced_at) bounced, count(complained_at) complained,
      count(*) FILTER (WHERE failed_at IS NOT NULL OR suppressed_at IS NOT NULL) failed
    FROM m GROUP BY 1
  ),
  domains AS (
    SELECT to_domain AS domain, count(*) sent, count(delivered_at) delivered, count(opened_at) opened,
      count(bounced_at) bounced, count(complained_at) complained, count(delayed_at) delayed,
      count(*) FILTER (WHERE failed_at IS NOT NULL OR suppressed_at IS NOT NULL) failed
    FROM m GROUP BY to_domain ORDER BY count(*) DESC LIMIT 15
  ),
  problems AS (
    SELECT to_email, kind, subject, sent_at,
      CASE WHEN complained_at IS NOT NULL THEN 'complained' WHEN bounced_at IS NOT NULL THEN 'bounced:' || coalesce(bounce_type, '')
           WHEN suppressed_at IS NOT NULL THEN 'suppressed' ELSE 'failed' END AS problem,
      coalesce(bounce_message, failed_reason) AS detail
    FROM m WHERE complained_at IS NOT NULL OR bounced_at IS NOT NULL OR failed_at IS NOT NULL OR suppressed_at IS NOT NULL
    ORDER BY sent_at DESC LIMIT 30
  )
  SELECT jsonb_build_object(
    'total',    (SELECT jsonb_build_object('sent', count(*), 'delivered', count(delivered_at), 'opened', count(opened_at),
                   'bounced', count(bounced_at), 'complained', count(complained_at)) FROM m),
    'daily',    (SELECT coalesce(jsonb_agg(daily ORDER BY day DESC), '[]') FROM daily WHERE sent > 0),
    'kinds',    (SELECT coalesce(jsonb_agg(kinds ORDER BY sent DESC), '[]') FROM kinds),
    'domains',  (SELECT coalesce(jsonb_agg(domains), '[]') FROM domains),
    'problems', (SELECT coalesce(jsonb_agg(problems), '[]') FROM problems),
    'suppressed', (SELECT coalesce(jsonb_object_agg(r, n), '{}') FROM (SELECT email_suppressed_reason r, count(*) n FROM profiles WHERE email_suppressed_reason IS NOT NULL GROUP BY 1) x),
    'notify_today', (SELECT count(*) FROM email_notify_log WHERE sent_at >= date_trunc('day', now() AT TIME ZONE 'Asia/Tokyo') AT TIME ZONE 'Asia/Tokyo'),
    'first_event_at', (SELECT min(sent_at) FROM email_messages)
  );
$$;

REVOKE ALL ON FUNCTION record_email_event(text, text, text, timestamptz, text, text, text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION claim_notify_email(uuid, text) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION get_email_stats(timestamptz, timestamptz) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION record_email_event(text, text, text, timestamptz, text, text, text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION claim_notify_email(uuid, text) TO service_role;
GRANT EXECUTE ON FUNCTION get_email_stats(timestamptz, timestamptz) TO service_role;
