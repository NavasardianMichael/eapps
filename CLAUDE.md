# eapps

The landing page of **eapps.site**: one page that lists free web apps and games (Crossword AI,
Millionaire Quiz, Armenian Hangman, Regionify, Distance Measurer) in English, Russian and
Armenian, built to rank in search and to be quoted by answer engines. No API, no database.

**Stack:** Next.js 16 (App Router, `src/proxy.ts`, standalone) · React 19 · TypeScript 6 ·
Tailwind 4 (tokens in `styles/tokens.ts` ↔ `globals.css` §1) · next-intl 4 · schema-dts ·
pnpm. Patterns from `../crossword` (itself built from `../who-wants-to-be-a-millionaire/docs/STACK_BLUEPRINT.md`),
minus everything a static directory does not need: no antd, Zustand, axios, service worker or Sentry.

## Commands

```bash
pnpm dev               # http://localhost:7008
pnpm verify            # typecheck → gates → lint → catalogues → unit tests → build — run before "done"
pnpm test              # unit: sitemap, robots, JSON-LD, llms.txt, catalogues, token mirror
pnpm test:e2e          # Playwright against a running site (CHROMIUM_PATH reuses a local Chromium)
pnpm check:messages    # ru/hy catalogues match en.json (keys, placeholders, plurals, brand)
```

## Where things live

| Looking for                                                      | Go to                                                                                                                                                                                                 |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| The listed apps (URL, platform, languages, price, accent)        | `src/constants/catalog.ts` — copy under `Apps.<id>` in `src/messages/*.json`                                                                                                                          |
| App glyphs and the other icons                                   | `src/components/ui/Icon.tsx` (`APP_GLYPHS`)                                                                                                                                                           |
| Accent class sets per app                                        | `src/constants/accents.ts`                                                                                                                                                                            |
| The page and its sections                                        | `src/app/[lang]/page.tsx` · `src/components/marketing/`                                                                                                                                               |
| Header, footer, language switcher                                | `src/components/layout/`                                                                                                                                                                              |
| Locales, routing, metadata, hreflang                             | `src/i18n/` · `src/proxy.ts` · catalogues `src/messages/`                                                                                                                                             |
| SEO/GEO: sitemap, robots, JSON-LD, link preview, icons, llms.txt | `src/app/{sitemap,robots,manifest,icon,apple-icon,opengraph-image}.ts(x)`, `src/linkedDataSchema/`, `src/helpers/llms.ts`, `src/app/llms*.txt/`                                                       |
| Design tokens                                                    | `src/styles/tokens.ts` (owner) → `globals.css` §1 mirror (`tests/unit/styles/tokens.spec.ts`)                                                                                                         |
| Deploying to eapps.site                                          | `docs/PRODUCTION_SETUP.md` (one-time server setup, in order) · `docs/DEPLOYMENT.md` (how the pipeline works) · `deployment/` (host templates; rules in `deployment/CLAUDE.md`) · `.github/workflows/` |

## Adding an app

1. An entry in `CATALOG` (`src/constants/catalog.ts`) — order is display order.
2. `Apps.<id>.{name,tagline,description}` in `en.json`, then written natively in `ru.json` and
   `hy.json`; mention it in the `Faq` answers that enumerate apps or languages.
3. A glyph in `APP_GLYPHS` and an English name in `app/opengraph-image.tsx` (the compiler asks).
4. Bump `CONTENT_UPDATED_AT` (`src/constants/app.ts`) — it is the sitemap `lastmod` and JSON-LD
   `dateModified`. `pnpm verify`.

## Working rules

- **Inspect before writing.** Follow the structure of neighbouring files.
- **Server components only** in `src/components` (gated): the page ships no JavaScript of its
  own. The only client code is next-intl's `Link` and `app/[lang]/error.tsx`.
- **Everything a crawler or an answer engine reads is generated from one source.** The hero
  stats, JSON-LD `ItemList`, `/llms.txt` and the cards all read `CATALOG` and the catalogues;
  never hand-copy a fact (an app count, a language count) into code. The FAQ prose is the one
  place facts are written out — keep it true when the catalogue changes.
- **The FAQ HTML and the FAQPage JSON-LD are the same strings** (`FaqSection`). Answers live in
  `<details>`, so they are in the server HTML.
- **Every user-visible string** is in `src/messages/en.json`, then written natively (not word
  for word) in `ru.json` and `hy.json`. `Common.siteName` is `eapps` in every language.
- **Named exports declared inline**; default exports only where Next or next-intl require them.
- **Light only.** No `dark:`, no dark colour-scheme query, no hex outside the token files, no
  Tailwind class built at runtime — `pnpm gates` enforces it.
- Comment only where the purpose is not obvious from the code.

## Easy to get wrong

- **Static rendering hinges on `src/i18n/request.ts`:** the locale comes from `lang()`, and
  `requestLocale` must never be destructured — that silently makes every page dynamic
  (`tests/unit/seo/staticRendering.spec.ts`). `pnpm build` must show `/en`, `/ru`, `/hy` as ●.
- **Every locale is self-canonical** with hreflang to all three plus `x-default` — never
  canonicalise `/ru` to `/en`. All metadata goes through `pageMetadata()`.
- **`/` is a personalised 307** (cookie, then `Accept-Language`) with `Vary` + `no-store`;
  never cache it, never make it a 308. Extension-less metadata routes are listed in
  `LOCALE_AGNOSTIC` in `src/proxy.ts`, or they would redirect to `/en/icon`.
- Outbound card links carry UTM tags (`appLinkUrl`); the canonical `app.url` in JSON-LD,
  llms.txt and the footer does not. Links are `rel="noopener"`, not `nofollow`: they are our
  own properties.
- The OG image's font has no Armenian glyphs — keep its text Latin.
