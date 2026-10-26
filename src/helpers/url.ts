import { SITE_URL_FALLBACK } from '@constants/app'

export const getSiteUrl = (): string => (process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK).replace(/\/+$/, '')

export const absoluteUrl = (path: string): string => `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`

/**
 * An outbound link to a listed app, tagged so the app's own analytics can tell marketplace
 * traffic apart. The canonical `app.url` (JSON-LD, llms.txt) stays untagged.
 */
export const appLinkUrl = (url: string, locale: string): string => {
  const target = new URL(url)
  // The Chrome Web Store keeps its own attribution; tags there only clutter the link.
  if (target.hostname === 'chromewebstore.google.com') return url
  target.searchParams.set('utm_source', 'eapps.site')
  target.searchParams.set('utm_medium', 'marketplace')
  target.searchParams.set('utm_content', locale)
  return target.toString()
}
