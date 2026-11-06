import { redirect } from 'next/navigation'

// キャラ別ガチャはやめた（2026-11-06〜 全キャラからひとつのガチャ）。古いリンクは /gacha へ
export default function GachaCharacterPage() {
  redirect('/gacha')
}
