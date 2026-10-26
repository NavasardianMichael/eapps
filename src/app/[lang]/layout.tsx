import type { CSSProperties, ReactNode } from 'react'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { getDirection, LOCALES } from '@i18n/config'
import { routing } from '@i18n/routing'
import { GA_ENABLED, GA_INIT_SCRIPT, GA_SCRIPT_SRC } from '@constants/analytics'
import { AUTHOR, SITE_NAME } from '@constants/app'
import { getSiteUrl } from '@helpers/url'
import { Footer } from '@components/layout/Footer'
import { Header } from '@components/layout/Header'
import '@styles/globals.css'
import { fontSans, getScriptFont } from '@styles/fonts'
import { PAPER } from '@styles/tokens'

/**
 * No `maximumScale`/`userScalable`: pinch-zoom must stay available. `viewportFit: 'cover'`
 * makes `env(safe-area-inset-*)` non-zero on notched phones. Light only.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: PAPER[100],
  colorScheme: 'light',
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: t('homeTitle'), template: `%s | ${SITE_NAME}` },
    description: t('homeDescription'),
    keywords: t('keywords'),
    applicationName: SITE_NAME,
    manifest: '/manifest.webmanifest',
    openGraph: { type: 'website', siteName: SITE_NAME },
    creator: AUTHOR.name,
    authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
    category: 'technology',
    robots: {
      index: true,
      follow: true,
      // Let search show the full description and a large preview — both help click-through.
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
    verification: siteVerification(),
  }
}

/** Search-console ownership tokens, each emitted only when set: Google, Yandex (ru) and Bing (which also feeds Copilot and ChatGPT search). */
const siteVerification = (): Metadata['verification'] => {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  const yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
  const bing = process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
  return {
    ...(google ? { google } : {}),
    ...(yandex ? { yandex } : {}),
    ...(bing ? { other: { 'msvalidate.01': bing } } : {}),
  }
}

/** Prerenders the page for every locale; otherwise every route would be dynamic. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

type Props = {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export default async function RootLayout({ children, params }: Props) {
  const { lang } = await params
  // A path segment is user input until proven otherwise; an unknown one must 404.
  if (!hasLocale(routing.locales, lang)) notFound()

  const t = await getTranslations('Common')
  const messages = await getMessages()
  const scriptFont = getScriptFont(lang)
  const style = scriptFont ? ({ '--font-script': `'${scriptFont.family}'` } as CSSProperties) : undefined

  return (
    // `data-scroll-behavior`: globals.css scrolls smoothly; Next turns it off during route changes.
    <html
      lang={lang}
      dir={getDirection(lang)}
      data-scroll-behavior='smooth'
      className={fontSans.variable}
      style={style}
    >
      <head>
        {scriptFont && (
          <>
            <link rel='preconnect' href='https://fonts.googleapis.com' />
            <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
            <link rel='stylesheet' href={scriptFont.href} />
          </>
        )}
      </head>
      <body>
        <a
          href='#main'
          className='sr-only z-50 rounded-full bg-ink-900 px-4 py-2 font-bold text-white focus:not-sr-only focus:fixed focus:inset-s-4 focus:top-4'
        >
          {t('skipToContent')}
        </a>
        {/* The page is server components; the only client copy is the error boundary's, so only `Errors` ships. */}
        <NextIntlClientProvider messages={{ Errors: messages.Errors }}>
          <Header />
          <main id='main'>{children}</main>
          <Footer />
        </NextIntlClientProvider>
        {GA_ENABLED && (
          <>
            <Script src={GA_SCRIPT_SRC} strategy='afterInteractive' />
            <Script id='ga-init' strategy='afterInteractive'>
              {GA_INIT_SCRIPT}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
