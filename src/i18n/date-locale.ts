import { ja, enUS, es, ptBR, de, fr } from 'date-fns/locale'
import type { Locale } from './config'

export const DATE_FNS_LOCALE = { ja, en: enUS, es, pt: ptBR, de, fr } satisfies Record<Locale, unknown>
