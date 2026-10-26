import { getTranslations } from 'next-intl/server'
import { ACCENT_CLASSES } from '@constants/accents'
import { appLanguageCount, CATALOG } from '@constants/catalog'
import { SECTIONS } from '@constants/routes'
import { cn } from '@helpers/cn'
import { AppGlyph, Icon } from '@components/ui/Icon'

/**
 * The page's one h1 and its pitch. The stats are computed from the catalogue, so they can
 * never claim more apps or languages than are listed. The tile row under it is decoration.
 */
export const Hero = async () => {
  const t = await getTranslations('Hero')
  const maxLanguages = Math.max(...CATALOG.map(appLanguageCount))
  const stats = [t('statApps', { count: CATALOG.length }), t('statLanguages', { count: maxLanguages }), t('statSignup')]

  return (
    <section className='hero-glow relative overflow-hidden'>
      <div className='container-page flex animate-rise flex-col items-center gap-6 pt-14 pb-12 text-center sm:pt-20 sm:pb-16'>
        <p className='eyebrow rounded-full border border-brand-200 bg-white/70 px-3 py-1'>{t('eyebrow')}</p>
        <h1 className='max-w-4xl text-display font-extrabold text-ink-900'>
          {t.rich('title', { mark: (chunks) => <span className='highlight'>{chunks}</span> })}
        </h1>
        <p className='max-w-2xl text-body text-ink-700 sm:text-h3 sm:font-medium'>{t('subtitle')}</p>
        <a href={`#${SECTIONS.apps}`} className='btn btn-primary mt-2 min-h-12 px-6'>
          {t('cta')}
          <Icon name='arrowDown' className='size-4' />
        </a>
        <ul className='flex flex-wrap justify-center gap-x-6 gap-y-2 text-body-sm font-semibold text-ink-500'>
          {stats.map((stat) => (
            <li key={stat} className='flex items-center gap-2'>
              <span aria-hidden className='size-1.5 rounded-full bg-brand-400' />
              {stat}
            </li>
          ))}
        </ul>
        <div aria-hidden className='mt-4 flex gap-3 sm:gap-4'>
          {CATALOG.map(({ id, accent }, index) => (
            <span
              key={id}
              className={cn(
                'flex size-12 items-center justify-center rounded-tile shadow-card sm:size-16',
                ACCENT_CLASSES[accent].tile,
                index % 2 === 1 ? 'translate-y-2' : '-translate-y-1'
              )}
            >
              <AppGlyph id={id} className='size-6 sm:size-7' />
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
