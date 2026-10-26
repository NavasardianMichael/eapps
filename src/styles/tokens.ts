/**
 * The single source of truth for design constants:
 *
 *   tokens.ts ─→ JS consumers (manifest, OG image, icons, the root 404)
 *            └→ globals.css §1 @theme ramps (mirrored literals — CSS cannot import JS;
 *               tests/unit/styles/tokens.spec.ts keeps the mirror equal) ─→ utilities
 *
 * A raw hex may appear in this file and in globals.css §1 only (`pnpm gates`).
 *
 * A quiet shelf for bright things: warm paper and deep ink-indigo for the page, one brand
 * indigo for actions, and one accent per app so each card is recognisable at a glance.
 * Light only: there is no dark theme.
 *
 * Contrast (WCAG AA, 4.5:1 for body text) is checked where text sits on a colour: ink 500+ on
 * paper, every 700 step on its own 100 step, white on brand 600+.
 */

/** The page (100), raised paper (50), dividers and wells (200–300). */
export const PAPER = {
  50: '#fdfcfa',
  100: '#f8f6f1',
  200: '#efebe3',
  300: '#e2dccf',
} as const

/** Lettering: body copy (900), secondary copy (700), hints (500, AA on paper), decoration (300). */
export const INK = {
  300: '#b3b0c2',
  500: '#64607a',
  700: '#3d3953',
  900: '#1c1a2e',
} as const

/** The brand: actions, links, focus. */
export const BRAND = {
  100: '#e8e9ff',
  200: '#cfd2ff',
  300: '#a9aefc',
  400: '#7f86f5',
  500: '#5b5fe9',
  600: '#4644cf',
  700: '#3634a6',
} as const

/** App accents — 100 chips, 200 icon tiles, 300 hover borders, 700 text and glyphs. */
export const CORAL = { 100: '#ffe6de', 200: '#ffc9b8', 300: '#ffa58b', 700: '#a8361a' } as const
export const VIOLET = { 100: '#f1e8ff', 200: '#e0cfff', 300: '#c7a8ff', 700: '#6930b8' } as const
export const SUN = { 100: '#fff6cf', 200: '#ffec9e', 300: '#ffe06b', 700: '#8a6700' } as const
export const TEAL = { 100: '#d9f4ef', 200: '#b0e9df', 300: '#7fdacb', 700: '#0d6f63' } as const
export const SKY = { 100: '#e1f1ff', 200: '#c0e2ff', 300: '#93cdff', 700: '#1b5a92' } as const

/** Hairlines on paper and white. */
export const LINE = {
  subtle: '#ebe6dc',
  strong: '#d9d2c3',
} as const

export const WHITE = '#ffffff'

/** Every ramp by its CSS name (`--color-<name>-<step>`), for the mirror test. */
export const COLOR_RAMPS = {
  paper: PAPER,
  ink: INK,
  brand: BRAND,
  coral: CORAL,
  violet: VIOLET,
  sun: SUN,
  teal: TEAL,
  sky: SKY,
  line: LINE,
} as const
