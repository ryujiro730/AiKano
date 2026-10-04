import type { Locale } from '../config'
import type { Messages } from './ja'
import { ja } from './ja'
import { en } from './en'
import { es } from './es'
import { pt } from './pt'
import { de } from './de'
import { fr } from './fr'

export const MESSAGES: Record<Locale, Messages> = { ja, en, es, pt, de, fr }
