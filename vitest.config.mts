import { defineConfig } from 'vitest/config'

/**
 * Unit tests only: the site has no API and no database. They cover what a crawler or an answer
 * engine reads (sitemap, robots, JSON-LD, llms.txt), the catalogues and the token mirror.
 */
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.spec.ts'],
    env: { TZ: 'UTC', NEXT_PUBLIC_SITE_URL: 'https://eapps.site' },
  },
})
