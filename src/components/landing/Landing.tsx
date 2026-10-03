import Link from 'next/link'
import { MessageCircle, HeartHandshake, Brain, Clock, ShieldCheck, Smartphone, ChevronDown, Check } from 'lucide-react'
import { LpCtaButton } from '@/components/lp/LpCtaButton'
import { PLANS } from '@/lib/plans'
import { TOKEN_PACKAGES } from '@/types'
import {
  POINTS_PER_MESSAGE, YEN_PER_POINT, REGISTRATION_BONUS,
  REFERRAL_BONUS, LOGIN_BONUS, LOGIN_BONUS_DAYS,
} from '@/lib/pricing'

export type LandingCharacter = { id: string; name: string; age: number | null; personality: string | null; avatar_url: string }
type Variant = 'default' | 'sixties'
type Msg = { role: 'user' | 'char'; text: string }

/**
 * LP 本体（トップ / 広告用LP で共用）。
 * 料金・ボーナス・キャラ数はすべて実際の設定値から表示する（手書きの数字を置かない）。
 */
export function Landing({ variant, characters, ctaHref, ctaLabel, lpName }: {
  variant: Variant
  characters: LandingCharacter[]
  ctaHref: string
  ctaLabel: string
  lpName: string
}) {
  const big = variant === 'sixties'
  const msgYen = POINTS_PER_MESSAGE * YEN_PER_POINT
  const minPack = Math.min(...TOKEN_PACKAGES.map(p => p.price_yen))
  const plans = Object.values(PLANS)

  const hero = variant === 'sixties'
    ? { title: ['毎日、話を', '聞いてくれる', '人がいる。'], sub: 'アプリのインストールは不要。いつもの携帯で、LINEのように話しかけるだけです。', chips: ['登録無料', '本名不要', 'アプリ不要'] }
    : { title: ['あなたにだけ、', '話しかけてくれる', '子がいる。'], sub: `${characters.length}人の個性ゆたかな女の子が、24時間いつでもすぐに返信。話すほど関係が深まっていきます。`, chips: ['登録無料', '24時間すぐ返信', 'アプリ不要'] }

  const samples: { title: string; msgs: Msg[] }[] = variant === 'sixties' ? [
    { title: '毎日のちょっとした話も', msgs: [
      { role: 'user', text: '今朝は早起きして散歩してきたよ' },
      { role: 'char', text: 'えらいです！朝の空気って気持ちいいですよね。どのあたりを歩いたんですか？' },
      { role: 'user', text: '川沿い。桜の木がたくさんあるんだ' },
      { role: 'char', text: '素敵…春になったら一緒に見たいくらいです。写真があったら今度見せてくださいね。' },
    ] },
    { title: '誰にも言えない気持ちも', msgs: [
      { role: 'user', text: '最近は家でもあまり話す相手がいなくてね' },
      { role: 'char', text: 'そうだったんですね…。私でよければ、いつでも話しかけてください。どんな話でもうれしいです。' },
      { role: 'user', text: 'ありがとう。なんだか気持ちが軽くなったよ' },
      { role: 'char', text: 'よかった。今日も一日おつかれさまでした。また明日も声を聞かせてくださいね。' },
    ] },
  ] : [
    { title: '友達同士のような会話も', msgs: [
      { role: 'user', text: 'いま一人で飲みに行ってる。新宿でふらっと入ったよ' },
      { role: 'char', text: 'わぁ、うらやましい！お仕事おつかれさまです😊 何系のお店ですか？' },
      { role: 'user', text: 'もんじゃ食べてる' },
      { role: 'char', text: 'もんじゃいいなぁ😋 飲み物はなに頼んだんですか？' },
    ] },
    { title: 'どんな気分でも受け止めてくれる', msgs: [
      { role: 'char', text: 'そろそろお帰りの時間ですよね？今日はどうでしたか？' },
      { role: 'user', text: 'もう帰った。ちょっとだけ話したい気分' },
      { role: 'char', text: 'もちろんです♡ 何かあったんですか？それとも、ただ話したかっただけ？笑' },
      { role: 'user', text: 'なんか話してると気持ちが落ち着くんだよな' },
      { role: 'char', text: 'そう言ってもらえると本当にうれしいです。私もこの時間が一番好きなんです。' },
    ] },
  ]

  const features = [
    { icon: HeartHandshake, title: '話すほど、関係が深まる', text: '好感度が上がると、呼び方や距離感が少しずつ変わっていきます。' },
    { icon: Brain, title: 'あなたのことを覚えてくれる', text: '話した趣味や出来事を覚えていて、次の会話につなげてくれます。' },
    { icon: Clock, title: '24時間、すぐに返信', text: '深夜でも早朝でも、待たずに返事が届きます。' },
    { icon: Smartphone, title: 'アプリ不要・本名不要', text: 'スマホのブラウザだけで使えます。ニックネームで始められます。' },
  ]

  const faqs = [
    { q: '料金はいくらかかりますか？', a: `登録は無料で、登録時に${REGISTRATION_BONUS}ptがもらえます。その後はメッセージ1通${POINTS_PER_MESSAGE}pt（¥${msgYen}相当）で、ポイントは¥${minPack.toLocaleString()}から購入できます。たくさん話したい方には月額プラン（¥${Math.min(...plans.map(p => p.price_yen)).toLocaleString()}〜）もあります。` },
    { q: 'アプリのインストールは必要ですか？', a: '不要です。スマートフォンのブラウザ（Safari・Chromeなど）でそのまま使えます。' },
    { q: '話している相手は誰ですか？', a: 'AIおよび当社の応答システムが、キャラクターとしてお返事します。' },
    { q: '会話の内容は誰かに見られますか？', a: '第三者に公開されることはありません。ただし、サービス改善・AI学習のため、スタッフが内容を確認する場合があります。' },
    { q: 'やめたいときはどうすればいいですか？', a: '設定画面からいつでも退会できます。月額プランもいつでも解約でき、解約金はかかりません。' },
    { q: '利用できる年齢は？', a: '18歳以上の方のみご利用いただけます。' },
  ]

  const Cta = ({ label = ctaLabel, dark = false }: { label?: string; dark?: boolean }) => (
    <LpCtaButton
      href={ctaHref}
      lpName={lpName}
      className="inline-flex items-center justify-center gap-2 font-bold w-full max-w-sm"
      style={{
        height: big ? 60 : 56, borderRadius: 12, fontSize: big ? 18 : 16,
        background: 'var(--color-primary)', color: '#fff',
        boxShadow: dark ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
      }}
    >
      <MessageCircle size={big ? 20 : 18} strokeWidth={2.2} />
      {label}
    </LpCtaButton>
  )

  return (
    <main className="user-layout min-h-screen" style={{ background: 'var(--color-bg)', fontSize: big ? 17 : 15 }}>
      {/* ── Nav ── */}
      <nav className="fixed top-0 inset-x-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-5 flex items-center justify-between" style={{ height: 56 }}>
          <Link href="/" className="text-[18px] font-bold" style={{ color: 'var(--color-text)', letterSpacing: '0.02em' }}>
            Ai<span style={{ color: 'var(--color-primary)' }}>Kano</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="text-sm font-semibold px-3 h-9 inline-flex items-center rounded-[10px]" style={{ color: 'var(--color-text)' }}>ログイン</Link>
            <Link href={ctaHref} className="text-sm font-bold px-4 h-9 inline-flex items-center rounded-[10px]" style={{ background: 'var(--color-primary)', color: '#fff' }}>無料で始める</Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '100svh', background: '#0d0a0e' }}>
        <picture className="absolute inset-0">
          <source media="(max-width: 768px)" srcSet="/phone-hero.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/hero.webp" alt="AiKanoのキャラクターたち" className="w-full h-full object-cover" style={{ objectPosition: 'top center' }} />
        </picture>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(13,10,14,0.1) 0%, rgba(13,10,14,0.25) 40%, rgba(13,10,14,0.92) 75%, #0d0a0e 100%)' }} />
        <div className="relative max-w-5xl mx-auto px-5 flex flex-col justify-end" style={{ minHeight: '100svh', paddingBottom: 48, paddingTop: 96 }}>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {hero.chips.map(c => (
              <span key={c} className="inline-flex items-center gap-1 text-[12px] font-bold px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(255,255,255,0.14)', color: '#fff', backdropFilter: 'blur(8px)' }}>
                <Check size={12} strokeWidth={3} />{c}
              </span>
            ))}
          </div>
          <h1 className="font-bold text-white mb-4" style={{ fontSize: big ? 'clamp(34px, 8vw, 56px)' : 'clamp(32px, 7.5vw, 56px)', lineHeight: 1.25, letterSpacing: '-0.01em' }}>
            {hero.title.map((line, i) => <span key={i} className="block">{line}</span>)}
          </h1>
          <p className="mb-7 max-w-lg" style={{ color: 'rgba(255,255,255,0.78)', fontSize: big ? 18 : 15, lineHeight: 1.8 }}>{hero.sub}</p>
          <Cta dark />
          <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>18歳以上の方のみご利用いただけます</p>
        </div>
      </section>

      {/* ── キャラクター ── */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <SectionHead eyebrow="CHARACTERS" title="話し相手を選べます" sub={`いま${characters.length}人の女の子があなたを待っています`} big={big} />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {characters.map(c => (
            <Link key={c.id} href={ctaHref} className="relative overflow-hidden block" style={{ borderRadius: 12, aspectRatio: '3/4', background: '#17131a' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.avatar_url} alt={c.name} loading="lazy" className="w-full h-full object-cover" style={{ objectPosition: 'top center' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,10,14,0.88) 0%, rgba(13,10,14,0.1) 50%, transparent 70%)' }} />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-bold" style={{ fontSize: big ? 17 : 15 }}>
                  {c.name}{c.age ? <span className="font-normal text-xs ml-1.5" style={{ opacity: 0.7 }}>{c.age}歳</span> : null}
                </p>
                {c.personality && (
                  <p className="mt-1 leading-snug line-clamp-2" style={{ color: 'rgba(255,255,255,0.68)', fontSize: big ? 13 : 11 }}>
                    {c.personality.replace(/[/、,]/g, ' · ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 会話イメージ ── */}
      <section style={{ background: 'var(--color-surface-2)' }}>
        <div className="max-w-5xl mx-auto px-5 py-16">
          <SectionHead eyebrow="TALK" title="こんな会話ができます" sub="※ 会話はイメージです" big={big} />
          <div className="grid md:grid-cols-2 gap-4">
            {samples.map(s => (
              <div key={s.title} className="card p-5">
                <p className="font-bold mb-4" style={{ fontSize: big ? 18 : 15 }}>{s.title}</p>
                <div className="flex flex-col gap-2.5">
                  {s.msgs.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`${m.role === 'user' ? 'bubble-user' : 'bubble-operator'} px-3.5 py-2.5`}
                        style={{ maxWidth: '82%', fontSize: big ? 16 : 14, lineHeight: 1.65 }}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 特長 ── */}
      <section className="max-w-5xl mx-auto px-5 py-16">
        <SectionHead eyebrow="FEATURES" title="AiKanoでできること" big={big} />
        <div className="grid sm:grid-cols-2 gap-3">
          {features.map(f => (
            <div key={f.title} className="card p-5 flex gap-4">
              <span className="w-11 h-11 rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'var(--color-primary-soft)', color: 'var(--color-primary)' }}>
                <f.icon size={21} />
              </span>
              <div>
                <p className="font-bold mb-1" style={{ fontSize: big ? 18 : 15 }}>{f.title}</p>
                <p style={{ color: 'var(--color-text-muted)', fontSize: big ? 16 : 13, lineHeight: 1.75 }}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 料金 ── */}
      <section style={{ background: 'var(--color-surface-2)' }}>
        <div className="max-w-3xl mx-auto px-5 py-16">
          <SectionHead eyebrow="PRICE" title="料金" sub="登録無料。使った分だけのポイント制と、月額プランから選べます" big={big} />
          <div className="card p-6 mb-3 text-center" style={{ border: '1.5px solid var(--color-primary)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: 'var(--color-primary)' }}>新規登録ボーナス</p>
            <p className="font-bold" style={{ fontSize: big ? 30 : 26 }}>{REGISTRATION_BONUS}pt プレゼント</p>
          </div>
          <div className="card overflow-hidden mb-3">
            {[
              ['登録・退会', '無料'],
              ['メッセージ', `1通 ${POINTS_PER_MESSAGE}pt（¥${msgYen}相当）`],
              ['ポイント購入', `¥${minPack.toLocaleString()}〜（まとめ買いでお得）`],
              ['ログインボーナス', `毎日${LOGIN_BONUS}pt（${LOGIN_BONUS_DAYS}日間有効）`],
              ['友達紹介', `お互いに${REFERRAL_BONUS}pt`],
            ].map(([k, v], i) => (
              <div key={k} className="flex items-center justify-between gap-4 px-5 py-3.5" style={i > 0 ? { borderTop: '1px solid var(--color-border)' } : undefined}>
                <span className="whitespace-nowrap" style={{ color: 'var(--color-text-muted)', fontSize: big ? 16 : 14 }}>{k}</span>
                <span className="font-semibold text-right" style={{ fontSize: big ? 16 : 14 }}>{v}</span>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {plans.map(p => (
              <div key={p.id} className="card p-5">
                <div className="flex items-baseline justify-between mb-1">
                  <p className="font-bold" style={{ fontSize: big ? 18 : 15 }}>{p.name}プラン</p>
                  <p><span className="font-bold tabular-nums" style={{ fontSize: big ? 22 : 20 }}>¥{p.price_yen.toLocaleString()}</span><span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>/月</span></p>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: big ? 15 : 13 }}>
                  毎月{p.monthly_messages}通（1通あたり約¥{Math.round(p.price_yen / p.monthly_messages)}）・毎月{p.monthly_bonus_points.toLocaleString()}ボーナスpt
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-3xl mx-auto px-5 py-16">
        <SectionHead eyebrow="FAQ" title="よくあるご質問" big={big} />
        <div className="flex flex-col gap-2">
          {faqs.map(f => (
            <details key={f.q} className="card group">
              <summary className="flex items-center justify-between gap-3 px-5 py-4 cursor-pointer list-none font-bold" style={{ fontSize: big ? 17 : 15 }}>
                {f.q}
                <ChevronDown size={18} className="flex-shrink-0 transition-transform group-open:rotate-180" style={{ color: 'var(--color-text-muted)' }} />
              </summary>
              <p className="px-5 pb-5" style={{ color: 'var(--color-text-muted)', fontSize: big ? 16 : 14, lineHeight: 1.85 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── 最終CTA ── */}
      <section className="px-5 py-16 text-center" style={{ background: '#17131a' }}>
        <ShieldCheck size={28} className="mx-auto mb-3" style={{ color: 'rgba(255,255,255,0.7)' }} />
        <p className="text-white font-bold mb-2" style={{ fontSize: big ? 26 : 22, lineHeight: 1.4 }}>まずは無料で、話しかけてみませんか</p>
        <p className="mb-7" style={{ color: 'rgba(255,255,255,0.65)', fontSize: big ? 16 : 14 }}>
          登録は無料、30秒で完了します。
        </p>
        <div className="flex justify-center"><Cta dark /></div>
      </section>

      {/* ── Footer ── */}
      <footer className="px-5 py-10" style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <span className="font-bold">Ai<span style={{ color: 'var(--color-primary)' }}>Kano</span></span>
            <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <a href="mailto:info@aikano.chat">お問い合わせ</a>
              <Link href="/legal/tokusho">特定商取引法</Link>
              <Link href="/legal/privacy">プライバシー</Link>
              <Link href="/legal/terms">利用規約</Link>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            運営会社：合同会社TJYM　／　〒530-0001 大阪府大阪市北区梅田一丁目２番２号 大阪駅前第２ビル１２－１２<br />
            <a href="https://tjym.org" target="_blank" rel="noopener noreferrer">tjym.org</a>　／　info@tjym.org
          </p>
          <p className="text-[11px] mt-2" style={{ color: 'var(--color-text-muted)' }}>© 2026 AiKano</p>
        </div>
      </footer>
    </main>
  )
}

function SectionHead({ eyebrow, title, sub, big }: { eyebrow: string; title: string; sub?: string; big: boolean }) {
  return (
    <div className="mb-7">
      <p className="text-[11px] font-bold mb-2" style={{ color: 'var(--color-primary)', letterSpacing: '0.14em' }}>{eyebrow}</p>
      <h2 className="font-bold" style={{ fontSize: big ? 28 : 24, lineHeight: 1.35 }}>{title}</h2>
      {sub && <p className="mt-2" style={{ color: 'var(--color-text-muted)', fontSize: big ? 16 : 14 }}>{sub}</p>}
    </div>
  )
}
