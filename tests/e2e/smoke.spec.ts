import { expect, test } from '@playwright/test'

/** What a crawler sees: everything here runs with JavaScript off. */
test.describe('server rendering', () => {
  test.use({ javaScriptEnabled: false })

  test('the page is complete without JavaScript', async ({ page }) => {
    await page.goto('/en')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('#apps article')).toHaveCount(3)
    await expect(page.locator('a[href^="https://crossword.eapps.site"]')).not.toHaveCount(0)
  })

  test('every locale is self-canonical with hreflang for each language', async ({ page }) => {
    await page.goto('/hy')
    await expect(page.locator('html')).toHaveAttribute('lang', 'hy')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/hy$/)
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(4)
  })

  test('the home title stands alone and carries a link preview', async ({ page }) => {
    await page.goto('/en')
    await expect(page).toHaveTitle(/^eapps — /)
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/opengraph-image$/)
  })

  test('the FAQ answers are in the HTML, matching the FAQPage data', async ({ page }) => {
    await page.goto('/ru')
    const data = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((text) =>
      JSON.parse(text)
    )
    expect(data.map((each) => each['@type'])).toEqual(['Organization', 'WebSite', 'CollectionPage', 'FAQPage'])
    const faq = data.find((each) => each['@type'] === 'FAQPage')
    await expect(page.getByText(faq.mainEntity[0].acceptedAnswer.text)).toHaveCount(1)
  })
})

test('an unprefixed visit goes to the browser language', async ({ browser }) => {
  const context = await browser.newContext({ locale: 'hy-AM' })
  const page = await context.newPage()
  await page.goto('/')
  await expect(page).toHaveURL(/\/hy$/)
  await context.close()
})

test('switching language keeps the choice for the next unprefixed visit', async ({ page }) => {
  await page.goto('/en')
  await page.getByRole('navigation', { name: 'Choose language' }).getByRole('link', { name: 'Русский' }).click()
  await expect(page).toHaveURL(/\/ru$/)
  await page.goto('/')
  await expect(page).toHaveURL(/\/ru$/)
})

test('an app opens in a new tab', async ({ page }) => {
  await page.goto('/en')
  const link = page.locator('#apps').getByRole('link', { name: /Crossword AI/ })
  await expect(link).toHaveAttribute('target', '_blank')
  await expect(link).toHaveAttribute('href', /utm_source=eapps\.site/)
})

test.describe('the privacy policy', () => {
  test.use({ javaScriptEnabled: false })

  test('is served in English, canonical to itself, with no other-language alternates', async ({ page }) => {
    await page.goto('/en/privacy')
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('h1')).toHaveText('Privacy policy')
    await expect(page.getByRole('link', { name: 'Ads Settings' })).toHaveAttribute('href', /google\.com\/settings\/ads/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/en\/privacy$/)
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(2)
  })

  for (const path of ['/privacy', '/ru/privacy', '/hy/privacy']) {
    test(`${path} goes to the English policy`, async ({ page }) => {
      await page.goto(path)
      await expect(page).toHaveURL(/\/en\/privacy$/)
    })
  }

  test('is linked from the footer of every language', async ({ page }) => {
    await page.goto('/hy')
    await expect(page.locator('footer a[href="/en/privacy"]')).toHaveCount(1)
  })
})
