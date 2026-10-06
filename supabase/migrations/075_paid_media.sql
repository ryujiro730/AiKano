-- 有料メディア：キャラが送る画像 100pt / 動画 500pt（会員も有料）。アイコン写真は無料。
-- messages はブラウザから直接読めるため、URL は metadata に置かず message_media（サーバー専用）に置く。
-- metadata には {"media": "image" | "video"} の目印だけ残す。
-- 解錠は URL 単位（チャットで解錠した写真はアルバムでも見られる）。

CREATE TABLE IF NOT EXISTS public.message_media (
  message_id uuid PRIMARY KEY REFERENCES public.messages(id) ON DELETE CASCADE,
  url        text NOT NULL,
  kind       text NOT NULL CHECK (kind IN ('image', 'video')),
  price      integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.message_media ENABLE ROW LEVEL SECURITY;  -- ポリシーなし = service role のみ

CREATE TABLE IF NOT EXISTS public.media_unlocks (
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  url        text NOT NULL,
  kind       text NOT NULL CHECK (kind IN ('image', 'video')),
  price      integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, url)
);
ALTER TABLE public.media_unlocks ENABLE ROW LEVEL SECURITY;  -- ポリシーなし = service role のみ

-- ── 既存メッセージの移行 ─────────────────────────────────────────────
-- キャラ発言の image_url / video_url を message_media へ移し、metadata から URL を消す。
INSERT INTO public.message_media (message_id, url, kind, price, created_at)
SELECT m.id,
       COALESCE(m.metadata->>'video_url', m.metadata->>'image_url'),
       CASE WHEN m.metadata ? 'video_url' THEN 'video' ELSE 'image' END,
       CASE
         WHEN m.metadata ? 'video_url' THEN 500
         WHEN EXISTS (SELECT 1 FROM public.characters c WHERE c.avatar_url = m.metadata->>'image_url') THEN 0
         ELSE 100
       END,
       m.created_at
FROM public.messages m
WHERE m.sender_role = 'character'
  AND (m.metadata ? 'image_url' OR m.metadata ? 'video_url')
ON CONFLICT (message_id) DO NOTHING;

-- これまで見られていた画像・解錠済みの動画は、そのユーザーには解錠済みとして引き継ぐ
INSERT INTO public.media_unlocks (user_id, url, kind, price, created_at)
SELECT DISTINCT ON (c.user_id, mm.url) c.user_id, mm.url, mm.kind, 0, mm.created_at
FROM public.message_media mm
JOIN public.messages m ON m.id = mm.message_id
JOIN public.conversations c ON c.id = m.conversation_id
WHERE mm.price > 0
  AND (mm.kind = 'image'
       OR EXISTS (SELECT 1 FROM public.video_unlocks v WHERE v.message_id = mm.message_id AND v.user_id = c.user_id))
ON CONFLICT (user_id, url) DO NOTHING;

UPDATE public.messages m
SET metadata = (m.metadata - 'image_url' - 'video_url' - 'locked') || jsonb_build_object('media', mm.kind)
FROM public.message_media mm
WHERE mm.message_id = m.id
  AND (m.metadata ? 'image_url' OR m.metadata ? 'video_url');

-- ── 動画販売は一律 500pt ─────────────────────────────────────────────
UPDATE public.video_items SET price_points = 500;
ALTER TABLE public.video_items ALTER COLUMN price_points SET DEFAULT 500;
