// Publication dates for the guides — the single source of truth.
//
// These previously lived as a default argument on ArticleJsonLd, which meant
// every guide declared datePublished = dateModified = 2026-06-30 regardless of
// reality. That was wrong in two directions: pages written in August claimed to
// predate themselves, and pages substantially rewritten in August still claimed
// a June modification date while the visible byline said "Updated August 2026".
// Machine-readable and human-readable dates contradicting each other is exactly
// the sort of thing a quality review notices.
//
// `modified` tracks SUBSTANTIVE content changes only. Three guides were touched
// in August by a site-wide styling pass (a CSS class rename) and are
// deliberately left at their original date — claiming freshness for a cosmetic
// edit is the freshness-gaming Google penalises, and it would also be a lie.
//
// Dates are taken from git history for the file backing each guide.
export const GUIDE_META = {
  'how-to-read-your-pay-stub':      { published: '2026-06-27', modified: '2026-06-27', readTime: 5 },
  'what-is-fica-tax':               { published: '2026-06-27', modified: '2026-08-19', readTime: 7 },
  'federal-vs-state-income-tax':    { published: '2026-06-27', modified: '2026-06-27', readTime: 4 },
  'pay-stub-vs-w2':                 { published: '2026-06-27', modified: '2026-08-19', readTime: 6 },
  'how-to-calculate-overtime':      { published: '2026-06-27', modified: '2026-08-19', readTime: 6 },
  'what-is-ytd-on-a-paycheck':      { published: '2026-06-30', modified: '2026-08-19', readTime: 5 },
  'how-many-pay-stubs-for-apartment': { published: '2026-06-30', modified: '2026-08-19', readTime: 6 },
  'gross-vs-net-pay':               { published: '2026-06-30', modified: '2026-08-19', readTime: 6 },
  'pay-stub-abbreviations':         { published: '2026-06-30', modified: '2026-06-30', readTime: 3 },
  '27-paycheck-years':              { published: '2026-08-19', modified: '2026-08-19', readTime: 6 },
}

const FALLBACK = { published: '2026-06-30', modified: '2026-06-30', readTime: 5 }

// Accepts either a bare slug or a full path like '/guides/what-is-fica-tax'.
export function guideMeta(slugOrPath = '') {
  const slug = slugOrPath.replace(/^\/guides\//, '').replace(/^\//, '')
  return GUIDE_META[slug] || FALLBACK
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

// ISO date to "19 August 2026". Parsed by parts rather than through Date() so
// the rendered string cannot shift by a day depending on the viewer's timezone.
export function formatDate(iso) {
  const [y, m, d] = (iso || '').split('-').map(Number)
  if (!y || !m || !d) return ''
  return `${d} ${MONTHS[m - 1]} ${y}`
}
