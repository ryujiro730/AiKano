export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen user-layout" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-md mx-auto px-5 pt-5">
        {children}
      </div>
    </div>
  )
}
