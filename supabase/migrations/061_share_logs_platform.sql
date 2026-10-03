-- share_logs にプラットフォームカラムを追加
ALTER TABLE share_logs ADD COLUMN IF NOT EXISTS platform text;
