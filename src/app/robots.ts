import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@helpers/url'

/**
 * Everything is public. Answer-engine crawlers are named and allowed explicitly — `*` already
 * admits them, but some operators read an explicit rule as consent, and being cited by
 * assistants is half of why this page exists. Robots is a crawling hint, never access control.
 */
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bingbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: AI_CRAWLERS, allow: '/' },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
