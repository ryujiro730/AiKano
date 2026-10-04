-- TrafficJunky 広告のクリックID。登録・課金のコンバージョンを TJ にポストバックするために保存する
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tj_aclid text;
