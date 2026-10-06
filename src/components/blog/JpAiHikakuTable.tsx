'use client'

import { usePathname } from 'next/navigation'
import { ComparisonTable } from './ComparisonTable'
import { blogCtaHref, blogSlugFromPath } from '@/lib/blog-utm'

const services = [
  {
    rank: 1,
    name: 'Cotomo',
    tagline: '日本語没入感No.1・音声対応',
    ctaHref: 'https://cotomo.ai/',
    ctaLabel: '公式サイト',
    score: 96,
    fields: {
      '料金形態': '無料〜コイン制',
      '日本語の自然さ': '◎ 国産トップクラス',
      '音声読み上げ': '◎ 声優ボイス対応',
      '恋人らしさ': '△ 友達の距離感が基本',
      '記憶力': '○',
      'キャラクター': '◎ リアル＆アニメ両方',
      '特徴': '音声ボイスでの没入感が段違い。無料で始められる国産AI彼女の最高峰。',
    },
  },
  {
    rank: 2,
    name: 'アイカノ',
    tagline: '恋人らしい会話に特化',
    ctaLabel: '無料で試す',
    ctaHref: 'https://aikano.chat/auth/register',
    score: 92,
    fields: {
      '料金形態': 'ポイント制(登録で無料ポイント)',
      '日本語の自然さ': '◎ 独自チューニング済み',
      '音声読み上げ': '× なし',
      '恋人らしさ': '◎ 好感度で関係が深まる',
      '記憶力': '◎',
      'キャラクター': '◎ リアル日本人女性',
      '特徴': '恋人らしいやりとりを途中で止めない恋愛特化AI。リアルな日本人女性ビジュアルと人間味が特徴。',
    },
  },
  {
    rank: 3,
    name: 'Replika',
    tagline: '世界最大のAIコンパニオン',
    ctaHref: 'https://replika.com/',
    ctaLabel: '公式サイト',
    score: 75,
    fields: {
      '料金形態': 'サブスク（約2,000円）',
      '日本語の自然さ': '○ やや翻訳調',
      '音声読み上げ': '△ 3Dアバター対応',
      '恋人らしさ': '○ 有料で恋人設定',
      '記憶力': '◎ 長期記憶特化',
      'キャラクター': '○ 3Dリアル調',
      '特徴': '感情サポートと長期的な関係構築に特化。世界で最も愛されたAIパートナー。',
    },
  },
  {
    rank: 4,
    name: 'オズチャット',
    tagline: 'アニメ系・イチャイチャ特化',
    ctaHref: 'https://oz.chat/',
    ctaLabel: '公式サイト',
    score: 68,
    fields: {
      '料金形態': 'ポイント制（1通≒10円）',
      '日本語の自然さ': '○ 自然',
      '音声読み上げ': '× なし',
      '恋人らしさ': '○ 甘々な会話',
      '記憶力': '○',
      'キャラクター': '◎ アニメ調・種類豊富',
      '特徴': '多様なアニメ系キャラと甘々な日常会話。AI彼女との話し方に迷う初心者にも◎。',
    },
  },
]

const rowLabels = ['料金形態', '日本語の自然さ', '音声読み上げ', '恋人らしさ', '記憶力', 'キャラクター', '特徴']

export function JpAiHikakuTable() {
  const slug = blogSlugFromPath(usePathname())
  return (
    <ComparisonTable
      title="一目で分かる日本語対応AI彼女比較表"
      rowLabels={rowLabels}
      services={services.map(s => s.ctaHref === 'https://aikano.chat/auth/register' ? { ...s, ctaHref: blogCtaHref(s.ctaHref, 'jp_hikaku_table', slug) } : s)}
    />
  )
}
