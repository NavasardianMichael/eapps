import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

// Without the explicit path next-intl looks for `./i18n/request.ts` at the project root.
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  // `.next/standalone`: server.js plus only the traced node_modules, so a release carries its
  // own runtime. `public/` and `.next/static` are copied in by the deploy (docs/DEPLOYMENT.md).
  output: 'standalone',
  poweredByHeader: false,
  // The privacy policy is English only; these run before `src/proxy.ts`, so `/privacy` skips
  // locale negotiation. 307s, so a translated policy can take the URLs back later.
  async redirects() {
    return [
      { source: '/privacy', destination: '/en/privacy', permanent: false },
      { source: '/:lang(ru|hy)/privacy', destination: '/en/privacy', permanent: false },
    ]
  },
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
