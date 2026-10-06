import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

import { createAdminClient } from '@/lib/supabase/server'
import { getAuthUser } from '@/lib/supabase/get-auth-user'
import { redirect } from 'next/navigation'
import { unstable_noStore as noStore } from 'next/cache'
import { Suspense } from 'react'
import { PointsDisplay } from '@/components/PointsDisplay'
import { BottomNavLive } from '@/components/BottomNavLive'
import { BottomNavServer } from '@/components/BottomNavServer'
import { canUseGacha } from '@/lib/features'
import { LoginBonusDialog } from '@/components/LoginBonusDialog'
import { CampaignBanner } from '@/components/CampaignBanner'
import { CampaignProvider } from '@/components/CampaignProvider'
import { LoginPing } from '@/components/LoginPing'
import { LocaleSync } from '@/components/LocaleSync'
import { getLocale } from '@/i18n/server'
import { isLocale } from '@/i18n/config'

export default async function UserLayout({ children }: { children: React.ReactNode }) {
  noStore()
  const user = await getAuthUser()
  if (!user) redirect('/auth/login')
  const userId = user.id

  const admin = createAdminClient()

  const [{ data: profile }] = await Promise.all([
    admin
      .from('profiles')
      .select('display_name, age, points, bonus_points, bonus_points_expires_at, role, subscription_status, subscription_plan, locale')
      .eq('id', userId)
      .single(),
    admin
      .from('profiles')
      .update({ last_login_at: new Date().toISOString() } as any)
      .eq('id', userId),
  ])

  if (!profile || profile.age === null) {
    redirect('/onboarding')
  }

  return (
    <CampaignProvider>
    <div className="min-h-screen user-layout" style={{ background: 'var(--color-bg)' }}>
      <header className="fixed top-0 w-full z-50 glass">
        <div className="max-w-2xl mx-auto px-4 flex items-center justify-between" style={{ height: '52px' }}>
          <Link href="/characters" className="text-[15px] font-bold" style={{ color: 'var(--color-text)', letterSpacing: '0.02em' }}>
            Ai<span style={{ color: 'var(--color-primary)' }}>Kano</span>
          </Link>
          <div className="flex items-center gap-3">
            {['admin', 'owner'].includes(profile?.role ?? '') && (
              <a href="/admin" className="text-xs text-[var(--color-text-muted)] hover:opacity-70 transition-opacity">
                管理画面 →
              </a>
            )}
            {((profile as any)?.subscription_status === 'active' || (profile as any)?.subscription_status === 'trialing') && (profile as any)?.subscription_plan && (
              <span className={`sub-badge ${(profile as any).subscription_plan === 'premium' ? 'sub-badge-premium' : 'sub-badge-standard'}`}>
                {(profile as any).subscription_plan === 'premium' ? 'PREMIUM' : 'STANDARD'}
              </span>
            )}
            <PointsDisplay initialPoints={(profile?.points ?? 0) + (
              profile?.bonus_points_expires_at && new Date(profile.bonus_points_expires_at) > new Date() ? (profile?.bonus_points ?? 0) : 0
            )} />
          </div>
        </div>
      </header>

      {isLocale((profile as any)?.locale) && (profile as any).locale !== getLocale() && <LocaleSync locale={(profile as any).locale} />}
      <CampaignBanner />

      <main className="max-w-2xl mx-auto px-4" style={{ paddingTop: 'var(--main-pt, 72px)', paddingBottom: '88px' }}>
        {children}
      </main>

      <LoginPing />
      <LoginBonusDialog />
      {/* ボトムナビ: サーバーで初期値を取得し、クライアントで定期ポーリング更新 */}
      <Suspense fallback={<BottomNavLive showGacha={canUseGacha(profile?.role)} />}>
        <BottomNavServer userId={userId} showGacha={canUseGacha(profile?.role)} />
      </Suspense>
    </div>
    </CampaignProvider>
  )
}
