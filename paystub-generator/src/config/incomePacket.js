// Config for the Income Verification Packet Builder tool.
// Legal guardrails here are absolute — see the mandatory PDF footer notice
// and the banned-words list enforced by scripts/check-banned-words.mjs.

export const TOOL_NAME = 'Income Verification Packet'

// Mandatory on every generated PDF page footer. Never removable, never optional.
export const PDF_FOOTER_NOTICE =
  'This document contains self-reported figures prepared by the user via MyFreePayStub.com. ' +
  'It is not issued or verified by any government agency, employer, or financial institution.'

// Shown inside the builder — data is session-only, never persisted.
export const NO_PERSISTENCE_NOTICE =
  "Your information is not saved anywhere — it only lives in this browser tab. " +
  "If you refresh or close this page before downloading, you'll need to start over."

// Words that must NEVER appear in this tool's UI copy or generated PDF content.
export const BANNED_WORDS = [
  'certified',
  'official',
  'verified',
  'irs-approved',
  'irs approved',
  'guaranteed',
]

export const LARGE_VALUE_WARNING_THRESHOLD = 50000
