import { defineConfig, devices } from '@playwright/test'

/**
 * E2E is opt-in, not part of `pnpm test`: it needs the site running (`pnpm dev`, or
 * `pnpm build && pnpm start` to check the production render).
 */
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:7008'

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'blob' : 'list',
  use: {
    baseURL: BASE_URL,
    // Reuse a Chromium already on disk instead of `playwright install` (any recent build works).
    ...(process.env.CHROMIUM_PATH && { launchOptions: { executablePath: process.env.CHROMIUM_PATH } }),
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'phone', use: { ...devices['Pixel 7'] } },
  ],
})
