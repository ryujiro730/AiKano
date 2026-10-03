ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS partner_character_id uuid REFERENCES characters(id) ON DELETE SET NULL;
