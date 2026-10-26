import en from '@messages/en.json'
import hy from '@messages/hy.json'
import ru from '@messages/ru.json'
import { describe, expect, it } from 'vitest'
import { CONTENT_UPDATED_AT } from '@constants/app'
import { CATALOG } from '@constants/catalog'
import { ROUTES } from '@constants/routes'
import { buildLlmsFullTxt, buildLlmsTxt } from '@helpers/llms'
import {
  catalogPageSchema,
  faqSchema,
  ORGANIZATION_ID,
  organizationSchema,
  WEBSITE_ID,
  websiteSchema,
} from '@linkedDataSchema/index'

const apps = CATALOG.map((app) => ({
  ...app,
  name: en.Apps[app.id].name,
  description: en.Apps[app.id].description,
}))

describe('JSON-LD builders', () => {
  it('gives the publisher and the site stable ids the other nodes point at', () => {
    expect(ORGANIZATION_ID).toBe('https://eapps.site/#organization')
    expect(organizationSchema('About', CATALOG)).toMatchObject({ '@id': ORGANIZATION_ID, name: 'eapps' })
    expect(websiteSchema('hy', 'About')).toMatchObject({
      '@id': WEBSITE_ID,
      url: 'https://eapps.site/hy',
      inLanguage: 'hy',
      publisher: { '@id': ORGANIZATION_ID },
    })
  })

  it('lists every app as a SoftwareApplication, in catalogue order', () => {
    const page = catalogPageSchema(
      { locale: 'ru', name: 'eapps', description: 'About', path: ROUTES.home, dateModified: CONTENT_UPDATED_AT },
      apps
    )
    expect(page).toMatchObject({ url: 'https://eapps.site/ru', isPartOf: { '@id': WEBSITE_ID } })
    const list = page.mainEntity as unknown as {
      numberOfItems: number
      itemListElement: { position: number; item: object }[]
    }
    expect(list.numberOfItems).toBe(CATALOG.length)
    list.itemListElement.forEach(({ position, item }, index) => {
      expect(position).toBe(index + 1)
      expect(item).toMatchObject({
        '@type': 'SoftwareApplication',
        name: apps[index]!.name,
        url: CATALOG[index]!.url,
        offers: { price: 0 },
      })
    })
  })

  it('turns the FAQ into Question/Answer pairs, word for word', () => {
    const schema = faqSchema(en.Faq.items)
    expect(schema.mainEntity).toHaveLength(en.Faq.items.length)
    expect((schema.mainEntity as object[])[0]).toMatchObject({
      '@type': 'Question',
      name: en.Faq.items[0]!.question,
      acceptedAnswer: { text: en.Faq.items[0]!.answer },
    })
  })
})

describe('llms.txt', () => {
  const summary = buildLlmsTxt()
  const full = buildLlmsFullTxt()

  it('links every app and every locale home page', () => {
    for (const { url } of CATALOG) expect(summary).toContain(`(${url})`)
    for (const locale of ['en', 'ru', 'hy']) expect(summary).toContain(`(https://eapps.site/${locale})`)
  })

  it('carries every app description and FAQ answer, in all three languages', () => {
    for (const messages of [en, ru, hy]) {
      for (const { id } of CATALOG) expect(full).toContain(messages.Apps[id].description)
      for (const { question, answer } of messages.Faq.items) {
        expect(full).toContain(question)
        expect(full).toContain(answer)
      }
    }
  })

  it('states facts, never placeholders', () => {
    expect(summary).toContain(`${CATALOG.length} free web apps`)
    expect(summary).not.toMatch(/\{[a-z]+\}/)
    expect(full).not.toMatch(/\{[a-z]+\}/)
  })
})
