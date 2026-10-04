import Link from 'next/link'
import { ReactNode } from 'react'
import { blogCtaHref } from '@/lib/blog-utm'

const CTA_PATHS = ['/', '/auth/register']

export function InlineLink({ href, children, slug }: { href: string; children: ReactNode; slug?: string }) {
  const isExternal = href.startsWith('http')
  if (CTA_PATHS.includes(href)) href = blogCtaHref(href, 'inline_link', slug)
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      style={{ color: 'var(--color-primary)', fontWeight: 600 }}
      className="underline underline-offset-2 hover:opacity-75 transition-opacity"
    >
      {children}
    </Link>
  )
}
