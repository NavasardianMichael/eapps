import type { MetadataRoute } from 'next'
import { DEFAULT_LOCALE } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { SITE_NAME } from '@constants/app'
import { ROUTES } from '@constants/routes'
import { PAPER } from '@styles/tokens'

/** Brand and icons for "Add to Home Screen". No service worker: the page is a directory, not an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: 'Free web apps and games that open in your browser and speak your language.',
    lang: DEFAULT_LOCALE,
    dir: 'ltr',
    // localePrefix is 'always', so '/' is a redirect; a start_url that redirects can loop.
    start_url: localePath(DEFAULT_LOCALE, ROUTES.home),
    scope: '/',
    display: 'browser',
    background_color: PAPER[100],
    theme_color: PAPER[100],
    categories: ['games', 'productivity', 'utilities'],
    icons: [{ src: '/icon', sizes: '512x512', type: 'image/png', purpose: 'any' }],
  }
}
