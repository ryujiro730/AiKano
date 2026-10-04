import type { Locale } from '../config'
import type { LegalDoc } from './types'
import { termsJa } from './terms-ja'
import { privacyJa } from './privacy-ja'
import { GENERATED_LEGAL } from './generated'

const JA = { terms: termsJa, privacy: privacyJa }

export function getLegalDoc(kind: 'terms' | 'privacy', locale: Locale): LegalDoc {
  return locale === 'ja' ? JA[kind] : GENERATED_LEGAL[kind][locale] ?? JA[kind]
}

export function legalSourceJa(kind: 'terms' | 'privacy') {
  return JA[kind]
}
