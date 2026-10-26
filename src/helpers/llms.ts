import en from '@messages/en.json'
import hy from '@messages/hy.json'
import ru from '@messages/ru.json'
import { createTranslator } from 'next-intl'
import { type Locale, LOCALE_LABELS, LOCALES } from '@i18n/config'
import { localePath } from '@i18n/pathname'
import { AUTHOR, SITE_NAME } from '@constants/app'
import { appLanguageCount, CATALOG, type CatalogApp } from '@constants/catalog'
import { ROUTES } from '@constants/routes'
import { absoluteUrl } from '@helpers/url'

/**
 * `/llms.txt` and `/llms-full.txt` (llmstxt.org): the site described for AI assistants and
 * answer engines, in Markdown. Built from the catalogue and the message catalogues, so it can
 * never drift from what the page says. Every URL is absolute.
 */
const MESSAGES = { en, ru, hy } as const

const translator = (locale: Locale) => createTranslator({ locale, messages: MESSAGES[locale] })

type FaqItem = { question: string; answer: string }

const PLATFORM_FACTS: Record<CatalogApp['platform'], string> = {
  pwa: 'installable web app (PWA), works offline',
  web: 'web app',
  chrome: 'Chrome extension',
}

const PRICING_FACTS: Record<CatalogApp['pricing'], string> = {
  free: 'free, no sign-up',
  freemium: 'free to start, one-time paid upgrades',
}

/** One line an answer engine can quote: name, link, what it is, and the facts behind it. */
const appLine = (locale: Locale, app: CatalogApp): string => {
  const t = translator(locale)
  const facts = [PLATFORM_FACTS[app.platform], PRICING_FACTS[app.pricing], `${appLanguageCount(app)} language(s)`]
  return `- [${t(`Apps.${app.id}.name`)}](${app.url}): ${t(`Apps.${app.id}.description`)} (${facts.join('; ')})`
}

const header = (): string[] => {
  const t = translator('en')
  return [
    `# ${SITE_NAME}`,
    '',
    `> ${t('Common.tagline')}`,
    '',
    `${SITE_NAME} (${absoluteUrl('/')}) is a marketplace of ${CATALOG.length} free web apps and games, each a standalone site. Made by ${AUTHOR.name} (${AUTHOR.url}).`,
    '',
    '## Apps',
    '',
    ...CATALOG.map((app) => appLine('en', app)),
  ]
}

export const buildLlmsTxt = (): string =>
  [
    ...header(),
    '',
    '## Pages',
    '',
    ...LOCALES.map(
      (locale) =>
        `- [${LOCALE_LABELS[locale]}](${absoluteUrl(localePath(locale, ROUTES.home))}): ${translator(locale)('Seo.homeDescription')}`
    ),
    '',
    '## Optional',
    '',
    `- [Full text](${absoluteUrl('/llms-full.txt')}): every app description and the FAQ, in English, Russian and Armenian`,
    `- [Sitemap](${absoluteUrl('/sitemap.xml')})`,
    '',
  ].join('\n')

const longForm = (locale: Locale): string[] => {
  const t = translator(locale)
  const faq = t.raw('Faq.items') as FaqItem[]
  return [
    `## ${LOCALE_LABELS[locale]} (${absoluteUrl(localePath(locale, ROUTES.home))})`,
    '',
    `### ${t('Catalog.title')}`,
    '',
    ...CATALOG.flatMap((app) => [
      `#### ${t(`Apps.${app.id}.name`)}`,
      '',
      `${t(`Apps.${app.id}.tagline`)} ${t(`Apps.${app.id}.description`)}`,
      '',
      `${app.url}`,
      '',
    ]),
    `### ${t('Faq.title')}`,
    '',
    ...faq.flatMap(({ question, answer }) => [`**${question}**`, '', answer, '']),
  ]
}

export const buildLlmsFullTxt = (): string => [...header(), '', ...LOCALES.flatMap(longForm)].join('\n')
