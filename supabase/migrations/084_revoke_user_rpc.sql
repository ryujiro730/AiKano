-- ポイント・好感度・無料枠を書き換える関数を、ブラウザ（anon / authenticated）から呼べないようにする
-- 047 などで GRANT EXECUTE TO service_role だけ書いていたが、関数は既定で PUBLIC に実行権があるため、
-- ログインしていない人でも rpc('add_points', { p_user_id: 誰でも, p_amount: 好きな数 }) が通っていた。
-- 呼んでいるのはすべてサーバー（service role）なので、service_role 以外の実行権を外す。
-- ロールバック: GRANT EXECUTE ON FUNCTION ... TO PUBLIC;

REVOKE EXECUTE ON FUNCTION add_points(uuid, int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION add_affection(uuid, uuid, int) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION use_daily_free_message(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION use_subscription_message(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION get_daily_free_usage(uuid, uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION get_unread_char_ids(uuid) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION add_points(uuid, int) TO service_role;
GRANT EXECUTE ON FUNCTION add_affection(uuid, uuid, int) TO service_role;
GRANT EXECUTE ON FUNCTION use_daily_free_message(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION use_subscription_message(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION get_daily_free_usage(uuid, uuid) TO service_role;
GRANT EXECUTE ON FUNCTION get_unread_char_ids(uuid) TO service_role;
