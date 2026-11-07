/** Every internal path, locale-free. `@i18n/navigation` adds the prefix. */
export const ROUTES = {
  home: '/',
  /** English only: the shared policy every app on *.eapps.site links to (`next.config.ts` redirects the other locales). */
  privacy: '/privacy',
} as const

export type RouteKey = keyof typeof ROUTES

/** Public pages, each emitted once per locale into the sitemap. */
export const INDEXABLE_ROUTES: readonly RouteKey[] = ['home']

/** In-page anchors on the home page; the header links to them. */
export const SECTIONS = {
  apps: 'apps',
  why: 'why',
  faq: 'faq',
} as const
