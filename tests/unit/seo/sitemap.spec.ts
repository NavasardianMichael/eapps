import { describe, expect, it } from 'vitest'
import { LOCALES } from '@i18n/config'
import { CONTENT_UPDATED_AT } from '@constants/app'
import { INDEXABLE_ROUTES } from '@constants/routes'
import robots from '../../../src/app/robots'
import sitemap from '../../../src/app/sitemap'

describe('sitemap', () => {
  const entries = sitemap()

  it('lists every public page in every locale', () => {
    expect(entries).toHaveLength(INDEXABLE_ROUTES.length * LOCALES.length)
    expect(entries.map(({ url }) => url)).toEqual([
      'https://eapps.site/en',
      'https://eapps.site/ru',
      'https://eapps.site/hy',
    ])
  })

  it('gives every entry the full hreflang set, plus x-default', () => {
    for (const entry of entries) {
      const languages = entry.alternates?.languages ?? {}
      expect(Object.keys(languages)).toHaveLength(LOCALES.length + 1)
      expect(String(languages['x-default' as keyof typeof languages])).toBe('https://eapps.site/en')
    }
  })

  it('dates entries by when the copy changed, not by the build', () => {
    for (const { lastModified } of entries) expect(new Date(lastModified!).getTime()).toBe(CONTENT_UPDATED_AT.getTime())
  })
})

describe('robots.txt', () => {
  const rules = robots()

  it('points at the sitemap and disallows nothing', () => {
    expect(rules.sitemap).toBe('https://eapps.site/sitemap.xml')
    expect(JSON.stringify(rules.rules)).not.toContain('disallow')
  })

  it('admits answer-engine crawlers by name', () => {
    const named = JSON.stringify(rules.rules)
    for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) expect(named).toContain(bot)
  })
})
