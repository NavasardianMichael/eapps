import { useLocale, useTranslations } from 'next-intl'
import { ACCENT_CLASSES } from '@constants/accents'
import { appLanguageCount, type CatalogApp } from '@constants/catalog'
import { cn } from '@helpers/cn'
import { appLinkUrl } from '@helpers/url'
import { AppGlyph, Icon } from '@components/ui/Icon'

/**
 * One app on the shelf. The app's name is the card's single link, stretched over the whole
 * card (`after:inset-0`): one tab stop, and the anchor text a crawler sees is the app's name.
 * The "Open" pill is its visual echo, hidden from assistive tech.
 */
export const AppCard = ({ app }: { app: CatalogApp }) => {
  const t = useTranslations()
  const locale = useLocale()
  const accent = ACCENT_CLASSES[app.accent]
  const name = t(`Apps.${app.id}.name`)

  return (
    <article
      className={cn(
        'card group relative flex flex-col gap-5 p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift',
        accent.ring
      )}
    >
      <div className='flex items-start justify-between gap-4'>
        <span className={cn('flex size-14 items-center justify-center rounded-tile', accent.tile)}>
          <AppGlyph id={app.id} className='size-7' />
        </span>
        <ul className='flex flex-wrap justify-end gap-1.5 text-caption font-bold'>
          <li className={cn('rounded-full px-2.5 py-1', accent.chip)}>{t(`Catalog.category.${app.category}`)}</li>
          <li className='rounded-full bg-paper-200 px-2.5 py-1 text-ink-700'>{t(`Catalog.pricing.${app.pricing}`)}</li>
        </ul>
      </div>

      <div className='flex flex-col gap-2'>
        <h3 className='text-h3 font-extrabold text-ink-900'>
          <a
            href={appLinkUrl(app.url, locale)}
            target='_blank'
            rel='noopener'
            aria-label={`${t('Catalog.openLabel', { name })} (${t('Common.opensInNewTab')})`}
            className='after:absolute after:inset-0 after:rounded-card focus-visible:outline-none focus-visible:after:outline-3 focus-visible:after:outline-brand-500'
          >
            {name}
          </a>
        </h3>
        <p className='font-semibold text-ink-900'>{t(`Apps.${app.id}.tagline`)}</p>
        <p className='text-body-sm text-ink-700'>{t(`Apps.${app.id}.description`)}</p>
      </div>

      <div className='mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line-subtle pt-4'>
        <p className='text-caption font-semibold text-ink-500'>
          {t(`Catalog.platform.${app.platform}`)} · {t('Catalog.languages', { count: appLanguageCount(app) })}
        </p>
        <span
          aria-hidden
          className='inline-flex items-center gap-1.5 text-body-sm font-bold text-brand-700 transition-transform group-hover:translate-x-0.5'
        >
          {t('Catalog.open')}
          <Icon name='external' className='size-4' />
        </span>
      </div>
    </article>
  )
}
