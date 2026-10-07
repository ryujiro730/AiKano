-- セキュリティ修正（2026-10-07）。公開キー（anon）で読めてはいけないものを塞ぐ。
--
-- 1) admin_users_view：全ユーザーのメール・課金額を含むビューが、公開キーで読めていた（Advisor: Security Definer View）
-- 2) character_photos：写真の URL が公開キーで一覧できた（ガチャを引かずに全写真が取れてしまう）
-- 3) Storage（avatars / chat-images）：公開キーでファイル一覧が取れた（キャラ写真・振込明細などを列挙できてしまう）
--
-- アプリはこれらをサーバー側（service role）で読むので、一般ユーザーからの読み取りを止めても動作は変わらない。
-- 管理画面（ブラウザから管理者として操作）用に、管理者だけは引き続き読めるようにする。

-- 1) admin_users_view
ALTER VIEW public.admin_users_view SET (security_invoker = on);
REVOKE ALL ON public.admin_users_view FROM anon, authenticated;
GRANT SELECT ON public.admin_users_view TO service_role;

-- 2) character_photos：閲覧は管理者のみ（ユーザーには /api/characters/[id]/photos 等がサーバーで必要な分だけ返す）
DROP POLICY IF EXISTS photos_public_read ON public.character_photos;
DROP POLICY IF EXISTS photos_admin_read ON public.character_photos;
CREATE POLICY photos_admin_read ON public.character_photos FOR SELECT USING (is_admin());

-- 3) Storage：一覧（SELECT）できるのは管理者だけにする
--    公開バケットのファイルは URL を知っていれば SELECT ポリシーなしで表示できるので、画像の表示には影響しない。
--    管理画面のアップロード（upsert）には SELECT が要るため、管理者用のポリシーを作る。
DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects' AND cmd = 'SELECT'
      AND (qual ILIKE '%avatars%' OR qual ILIKE '%chat-images%')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

DROP POLICY IF EXISTS "admins can read app buckets" ON storage.objects;
CREATE POLICY "admins can read app buckets" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id IN ('avatars', 'chat-images') AND public.is_admin());
