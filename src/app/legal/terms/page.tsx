import type { Metadata } from 'next'
import { LegalPage } from '@/components/LegalPage'
import { getLegalDoc } from '@/i18n/legal'
import { getLocale, getMessages } from '@/i18n/server'

export function generateMetadata(): Metadata {
  const doc = getLegalDoc('terms', getLocale())
  return { title: `${doc.title} | AiKano`, description: `AiKano ${doc.title}` }
}

export default function TermsPage() {
  const locale = getLocale()
  return <LegalPage doc={getLegalDoc('terms', locale)} notice={locale === 'ja' ? undefined : getMessages(locale).legal.translationNotice} />
}
