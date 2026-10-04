# CLAUDE.md — AiKano プロジェクト作業ガイド

## ホスティング構成（最重要）

**Vercel は使っていない。** VPS (Vultr) + GitHub Actions でホスティングしている。

| 要素 | 内容 |
|------|------|
| 本番サーバー | Vultr VPS（Cloudflare経由） |
| アプリ | Docker コンテナ、ポート `localhost:3001` で稼働 |
| デプロイ | `main` push → GitHub Actions → GHCR に Docker build → Vultr で pull & restart |
| イメージ | `ghcr.io/ryujiro730/aikano` |
| ワークフロー | `.github/workflows/deploy.yml` |
| 本番URL | `https://aikano.chat` |
| Cron | VPS の `crontab` で管理（`* * * * *` = 1分間隔）、`deploy.yml` で設定・上書き |
| DB | Supabase Cloud (`ojvqsxyqdwmficqicqmy.supabase.co`) |
| ローカル開発 | 別VPS (49.98.0.210) で `next dev --turbo` ポート3000 |

**vercel.json があっても使用していない。**

---

## 設計方針（重要）

### フロントに計算させない

**ブラウザ（React）は表示だけ。計算・集計・フィルタはサーバーかDBに任せる。**

```
ブラウザ     → クリック・入力・表示のみ
Next.js SC  → データ取得・整形（Server Component）
Supabase RPC → 集計・計算・複雑なフィルタ（SQL/PostgreSQL）
```

- JS で `filter()` `reduce()` して集計するのは禁止
- DB で GROUP BY・SUM できるならそちらに移す
- 例：analytics は `get_analytics_stats` RPC で全集計をDB側に寄せた

### Server Component を優先する

- `'use client'` はリアルタイム操作が必要な箇所のみ（チャット送信ボタン等）
- データ取得・表示ロジックは Server Component に置く
- クライアント側の状態管理は最小限に

---

## 作業前の必須確認事項

### 1. コードを修正する前に必ず全体を把握する

- 修正対象のファイルだけ読んで直すのは禁止
- 関連するファイル（APIルート・UIコンポーネント・ライブラリ・型定義・ワークフロー）を全て確認してから手を付ける
- `grep` や `glob` で使用箇所を網羅的に探す

### 2. 修正後は動作確認まで行う

- コードを直して「終わり」にしない
- ローカル（`http://localhost:3000`）で実際にAPIを叩いてレスポンスを確認する
- DBの状態（Supabaseへの直接クエリ）も確認する
- 本番（`https://aikano.chat`）との差分を把握する

### 3. 本番と開発の区別を常に意識する

- ローカルの変更は本番に自動反映されない
- 本番反映には `main` push → GitHub Actions 完了が必要
- cronの設定変更はワークフロー（`deploy.yml`）を直さないとデプロイのたびに上書きされる

---

## よくあるミスと禁止事項

### ❌ Vercel関連の言及
- Vercel cron、Vercel関数、Vercelダッシュボードへの言及は不要

### ❌ 調べずに決めつける
- 「おそらく〜だと思います」で修正しない
- ホスティング方法・Cron設定・DB構成は必ずコードとファイルを確認してから話す

### ❌ 関連ファイルを見ずに1ファイルだけ直す
- 例：`auto-broadcast.ts` を直すなら、cronルート・UIコンポーネント・ワークフロー・DBログも全部確認する

### ❌ git commit/push を無断で行う
- 明示的に指示されるまで commit も push もしない

---

## デバッグの進め方

1. **ローカルで再現確認** → `http://localhost:3000/api/...` を直接叩く
2. **DBを直接確認** → Supabase REST API（service role key）で状態確認
3. **本番確認** → `https://aikano.chat/api/...` を叩いてローカルと比較
4. **ログ確認** → 本番ログは VPS の `/var/log/humanchat-cron.log` 等
5. **仮説を立てて検証** → 推測で直さず、必ず原因を特定してから修正

---

## Supabase JS SDK の既知の注意点

- `!inner` ネストジョインを使うクエリは `.limit(N)` を必ず付ける（付けないと空配列を返すバグあり）
- service role key は `SUPABASE_SERVICE_ROLE_KEY` 環境変数から取得
- `NOT IN` は NULL を除外するため `.not('col', 'in', '...')` は `.or('col.is.null,col.not.in.(...)')` に置き換える
- デフォルトの行上限は1000件。大量データを扱うクエリには必ず `.limit()` を明示する（上限なしで ASC ソートすると最新データが切り捨てられる）
- RPC に UUID[] を渡すと型ミスマッチになる。JS からは TEXT[] として渡し、SQL 側で `::text` キャストで比較する

---

## 管理画面（AI返信前提で簡素化）

- メニュー: 概要 / ユーザー / 会話 / キャラ管理 / 集計 / 銀行振込 / お問い合わせ / 動画販売 / アイテム / キャンペーン / 自動同報 / プロモ申請（人手返信用の受信トレイ・モニター・オペグラ・個別送信・通報はメニューから外した。ページ自体は残っている）
- 管理APIの認可は `requireAdmin()`（`lib/admin-auth.ts`）。集計は DB 関数 `admin_user_stats` / `admin_conversation_list` / `admin_overview`（066〜068、service_role のみ）
- `lib/supabase/server.ts` の `createAdminClient()` は純粋な service role（以前は cookie 付きでユーザー権限になっていたのを修正）。ユーザーの特定は必ず `getAuthUser()` で行い、本人のデータに絞る条件を書くこと
- ユーザー一覧は `search_admin_users`、行動タイムラインは `admin_user_timeline`（行動ログ＋メッセージ＋ポイント取引＋ログインを合成）。どちらもページング対応（069）
- 自動同報の予約は `schedule_auto_broadcasts()`、送信対象の取り出しは `claim_auto_broadcast_logs(300)`（070）。JS で全ユーザーを取得しない（PostgREST 上限1000件で漏れるため）
- アクションログ: 課金・送信などの確定イベントはサーバーで `logUserAction()`（`lib/user-action-log.ts`）、画面閲覧はクライアントで `logAction()`。表示は `components/admin/ActionLogTimeline.tsx`（残高の増減付き）
- キャラ管理の「テスト会話」で、保存前の設定と好感度レベルを指定してAIの返事を試せる（`/api/admin/character-test`）

## 未読数・バッジ

- 未読数の定義は DB 関数 `get_conversation_unread` / `get_badge_counts`（063）に一本化。メッセージ一覧・フッター・ホームが同じ条件（直近15日・ブロック除外）を使う
- チャット画面ではキャラ発言を受信した時点で既読化し、`notifyBadgesChanged()`（`lib/badge-events.ts`）でフッターを即更新
- サポート返信の既読は `profiles.support_last_read_at`（サポート画面を開くと更新）

## ユーザー画面デザイン

- 色・角丸は `globals.css` の `.user-layout` トークンで管理（インク×ローズ1色、`--radius-card: 12px`）。色の直書き・絵文字アイコンは使わない
- 好感度レベルのアイコンは `components/AffectionIcon.tsx`（lucide）

## Next.js キャッシュの注意点

- 管理画面ナビ（`AdminNav`）の `<Link>` は `prefetch={false}` 済み。データが古くなる問題を防ぐため
- `force-dynamic` ページでもルーターキャッシュが効いてしまうことがある（Next.js 14.2 の挙動）
- 集計ページなど常に最新データが必要なページには `<RefreshOnMount />` パターンを使う
  ```tsx
  // app/admin/analytics/RefreshOnMount.tsx
  'use client'
  export function RefreshOnMount() {
    const router = useRouter()
    useEffect(() => { router.refresh() }, [])
    return null
  }
  ```

---

## ポイント・課金システム

**課金導線**: ポイント購入は `PointPackageList`（購入ダイアログと /payment#points で共用）→ `/api/stripe/checkout`（packageId のみ受け取り、価格・付与pt・キャンペーン倍率はサーバーで決定）→ webhook で付与。キャンペーン判定は `lib/campaigns.ts`、付与pt計算は `lib/point-packages.ts` を表示とサーバーで共用。

**書き込み権限**: profiles・point_transactions・user_items・動画購入はブラウザから書けない（065）。必ず service role のサーバーAPI経由で書く

| 項目 | 値 |
|------|-----|
| 登録ボーナス | 50pt（5通分。残高が次の1通に足りなくなった時点で購入ダイアログ表示）（`type: 'registration_bonus'`） |
| 送信コスト | 非会員10pt/通。サブスク会員は月間上限まで無料、超過後5pt/通（`plans.ts` の overage_points） |
| 紹介ボーナス | 100pt（紹介者・被紹介者双方、`type: 'referral_bonus'`） |
| ログインボーナス | 毎日20pt、課金有無に関係なく全員（`bonus_points` カラム、30日有効） |

**ポイント消費タイミング**: ユーザーが**送信するとき**にチェック・消費。AI返信はポイント残高に関係なく必ず返す。

`point_transactions.type` の有効値:
- `'purchase'` = 実際に課金した取引のみ（これだけが集計の「課金額」に使われる）
- `'spend'` = ポイント消費
- `'login_bonus'` = ログインボーナス
- `'registration_bonus'` = 新規登録ボーナス
- `'referral_bonus'` = 友達紹介ボーナス
- `'admin_adjust'` = 管理者手動調整
- `'subscription_bonus'` = サブスク会員の毎月ボーナス

## サブスク会員特典（plans.ts で定義）

- 毎月ボーナスpt（standard 300 / premium 1000）: `grant_subscription_bonus` RPC で period_key ごとに1回だけ付与（webhook のカード初回・毎月更新・コンビニパス、銀行振込承認の4経路から呼ぶ）
- 好感度倍率（standard ×2 / premium ×3）: 好感度は `ai-reply` 内でサーバー加算（クライアントから加算する API は廃止）
- 会員限定フォト: `character_photos.members_only`。非会員には URL を返さない（`lib/character-photos.ts`）。RLS でも直読み不可
- 会員判定は `getActivePlan(profile)`（期限切れパスは非会員扱い）

---

## 集計システム（analytics）

- `get_analytics_stats(p_from_iso, p_to_iso, p_period, p_exclude_ids)` RPC で全集計をDB側に寄せている
- `p_period`: `'hourly'` | `'daily'` | `'monthly'`
- `p_exclude_ids`: TEXT[]（UUID[]ではない）
- 返却: バケット別の revenue, points_spent, payer_count, registration_count, login_count 等
- JST 変換は SQL 内で `AT TIME ZONE 'Asia/Tokyo'` で処理
- ログインカウントは `login_events` テーブルで蓄積（`last_login_at` は上書きされるため）

---

## UTM / 流入元トラッキング

- LP → `onboarding` へ UTM params と `ref` をクエリパラメータで渡す
- `register/page.tsx` の useEffect で sessionStorage に保存
- `UtmCapture` コンポーネント（root layout に配置）が localStorage にも保存（30日TTL）
- gclid は localStorage に90日保持（`getStoredGclid()` でアクセス）
- `complete()` は URL → sessionStorage → localStorage → user_metadata の順で参照
- profiles に `referral_source`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`, `fbclid`, `gclid` を保存
- `signUp()` の metadata に UTM を渡す（メール確認を別ブラウザで開いた場合のフォールバック）

---

## 自動同報システム

- `auto_broadcast_sequences`: シーケンス定義（キャラ・トリガー・ターゲット・ラベル条件）
- `auto_broadcast_steps`: 各ステップ（delay_minutes・メッセージ・画像）
- `auto_broadcast_logs`: 送信ログ（pending → processing → sent/failed/cancelled）
- cron が1分おきに `processAutoBroadcast()` を実行
- `trigger: 'registration'` = ユーザー登録日時 + delay_minutes で送信時刻を計算

---

## LLMサービス

- 環境変数 `LLM_PROVIDER` で切り替え（`'claude'`（デフォルト）| `'openai'`）。本番は `openai`
- モデル: `OPENAI_MODEL`（GitHub Secret、現在 `gpt-6-luna`）、記憶抽出は `OPENAI_MEMORY_MODEL`（未設定時 `gpt-6-luna`）。サブスクは `plans.ts` の model（standard=gpt-6-luna / premium=gpt-6-sol）
- 共通会話ルール `BASE_CONVERSATION_RULES`（llm-service.ts）はキャラ個別 system_prompt の有無に関わらず常に入る
- 好感度レベル（1〜7）を ai-reply から渡し、`RELATIONSHIP_STAGES`（llm-service.ts）で距離感を変える。口調はキャラ設定を維持し、心の距離だけ変わる
- ユーザーメッセージは `/api/chat/send-message`（ポイント消費＋保存）経由のみ。ブラウザからの直接INSERTは 062 のトリガーで禁止
- OpenAI の場合のみ `user_character_memories` でメモリを管理
- キャラクターごとに `system_prompt` を設定（管理画面 → キャラ管理 → 鉛筆アイコン）

---

## プロジェクト構成

```
src/
  app/
    (user)/          # ユーザー向けページ
      chat/          # チャット画面（メイン機能）
      characters/    # キャラ一覧・詳細
      conversations/ # 会話一覧
      payment/       # 決済
      points/        # ポイント履歴
      settings/      # 設定（SNSシェアで枠解放含む）
      shop/          # ショップ
      support/       # サポート
      videos/        # 動画
    admin/           # 管理画面
      analytics/     # 集計（get_analytics_stats RPC使用）
      auto-broadcast-schedule/ # 自動同報管理
      campaigns/     # キャンペーン管理
      characters/    # キャラ管理（system_prompt設定）
      conversations/ # やり取り検索・受信トレイ
      individual/    # 個別送信（ユーザー検索→メッセージ送信）
      items/         # アイテム管理
      kpi/           # KPI
      labels/        # ラベル管理
      monitor/       # リアルタイムモニター
      opegra/        # オペグラ（写真・動画管理）
      reports/       # 通報管理
      training/      # AI学習データ
      users/         # ユーザー管理・詳細
      videos/        # 動画販売管理
    api/
      cron/          # cronエンドポイント（auto-broadcast, broadcast, bulk-send）
      admin/         # 管理系API（staff-reply, individual-send, adjust-points等）
      chat/          # チャット系API（ai-reply, add-affection等）
      auth/          # 認証系
      onboarding/    # オンボーディング完了API
      share/         # SNSシェアで枠解放
    auth/            # 認証ページ（login, register, callback）
    lp/              # ランディングページ
    onboarding/      # オンボーディング
  lib/
    auto-broadcast.ts       # 自動同報ロジック
    broadcast.ts            # 同報ロジック
    llm-service.ts          # LLM（Claude/OpenAI）
    affection.ts            # 友好度レベル定義・計算
    plans.ts                # サブスクプラン定義
    message-variables.ts    # メッセージ変数（{name}等）
    internal-accounts.ts    # 除外アカウント定義
    gtag.ts                 # Google Analytics
    supabase/               # Supabaseクライアント
  components/
    admin/                  # 管理画面コンポーネント
    AffectionMeter.tsx      # 友好度ゲージ
    UtmCapture.tsx          # UTMパラメータ捕捉
    PointsShortageDialog.tsx # ポイント不足ダイアログ
.github/workflows/deploy.yml  # デプロイ＆cron設定
supabase/migrations/          # マイグレーション（070まで適用済み）
```

---

## DB マイグレーション運用

- ファイルは `supabase/migrations/NNN_name.sql` の連番
- **デプロイしても自動適用されない** — Supabase の SQL Editor で手動実行が必要
- 現在未適用の可能性があるもの: `058`（analytics RPC）、`059`〜`061`（UTM・集計バグ修正・シェア）
