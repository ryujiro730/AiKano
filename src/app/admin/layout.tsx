import { createClient, createAdminClientStatic } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { unstable_cache } from 'next/cache'
import { AdminNav } from '@/components/admin/AdminNav'

// roleチェックは30秒キャッシュ（cookies不要なstaticクライアントを使用）
const getAdminProfile = unstable_cache(
  async (userId: string) => {
    const adminDb = createAdminClientStatic()
    const { data } = await adminDb
      .from('profiles').select('role, display_name').eq('id', userId).single()
    return data
  },
  ['admin-profile'],
  { revalidate: 30 }
)

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // getSession() はクッキー読み取りのみ（ネットワーク不要）→ 高速
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user ?? null

  if (!user) redirect('/auth/login')

  const profile = await getAdminProfile(user.id)

  if (!profile || profile.role !== 'admin') {
    redirect('/characters')
  }

  // AIが返信する運用のため、人手で返信するための画面（受信トレイ・モニター・オペグラ・個別送信・通報など）はメニューから外している
  const navItems = [
    { href: '/admin', label: '概要' },
    { href: '/admin/users', label: 'ユーザー' },
    { href: '/admin/conversations', label: '会話' },
    { href: '/admin/characters', label: 'キャラ管理' },
    { href: '/admin/analytics', label: '集計' },
    { href: '/admin/bank-transfers', label: '銀行振込' },
    { href: '/admin/inquiries', label: 'お問い合わせ' },
    { href: '/admin/videos', label: '動画販売' },
    { href: '/admin/items', label: 'アイテム' },
    { href: '/admin/campaigns', label: 'キャンペーン' },
    { href: '/admin/auto-broadcast-schedule', label: '自動同報' },
    { href: '/admin/promo-submissions', label: 'プロモ申請' },
  ]

  return (
    <div className="min-h-screen admin-layout" style={{ background: 'var(--color-bg)' }}>
      <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="w-full px-4 flex items-center gap-4 h-12">
          <a href="/characters" className="text-sm font-semibold text-[var(--color-text)] shrink-0 hover:opacity-70 transition-opacity">AiKano</a>
          <span className="text-[var(--color-text-muted)] text-xs shrink-0 hidden md:block">|</span>
          <AdminNav navItems={navItems} />
        </div>
      </header>

      <main className="w-full px-4 py-5">
        {children}
      </main>
    </div>
  )
}
