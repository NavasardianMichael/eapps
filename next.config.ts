import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Without the explicit path next-intl looks for `./i18n/request.ts` at the project root.
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // `.next/standalone`: server.js plus only the traced node_modules, so a release carries its
  // own runtime. `public/` and `.next/static` are copied in by the deploy (docs/DEPLOYMENT.md).
  output: 'standalone',
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
