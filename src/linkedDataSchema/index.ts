import type {
  CollectionPage,
  FAQPage,
  Organization,
  Person,
  SoftwareApplication,
  WebSite,
  WithContext,
} from 'schema-dts'
import type { Locale } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { AUTHOR, OG_IMAGE_PATH, SITE_NAME } from '@constants/app'
import { type CatalogApp, OPERATING_SYSTEMS } from '@constants/catalog'
import { absoluteUrl } from '@helpers/url'

/**
 * JSON-LD builders. Every URL is absolute and locale-prefixed, matching the page's canonical.
 * The organisation and the site are the same entity on every locale's page, so they carry a
 * stable `@id` and the other nodes point at it instead of repeating it — that is what lets an
 * answer engine merge `/en`, `/ru` and `/hy` into one publisher. Typed with `schema-dts`, so a
 * misspelt property is a compile error rather than a silently ignored field.
 */
export const ORGANIZATION_ID = `${absoluteUrl('/')}#organization`
export const WEBSITE_ID = `${absoluteUrl('/')}#website`

const author: Person = { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url, sameAs: [...AUTHOR.sameAs] }

export const organizationSchema = (description: string, apps: readonly CatalogApp[]): WithContext<Organization> => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: absoluteUrl('/'),
  logo: absoluteUrl('/icon'),
  description,
  founder: author,
  // The apps are this publisher's own properties; listing them ties their reputations together.
  owns: apps.map(({ url }) => ({ '@type': 'SoftwareApplication', url })),
})

export const websiteSchema = (locale: Locale, description: string): WithContext<WebSite> => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: absoluteUrl(localePath(locale, '/')),
  inLanguage: locale,
  description,
  publisher: { '@id': ORGANIZATION_ID },
})

export type LocalizedApp = CatalogApp & { name: string; description: string }

export const softwareApplicationSchema = (app: LocalizedApp): SoftwareApplication => ({
  '@type': 'SoftwareApplication',
  name: app.name,
  description: app.description,
  url: app.url,
  applicationCategory: app.schemaCategory,
  applicationSubCategory: app.genre,
  operatingSystem: OPERATING_SYSTEMS[app.platform],
  inLanguage: [...app.languages],
  isAccessibleForFree: true,
  // A freemium app states only its free entry point: a made-up price would be worse than none.
  offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' },
  author,
  publisher: { '@id': ORGANIZATION_ID },
})

type PageInput = { locale: Locale; name: string; description: string; path: string; dateModified: Date }

/** The home page: a collection whose main entity is the ordered list of apps. */
export const catalogPageSchema = (page: PageInput, apps: LocalizedApp[]): WithContext<CollectionPage> => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: page.name,
  description: page.description,
  url: absoluteUrl(localePath(page.locale, page.path)),
  inLanguage: page.locale,
  dateModified: page.dateModified.toISOString(),
  isPartOf: { '@id': WEBSITE_ID },
  primaryImageOfPage: { '@type': 'ImageObject', url: absoluteUrl(OG_IMAGE_PATH) },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: apps.length,
    itemListOrder: 'https://schema.org/ItemListUnordered',
    itemListElement: apps.map((app, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: softwareApplicationSchema(app),
    })),
  },
})

export const faqSchema = (items: { question: string; answer: string }[]): WithContext<FAQPage> => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
})
