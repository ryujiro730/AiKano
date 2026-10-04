import { cookies, headers } from 'next/headers'
import { isLocale, localeFromAcceptLanguage, LOCALE_COOKIE, LOCALE_HEADER, type Locale } from './config'
import { MESSAGES } from './messages'

/** middleware が決めた言語（なければ Cookie → Accept-Language） */
export function getLocale(): Locale {
  const h = headers()
  const fromHeader = h.get(LOCALE_HEADER)
  if (isLocale(fromHeader)) return fromHeader
  const fromCookie = cookies().get(LOCALE_COOKIE)?.value
  if (isLocale(fromCookie)) return fromCookie
  return localeFromAcceptLanguage(h.get('accept-language'))
}

export function getMessages(locale: Locale = getLocale()) {
  return MESSAGES[locale]
}
