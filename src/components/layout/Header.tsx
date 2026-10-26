import { useTranslations } from 'next-intl'
import { SECTIONS } from '@constants/routes'
import { Logo } from '@components/brand/Logo'
import { LanguageSwitcher } from './LanguageSwitcher'

const NAV = [
  { labelKey: 'apps', anchor: SECTIONS.apps },
  { labelKey: 'why', anchor: SECTIONS.why },
  { labelKey: 'faq', anchor: SECTIONS.faq },
] as const

/** Sticky, translucent bar. The section links are in-page anchors, hidden on phones where the page is one short scroll. */
export const Header = () => {
  const t = useTranslations('Nav')
  return (
    <header className='sticky top-0 z-40 border-b border-line-subtle bg-paper-100/85 pt-safe backdrop-blur-md'>
      <div className='container-page flex h-header items-center gap-6'>
        <Logo className='me-auto shrink-0' />
        <nav aria-label={t('main')} className='hidden md:block'>
          <ul className='flex items-center gap-1'>
            {NAV.map(({ labelKey, anchor }) => (
              <li key={anchor}>
                <a
                  href={`#${anchor}`}
                  className='rounded-full px-3 py-2 text-body-sm font-semibold text-ink-700 transition-colors hover:bg-paper-200 hover:text-ink-900'
                >
                  {t(labelKey)}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <LanguageSwitcher className='shrink-0' />
      </div>
    </header>
  )
}
