import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { COLOR_RAMPS } from '@styles/tokens'

/** globals.css §1 mirrors the ramps in `tokens.ts` (CSS cannot import JS); they must stay equal. */
const css = readFileSync(path.resolve(__dirname, '../../../src/styles/globals.css'), 'utf8').toLowerCase()

describe('design tokens', () => {
  it.each(Object.entries(COLOR_RAMPS))('%s ramp matches the stylesheet', (name, ramp) => {
    for (const [step, hex] of Object.entries(ramp))
      expect(css).toContain(`--color-${name}-${step}: ${hex.toLowerCase()};`)
  })

  it('declares no colour the tokens do not own', () => {
    const declared = [...css.matchAll(/--color-([a-z]+)-([a-z0-9]+):/g)].map(([, name, step]) => `${name}-${step}`)
    const owned = Object.entries(COLOR_RAMPS).flatMap(([name, ramp]) =>
      Object.keys(ramp).map((step) => `${name}-${step}`)
    )
    expect(declared.sort()).toEqual(owned.sort())
  })

  it('is light only', () => {
    expect(css).toContain('color-scheme: light;')
    expect(css).not.toContain('prefers-color-scheme: dark')
  })
})
