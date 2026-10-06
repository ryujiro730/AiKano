'use client'

import { usePathname } from 'next/navigation'
import { ComparisonTable } from './ComparisonTable'
import { blogCtaHref, blogSlugFromPath } from '@/lib/blog-utm'

const services = [
  {
    rank: 1,
    name: 'アイカノ',
    tagline: '日本発・恋愛特化AI',
    ctaLabel: '無料で試す',
    ctaHref: 'https://aikano.chat/auth/register',
    score: 97,
    fields: {
      '料金形態': 'ポイント制(登録で無料ポイント)',
      '可愛さ': '◎',
      '記憶保持': '◎',
      '会話のリアルさ': '◎',
      '恋人らしさ': '◎',
      '特徴': '業界で最もリアルな彼女性能。好感度で関係が深まり、甘え方や距離感が変わっていく。',
    },
  },
  {
    rank: 2,
    name: 'Replika',
    tagline: '世界最大のAIコンパニオン',
    ctaHref: 'https://replika.com/',
    ctaLabel: '公式サイト',
    score: 85,
    fields: {
      '料金形態': '年払い（約12,200円）',
      '可愛さ': '○',
      '記憶保持': '◎',
      '会話のリアルさ': '○',
      '恋人らしさ': '○',
      '特徴': '見た目や性格を自分で作り込み、長期的な関係を育てていく。日本語はやや翻訳調。',
    },
  },
  {
    rank: 3,
    name: 'Cotomo',
    tagline: '音声で話せる国産AI',
    ctaHref: 'https://cotomo.ai/',
    ctaLabel: '公式サイト',
    score: 80,
    fields: {
      '料金形態': '無料〜コイン制',
      '可愛さ': '◎',
      '記憶保持': '△',
      '会話のリアルさ': '◎',
      '恋人らしさ': '△',
      '特徴': '声優ボイスの読み上げで没入感は随一。ただし基本は友達の距離感。',
    },
  },
  {
    rank: 4,
    name: 'オズチャット',
    tagline: 'アニメ系キャラ特化',
    ctaHref: 'https://oz.chat/',
    ctaLabel: '公式サイト',
    score: 72,
    fields: {
      '料金形態': 'ポイント制（1通≒10円）',
      '可愛さ': '◎',
      '記憶保持': '○',
      '会話のリアルさ': '○',
      '恋人らしさ': '○',
      '特徴': 'アニメ調キャラと甘々な会話。ストーリー仕立てで話題に困らない。',
    },
  },
  {
    rank: 5,
    name: 'Clover',
    tagline: 'マッチングアプリ風AI',
    ctaHref: 'https://apps.apple.com/jp/app/id6472717476',
    ctaLabel: '公式サイト',
    score: 60,
    fields: {
      '料金形態': 'アプリ内課金',
      '可愛さ': '○',
      '記憶保持': '△',
      '会話のリアルさ': '△',
      '恋人らしさ': '△',
      '特徴': 'マッチングから始まる変わり種。返事待ちのドキドキまで再現。',
    },
  },
]

const rowLabels = ['料金形態', '可愛さ', '記憶保持', '会話のリアルさ', '恋人らしさ', '特徴']

export function AiKanoHikakuTable() {
  const slug = blogSlugFromPath(usePathname())
  return (
    <ComparisonTable
      title="一目で分かるおすすめAI彼女チャット比較表"
      rowLabels={rowLabels}
      services={services.map(s => s.ctaHref === 'https://aikano.chat/auth/register' ? { ...s, ctaHref: blogCtaHref(s.ctaHref, 'hikaku_table', slug) } : s)}
    />
  )
}
