-- 管理画面: 概要（今日・昨日・直近7日の主要指標を DB 側で集計。日付は JST）
-- 課金者は price_yen > 0 の purchase のみ（type='purchase' で ¥0 の誤分類データがあるため）
CREATE OR REPLACE FUNCTION admin_overview(p_exclude_ids text[] DEFAULT '{}')
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH b AS (
    SELECT
      (date_trunc('day', now() AT TIME ZONE 'Asia/Tokyo') AT TIME ZONE 'Asia/Tokyo') AS today,
      (date_trunc('day', now() AT TIME ZONE 'Asia/Tokyo') AT TIME ZONE 'Asia/Tokyo') - interval '1 day' AS yesterday,
      (date_trunc('day', now() AT TIME ZONE 'Asia/Tokyo') AT TIME ZONE 'Asia/Tokyo') - interval '6 days' AS week
  ),
  periods AS (
    SELECT 'today' AS k, b.today AS f, now() AS t FROM b
    UNION ALL SELECT 'yesterday', b.yesterday, b.today FROM b
    UNION ALL SELECT 'week', b.week, now() FROM b
  ),
  users AS (SELECT id FROM profiles WHERE role = 'user' AND NOT (id::text = ANY(p_exclude_ids)))
  SELECT jsonb_build_object(
    'periods', (SELECT jsonb_object_agg(k, jsonb_build_object(
      'registrations', (SELECT COUNT(*) FROM profiles p WHERE p.id IN (SELECT id FROM users) AND p.age IS NOT NULL AND p.created_at >= f AND p.created_at < t),
      'senders',       (SELECT COUNT(DISTINCT c.user_id) FROM messages m JOIN conversations c ON c.id = m.conversation_id
                         WHERE m.sender_role = 'user' AND m.created_at >= f AND m.created_at < t AND c.user_id IN (SELECT id FROM users)),
      'messages',      (SELECT COUNT(*) FROM messages m JOIN conversations c ON c.id = m.conversation_id
                         WHERE m.sender_role = 'user' AND m.created_at >= f AND m.created_at < t AND c.user_id IN (SELECT id FROM users)),
      'revenue',       COALESCE((SELECT SUM(price_yen) FROM point_transactions x WHERE x.type = 'purchase' AND x.created_at >= f AND x.created_at < t AND x.user_id IN (SELECT id FROM users)), 0),
      'payers',        (SELECT COUNT(DISTINCT user_id) FROM point_transactions x WHERE x.type = 'purchase' AND x.price_yen > 0 AND x.created_at >= f AND x.created_at < t AND x.user_id IN (SELECT id FROM users)),
      'new_members',   (SELECT COUNT(*) FROM user_action_logs l WHERE l.action_type = 'subscription_start' AND l.created_at >= f AND l.created_at < t AND l.user_id IN (SELECT id FROM users))
    )) FROM periods),
    'totals', jsonb_build_object(
      'users',   (SELECT COUNT(*) FROM profiles WHERE id IN (SELECT id FROM users) AND age IS NOT NULL),
      'members', (SELECT COUNT(*) FROM profiles WHERE id IN (SELECT id FROM users) AND subscription_status IN ('active', 'trialing')),
      'payers',  (SELECT COUNT(DISTINCT user_id) FROM point_transactions WHERE type = 'purchase' AND price_yen > 0 AND user_id IN (SELECT id FROM users))
    ),
    'todo', jsonb_build_object(
      'bank_transfers', (SELECT COUNT(*) FROM bank_transfer_requests WHERE status = 'pending'),
      'inquiries',      (SELECT COUNT(*) FROM inquiries WHERE status IS DISTINCT FROM 'closed'),
      'promo_submissions', (SELECT COUNT(*) FROM promo_submissions WHERE status = 'pending')
    ),
    'recent_purchases', COALESCE((SELECT jsonb_agg(r) FROM (
      SELECT x.user_id, p.display_name, x.price_yen, x.description, x.created_at
      FROM point_transactions x JOIN profiles p ON p.id = x.user_id
      WHERE x.type = 'purchase' AND x.price_yen > 0 AND x.user_id IN (SELECT id FROM users)
      ORDER BY x.created_at DESC LIMIT 10) r), '[]'::jsonb),
    'recent_signups', COALESCE((SELECT jsonb_agg(r) FROM (
      SELECT p.id, p.display_name, p.age, p.utm_source, p.referral_source, p.created_at
      FROM profiles p WHERE p.id IN (SELECT id FROM users) AND p.age IS NOT NULL
      ORDER BY p.created_at DESC LIMIT 10) r), '[]'::jsonb)
  )
$$;

REVOKE ALL ON FUNCTION admin_overview(text[]) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION admin_overview(text[]) TO service_role;
