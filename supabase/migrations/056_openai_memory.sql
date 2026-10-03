-- ── OpenAI Responses API 連携 & 長期メモリ ────────────────────────────────

-- conversations テーブルに OpenAI レスポンス ID を追加
-- LLM_PROVIDER=openai のとき Responses API の response.id を保存し、
-- 次回リクエストで previous_response_id として渡すことで会話を継続する
ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS openai_last_response_id TEXT;

-- ユーザー × キャラクター ごとの長期メモリ
-- 会話から抽出した「覚えておく価値のある情報」を蓄積する
CREATE TABLE IF NOT EXISTS user_character_memories (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  character_id UUID        NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  memory_text  TEXT        NOT NULL DEFAULT '',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, character_id)
);

ALTER TABLE user_character_memories ENABLE ROW LEVEL SECURITY;
-- サービスロールからのみアクセス可（ユーザーには見せない）
