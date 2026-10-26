import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { currentLocale, pageMetadata } from '@i18n/metadata'
import { CONTENT_UPDATED_AT } from '@constants/app'
import { CATALOG } from '@constants/catalog'
import { ROUTES, SECTIONS } from '@constants/routes'
import { catalogPageSchema, organizationSchema, websiteSchema } from '@linkedDataSchema/index'
import { AppCard } from '@components/marketing/AppCard'
import { FaqSection } from '@components/marketing/FaqSection'
import { Hero } from '@components/marketing/Hero'
import { WhySection } from '@components/marketing/WhySection'
import { JsonLd } from '@components/seo/JsonLd'
import { Section } from '@components/ui/Section'

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Seo')
  return pageMetadata({
    path: ROUTES.home,
    title: t('homeTitle'),
    description: t('homeDescription'),
    absoluteTitle: true,
  })
}

export default async function HomePage() {
  const locale = await currentLocale()
  const t = await getTranslations()
  const description = t('Seo.homeDescription')
  const apps = CATALOG.map((app) => ({
    ...app,
    name: t(`Apps.${app.id}.name`),
    description: t(`Apps.${app.id}.description`),
  }))

  return (
    <>
      <JsonLd data={organizationSchema(t('Common.tagline'), CATALOG)} />
      <JsonLd data={websiteSchema(locale, description)} />
      <JsonLd
        data={catalogPageSchema(
          { locale, name: t('Seo.homeTitle'), description, path: ROUTES.home, dateModified: CONTENT_UPDATED_AT },
          apps
        )}
      />

      <Hero />

      <Section id={SECTIONS.apps} title={t('Catalog.title')} subtitle={t('Catalog.subtitle')}>
        <ul className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {CATALOG.map((app) => (
            <li key={app.id} className='flex'>
              <AppCard app={app} />
            </li>
          ))}
        </ul>
      </Section>

      <WhySection />
      <FaqSection />
    </>
  )
}
