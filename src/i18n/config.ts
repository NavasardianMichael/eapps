/**
 * The site's languages: the ones its apps are built for first. Every app speaks English; the
 * games are also written natively in Russian and Armenian.
 *
 * The locale is a path segment: every route lives under `app/[lang]/` and every URL names
 * its language, English included (`localePrefix: 'always'`). `src/proxy.ts` negotiates a
 * locale only for unprefixed traffic — `NEXT_LOCALE` cookie, then `Accept-Language`.
 */
export const LOCALES = ['en', 'ru', 'hy'] as const

export type Locale = (typeof LOCALES)[number]

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale)

export const DEFAULT_LOCALE: Locale = 'en'

/** next-intl's cookie, written by its middleware and by `<Link locale>`. Read by `src/proxy.ts`. */
export const LOCALE_COOKIE = 'NEXT_LOCALE'

export type Direction = 'ltr' | 'rtl'

/** All three languages read left to right; kept so `<html dir>` stays explicit when an RTL one joins. */
export const getDirection = (_locale: Locale): Direction => 'ltr'

/**
 * Endonyms — each language named in itself, which is what a language switcher must show:
 * someone who cannot read the current UI language still has to find their own. Never
 * translate these.
 */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
  hy: 'Հայերեն',
}

/** OpenGraph wants `ll_CC`. */
export const OG_LOCALES: Record<Locale, string> = {
  en: 'en_US',
  ru: 'ru_RU',
  hy: 'hy_AM',
}
