import { getTranslations } from 'next-intl/server'
import { ROUTES } from '@constants/routes'
import { Emblem } from '@components/brand/Emblem'
import { AppLink } from '@components/ui/AppLink'

export default async function NotFound() {
  const t = await getTranslations('Errors')
  return (
    <div className='container-page flex min-h-[60dvh] flex-col items-center justify-center gap-4 py-16 text-center'>
      <Emblem className='size-20' />
      <p aria-hidden className='text-display font-extrabold text-brand-500'>
        404
      </p>
      <h1 className='text-h2 font-bold'>{t('notFoundTitle')}</h1>
      <p className='max-w-md text-ink-700'>{t('notFoundBody')}</p>
      <AppLink href={ROUTES.home} className='btn btn-primary mt-2'>
        {t('goHome')}
      </AppLink>
    </div>
  )
}
