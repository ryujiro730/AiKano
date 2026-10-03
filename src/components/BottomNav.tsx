'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, MessageCircle, Crown, Settings, X } from 'lucide-react'

const tabs = [
  { href: '/characters',    icon: Heart,          label: 'ホーム' },
  { href: '/conversations', icon: MessageCircle,  label: 'メッセージ' },
  { href: '/payment',       icon: Crown,          label: 'プラン' },
  { href: '/settings',      icon: Settings,       label: '設定' },
]

interface Props {
  unreadCount?: number
  supportCount?: number
  activeCampaign?: { id: string; catchphrase: string } | null
  onDismissCampaign?: () => void
}

export function BottomNav({
  unreadCount = 0,
  supportCount = 0,
  activeCampaign = null,
  onDismissCampaign,
}: Props) {
  const pathname = usePathname()
  if (pathname === '/chat' || pathname === '/profile/edit') return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(0,0,0,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="max-w-2xl mx-auto flex relative" style={{ height: '56px' }}>
        {tabs.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          const isPayment = href === '/payment'

          const badge =
            href === '/conversations' && unreadCount > 0 ? unreadCount :
            href === '/settings' && supportCount > 0 ? supportCount : 0

          const content = (
            <>
              <span className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.6} />
                {badge > 0 && (
                  <span
                    className="absolute -top-1 -right-1.5 min-w-[15px] h-[15px] rounded-full flex items-center justify-center"
                    style={{
                      background: 'var(--color-primary)',
                      color: 'white',
                      fontSize: '9px',
                      fontWeight: 700,
                      padding: '0 3px',
                      lineHeight: 1,
                    }}
                  >
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </span>
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 400, letterSpacing: '0.02em' }}>
                {label}
              </span>
            </>
          )

          if (isPayment) {
            return (
              <div key={href} className="flex-1 relative flex flex-col items-center justify-center">
                {activeCampaign && (
                  <div
                    className="absolute"
                    style={{ bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', zIndex: 60 }}
                  >
                    <div
                      className="relative flex items-center gap-1.5 rounded-full px-3 py-1.5 shadow-lg"
                      style={{
                        background: 'var(--color-primary)',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        maxWidth: '180px',
                        animation: 'campaign-text-bounce 2s ease-in-out infinite',
                      }}
                    >
                      <span>🎉</span>
                      <span className="truncate">{activeCampaign.catchphrase || 'キャンペーン開催中！'}</span>
                      <button
                        onClick={e => { e.preventDefault(); e.stopPropagation(); onDismissCampaign?.() }}
                        className="flex-shrink-0 opacity-70 hover:opacity-100 ml-0.5"
                        style={{ lineHeight: 1 }}
                      >
                        <X size={11} />
                      </button>
                      <span
                        className="absolute"
                        style={{
                          top: '100%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 0,
                          height: 0,
                          borderLeft: '5px solid transparent',
                          borderRight: '5px solid transparent',
                          borderTop: '5px solid var(--color-primary)',
                        }}
                      />
                    </div>
                  </div>
                )}
                <Link
                  href={href}
                  prefetch={true}
                  className="flex flex-col items-center justify-center gap-0.5 w-full h-full transition-opacity active:opacity-60"
                  style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
                >
                  {content}
                </Link>
              </div>
            )
          }

          return (
            <Link
              key={href}
              href={href}
              prefetch={true}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-opacity active:opacity-60"
              style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
