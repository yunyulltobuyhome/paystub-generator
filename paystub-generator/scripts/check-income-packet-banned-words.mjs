// Guardrail check for the Income Verification Packet Builder (income-packet-builder-spec.md
// section 2): the banned words must never appear as a POSITIVE claim in this tool's UI/PDF copy
// (e.g. "this document is certified" or "guaranteed approval").
//
// They are allowed — and required — in NEGATED/disclaiming form (e.g. "not verified", "does not
// guarantee"), which is exactly how Terms.jsx, Privacy.jsx, and this tool's own disclaimers use
// them. So each occurrence is checked for a nearby negation marker rather than being flagged
// outright. src/config/incomePacket.js is excluded entirely — it's the definitional source of
// the banned-words list itself, not usage.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { BANNED_WORDS } from '../src/config/incomePacket.js'

const ROOT = join(fileURLToPath(import.meta.url), '../..')
const SCAN_DIRS = [
  join(ROOT, 'src/components/incomePacket'),
  join(ROOT, 'src/data/incomePacketPresets.js'),
  join(ROOT, 'src/data/nicheContent.js'),
]

const NEGATION = /\b(not|never|no|n't|without|isn't|aren't|wasn't|doesn't|does not|do not|did not)\b/i
const WORD_RE = new RegExp(BANNED_WORDS.join('|'), 'gi')

let violations = []

function scanFile(file) {
  const rel = relative(ROOT, file)
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, i) => {
    // FAQ-style entries put a question ("Is this certified?") and its negating
    // answer ("No, not verified...") on the same source line — so a negation
    // marker anywhere on the line is enough to treat it as a safe disclaimer.
    if (WORD_RE.test(line) && !NEGATION.test(line)) {
      violations.push(`${rel}:${i + 1}: ${line.trim()}`)
    }
    WORD_RE.lastIndex = 0
  })
}

function walk(target) {
  const stat = statSync(target)
  if (stat.isDirectory()) {
    for (const entry of readdirSync(target)) walk(join(target, entry))
  } else if (/\.(jsx?|css)$/.test(target)) {
    scanFile(target)
  }
}

for (const dir of SCAN_DIRS) walk(dir)

if (violations.length > 0) {
  console.error('❌ Income Packet banned word check FAILED — positive claim found (no nearby negation):\n')
  violations.forEach(v => console.error('  ' + v))
  process.exit(1)
} else {
  console.log('✅ Income Packet banned word check passed — no unnegated banned-word claims found.')
}
