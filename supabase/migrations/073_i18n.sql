-- 多言語対応
-- characters.i18n: 言語別の表示用テキスト。例 {"en": {"name": "Momo", "personality": "...", "description": "..."}}
--   日本語は既存の name / personality / description をそのまま使う
-- profiles.locale: ユーザーの表示言語（自動同報・メールをその言語で送るため）
-- auto_broadcast_steps.i18n: 同報メッセージの翻訳キャッシュ。例 {"en": "..."}
ALTER TABLE characters ADD COLUMN IF NOT EXISTS i18n jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS locale text NOT NULL DEFAULT 'ja';
ALTER TABLE auto_broadcast_steps ADD COLUMN IF NOT EXISTS i18n jsonb NOT NULL DEFAULT '{}'::jsonb;
