-- RLS 強化: ブラウザ（anon / authenticated）からお金・権限に関わる行を書き換えられないようにする
-- 書き込みはすべてサーバー（service_role）経由で行う。service_role は RLS・列権限の影響を受けない。

-- ── profiles ─────────────────────────────────────────────────────
-- 旧: profiles_self (ALL) により本人が points / role / subscription_* を自由に更新できた
-- 新: 本人が更新できるのは last_login_at のみ（ログイン画面が直接更新している）
REVOKE INSERT, UPDATE, DELETE ON profiles FROM anon, authenticated;
GRANT UPDATE (last_login_at) ON profiles TO authenticated;

-- ── point_transactions ───────────────────────────────────────────
-- 旧: 本人が自由に INSERT/UPDATE/DELETE できた（偽の課金履歴を作れた）
DROP POLICY IF EXISTS transactions_self ON point_transactions;
CREATE POLICY transactions_self_read ON point_transactions FOR SELECT USING (auth.uid() = user_id);

-- ── user_items（ショップ所持品）──────────────────────────────────
-- 旧: 本人が自由に追加・数量変更できた（無料でアイテム入手）
DROP POLICY IF EXISTS "Users manage own inventory" ON user_items;
CREATE POLICY user_items_self_read ON user_items FOR SELECT USING (auth.uid() = user_id);

-- ── 動画の購入・解錠 ─────────────────────────────────────────────
-- 旧: 本人が購入済みレコードを直接 INSERT できた（無料で解錠）
DROP POLICY IF EXISTS "users can insert own video purchases" ON video_item_purchases;
DROP POLICY IF EXISTS "users can insert own video unlocks" ON video_unlocks;

-- ── bank_transfer_requests ───────────────────────────────────────
-- 旧: 「service role full access」が roles=public・条件 true で、誰でも全件を読み書きできた
DROP POLICY IF EXISTS "service role full access" ON bank_transfer_requests;
CREATE POLICY bank_transfer_requests_service ON bank_transfer_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
