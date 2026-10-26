import { BRAND, CORAL, SUN, TEAL, WHITE } from '@styles/tokens'

/**
 * The emblem: a 2×2 shelf of app tiles — the brand tile carrying the `e`, the others in app
 * accents. One SVG string feeds the inline header mark, the favicon, the apple icon and the
 * link preview (`ImageResponse` takes it as an image).
 */
const TILES: { x: number; y: number; fill: string; letter?: boolean }[] = [
  { x: 0, y: 0, fill: BRAND[600], letter: true },
  { x: 1, y: 0, fill: CORAL[300] },
  { x: 0, y: 1, fill: TEAL[300] },
  { x: 1, y: 1, fill: SUN[300] },
]

export const emblemSvg = ({ background = false }: { background?: boolean } = {}): string => {
  const cell = 26
  const gap = 4
  const tiles = TILES.map(({ x, y, fill, letter }) => {
    const left = 4 + x * (cell + gap)
    const top = 4 + y * (cell + gap)
    const text = letter
      ? `<text x="${left + cell / 2}" y="${top + cell / 2 + 7}" text-anchor="middle" font-family="Arial, sans-serif" font-size="21" font-weight="700" fill="${WHITE}">e</text>`
      : ''
    return `<rect x="${left}" y="${top}" width="${cell}" height="${cell}" rx="8" fill="${fill}"/>${text}`
  }).join('')
  const backdrop = background ? `<rect width="64" height="64" rx="16" fill="${WHITE}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${backdrop}${tiles}</svg>`
}

export const emblemDataUri = (options?: { background?: boolean }): string =>
  `data:image/svg+xml;base64,${Buffer.from(emblemSvg(options)).toString('base64')}`
