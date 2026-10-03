import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | AiKano',
  description: 'AiKano 特定商取引法に基づく表記',
}

const rows: { label: string; value: React.ReactNode }[] = [
  { label: '販売事業者', value: '合同会社TJYM（TJYM LLC）' },
  { label: '代表者', value: '有限責任社員 辻龍次朗 / 有限責任社員 山内政志' },
  { label: '所在地', value: '〒530-0001 大阪府大阪市北区梅田一丁目２番２号 大阪駅前第２ビル１２－１２' },
  { label: '連絡先メール', value: 'info@tjym.org' },
  { label: 'ウェブサイト', value: 'https://aikano.chat' },
  {
    label: '販売価格',
    value: (
      <div className="space-y-3">
        <div>
          <p className="font-semibold text-sm text-[#1a1a1a] mb-1">■ ポイント購入（都度払い）</p>
          <table className="text-sm w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                <th className="text-left py-1 pr-4 font-medium text-[#888]">金額（税込）</th>
                <th className="text-left py-1 pr-4 font-medium text-[#888]">付与ポイント</th>
                <th className="text-left py-1 font-medium text-[#888]">ボーナス</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1 pr-4">¥1,000</td><td className="pr-4">100pt</td><td>—</td></tr>
              <tr><td className="py-1 pr-4">¥3,000</td><td className="pr-4">330pt</td><td>+30pt</td></tr>
              <tr><td className="py-1 pr-4">¥5,000</td><td className="pr-4">550pt</td><td>+50pt</td></tr>
              <tr><td className="py-1 pr-4">¥10,000</td><td className="pr-4">1,150pt</td><td>+150pt</td></tr>
              <tr><td className="py-1 pr-4">¥30,000</td><td className="pr-4">3,600pt</td><td>+600pt</td></tr>
              <tr><td className="py-1 pr-4">¥50,000</td><td className="pr-4">6,500pt</td><td>+1,500pt</td></tr>
            </tbody>
          </table>
          <p className="text-xs mt-1" style={{ color: '#aaa' }}>1ポイント＝10円相当。ポイントは1通5〜10ptで消費されます。</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-[#1a1a1a] mb-1">■ 月額サブスクリプション（自動更新）</p>
          <table className="text-sm w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                <th className="text-left py-1 pr-4 font-medium text-[#888]">プラン</th>
                <th className="text-left py-1 pr-4 font-medium text-[#888]">月額（税込）</th>
                <th className="text-left py-1 font-medium text-[#888]">月間メッセージ数</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1 pr-4">スタンダード</td><td className="pr-4">¥2,980</td><td>300通/月</td></tr>
              <tr><td className="py-1 pr-4">プレミアム</td><td className="pr-4">¥4,980</td><td>500通/月</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <p className="font-semibold text-sm text-[#1a1a1a] mb-1">■ 30日間パス（コンビニ・PayPay対応）</p>
          <table className="text-sm w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e8e8e8' }}>
                <th className="text-left py-1 pr-4 font-medium text-[#888]">プラン</th>
                <th className="text-left py-1 pr-4 font-medium text-[#888]">金額（税込）</th>
                <th className="text-left py-1 font-medium text-[#888]">有効期間</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="py-1 pr-4">スタンダード</td><td className="pr-4">¥2,980</td><td>購入日から30日間</td></tr>
              <tr><td className="py-1 pr-4">プレミアム</td><td className="pr-4">¥4,980</td><td>購入日から30日間</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    label: '支払い方法',
    value: (
      <div className="space-y-1 text-sm">
        <p>・クレジットカード（Visa / Mastercard / American Express / JCB / Diners Club / Discover / 銀聯）</p>
        <p>・コンビニ払い（ファミリーマート・ローソン・ミニストップ・セイコーマート）※30日間パスのみ</p>
        <p>・PayPay ※30日間パスのみ</p>
      </div>
    ),
  },
  { label: '支払い時期', value: 'クレジットカード・PayPay：購入手続き完了時。コンビニ払い：払込票発行後、コンビニにてお支払い後に有効化。月額サブスクリプション：毎月契約日に自動引き落とし。' },
  { label: 'サービス提供時期', value: 'ポイント購入・クレジットカード決済：決済完了後、即時利用可能。コンビニ払い：入金確認後、即時利用可能。' },
  { label: 'キャンセル・解約', value: '月額サブスクリプションはマイページよりいつでも解約可能です。解約後は当該月の残期間までご利用いただけます。ポイント・30日間パスはデジタルコンテンツの性質上、購入後の返金・キャンセルには原則応じられません。未成年者契約の取消しについては消費者契約法および民法の規定に従います。' },
  { label: '動作環境', value: '最新バージョンの Chrome / Safari / Firefox / Edge を推奨。インターネット接続が必要です。' },
  { label: '事業内容', value: 'AIソリューション開発 / 国産AIコンパニオンサービス「AiKano」運営 / Webサービス・システム受託開発 / デジタルマーケティング / バーチャルキャラクター制作 / デジタルコンテンツ制作' },
]

export default function TokushoPage() {
  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8' }} className="sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-3">
          <Link href="/" style={{ fontSize: '13px', color: '#888', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}
            className="hover:text-[#1a1a1a] transition-colors">
            <ChevronLeft size={14} />AiKano
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-14">
        <h1 style={{ fontFamily: "'Noto Serif JP', serif", fontSize: '1.75rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '8px' }}>
          特定商取引法に基づく表記
        </h1>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '48px' }}>最終更新日：2026年10月3日</p>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #e8e8e8' }}>
                <th style={{
                  width: '160px',
                  minWidth: '120px',
                  padding: '16px 20px 16px 0',
                  textAlign: 'left',
                  verticalAlign: 'top',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1a1a1a',
                  whiteSpace: 'nowrap',
                }}>
                  {row.label}
                </th>
                <td style={{
                  padding: '16px 0',
                  fontSize: '14px',
                  color: '#444',
                  lineHeight: 1.8,
                  verticalAlign: 'top',
                }}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '64px', paddingTop: '24px', borderTop: '1px solid #e8e8e8' }}>
          <p style={{ fontSize: '13px', color: '#aaa', textAlign: 'center' }}>
            合同会社TJYM（AiKano 運営事務局）
          </p>
        </div>
      </div>
    </div>
  )
}
