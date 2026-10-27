/**
 * The brand as every language writes it: lowercase, never translated. The web manifest and
 * the JSON-LD `Organization` use it verbatim.
 */
export const SITE_NAME = 'eapps'

/** The site-wide link preview (`src/app/opengraph-image.tsx`), the size every network expects. */
export const OG_IMAGE_PATH = '/opengraph-image'
export const OG_IMAGE_SIZE = { width: 1200, height: 630 } as const

export const SITE_URL_FALLBACK = 'http://localhost:7008'

export const AUTHOR = {
  name: 'Michael Navasardyan',
  url: 'https://www.linkedin.com/in/michael-navasardyan/',
  sameAs: ['https://www.linkedin.com/in/michael-navasardyan/', 'https://github.com/NavasardianMichael'],
} as const

/**
 * When the public copy (catalogue, FAQ) last changed: the sitemap's `lastmod` and JSON-LD
 * `dateModified`. Bump it with the copy — a date that moves on every deploy teaches crawlers
 * to ignore it.
 */
export const CONTENT_UPDATED_AT = new Date('2026-10-27T00:00:00Z')
