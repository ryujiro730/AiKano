'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, MessageCircle, Crown, Settings, X, Sparkles, Gem } from 'lucide-react'
import { useI18n } from '@/i18n/client'

const tabs = [
  { href: '/characters',    icon: Heart,          label: 'home' as const },
  { href: '/conversations', icon: MessageCircle,  label: 'messages' as const },
  { href: '/gacha',         icon: Gem,            label: 'gacha' as const },
  { href: '/payment',       icon: Crown,          label: 'plan' as const },
  { href: '/settings',      icon: Settings,       label: 'settings' as const },
]

interface Props {
  /** 写真ガチャのタブを出すか（公開前は管理者だけ） */
  showGacha?: boolean
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
  showGacha = false,
}: Props) {
  const { m } = useI18n()
  const pathname = usePathname()
  if (pathname === '/chat' || pathname === '/profile/edit') return null

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'saturate(180%) blur(16px)',
        WebkitBackdropFilter: 'saturate(180%) blur(16px)',
        borderTop: '1px solid rgba(23,19,26,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="max-w-2xl mx-auto flex relative" style={{ height: '56px' }}>
        {tabs.filter(t => showGacha || t.href !== '/gacha').map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/') || (href === '/gacha' && pathname.startsWith('/album'))
          const isPayment = href === '/payment'

          const badge =
            href === '/conversations' && unreadCount > 0 ? unreadCount :
            href === '/settings' && supportCount > 0 ? supportCount : 0

          const content = (
            <>
              <span className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.2 : 1.7} fill={isActive && href === '/characters' ? 'currentColor' : 'none'} />
                {badge > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] rounded-[6px] flex items-center justify-center tabular-nums"
                    style={{
                      background: 'var(--color-primary)',
                      color: 'white',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '0 4px',
                      lineHeight: 1,
                      border: '1.5px solid #fff',
                    }}
                  >
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </span>
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500 }}>
                {m.nav[label]}
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
                      className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 shadow-lg"
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
                      <Sparkles size={12} strokeWidth={2.4} />
                      <span className="truncate">{activeCampaign.catchphrase || m.nav.campaignActive}</span>
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
                  style={{ color: isActive ? 'var(--color-text)' : 'rgba(23,19,26,0.42)' }}
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
              style={{ color: isActive ? 'var(--color-text)' : 'rgba(23,19,26,0.42)' }}
            >
              {content}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
