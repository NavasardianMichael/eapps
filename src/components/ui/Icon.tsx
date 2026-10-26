import type { ReactNode } from 'react'
import type { AppId } from '@constants/catalog'
import { cn } from '@helpers/cn'

/**
 * The few icons the page uses, inlined so no icon library ships. 24×24 strokes in
 * `currentColor`; paths from Lucide (ISC).
 */
const ICONS = {
  external: (
    <>
      <path d='M15 3h6v6' />
      <path d='M10 14 21 3' />
      <path d='M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' />
    </>
  ),
  chevronDown: <path d='m6 9 6 6 6-6' />,
  arrowDown: (
    <>
      <path d='M12 5v14' />
      <path d='m19 12-7 7-7-7' />
    </>
  ),
  heart: (
    <path d='M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z' />
  ),
  languages: (
    <>
      <path d='m5 8 6 6' />
      <path d='m4 14 6-6 2-3' />
      <path d='M2 5h12' />
      <path d='M7 2h1' />
      <path d='m22 22-5-10-5 10' />
      <path d='M14 18h6' />
    </>
  ),
  devices: (
    <>
      <path d='M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8' />
      <path d='M10 19v-3.96 3.15' />
      <path d='M7 19h5' />
      <rect width='6' height='10' x='16' y='12' rx='2' />
    </>
  ),
} satisfies Record<string, ReactNode>

/** One glyph per listed app. A new app needs one here (the type makes it a compile error otherwise). */
const APP_GLYPHS: Record<AppId, ReactNode> = {
  crossword: (
    <>
      <rect width='18' height='18' x='3' y='3' rx='2' />
      <path d='M9 3v18' />
      <path d='M15 3v18' />
      <path d='M3 9h18' />
      <path d='M3 15h18' />
      <path d='M15 15h6v6h-4a2 2 0 0 1-2-2Z' fill='currentColor' />
      <path d='M3 3h6v6H3Z' fill='currentColor' />
    </>
  ),
  millionaire: (
    <>
      <path d='M6 3h12l4 6-10 13L2 9Z' />
      <path d='M11 3 8 9l4 13 4-13-3-6' />
      <path d='M2 9h20' />
    </>
  ),
  hangman: (
    <>
      <path d='M3 21h10' />
      <path d='M6 21V3h9v3' />
      <path d='m6 7 4-4' />
      <circle cx='15' cy='8.5' r='2.5' />
      <path d='M15 11v5' />
      <path d='m12.5 20 2.5-4 2.5 4' />
      <path d='M12.5 13h5' />
    </>
  ),
  regionify: (
    <>
      <path d='M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z' />
      <path d='M15 5.764v15' />
      <path d='M9 3.236v15' />
    </>
  ),
  distanceMeasurer: (
    <>
      <path d='M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z' />
      <path d='m14.5 12.5 2-2' />
      <path d='m11.5 9.5 2-2' />
      <path d='m8.5 6.5 2-2' />
      <path d='m17.5 15.5 2-2' />
    </>
  ),
}

export type IconName = keyof typeof ICONS

const Svg = ({ children, className }: { children: ReactNode; className?: string }) => (
  <svg
    aria-hidden
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth={2}
    strokeLinecap='round'
    strokeLinejoin='round'
    className={cn('size-5 shrink-0', className)}
  >
    {children}
  </svg>
)

export const Icon = ({ name, className }: { name: IconName; className?: string }) => (
  <Svg className={className}>{ICONS[name]}</Svg>
)

export const AppGlyph = ({ id, className }: { id: AppId; className?: string }) => (
  <Svg className={className}>{APP_GLYPHS[id]}</Svg>
)
