import { useLocale, useTranslations } from 'next-intl'
import { LOCALE_LABELS, LOCALES } from '@i18n/config'
import { ROUTES } from '@constants/routes'
import { cn } from '@helpers/cn'
import { AppLink } from '@components/ui/AppLink'

/**
 * Three languages fit inline, so this is plain links rather than a menu: no JavaScript of its
 * own, and every variant is a crawlable `<a hreflang>`. Each shows its code and is named by
 * its endonym (with `lang`), so someone who cannot read the current UI still finds theirs.
 * next-intl's `<Link locale>` writes the `NEXT_LOCALE` cookie, so the choice sticks for `/`.
 */
export const LanguageSwitcher = ({ className }: { className?: string }) => {
  const current = useLocale()
  const t = useTranslations('Common')

  return (
    <nav aria-label={t('chooseLanguage')} className={cn('flex items-center rounded-full bg-paper-200 p-1', className)}>
      {LOCALES.map((locale) => {
        const active = locale === current
        return (
          <AppLink
            key={locale}
            href={ROUTES.home}
            locale={locale}
            lang={locale}
            hrefLang={locale}
            aria-label={LOCALE_LABELS[locale]}
            aria-current={active ? 'true' : undefined}
            className={cn(
              'flex min-h-9 min-w-11 items-center justify-center rounded-full px-2.5 text-caption font-bold uppercase tracking-wider transition-colors',
              active ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-900'
            )}
          >
            {locale}
          </AppLink>
        )
      })}
    </nav>
  )
}
