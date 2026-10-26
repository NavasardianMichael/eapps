import { useTranslations } from 'next-intl'
import { LOCALE_LABELS, LOCALES } from '@i18n/config'
import { AUTHOR, SITE_NAME } from '@constants/app'
import { CATALOG } from '@constants/catalog'
import { ROUTES } from '@constants/routes'
import { Emblem } from '@components/brand/Emblem'
import { AppLink } from '@components/ui/AppLink'

/**
 * Server-rendered, so every link is crawlable: the apps (outbound, to their canonical URLs)
 * and each locale's home page — together with `hreflang` and the sitemap, that is how every
 * language variant is found.
 */
export const Footer = () => {
  const t = useTranslations()
  const year = new Date().getFullYear()
  const linkClass = 'text-body-sm font-semibold text-ink-700 transition-colors hover:text-brand-700'

  return (
    <footer className='mt-8 border-t border-line-subtle bg-paper-200/60 pb-safe'>
      <div className='container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-2.5'>
            <Emblem className='size-9' />
            <p className='text-h3 font-extrabold tracking-tight'>{SITE_NAME}</p>
          </div>
          <p className='max-w-sm text-body-sm text-ink-700'>{t('Common.tagline')}</p>
        </div>

        <nav aria-label={t('Nav.footer')}>
          <h2 className='eyebrow mb-3'>{t('Nav.apps')}</h2>
          <ul className='flex flex-col gap-2'>
            {CATALOG.map(({ id, url }) => (
              <li key={id}>
                <a href={url} target='_blank' rel='noopener' className={linkClass}>
                  {t(`Apps.${id}.name`)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className='eyebrow mb-3'>{t('Common.language')}</h2>
          <ul className='flex flex-col gap-2'>
            {LOCALES.map((locale) => (
              <li key={locale}>
                <AppLink href={ROUTES.home} locale={locale} lang={locale} hrefLang={locale} className={linkClass}>
                  {LOCALE_LABELS[locale]}
                </AppLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='container-page flex flex-wrap items-center justify-between gap-2 border-t border-line-strong py-5 text-caption text-ink-500'>
        <p>{t('Common.copyright', { year, siteName: SITE_NAME })}</p>
        <p>
          {t('Common.madeBy', { author: AUTHOR.name })} ·{' '}
          <a href={AUTHOR.url} target='_blank' rel='noopener author' className='underline-offset-4 hover:underline'>
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  )
}
