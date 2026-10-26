# eapps

The home of **[eapps.site](https://eapps.site)**: a one-page marketplace of free web apps and
games, in **English, Russian and Armenian**.

| App | What it is | Where |
|---|---|---|
| Crossword AI | AI crosswords and scanwords, never a repeat | crossword.eapps.site |
| Millionaire Quiz | The quiz-show game in 80 languages | who-wants-to-be-a-millionaire.mnavasardian.com |
| Armenian Hangman | The classic word game, in Armenian | hangman.mnavasardian.com |
| Regionify | Choropleth maps from spreadsheet data | regionify.pro |
| Distance Measurer | Chrome extension for measuring web pages | Chrome Web Store |

Built for search and answer engines: every language has its own self-canonical URL with
hreflang, the page is fully server-rendered (it works with JavaScript off), and it carries
JSON-LD (`Organization`, `WebSite`, `CollectionPage` with an `ItemList` of
`SoftwareApplication`, `FAQPage`), a generated link preview and icons, a sitemap, a robots.txt
that welcomes AI crawlers, and `/llms.txt` + `/llms-full.txt`.

## Getting started

```bash
nvm use                     # Node 24
pnpm install
cp .env.example .env.local
pnpm dev                    # http://localhost:7008
```

## Checks

```bash
pnpm verify                 # typecheck → grep gates → lint → catalogues → unit tests → build
pnpm test:e2e               # Playwright on desktop and phone (needs the site running)
```

See `CLAUDE.md` for where things live and how to add an app, `docs/DEPLOYMENT.md` for production.
