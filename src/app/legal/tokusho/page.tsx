import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { POINTS_PER_MESSAGE, IMAGE_UNLOCK_POINTS, VIDEO_UNLOCK_POINTS, GACHA_SINGLE_POINTS, GACHA_TEN_POINTS } from '@/lib/pricing'
import { PLANS } from '@/lib/plans'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記 | AiKano',
  description: 'AiKano 特定商取引法に基づく表記',
}

const rows: { label: string; value: React.ReactNode }[] = [
  { label: '販売事業者', value: '合同会社TJYM（TJYM LLC）' },
  { label: '販売責任者', value: '有限責任社員 辻龍次朗' },
  { label: '運営責任者', value: '有限責任社員 辻龍次朗 / 有限責任社員 山内政志' },
  { label: '所在地', value: '〒530-0001 大阪府大阪市北区梅田一丁目２番２号 大阪駅前第２ビル１２－１２' },
  { label: 'サポート電話番号', value: '050-8894-5439' },
  { label: 'サポートメールアドレス', value: 'info@tjym.org' },
  { label: 'サポート対応時間', value: '10:00 - 17:00（土日祝・年末年始を除く）。メールは24時間受け付け、対応時間内に順次返信します。' },
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
          <p className="text-xs mt-1" style={{ color: '#aaa' }}>1ポイント＝10円相当。メッセージは1通{POINTS_PER_MESSAGE}pt（会員の月間上限超過後は{PLANS.standard.overage_points}pt）で消費されます。</p>
        </div>
        <div>
          <p className="font-semibold text-sm text-[#1a1a1a] mb-1">■ ポイントの使い道（デジタルコンテンツ）</p>
          <table className="text-sm w-full" style={{ borderCollapse: 'collapse' }}>
            <tbody>
              <tr><td className="py-1 pr-4">キャラクターへのメッセージ送信</td><td>1通 {POINTS_PER_MESSAGE}pt（{POINTS_PER_MESSAGE * 10}円相当）</td></tr>
              <tr><td className="py-1 pr-4">チャット内の写真の閲覧</td><td>1枚 {IMAGE_UNLOCK_POINTS}pt（{IMAGE_UNLOCK_POINTS * 10}円相当）</td></tr>
              <tr><td className="py-1 pr-4">動画の閲覧</td><td>1本 {VIDEO_UNLOCK_POINTS}pt（{VIDEO_UNLOCK_POINTS * 10}円相当）</td></tr>
              <tr><td className="py-1 pr-4">写真ガチャ</td><td>1回 {GACHA_SINGLE_POINTS}pt（{GACHA_SINGLE_POINTS * 10}円相当）／10回 {GACHA_TEN_POINTS}pt（{(GACHA_TEN_POINTS * 10).toLocaleString()}円相当）</td></tr>
              <tr><td className="py-1 pr-4">ギフトアイテム</td><td>1個 10pt〜3,000pt（アイテムごとに購入画面に表示）</td></tr>
            </tbody>
          </table>
          <p className="text-xs mt-1" style={{ color: '#aaa' }}>各コンテンツの消費ポイントは、購入・閲覧の前に画面に表示されます。写真ガチャは、まだ持っていない写真の中からランダムに1枚ずつ届き、同じ写真が重複して出ることはありません。</p>
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
          <div className="text-xs mt-2 space-y-1" style={{ color: '#888', lineHeight: 1.7 }}>
            <p>・料金の計算方法：申込日に1か月分の全額をお支払いいただき、その日から1か月ごとに同じ金額が自動で請求されます。月の途中から始めても日割り計算はせず、申込日が毎月の更新日になります。</p>
            <p>・解約方法：ログイン後、「料金プラン」画面（https://aikano.chat/payment）の「プランを管理する・解約」ボタンから、いつでも手続きできます。お問い合わせ（info@tjym.org）でも受け付けます。</p>
            <p>・解約月の料金：解約後は次回以降の請求は発生せず、支払い済みの期間の終了日まで引き続きご利用いただけます。解約月の料金の日割り計算・日割り返金は行いません。</p>
            <p>・決済後のキャンセル：有料サービスの決済完了後は、デジタルコンテンツの性質上、お客様のご都合によるキャンセル・返金には応じられません。二重請求や当社の不具合によりサービスを利用できなかった場合は、サポートメールアドレス（info@tjym.org）までご連絡ください。内容を確認のうえ返金などの対応をいたします。</p>
          </div>
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
          <p className="text-xs mt-1" style={{ color: '#888' }}>30日間パスは自動更新されません。期間が終わると自動で会員特典が終わり、追加の請求は一切発生しません。</p>
        </div>
      </div>
    ),
  },
  {
    label: '支払い方法',
    value: (
      <div className="space-y-1 text-sm">
        <p>・クレジットカード（Visa / Mastercard / American Express / JCB / Diners Club / Discover / 銀聯）</p>
        <p>・コンビニ払い（ファミリーマート・ローソン・ミニストップ・セイコーマート）※ポイント購入・30日間パス（月額サブスクリプションの自動更新には使えません）</p>
        <p>・PayPay ※ポイント購入・30日間パス（月額サブスクリプションの自動更新には使えません）</p>
      </div>
    ),
  },
  { label: '追加手数料', value: '送料：商品/サービスの特性上（オンラインで提供するデジタルコンテンツのため）、送料は発生いたしません。決済手数料：コンビニ払い・PayPayを含め、当社が負担するためお客様への追加手数料はありません。その他：サイトの閲覧・利用にかかるインターネット通信料はお客様のご負担となります。表示価格はすべて税込です。' },
  { label: 'ポイントの有効期限', value: '購入したポイントに有効期限はありません。ログインボーナスで無料付与されたポイントのみ、付与から24時間で失効します。' },
  { label: '支払い時期', value: 'クレジットカード・PayPay：購入手続き完了時。コンビニ払い：払込票発行後、コンビニにてお支払い後に有効化。月額サブスクリプション：毎月契約日に自動引き落とし。' },
  { label: 'サービス提供時期', value: 'ポイント購入・クレジットカード決済：決済完了後、即時利用可能。コンビニ払い：入金確認後、即時利用可能。' },
  { label: 'キャンセル・解約', value: '月額サブスクリプションは「料金プラン」画面からいつでも解約できます。解約後も支払い済みの期間の終了日まで利用でき、日割り返金は行いません。ポイント・30日間パスを含む有料サービスは、デジタルコンテンツの性質上、決済完了後のお客様都合によるキャンセル・返金には応じられません（二重請求や当社の不具合の場合を除く）。未成年者契約の取消しについては消費者契約法および民法の規定に従います。' },
  { label: '資金決済法に基づく表示', value: <Link href="/legal/payment-services" className="underline">資金決済法に基づく表示はこちら</Link> },
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
        <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '48px' }}>最終更新日：2026年10月19日</p>

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
