import { getTranslations } from 'next-intl/server'
import { SECTIONS } from '@constants/routes'
import { Icon, type IconName } from '@components/ui/Icon'
import { Section } from '@components/ui/Section'

/** Icons in the order of `Why.items` in the catalogues. */
const ICONS: IconName[] = ['heart', 'languages', 'devices']

type Point = { title: string; body: string }

export const WhySection = async () => {
  const t = await getTranslations('Why')
  const points = t.raw('items') as Point[]

  return (
    <Section id={SECTIONS.why} title={t('title')} className='pt-4 sm:pt-6'>
      <ul className='grid gap-4 md:grid-cols-3'>
        {points.map(({ title, body }, index) => (
          <li key={title} className='flex flex-col gap-3 rounded-card bg-paper-200/70 p-6'>
            <span className='flex size-11 items-center justify-center rounded-full bg-white text-brand-600 shadow-card'>
              <Icon name={ICONS[index] ?? 'heart'} />
            </span>
            <h3 className='text-h3 font-bold text-ink-900'>{title}</h3>
            <p className='text-body-sm text-ink-700'>{body}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
