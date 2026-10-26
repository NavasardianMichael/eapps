import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE, LOCALES } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { CONTENT_UPDATED_AT } from '@constants/app'
import { INDEXABLE_ROUTES, ROUTES } from '@constants/routes'
import { absoluteUrl } from '@helpers/url'

/**
 * Every public page × every locale, each entry carrying the full `hreflang` set (and
 * `x-default`) so crawlers see one page in three languages rather than competing
 * near-duplicates. `lastModified` is when the copy changed, not the build time.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.flatMap((key) => {
    const path = ROUTES[key]
    const languages = {
      ...Object.fromEntries(LOCALES.map((locale) => [locale, absoluteUrl(localePath(locale, path))])),
      'x-default': absoluteUrl(localePath(DEFAULT_LOCALE, path)),
    }
    return LOCALES.map((locale) => ({
      url: absoluteUrl(localePath(locale, path)),
      lastModified: CONTENT_UPDATED_AT,
      changeFrequency: 'weekly' as const,
      priority: 1,
      alternates: { languages },
    }))
  })
}
