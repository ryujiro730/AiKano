-- キャンペーンのテーブルをブラウザから読み書きできないようにする（065 と同じ方針: 書き込みはサーバー API 経由だけ）
-- 044 で anon / authenticated に GRANT ALL していて、条件（campaign_conditions）は誰でも読め、
-- 管理画面はブラウザから直接 campaigns に書いていた。今は管理画面も表示も /api/admin/campaigns・/api/campaigns/* （service role）を通る。
-- ※ 管理画面を API 経由にした版（CampaignManager）をデプロイしてから流すこと（先に流すと古い管理画面で保存できなくなる）
-- ロールバック: 044 の GRANT と POLICY を流し直す

DROP POLICY IF EXISTS "admin/staff can manage campaigns" ON campaigns;
DROP POLICY IF EXISTS "users can read active campaigns" ON campaigns;
DROP POLICY IF EXISTS "admin/staff can manage campaign_conditions" ON campaign_conditions;
DROP POLICY IF EXISTS "users can read campaign_conditions" ON campaign_conditions;
DROP POLICY IF EXISTS "users can insert own display log" ON campaign_displays;
DROP POLICY IF EXISTS "users can read own display log" ON campaign_displays;
DROP POLICY IF EXISTS "admin can read all display logs" ON campaign_displays;

REVOKE ALL ON TABLE campaigns, campaign_conditions, campaign_displays FROM anon, authenticated;
GRANT ALL ON TABLE campaigns, campaign_conditions, campaign_displays TO service_role;
