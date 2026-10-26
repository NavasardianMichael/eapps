import { isLocale, type Locale } from './config'

export type SplitPathname = {
  /** `undefined` when the path carries no locale prefix at all. */
  locale?: Locale
  /** The path as `src/constants/routes.ts` declares it, with no locale segment. */
  pathname: string
}

/**
 * A locale-free route path prefixed for one locale.
 *
 * `ROUTES.home` is `'/'`, which would otherwise yield `/en/` — a second URL for the same page,
 * and a redirect hop for anything that follows it.
 *
 * Lives here rather than in `metadata.ts` so JSON-LD builders, the sitemap and llms.txt can use
 * it without pulling in `next/root-params`, which is Server-Component-only.
 */
export const localePath = (locale: Locale, path: string): string => (path === '/' ? `/${locale}` : `/${locale}${path}`)

/** The inverse, for the proxy: `/hy/anything` → `{ locale: 'hy', pathname: '/anything' }`. */
export const splitLocaleFromPathname = (pathname: string): SplitPathname => {
  const [, maybeLocale, ...rest] = pathname.split('/')

  if (!isLocale(maybeLocale)) return { pathname }

  // '/hy' -> '/', not '' — ROUTES.home is '/' and a bare '' matches nothing.
  return { locale: maybeLocale, pathname: `/${rest.join('/')}` }
}
