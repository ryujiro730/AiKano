-- 退会（アカウント削除）しても課金・振込の記録を残す
-- point_transactions / bank_transfer_requests は profiles への外部キーが ON DELETE CASCADE で、
-- /api/account/delete でユーザーを消すと売上・振込の記録まで消えていた（会計・チャージバック対応で困る）。
-- customer_registry（057）と同じく、user_id の値は残して外部キー制約だけ外す。
-- ロールバック: ALTER TABLE ... ADD CONSTRAINT ..._user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
--              （先に孤立した行を消す必要がある）

ALTER TABLE point_transactions DROP CONSTRAINT IF EXISTS point_transactions_user_id_fkey;
ALTER TABLE bank_transfer_requests DROP CONSTRAINT IF EXISTS bank_transfer_requests_user_id_fkey;
