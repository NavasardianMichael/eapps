import { Manrope } from 'next/font/google'
import type { Locale } from '@i18n/config'

/**
 * One family for headings and body — Manrope, a variable font, so every weight is one file per
 * subset. It covers Latin and Cyrillic; English and Russian need nothing else.
 *
 * The variable is `--font-manrope`, NOT `--font-sans`: Tailwind defines `--font-sans` itself,
 * and globals.css composes it from this plus `--font-script`.
 */
export const fontSans = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
})

/**
 * Locales whose script Manrope lacks, loaded per page from Google Fonts — only the active
 * locale's family, so English and Russian visitors never download an Armenian font. (next/font
 * would inline every family's @font-face into the shared CSS.)
 *
 * `--font-script` is appended *after* Manrope, so Latin text inside an Armenian page still
 * renders in Manrope by per-glyph fallback.
 */
const SCRIPT_FAMILIES: Partial<Record<Locale, string>> = {
  hy: 'Noto Sans Armenian',
}

export type ScriptFont = { family: string; href: string }

export const getScriptFont = (locale: Locale): ScriptFont | null => {
  const family = SCRIPT_FAMILIES[locale]
  if (!family) return null
  return {
    family,
    href: `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@400;500;600;700;800&display=swap`,
  }
}
