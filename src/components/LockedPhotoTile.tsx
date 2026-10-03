import Link from 'next/link'
import { Lock } from 'lucide-react'

/** 非会員向けの会員限定フォト枠（タップで料金プランへ） */
export function LockedPhotoTile({ className = '' }: { className?: string }) {
  return (
    <Link
      href="/payment"
      className={`relative overflow-hidden flex flex-col items-center justify-center gap-1.5 text-white ${className}`}
      style={{ aspectRatio: '1', background: 'linear-gradient(160deg, #3a2a33 0%, #17131a 100%)' }}
    >
      <span className="flex items-center justify-center w-8 h-8 rounded-[10px]" style={{ background: 'rgba(255,255,255,0.14)' }}>
        <Lock size={15} strokeWidth={2.2} />
      </span>
      <span className="text-[10px] font-bold" style={{ letterSpacing: '0.04em' }}>会員限定</span>
    </Link>
  )
}
