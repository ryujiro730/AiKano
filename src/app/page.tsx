import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { Cpu, Database, Dna, Unlock, Image as ImageIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { REGISTRATION_BONUS, REFERRAL_BONUS, LOGIN_BONUS, YEN_PER_POINT, FREE_MESSAGES_PER_LOGIN } from '@/lib/pricing'
import { getLocale, getMessages } from '@/i18n/server'
import { fmt, gap } from '@/i18n/fmt'
import { Lines } from '@/i18n/Lines'
import { localizedCharacter } from '@/lib/character-i18n'
import { LanguageSelect } from '@/components/LanguageSelect'

export function generateMetadata(): Metadata {
  const m = getMessages()
  return {
    alternates: { canonical: 'https://aikano.chat' },
    openGraph: {
      title: m.meta.ogTitle,
      description: m.meta.description,
      url: 'https://aikano.chat',
      siteName: 'AiKano',
      type: 'website',
      images: [{ url: 'https://aikano.chat/og-default.png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: m.meta.ogTitle,
      description: m.meta.description,
      images: ['https://aikano.chat/og-default.png'],
    },
  }
}


export default async function HomePage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: characters } = await supabase
    .from('characters')
    .select('id, name, age, personality, avatar_url, i18n')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  const locale = getLocale()
  const m = getMessages(locale)
  const chars = (characters ?? []).map(c => localizedCharacter(c, locale))
  const ctaHref = user ? '/characters' : '/auth/register'
  const ctaText = user ? m.common.continueTalking : m.lp.registerFreeArrow


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
          {locale === 'ja' && (
            <Link href="/blog" style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 500 }}
              className="hover:text-[var(--color-primary)] transition-colors hidden sm:block">
              {m.common.blog}
            </Link>
          )}
          {user ? (
            <Link href="/characters" className="btn-cta" style={{ padding: '8px 20px', fontSize: '14px', borderRadius: '8px' }}>{m.common.continue}</Link>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost" style={{ padding: '8px 14px', fontSize: '14px', whiteSpace: 'nowrap' }}>{m.common.login}</Link>
              <Link href="/auth/register" className="btn-cta" style={{ padding: '8px 16px', fontSize: '14px', borderRadius: '8px', whiteSpace: 'nowrap' }}>{locale === 'ja' ? m.common.registerFree : m.common.register}</Link>
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
            <img src="/hero-v2.webp" alt={m.lp.heroImageAlt} className="ken-burns" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
          </picture>
          <div className="hero-shade" style={{ position: 'absolute', inset: 0 }} />
          
          {/* キャッチコピー：左下に固定（スマホは縦積み） */}
          <div className="hero-catchcopy" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.55)' }}>
            <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {!user && (
                <span style={{ display: 'inline-block', background: 'rgba(13,10,20,0.55)', border: '1px solid rgba(255,200,0,0.5)', color: '#fcd34d', padding: '5px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.04em' }}>
                  🎁 {fmt(m.lp.badgeBonus, { pt: REGISTRATION_BONUS })}
                </span>
              )}
              <span style={{ display: 'inline-block', background: 'rgba(13,10,20,0.55)', border: '1px solid rgba(232,67,143,0.45)', color: '#f9a8d4', padding: '5px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em' }}>
                ✦ {m.lp.badgeWaiting}
              </span>
            </div>
            <h1 style={{ fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 8vw, 3.8rem)', color: '#fff' }}>{m.lp.heroLine1}</span>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 8vw, 3.8rem)', background: 'linear-gradient(90deg, #e8438f, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none' }}>{m.lp.heroLine2}</span>
              <span style={{ display: 'block', fontSize: 'clamp(2.2rem, 8vw, 3.8rem)', color: '#fff' }}>{m.lp.heroLine3}</span>
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
          { num: fmt(m.lp.statGirls, { n: chars.length }), label: m.lp.statGirlsLabel },
          { num: '24h', label: m.lp.statHoursLabel },
          { num: m.lp.statAi, label: m.lp.statAiLabel },
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
          <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>{m.lp.charactersTitle}</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '36px' }}>{m.lp.charactersSub}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))', gap: '14px' }}>
            {chars.map((char, i) => (
              <AnimateOnScroll key={char.id} delay={i * 80}>
              <Link href={user ? `/chat?character=${char.id}` : '/auth/register'} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'var(--color-surface-2)', border: '1px solid rgba(220,80,140,0.18)', borderRadius: '16px', padding: '20px 16px', textAlign: 'center', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(126,200,80,0.2)', border: '1px solid rgba(126,200,80,0.4)', borderRadius: '99px', padding: '2px 8px', fontSize: '10px', color: '#7ec850', fontWeight: 600 }}>● {m.lp.online}</div>
                  <div style={{ width: '72px', height: '72px', borderRadius: '50%', overflow: 'hidden', margin: '0 auto 12px', border: '2px solid rgba(232,67,143,0.4)', boxShadow: '0 0 16px rgba(232,67,143,0.2)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={char.avatar_url} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '2px', color: 'var(--color-text)' }}>{char.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>{fmt(m.common.ageSuffix, { age: char.age ?? '' })}</p>
                  <p style={{ fontSize: '11px', color: '#e8438f', fontWeight: 500 }}>{char.personality?.split(/[・,、]/)[0]}</p>
                </div>
              </Link>
              </AnimateOnScroll>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Link href={ctaHref} className="btn-cta" style={{ padding: '14px 40px', fontSize: '15px', borderRadius: '12px', display: 'inline-block', textDecoration: 'none' }}>
              {user ? m.lp.talkToAll : m.lp.registerToTalkAll}
            </Link>
            {!user && (
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                {fmt(m.lp.bonusNote, { pt: REGISTRATION_BONUS })}
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
                  <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{m.lp.sample1Title}</h2>
                  <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(220,80,140,0.15)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {m.lp.sample1.map((msg, i) => (
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
                  <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{m.lp.sample2Title}</h2>
                  <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(220,80,140,0.15)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {m.lp.sample2.map((msg, i) => (
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
                  <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>{m.lp.sample3Title}</h2>
                  <div style={{ background: 'var(--color-surface)', border: '1px solid rgba(220,80,140,0.15)', borderRadius: '20px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {m.lp.sample3.map((msg, i) => (
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
              <img src={src} alt={m.lp.characterImageAlt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            </AnimateOnScroll>
          ))}
        </div>
        <AnimateOnScroll style={{ padding: '28px 24px', textAlign: 'center', background: 'var(--color-surface)' }}>
          <p style={{ color: '#e8438f', fontSize: '13px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.1em' }}>MEMBERS ONLY</p>
          <h2 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>{m.lp.membersTitle}</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>{m.lp.membersSub}</p>
        </AnimateOnScroll>
      </section>

      {/* ── 機能紹介 ── */}
<section style={{ padding: '64px 24px', background: 'var(--color-bg)' }}>
  <div style={{ maxWidth: '560px', margin: '0 auto' }}>
    <p style={{ textAlign: 'center', color: '#e8438f', fontSize: '13px', fontWeight: 600, marginBottom: '10px', letterSpacing: '0.1em' }}>FEATURES</p>
    <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, marginBottom: '36px' }}>
      {m.lp.featuresTitleA.trim()}{gap(locale, m.lp.featuresTitleB.trim())}<span style={{ color: '#e8438f' }}>{m.lp.featuresTitleB.trim()}</span>
    </h2>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[Cpu, Database, Dna, Unlock, ImageIcon].map((Icon, i) => ({ Icon, ...m.lp.features[i] })).map((f, i) => (
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
            <p style={{ color: '#f472b6', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>✦ {m.lp.secretBadge}</p>
            <p style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, lineHeight: 1.4, marginBottom: '12px', color: 'var(--color-text)' }}>
              <Lines text={m.lp.secretTitle} />
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
              <Lines text={m.lp.secretBody} />
            </p>
            {user ? (
              <Link href="/characters" className="btn-cta" style={{ padding: '12px 28px', fontSize: '14px', borderRadius: '10px', display: 'inline-block', textDecoration: 'none' }}>
                {m.common.continueTalking}
              </Link>
            ) : (
              <div style={{ display: 'flex', gap: '10px', whiteSpace: 'nowrap' }}>
                <Link href="/auth/register" className="btn-cta" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '10px', display: 'inline-block', textDecoration: 'none' }}>
                  {m.common.register}
                </Link>
                <Link href="/auth/login" className="btn-ghost" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '10px', display: 'inline-block', textDecoration: 'none' }}>
                  {m.common.login}
                </Link>
              </div>
            )}
          </div>
          <div style={{ flex: '1 1 260px', maxWidth: '360px', height: '320px', overflow: 'hidden', margin: '0 auto' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/rin-silent.webp" alt={m.lp.characterImageAlt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
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
                🎁 {m.lp.referralBadge}
              </span>
              <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 800, lineHeight: 1.4, marginBottom: '12px', color: 'var(--color-text)' }}>
                {m.lp.referralTitleA}<br />
                <span style={{ background: 'linear-gradient(90deg, #e8438f, #a060e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{fmt(m.lp.referralTitleB, { pt: REFERRAL_BONUS })}</span>
              </h2>
              <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
                <Lines text={fmt(m.lp.referralBody, { pt: REFERRAL_BONUS })} />
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href={user ? '/payment' : ctaHref} className="btn-cta" style={{ padding: '12px 24px', fontSize: '14px', borderRadius: '10px', display: 'inline-block', textDecoration: 'none' }}>
                  {user ? m.lp.referralCtaUser : m.lp.referralCtaGuest}
                </Link>
              </div>
            </div>
            {/* 画像（メガホン・右） */}
            <div style={{ flex: '1 1 220px', maxWidth: '320px', minHeight: '260px', position: 'relative', overflow: 'hidden', margin: '0 auto' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/share.webp" alt={m.lp.referralBadge} loading="lazy" style={{ position: 'absolute', bottom: 0, right: 0, height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'bottom right' }} />
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
                <img src={src} alt={m.lp.characterImageAlt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
              </AnimateOnScroll>
            ))}
          </div>
          <h2 style={{ textAlign: 'center', fontSize: '22px', fontWeight: 800, marginBottom: '12px' }}>
            {m.lp.realTitleA.trim()}{gap(locale, m.lp.realTitleB.trim())}<span style={{ color: '#e8438f' }}>{m.lp.realTitleB.trim()}</span>{gap(locale, m.lp.realTitleC.trim())}{m.lp.realTitleC.trim()}
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px', lineHeight: 1.8 }}>
            <Lines text={m.lp.realBody} />
          </p>
        </div>
      </section>


      {/* ── 最終CTA（写真背景） ── */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/p8.png" alt={m.lp.characterImageAlt} loading="lazy" className="ken-burns" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(13,10,20,0.82)' }} />
        <AnimateOnScroll style={{ position: 'relative', zIndex: 10, padding: '80px 24px', textAlign: 'center', maxWidth: '460px', margin: '0 auto' }}>
          {user ? (
            <>
              <p style={{ color: '#f472b6', fontSize: '13px', fontWeight: 600, marginBottom: '14px', letterSpacing: '0.1em' }}>✦ {m.lp.finalUserBadge}</p>
              <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '28px', lineHeight: 1.3, color: '#fff' }}>
                <Lines text={m.lp.finalUserTitle} />
              </h2>
              <Link href="/characters" className="btn-cta" style={{ display: 'block', padding: '20px', fontSize: '19px', borderRadius: '16px', textDecoration: 'none' }}>
                {m.common.continueTalking}
              </Link>
            </>
          ) : (
            <>
              <div style={{ display: 'inline-block', background: 'rgba(255,200,0,0.2)', border: '1px solid rgba(255,200,0,0.5)', borderRadius: '99px', padding: '6px 18px', marginBottom: '20px' }}>
                <span style={{ color: '#fcd34d', fontSize: '13px', fontWeight: 700 }}>🎁 {m.lp.finalGuestBadge}</span>
              </div>
              <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '12px', lineHeight: 1.3, color: '#fff' }}>
                <Lines text={m.lp.finalGuestTitle} />
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.8 }}>
                {m.lp.finalGuestLead}<br />
                <span style={{ color: '#fcd34d', fontWeight: 700, fontSize: '18px' }}>{fmt(m.lp.finalGuestBonus, { pt: REGISTRATION_BONUS, yen: (REGISTRATION_BONUS * YEN_PER_POINT).toLocaleString() })}</span>{m.lp.finalGuestTail}<br />
                {m.lp.finalGuestNote}
              </p>
              {/* 特典リスト */}
              <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '16px 20px', marginBottom: '28px', textAlign: 'left' }}>
                {[
                  `✅ ${fmt(m.lp.perkBonus, { pt: REGISTRATION_BONUS })}`,
                  `✅ ${fmt(m.lp.perkLogin, { pt: LOGIN_BONUS, n: FREE_MESSAGES_PER_LOGIN })}`,
                  `✅ ${m.lp.perkPointSystem}`,
                ].map(item => (
                  <p key={item} style={{ color: 'rgba(255,255,255,0.85)', fontSize: '13px', lineHeight: 1.8, margin: 0 }}>{item}</p>
                ))}
              </div>
              <Link href="/auth/register" className="btn-cta" style={{ display: 'block', padding: '20px', fontSize: '17px', borderRadius: '16px', textDecoration: 'none' }}>
                {m.lp.registerFreeArrow}
              </Link>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', marginTop: '14px' }}>🔒 {m.lp.privacyNote}</p>
            </>
          )}
        </AnimateOnScroll>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: '1px solid rgba(220,80,140,0.1)', padding: '24px 20px', background: 'var(--color-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <span style={{ fontWeight: 800, fontSize: '14px', background: 'linear-gradient(90deg, #e8438f, #a060e0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AiKano</span>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
            <LanguageSelect />
            <a href="mailto:info@aikano.chat" style={{ color: 'var(--color-text-muted)', fontSize: '12px', textDecoration: 'none' }}>{m.common.contact}</a>
            {[
              { label: m.common.tokusho, href: '/legal/tokusho' },
              { label: m.common.privacy, href: '/legal/privacy' },
              { label: m.common.terms, href: '/legal/terms' },
            ].map(l => (
              <Link key={l.label} href={l.href} style={{ color: 'var(--color-text-muted)', fontSize: '12px', textDecoration: 'none' }}>{l.label}</Link>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(220,80,140,0.06)', paddingTop: '16px', marginTop: '4px' }}>
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', textAlign: 'center', lineHeight: 1.9 }}>
            {locale === 'ja'
              ? <>{m.common.company}：合同会社TJYM　／　〒530-0001 大阪府大阪市北区梅田一丁目２番２号 大阪駅前第２ビル１２－１２</>
              : <>{m.common.company}: TJYM LLC / Osaka Ekimae Dai-2 Bldg. 12-12, 1-2-2 Umeda, Kita-ku, Osaka 530-0001, Japan</>}<br />
            <a href="https://tjym.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}>tjym.org</a>　／　info@tjym.org
          </p>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: '10px' }}>© 2026 AiKano</p>
        </div>
      </footer>

    </main>
  )
}
