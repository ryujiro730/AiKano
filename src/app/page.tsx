import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import { Landing, type LandingCharacter } from '@/components/landing/Landing'

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

  return (
    <Landing
      variant="default"
      characters={(characters ?? []) as LandingCharacter[]}
      ctaHref={user ? '/characters' : '/auth/register'}
      ctaLabel={user ? 'つづきを話す' : '無料で話しかけてみる'}
      lpName="top"
    />
  )
}
