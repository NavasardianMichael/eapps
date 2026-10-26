'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations('Errors')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className='container-page flex min-h-[50dvh] flex-col items-center justify-center gap-4 py-16 text-center'>
      <h1 className='text-h2 font-bold text-ink-900'>{t('pageErrorTitle')}</h1>
      <p className='max-w-md text-ink-700'>{t('pageErrorBody')}</p>
      <button type='button' onClick={reset} className='btn btn-primary mt-2'>
        {t('retry')}
      </button>
    </div>
  )
}
