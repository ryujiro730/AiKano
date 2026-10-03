import Link from 'next/link'
import { createAdminClientStatic } from '@/lib/supabase/server'

// 登録・ログイン画面の共通レイアウト（アプリ本体と同じ配色）
export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: chars } = await createAdminClientStatic()
    .from('characters').select('avatar_url').eq('is_active', true).order('sort_order').limit(5)

  return (
    <div className="min-h-screen user-layout" style={{ background: 'var(--color-bg)' }}>
      <div className="w-full max-w-sm mx-auto px-5 pt-6 pb-12">
        <Link href="/" className="inline-block text-[17px] font-bold mb-8" style={{ color: 'var(--color-text)', letterSpacing: '0.02em' }}>
          Ai<span style={{ color: 'var(--color-primary)' }}>Kano</span>
        </Link>
        {(chars?.length ?? 0) > 0 && (
          <div className="flex mb-5" aria-hidden>
            {chars!.map((c, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={c.avatar_url} alt=""
                className="w-11 h-11 rounded-full object-cover"
                style={{ objectPosition: 'top center', border: '2.5px solid var(--color-bg)', marginLeft: i === 0 ? 0 : -12 }} />
            ))}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
