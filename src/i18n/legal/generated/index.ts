import type { Locale } from '../../config'
import type { LegalDoc } from '../types'
import terms_en from './terms.en.json'
import terms_es from './terms.es.json'
import terms_pt from './terms.pt.json'
import terms_de from './terms.de.json'
import terms_fr from './terms.fr.json'
import privacy_en from './privacy.en.json'
import privacy_es from './privacy.es.json'
import privacy_pt from './privacy.pt.json'
import privacy_de from './privacy.de.json'
import privacy_fr from './privacy.fr.json'

// scripts/translate-i18n.ts が生成する翻訳版（日本語版が正）
export const GENERATED_LEGAL: Record<'terms' | 'privacy', Partial<Record<Locale, LegalDoc>>> = {
  terms: { en: terms_en as LegalDoc, es: terms_es as LegalDoc, pt: terms_pt as LegalDoc, de: terms_de as LegalDoc, fr: terms_fr as LegalDoc },
  privacy: { en: privacy_en as LegalDoc, es: privacy_es as LegalDoc, pt: privacy_pt as LegalDoc, de: privacy_de as LegalDoc, fr: privacy_fr as LegalDoc },
}
