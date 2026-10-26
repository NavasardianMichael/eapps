#!/usr/bin/env node
/**
 * Design-system and convention grep gates (crossword's pattern). Every gate must report 0 hits.
 * Scoped by extension so the docs that describe a gate never trip it; this file lives in
 * `scripts/`, outside every gate's root.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const TS = ['.ts', '.tsx']
const TSX = ['.tsx']
const CODE = ['.ts', '.tsx', '.css']

const GATES = [
  {
    name: 'no hex colours outside the token files',
    why: 'Colours live in src/styles/tokens.ts and its mirror, globals.css §1 — CLAUDE.md',
    root: 'src',
    exts: TS,
    pattern: /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b(?![\w-])/,
    // The palette itself.
    skip: /^src\/styles\//,
    excludeLine: /^\s*(\/\/|\*)/,
  },
  {
    name: 'no `dark:` variants',
    why: 'Light only, by design — there is no dark theme (CLAUDE.md)',
    root: 'src',
    exts: CODE,
    pattern: /\bdark:/,
  },
  {
    name: 'no dark colour-scheme queries',
    why: 'Light only, by design — there is no dark theme (CLAUDE.md)',
    root: 'src',
    exts: CODE,
    pattern: /prefers-color-scheme:\s*dark|colorScheme:\s*'dark'/,
  },
  {
    name: 'no Tailwind `2xl:` breakpoint',
    why: "globals.css resets Tailwind's scale; only sm/md/lg/xl exist",
    root: 'src',
    exts: TSX,
    pattern: /\b2xl:[a-z]/,
  },
  {
    name: 'no Tailwind class built at runtime',
    why: 'Tailwind only generates class names it can read in the source — use a literal map (constants/accents.ts)',
    root: 'src',
    exts: TSX,
    pattern: /\b(bg|text|border|ring|from|to|fill|stroke)-\$\{/,
  },
  {
    name: 'no raw `next/link`',
    why: 'Drops the locale prefix — use AppLink / @i18n/navigation',
    root: 'src',
    exts: TS,
    pattern: /from 'next\/link'/,
  },
  {
    name: 'no raw `next/navigation` routing',
    why: 'Use @i18n/navigation for internal destinations; `notFound` is fine',
    root: 'src',
    exts: TS,
    pattern: /from 'next\/navigation'/,
    excludeLine: /notFound/,
  },
  {
    name: 'no default exports in components',
    why: 'A default export lets each import site rename the symbol — CLAUDE.md',
    root: 'src/components',
    exts: TS,
    pattern: /export default/,
  },
  {
    name: 'no client components in src/components',
    why: 'The page ships no JavaScript of its own: everything a crawler or a first paint needs is server-rendered — CLAUDE.md',
    root: 'src/components',
    exts: TS,
    pattern: /^['"]use client['"]/,
  },
]

const walk = (dir, exts, out = []) => {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, exts, out)
    else if (exts.includes(path.extname(entry))) out.push(full)
  }
  return out
}

const hitsFor = ({ root, exts, pattern, skip, excludeLine }) =>
  walk(path.join(ROOT, root), exts)
    .map((file) => ({ file, rel: path.relative(ROOT, file).split(path.sep).join('/') }))
    .filter(({ rel }) => !skip?.test(rel))
    .flatMap(({ file, rel }) =>
      readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .map((line, index) => ({ rel, line: index + 1, text: line.trim() }))
        .filter(({ text }) => pattern.test(text))
        .filter(({ text }) => !excludeLine?.test(text))
    )

let failed = 0
for (const gate of GATES) {
  const hits = hitsFor(gate)
  if (!hits.length) {
    console.log(`  ok   ${gate.name}`)
    continue
  }
  failed += 1
  console.log(`  FAIL ${gate.name} — ${hits.length} hit${hits.length > 1 ? 's' : ''}`)
  console.log(`       ${gate.why}`)
  for (const hit of hits.slice(0, 10)) console.log(`       ${hit.rel}:${hit.line}  ${hit.text.slice(0, 100)}`)
}

console.log(failed ? `\n${failed} of ${GATES.length} gates failed.` : `\n${GATES.length} gates clean.`)
process.exit(failed ? 1 : 0)
