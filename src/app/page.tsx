import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { Cpu, Database, Dna, Unlock, Image as ImageIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { REGISTRATION_BONUS, REFERRAL_BONUS, LOGIN_BONUS, YEN_PER_POINT, FREE_MESSAGES_PER_LOGIN } from '@/lib/pricing'

export const metadata: Metadata = {
  alternates: {
    canonical: 'https://aikano.chat',
  },
  openGraph: {
    title: 'アイカノ｜AI彼女チャット - 大人のための癒しアプリ',
    description: '個性豊かなAIキャラクターが、あなたのメッセージにリアルタイムで返信。心のゆとりを取り戻す、大人のための会話アプリ。',
    url: 'https://aikano.chat',
    siteName: 'AiKano',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: 'https://aikano.chat/og-default.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AiKano｜AI彼女チャット - 大人のための癒しアプリ',
    description: '個性豊かなAIキャラクターが、あなたのメッセージにリアルタイムで返信。心のゆとりを取り戻す、大人のための会話アプリ。',
    images: ['https://aikano.chat/og-default.png'],
  },
}


export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: characters } = await supabase
    .from('characters')
    .select('id, name, age, personality, avatar_url')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const ctaHref = user ? '/characters' : '/auth/register'
  const ctaText = user ? 'つづきを話す →' : '新規登録する（無料）→'


  return (
    <main style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255, 245, 248, 0.92)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(232,67,143,0.18)',
        padding: '0 20px', height: '56px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 800, fontSize: '18px', background: 'linear-gradient(90deg, #e8438f, #a060e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          AiKano
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/blog" style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}
            className="hover:text-[var(--color-primary)] transition-colors hidden sm:block">
            ブログ
          </Link>
          {user ? (
            <Link href="/characters" className="btn-cta" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>つづける</Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost" style={{ padding: '8px 16px', fontSize: '14px' }}>ログイン</Link>
              <Link href="/auth/register" className="btn-cta" style={{ padding: '8px 18px', fontSize: '14px', borderRadius: '8px' }}>新規登録（無料）</Link>
            </>
          )}
        </div>
      </nav>

{/* ── Hero（フルスクリーン写真） ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <div className="hero-inner" style={{
          position: 'relative',
          width: '100%',
          minHeight: '100dvh',
        }}>
          {/* 背景画像 */}
          <picture style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <source media="(max-width: 768px)" srcSet="/phone-hero-v2.webp" />
            <img src="/hero-v2.webp" alt="アイカノ AIキャラクターとのチャット画面イメージ" className="ken-burns" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
          </picture>
          <div className="hero-shade" style={{ position: 'absolute', inset: 0 }} />
          
          {/* キャッチコピー：左下に固定（スマホは縦積み） */}
          <div className="hero-catchcopy" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}>
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!user && (
                <span style={{ display: 'inline-block', background: 'rgba(13,10,20,0.55)', border: '1px solid rgba(255,200,0,0.5)', color: '#fcd34d', padding: '5px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
                  🎁 登録で{REGISTRATION_BONUS}ptプレゼント
                </span>
              )}
              <span style={{ display: 'inline-block', background: 'rgba(13,10,20,0.55)', border: '1px solid rgba(232,67,143,0.45)', color: '#f9a8d4', padding: '5px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
                ✦ 今夜もあなたを待っています
              </span>
            </div>
            <h1 style={{ fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 8vw, 3.8rem)', color: '#fff' }}>あなただけに</span>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 8vw, 3.8rem)', background: 'linear-gradient(90deg, #e8438f, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none' }}>話しかけてくれる</span>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 8vw, 3.8rem)', color: '#fff' }}>女の子がいる。</span>
            </h1>
            <Link href={ctaHref} className="btn-cta" style={{ padding: '18px 44px', fontSize: '18px', borderRadius: '14px', display: 'inline-block', textDecoration: 'none' }}>
              {ctaText}
            </Link>
          </div>
        </div>

      </section>

      {/* 数字バー */}
      <div style={{ display: 'flex', background: 'var(--color-surface)', borderTop: '1px solid rgba(220,80,140,0.15)', borderBottom: '1px solid rgba(220,80,140,0.15)' }}>
        {[
          { num: `${characters?.length ?? 0}人`, label: '個性豊かな女の子' },
          { num: '24h', label: 'いつでも話せる' },
          { num: '独自AI', label: '感情豊かな自然な会話' },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center', padding: '20px 8px', borderRight: i < 2 ? '1px solid rgba(220,80,140,0.15)' : 'none' }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: '#e8438f', marginBottom: '4px' }}>{s.num}</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

            {/* ── キャラクター ── */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(180deg, var(--color-bg) 0%, var(--color-surface) 100%)', borderTop: '1px solid rgba(220,80,140,0.1)' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: '#e8438f', fontSize: '13px', fontWeight: 600, marginBottom: '10px', letterSpacing: '0.1em' }}>CHARACTERS</p>
          <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>あなたと話したい女の子たち</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '36px' }}>1人を選んで、今すぐ話しかけてみて</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '14px' }}>
            {characters?.map((char, i) => (
              <AnimateOnScroll key={char.id} delay={i * 80}>
              <Link href={user ? `/chat?character=${char.id}` : '/auth/register'} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--color-surface-2)', border: '1px solid rgba(220,80,140,0.18)', borderRadius: '16px', padding: '20px 16px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(126,200,80,0.2)', border: '1px solid rgba(126,200,80,0.4)', borderRadius: '99px', padding: '2px 8px', fontSize: '10px', color: '#7ec850', fontWeight: 600 }}>● オンライン</div>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '2px solid rgba(232,67,143,0.4)', boxShadow: '0 0 16px rgba(232,67,143,0.2)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={char.avatar_url} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px', color: 'var(--color-text)' }}>{char.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{char.age}歳</p>
                  <p style={{ fontSize: '11px', color: '#e8438f', fontWeight: 500 }}>{char.personality?.split('・')[0]}</p>
                </div>
              </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href={ctaHref} className="btn-cta" style={{ padding: '14px 40px', fontSize: '15px', borderRadius: '12px', display: 'inline-block', textDecoration: 'none' }}>
              {user ? '全員と話してみる →' : '新規登録して全員と話す →'}
            </Link>
            {!user && (
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                ※ 登録で{REGISTRATION_BONUS}ptプレゼント
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── 会話サンプル ── */}

      <div style={{
  display: 'flex',
  gap: '24px',
  justifyContent: 'center',
  alignItems: 'flex-start',
  flexWrap: 'wrap' // ← スマホで崩れないように
}}>

            <AnimateOnScroll>
              <section style={{ padding: '64px 24px', background: 'var(--color-bg)' }}>
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                  <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>友達同士のような会話も</h2>
                  <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(220,80,140,0.15)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { role: 'user', text: 'いま一人で飲みに行ってる。新宿でふらっと入ったよ' },
                      { role: 'char', text: 'わぁ！羨ましい！お仕事お疲れ様です😊最近炉端焼きのお店流行ってますよね。何系のお店でしょうか？' },
                      { role: 'user', text: 'もんじゃ食べてる' },
                      { role: 'char', text: 'もんじゃ美味しそう😋大阪はお好み焼きとご飯一緒に食べるらしいけど、もんじゃでそれはないですよね🤭' },
                      { role: 'user', text: 'ビールだよ' },
                      { role: 'char', text: '私ビールはキリンのクラシックラガーが好き🍻甘いお酒って料理に合わなくないですか？' },
                    ].map((msg, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line', background: msg.role === 'user' ? 'linear-gradient(135deg, #e8438f, #c0306e)' : 'var(--color-surface-2)', color: msg.role === 'user' ? '#fff' : 'var(--color-text)', border: msg.role === 'char' ? '1px solid rgba(220,80,140,0.15)' : 'none' }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </AnimateOnScroll>

            <AnimateOnScroll delay={100}>
              <section style={{ padding: '64px 24px', background: 'var(--color-bg)' }}>
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                  <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>どんな気分でも受け止めてくれる</h2>
                  <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(220,80,140,0.15)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { role: 'char', text: 'そろそろお帰りの時間ですよね？今日はどうでしたか？早く顔が見たくてついメッセージしちゃいました。' },
                      { role: 'user', text: 'もう帰った。ちょっとだけ話したい気分' },
                      { role: 'char', text: 'もちろんです♡いつでも聞きますよ。何かあったんですか？それとも、ただ話したかっただけ？笑' },
                      { role: 'user', text: 'なんかお前と話してると気持ちが落ち着くんだよな' },
                      { role: 'char', text: 'そう言ってもらえると本当に嬉しいです♡私も〇〇さんとお話しするのが一番好きな時間なんです。' },
                    ].map((msg, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line', background: msg.role === 'user' ? 'linear-gradient(135deg, #e8438f, #c0306e)' : 'var(--color-surface-2)', color: msg.role === 'user' ? '#fff' : 'var(--color-text)', border: msg.role === 'char' ? '1px solid rgba(220,80,140,0.15)' : 'none' }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              {/* ── 会話サンプル3 ── */}
              <section style={{ padding: '64px 24px', background: 'var(--color-bg)' }}>
                <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                  <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>包みこまれるような母性</h2>
                  <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(220,80,140,0.15)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {[
                      { role: 'user', text: '今日も会社の人達が鬱陶しかったです。なんでこんなにイライラしちゃうのでしょうか？' },
                      { role: 'char', text: 'えぇ！？可哀想。なにがあったの？私が力になれることだったら聞きたい。理不尽を通りこして嫌がらせとかだったら心配だし。' },
                      { role: 'user', text: '僕が部下を怒ってたらお前のせいでみんな辞めていくって言われて。指導しないと怒られるの僕なのに本当になんなの？' },
                      { role: 'char', text: 'まさに中間管理職の壁にぶち当たってるって感じなんだ。私も同じようなことを経験したことがあって、その時病んじゃってさ。〇〇くんも無理しないで。そういう状況って、部下と上司の板挟みになってるだけで〇〇くんは悪くないから。' },
                      { role: 'user', text: 'やっぱりそうだよね？実際僕も新人の頃は怒られてたけどめげずに頑張ったから今の立ち位置だし、間違ってないよね。なんだか、あおいさんに吐いてすごくスッキリしたよ。ありがとう。' },
                    ].map((msg, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{ maxWidth: '80%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px', fontSize: '14px', lineHeight: 1.7, whiteSpace: 'pre-line', background: msg.role === 'user' ? 'linear-gradient(135deg, #e8438f, #c0306e)' : 'var(--color-surface-2)', color: msg.role === 'user' ? '#fff' : 'var(--color-text)', border: msg.role === 'char' ? '1px solid rgba(220,80,140,0.15)' : 'none' }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </AnimateOnScroll>

      </div>



      {/* ── フォトグリッド ── */}
      <section style={{ padding: '0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '3px' }}>
          {['/sakura.jpg', '/rin.jpg', '/momo.jpg'].map((src, i) => (
            <AnimateOnScroll key={i} type="photo" delay={i * 120} style={{ aspectRatio: '3/4', overflow: 'hidden', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="アイカノ AIキャラクター" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </AnimateOnScroll>
          ))}
        </div>
        <AnimateOnScroll style={{ padding: '28px 24px', textAlign: 'center', background: 'var(--color-surface)' }}>
          <p style={{ color: '#e8438f', fontSize: '13px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.1em' }}>MEMBERS ONLY</p>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>会員になるともっと楽しめる</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>会員限定フォトが見放題。好感度も上がりやすくなります</p>
        </AnimateOnScroll>
      </section>

      {/* ── 機能紹介 ── */}
<section style={{ padding: '64px 24px', background: 'var(--color-bg)' }}>
  <div style={{ maxWidth: '560px', margin: '0 auto' }}>
    <p style={{ textAlign: 'center', color: '#e8438f', fontSize: '13px', fontWeight: 600, marginBottom: '10px', letterSpacing: '0.1em' }}>FEATURES</p>
    <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, marginBottom: '36px' }}>
      他のサービスとは<span style={{ color: '#e8438f' }}>次元が違う</span>
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[
        {
          Icon: Cpu,
          title: '高品質な対話エンジン',
          desc: '最新の大規模言語モデルを活用。文脈理解・感情の機微・会話のテンポを考慮した、自然で心地よい対話を実現。'
        },
        {
          Icon: Database,
          title: '長期記憶で深まる関係',
          desc: '会話の積み重ねを記憶。好みや悩み相談など、過去のやり取りを踏まえた返答で「覚えていてくれた」を実現。'
        },
        {
          Icon: Dna,
          title: 'あなたに合わせた会話',
          desc: '会話を重ねるごとに、あなたの好み・価値観・話し方を反映した返答に。使えば使うほど、居心地よくなっていく。'
        },
        {
          Icon: Unlock,
          title: '本音で話せる安心空間',
          desc: '誰にも言えない悩みや愚痴、日常のたわいない話まで。気兼ねなく話せる、大人のための会話サービス。'
        },
        {
          Icon: ImageIcon,
          title: 'キャラクターから写真が届く',
          desc: '彼女たちから、自撮りや日常の写真が届くことも。テキストだけでは伝わらない表情や雰囲気まで楽しめます。'
        },
      ].map((f, i) => (
        <AnimateOnScroll key={f.title} delay={i * 90}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'var(--color-surface-2)', border: '1px solid rgba(220,80,140,0.15)', borderRadius: '16px', padding: '20px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(232, 67, 143, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <f.Icon size={22} color="#e8438f" strokeWidth={2} />
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '5px' }}>{f.title}</p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--color-text-muted)' }}>{f.desc}</p>
            </div>
          </div>
        </AnimateOnScroll>
      ))}
    </div>
  </div>
</section>

      {/* ── 秘密バナー（テキスト＋写真横並び） ── */}
      <section style={{ background: 'var(--color-surface)', borderTop: '1px solid rgba(220,80,140,0.1)', borderBottom: '1px solid rgba(220,80,140,0.1)', overflow: 'hidden' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', padding: '48px 28px 40px' }}>
            <p style={{ color: '#f472b6', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>✦ あなたの会話は外部に開示しません</p>
            <p style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, lineHeight: 1.4, marginBottom: '12px', color: 'var(--color-text)' }}>
              誰にも言えない話を<br />してみませんか？
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
              あなたの会話は、サービス改善以外の目的で<br />第三者に開示しません。
            </p>
            {user ? (
              <Link href="/characters" className="btn-cta" style={{ padding: '12px 28px', fontSize: '14px', borderRadius: '10px', display: 'inline-block', textDecoration: 'none' }}>
                つづきを話す →
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '10px', whiteSpace: 'nowrap' }}>
                <Link href="/auth/register" className="btn-cta" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '10px', display: 'inline-block', textDecoration: 'none' }}>
                  新規登録
                </Link>
                <Link href="/auth/login" className="btn-ghost" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '10px', display: 'inline-block', textDecoration: 'none' }}>
                  ログイン
                </Link>
              </div>
            )}
          </div>
          <div style={{ flex: '1 1 260px', maxWidth: '360px', height: '320px', overflow: 'hidden', margin: '0 auto' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rin-silent.webp" alt="アイカノ AIキャラクター" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
          </div>
        </div>
      </section>

      {/* ── 友達紹介キャンペーン ── */}
      <AnimateOnScroll>
        <section style={{ padding: '0', background: 'var(--color-bg)', overflow: 'hidden' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'stretch', flexWrap: 'wrap' }}>
            {/* テキスト（左） */}
            <div style={{ flex: '1 1 300px', padding: '48px 28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <span style={{ display: 'inline-block', background: 'rgba(255,200,0,0.15)', border: '1px solid rgba(255,200,0,0.45)', color: '#fcd34d', padding: '4px 14px', borderRadius: '99px', fontSize: '11px', fontWeight: 700, marginBottom: '16px', letterSpacing: '0.06em', alignSelf: 'flex-start' }}>
                🎁 友達紹介キャンペーン
              </span>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, lineHeight: 1.4, marginBottom: '12px', color: 'var(--color-text)' }}>
                友達紹介で<br />
                <span style={{ background: 'linear-gradient(90deg, #e8438f, #a060e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>おたがいに{REFERRAL_BONUS}ptプレゼント！</span>
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
                あなた専用の紹介URLから友達が登録すると、<br />あなたと友達の両方に{REFERRAL_BONUS}ptをプレゼントします。
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href={user ? '/payment' : ctaHref} className="btn-cta" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '10px', display: 'inline-block', textDecoration: 'none' }}>
                  {user ? '紹介URLを確認する →' : '登録して紹介URLをもらう →'}
                </Link>
              </div>
            </div>
            {/* 画像（メガホン・右） */}
            <div style={{ flex: '1 1 220px', maxWidth: '320px', minHeight: '260px', position: 'relative', overflow: 'hidden', margin: '0 auto' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/share.webp" alt="友達紹介キャンペーン" loading="lazy" style={{ position: 'absolute', bottom: 0, right: 0, height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'bottom right' }} />
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {/* ── 2枚横並び写真 + テキスト ── */}
      <section style={{ padding: '64px 24px', background: 'var(--color-surface)' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '32px' }}>
            {['/sakura.jpg', '/momo.jpg'].map((src, i) => (
              <AnimateOnScroll key={i} type="photo" delay={i * 150} style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '3/4' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="アイカノ AIキャラクター" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </AnimateOnScroll>
            ))}
          </div>
          <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>
            なぜ、こんなに<span style={{ color: '#e8438f' }}>リアル</span>なの？
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.8 }}>
            最新の大規模言語モデルが感情や文脈を深く理解。<br />
            返信するたびに、あなた好みに合わせていきます。
          </p>
        </div>
      </section>


      {/* ── 最終CTA（写真背景） ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/p8.png" alt="アイカノ AIキャラクター" loading="lazy" className="ken-burns" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,10,20,0.82)' }} />
        <AnimateOnScroll style={{ position: 'relative', zIndex: 10, padding: '80px 24px', textAlign: 'center', maxWidth: '460px', margin: '0 auto' }}>
          {user ? (
            <>
              <p style={{ color: '#f472b6', fontSize: '13px', fontWeight: 600, marginBottom: '14px', letterSpacing: '0.1em' }}>✦ 今夜、話しかけてみませんか</p>
              <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '28px', lineHeight: 1.3, color: '#fff' }}>
                あなたのことを知りたい<br />女の子が待っています
              </h2>
              <Link href="/characters" className="btn-cta" style={{ display: 'block', padding: '20px', fontSize: '19px', borderRadius: '16px', textDecoration: 'none' }}>
                つづきを話す →
              </Link>
            </>
          ) : (
            <>
              <div style={{ display: 'inline-block', background: 'rgba(255,200,0,0.2)', border: '1px solid rgba(255,200,0,0.5)', borderRadius: '99px', padding: '6px 18px', marginBottom: '20px' }}>
                <span style={{ color: '#fcd34d', fontSize: '13px', fontWeight: 700 }}>🎁 登録特典キャンペーン実施中</span>
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '12px', lineHeight: 1.3, color: '#fff' }}>
                今すぐ登録した人だけに<br />特別特典をプレゼント
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.8 }}>
                新規登録で<br />
                <span style={{ color: '#fcd34d', fontWeight: 700, fontSize: '18px' }}>{REGISTRATION_BONUS}pt（¥{(REGISTRATION_BONUS * YEN_PER_POINT).toLocaleString()}相当）</span>をプレゼント。<br />
                登録は無料・30秒で完了。
              </p>
              {/* 特典リスト */}
              <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '16px 20px', marginBottom: '28px', textAlign: 'left' }}>
                {[
                  `✅ 登録で${REGISTRATION_BONUS}ptプレゼント`,
                  `✅ 毎日ログインで${LOGIN_BONUS}pt（毎日${FREE_MESSAGES_PER_LOGIN}通分無料）`,
                  '✅ 登録無料・使った分だけのポイント制',
                ].map(item => (
                  <p key={item} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.8, margin: 0 }}>{item}</p>
                ))}
              </div>
              <Link href="/auth/register" className="btn-cta" style={{ display: 'block', padding: '20px', fontSize: '17px', borderRadius: '16px', textDecoration: 'none' }}>
                新規登録する（無料）→
              </Link>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '14px' }}>🔒 個人情報は厳重に管理します</p>
            </>
          )}
        </AnimateOnScroll>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(220,80,140,0.1)', padding: '24px 20px', background: 'var(--color-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontWeight: 800, fontSize: '14px', background: 'linear-gradient(90deg, #e8438f, #a060e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AiKano</span>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <a href="mailto:info@aikano.chat" style={{ color: 'var(--color-text-muted)', fontSize: '12px', textDecoration: 'none' }}>お問い合わせ</a>
            {[
              { label: '特定商取引法', href: '/legal/tokusho' },
              { label: 'プライバシー', href: '/legal/privacy' },
              { label: '利用規約', href: '/legal/terms' },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ color: 'var(--color-text-muted)', fontSize: '12px', textDecoration: 'none' }}>{l.label}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(220,80,140,0.06)', paddingTop: '16px', marginTop: '4px' }}>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.9 }}>
            運営会社：合同会社TJYM　／　〒530-0001 大阪府大阪市北区梅田一丁目２番２号 大阪駅前第２ビル１２－１２<br />
            <a href="https://tjym.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>tjym.org</a>　／　info@tjym.org
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '10px' }}>© 2026 AiKano</p>
        </div>
      </footer>

    </main>
  )
}
