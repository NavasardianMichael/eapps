import { getTranslations } from 'next-intl/server'
import { SECTIONS } from '@constants/routes'
import { faqSchema } from '@linkedDataSchema/index'
import { JsonLd } from '@components/seo/JsonLd'
import { Icon } from '@components/ui/Icon'
import { Section } from '@components/ui/Section'

type FaqItem = { question: string; answer: string }

/**
 * Native `<details>`: no JavaScript, and every answer is in the server HTML (collapsed until
 * opened), matching the FAQPage JSON-LD beside it word for word — answer engines quote
 * both, and a mismatch between them is what gets rich results withdrawn.
 */
export const FaqSection = async () => {
  const t = await getTranslations('Faq')
  const items = t.raw('items') as FaqItem[]

  return (
    <Section id={SECTIONS.faq} title={t('title')} align='center'>
      <JsonLd data={faqSchema(items)} />
      <div className='card mx-auto max-w-3xl divide-y divide-line-subtle overflow-hidden'>
        {items.map(({ question, answer }) => (
          <details key={question} className='group'>
            <summary className='flex min-h-14 list-none items-center justify-between gap-4 px-6 py-4 font-bold text-ink-900 transition-colors hover:bg-paper-50 [&::-webkit-details-marker]:hidden'>
              <h3 className='text-body'>{question}</h3>
              <Icon name='chevronDown' className='text-brand-600 transition-transform group-open:rotate-180' />
            </summary>
            <p className='px-6 pb-5 text-ink-700'>{answer}</p>
          </details>
        ))}
      </div>
    </Section>
  )
}
