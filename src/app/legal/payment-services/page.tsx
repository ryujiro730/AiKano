import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { YEN_PER_POINT, LOGIN_BONUS_HOURS } from '@/lib/pricing'

export const metadata: Metadata = {
  title: '資金決済法に基づく表示 | AiKano',
  description: 'AiKano 資金決済法に基づく表示（前払式支払手段）',
}

const rows: { label: string; value: React.ReactNode }[] = [
  { label: '発行者の名称', value: '合同会社TJYM（TJYM LLC）' },
  { label: '住所', value: '〒530-0001 大阪府大阪市北区梅田一丁目２番２号 大阪駅前第２ビル１２－１２' },
  { label: '電話番号', value: '050-8894-5439（対応時間 10:00 - 17:00、土日祝・年末年始を除く）' },
  { label: 'メールアドレス', value: 'info@tjym.org' },
  { label: '前払式支払手段の名称', value: 'AiKanoポイント（本サービス内で「pt」と表示されるもの）' },
  { label: '支払可能金額等（保有上限）', value: `1ポイント＝${YEN_PER_POINT}円相当でご利用いただけます。お一人が保有できるポイントに上限は設けていません。` },
  {
    label: '有効期間・期限',
    value: `有償で購入したポイントに有効期限はありません。ただし、退会されるとポイントはすべて失効し、ご利用いただけなくなります。なお、ログインボーナスとして無償で付与されたポイントは、付与から${LOGIN_BONUS_HOURS}時間で失効します。`,
  },
  {
    label: '使用できる場所（使用範囲）',
    value: 'AiKano（https://aikano.chat）のサービス内でのみご利用いただけます。キャラクターへのメッセージ送信、チャット内の写真・動画の閲覧、写真ガチャ、ギフトアイテムの購入に使えます。',
  },
  {
    label: '利用上の注意（払戻し）',
    value: 'ポイントは、法令に定める場合を除き、払戻し（現金への交換・返金）はいたしません。第三者への譲渡・売買はできません。各コンテンツで消費するポイント数は、利用の前に画面に表示されます。',
  },
  {
    label: '未使用残高の確認方法',
    value: <>ログイン後、「料金プラン」画面（<Link href="/payment" className="underline">https://aikano.chat/payment</Link>）で現在のポイント残高を確認できます。</>,
  },
  {
    label: '利用規約',
    value: <>ポイントの詳しい取扱いは<Link href="/legal/terms" className="underline">利用規約</Link>（第7条 利用料金）をご確認ください。</>,
  },
  {
    label: '苦情・相談窓口',
    value: '上記の電話番号またはメールアドレスまでご連絡ください。',
  },
]

export default function PaymentServicesPage() {
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
          資金決済法に基づく表示
        </h1>
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '48px' }}>最終更新日：2026年10月18日</p>

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
