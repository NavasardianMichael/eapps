import en from '@messages/en.json'
import hy from '@messages/hy.json'
import ru from '@messages/ru.json'
import { describe, expect, it } from 'vitest'
import { ACCENT_CLASSES } from '@constants/accents'
import { APP_IDS, CATALOG } from '@constants/catalog'
import { appLinkUrl } from '@helpers/url'

const CATALOGUES = { en, ru, hy }

describe('the app catalogue', () => {
  it('lists every app id exactly once, in a stable order', () => {
    expect(CATALOG.map(({ id }) => id)).toEqual([...APP_IDS])
  })

  it('links every app over https', () => {
    for (const { url } of CATALOG) expect(new URL(url).protocol).toBe('https:')
  })

  it.each(Object.entries(CATALOGUES))('names and describes every app in %s', (_, messages) => {
    for (const id of APP_IDS) {
      const copy = (messages.Apps as Record<string, Record<string, string>>)[id]
      expect(copy?.name, id).toBeTruthy()
      expect(copy?.tagline, id).toBeTruthy()
      expect(copy?.description?.length, id).toBeGreaterThan(60)
    }
    expect(Object.keys(messages.Apps).sort()).toEqual([...APP_IDS].sort())
  })

  it('has a literal class set for every accent in use', () => {
    for (const { accent } of CATALOG) expect(ACCENT_CLASSES[accent]).toBeDefined()
  })
})

describe('outbound app links', () => {
  it('tag marketplace traffic without touching the canonical URL', () => {
    const tagged = new URL(appLinkUrl('https://crossword.eapps.site', 'hy'))
    expect(tagged.origin).toBe('https://crossword.eapps.site')
    expect(tagged.searchParams.get('utm_source')).toBe('eapps.site')
    expect(tagged.searchParams.get('utm_content')).toBe('hy')
    expect(CATALOG[0]?.url).toBe('https://crossword.eapps.site')
  })

  it('leave Chrome Web Store links alone', () => {
    const store = CATALOG.find(({ platform }) => platform === 'chrome')!
    expect(appLinkUrl(store.url, 'en')).toBe(store.url)
  })
})
