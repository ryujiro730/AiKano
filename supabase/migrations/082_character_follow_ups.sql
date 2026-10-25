-- キャラからの追いLINE（ユーザーが数時間戻ってこないとき、会話を踏まえた一言を送ってメールで呼び戻す）
-- 送信本体は lib/character-follow-up.ts（cron /api/cron/follow-up から呼ぶ）

-- follow_up_count: ユーザーが最後に送ってから、追いLINEを何通送ったか（ユーザーが送ると 0 に戻る）
alter table conversations
  add column if not exists follow_up_count integer not null default 0,
  add column if not exists last_follow_up_at timestamptz;

-- メール配信停止（追いLINE・自動同報のメール通知を止める。アプリ内のメッセージは届く）
alter table profiles
  add column if not exists email_opt_out boolean not null default false;

create or replace function fn_reset_follow_up_count()
returns trigger language plpgsql security definer as $$
begin
  if new.sender_role = 'user' then
    update conversations set follow_up_count = 0 where id = new.conversation_id and follow_up_count <> 0;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reset_follow_up_count on messages;
create trigger trg_reset_follow_up_count
  after insert on messages
  for each row execute function fn_reset_follow_up_count();

/**
 * 追いLINEを送る会話を取り出す（取り出した時点で follow_up_count を +1・last_follow_up_at を更新するので、同時実行でも重複しない）
 * - ユーザーごとに1会話だけ（一度でも返信したことのある会話のうち、いちばん最近動いたもの）
 * - 最後の動き（その会話の最終メッセージ・最後の追いLINE・ユーザーの最終アクセス）から、
 *   追いLINEの通数に応じた間隔（3時間 → 12時間 → 1日 → 2日 → 以降3日おき）が空いたら送る。通数の上限はなし
 * - 送るのは日本時間 9〜22時台だけ
 */
create or replace function claim_character_follow_ups(p_limit int default 20)
returns table (
  conversation_id uuid,
  user_id uuid,
  character_id uuid,
  follow_up_count int,
  idle_since timestamptz,
  last_sender_role text
)
language plpgsql security definer set search_path = public as $$
#variable_conflict use_column
declare
  jst_hour int := extract(hour from now() at time zone 'Asia/Tokyo');
begin
  if jst_hour < 9 or jst_hour >= 23 then
    return;
  end if;

  return query
  with latest as (
    select distinct on (c.user_id)
      c.id, c.user_id, c.character_id, c.follow_up_count, c.last_message_sender_role,
      greatest(c.last_message_at, c.last_follow_up_at, p.last_login_at) as idle_since
    from conversations c
    join profiles p on p.id = c.user_id
    join auth.users u on u.id = c.user_id
    where c.has_user_reply
      and c.last_message_at is not null
      and (u.banned_until is null or u.banned_until < now())
      and not exists (select 1 from blocks b where b.user_id = c.user_id and b.character_id = c.character_id)
    order by c.user_id, c.last_message_at desc
  ),
  due as (
    -- 条件は conversations の列で書く（行ロック待ちのあと最新の値で再判定させるため）
    select c.id, l.idle_since as idle_since_at_claim
    from conversations c
    join latest l on l.id = c.id
    join profiles p on p.id = c.user_id
    where greatest(c.last_message_at, c.last_follow_up_at, p.last_login_at) < now() - case
      when c.follow_up_count = 0 then interval '3 hours'
      when c.follow_up_count = 1 then interval '12 hours'
      when c.follow_up_count = 2 then interval '1 day'
      when c.follow_up_count = 3 then interval '2 days'
      else interval '3 days'
    end
    order by l.idle_since
    limit p_limit
    for update of c skip locked
  ),
  claimed as (
    update conversations c
    set follow_up_count = c.follow_up_count + 1, last_follow_up_at = now()
    from due d
    where c.id = d.id
    returning c.id, c.user_id, c.character_id, c.follow_up_count - 1, d.idle_since_at_claim, c.last_message_sender_role
  )
  select * from claimed;
end;
$$;

revoke all on function claim_character_follow_ups(int) from public, anon, authenticated;
grant execute on function claim_character_follow_ups(int) to service_role;
