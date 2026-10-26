import type { AppAccent } from './catalog'

/**
 * Literal class sets per app accent. Tailwind generates only class names it can read in the
 * source, so these are never assembled at runtime.
 */
export const ACCENT_CLASSES: Record<AppAccent, { tile: string; chip: string; ring: string }> = {
  coral: { tile: 'bg-coral-200 text-coral-700', chip: 'bg-coral-100 text-coral-700', ring: 'hover:border-coral-300' },
  violet: {
    tile: 'bg-violet-200 text-violet-700',
    chip: 'bg-violet-100 text-violet-700',
    ring: 'hover:border-violet-300',
  },
  sun: { tile: 'bg-sun-200 text-sun-700', chip: 'bg-sun-100 text-sun-700', ring: 'hover:border-sun-300' },
  teal: { tile: 'bg-teal-200 text-teal-700', chip: 'bg-teal-100 text-teal-700', ring: 'hover:border-teal-300' },
  sky: { tile: 'bg-sky-200 text-sky-700', chip: 'bg-sky-100 text-sky-700', ring: 'hover:border-sky-300' },
}
