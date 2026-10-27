/**
 * The marketplace: every listed app, in display order. Facts live here (URL, platform,
 * languages, price); the words a visitor reads live in `src/messages/*.json` under
 * `Apps.<id>`. The page, the JSON-LD `ItemList`, `/llms.txt` and the tests all read this one
 * list. Adding an app: an entry here, its copy in all three catalogues (tests/unit/catalog.spec.ts
 * checks), a glyph in `APP_GLYPHS` (`components/ui/Icon.tsx`) and its English name in
 * `app/opengraph-image.tsx` — the compiler asks for the last two.
 */
export const APP_IDS = ['crossword', 'millionaire', 'hangman'] as const

export type AppId = (typeof APP_IDS)[number]

export type AppCategory = 'game' | 'tool'

export type AppPlatform = 'pwa' | 'web'

export type AppPricing = 'free' | 'freemium'

/** schema.org `applicationCategory` values in use. */
export type SchemaCategory = 'GameApplication' | 'BusinessApplication' | 'DeveloperApplication'

/** Each app's colour; a literal class set per accent lives in `constants/accents.ts`. */
export type AppAccent = 'coral' | 'violet' | 'sun' | 'teal' | 'sky'

export type CatalogApp = {
  id: AppId
  url: string
  category: AppCategory
  schemaCategory: SchemaCategory
  /** schema.org `applicationSubCategory`, in English. */
  genre: string
  platform: AppPlatform
  /** BCP 47 codes the app's interface and content are written in. */
  languages: readonly string[]
  /** Shown instead of the list when it is too long to spell out. */
  languageCount?: number
  pricing: AppPricing
  accent: AppAccent
}

export const CATALOG: readonly CatalogApp[] = [
  {
    id: 'crossword',
    url: 'https://crossword.eapps.site',
    category: 'game',
    schemaCategory: 'GameApplication',
    genre: 'Crossword puzzle',
    platform: 'pwa',
    languages: ['en', 'ru', 'hy'],
    pricing: 'free',
    accent: 'coral',
  },
  {
    id: 'millionaire',
    url: 'https://who-wants-to-be-a-millionaire.eapps.site',
    category: 'game',
    schemaCategory: 'GameApplication',
    genre: 'Trivia quiz',
    platform: 'pwa',
    languages: ['en', 'ru', 'hy'],
    languageCount: 80,
    pricing: 'free',
    accent: 'violet',
  },
  {
    id: 'hangman',
    url: 'https://hangman.mnavasardian.com',
    category: 'game',
    schemaCategory: 'GameApplication',
    genre: 'Word game',
    platform: 'pwa',
    languages: ['hy'],
    pricing: 'free',
    accent: 'sun',
  },
]

export const appLanguageCount = (app: CatalogApp): number => app.languageCount ?? app.languages.length

/** schema.org `operatingSystem` per platform. */
export const OPERATING_SYSTEMS: Record<AppPlatform, string> = {
  pwa: 'Any (web browser); installable on Android, iOS, Windows and macOS',
  web: 'Any (web browser)',
}
