// Which programmatic page clusters are offered to search engines.
//
// Background: the site generates several page families from data — one page per
// state, per salary, per hourly rate. Measured against each other, two of those
// families were 77-86% word-identical, differing only in a state name and a few
// numbers. Google classifies that as scaled content abuse, and for a
// money-and-taxes site (which search quality guidelines treat as
// "your money or your life", held to a higher bar) it is enough on its own to
// fail a review.
//
// So the near-duplicate families are marked noindex. They remain fully working
// pages — reachable from navigation, useful to a visitor who lands on them —
// they are simply not presented to search engines as separate documents, and
// they are excluded from the sitemap.
//
// This is deliberately one flag per family so it is reversible: once a family
// carries genuinely distinct per-page content (local rates, state-specific
// rules, original commentary), flip it back to true and it returns to the
// sitemap on the next build.
export const INDEX_CLUSTERS = {
  // 51 pages, ~86% word overlap with each other. The hub at /minimum-wage
  // carries the full ranked comparison table and is indexed instead.
  minimumWageStates: false,

  // 51 pages that overlap heavily with /pay-stub/:state in purpose and wording.
  // The all-state calculator at /paycheck-calculator is indexed instead.
  statePaycheckCalculators: false,

  // Each page's numbers differ throughout (a full 51-row take-home table
  // computed for that amount), so these read as distinct documents.
  salaryAmounts: true,
  hourlyWages: true,

  // Measured at 94% word overlap with each other — the highest of any family
  // here, despite being the oldest. The per-state variation is a name, a rate
  // and a couple of numbers inside otherwise identical prose. The /states hub
  // is indexed instead.
  statePayStubGuides: false,
}

export const ROBOTS_NOINDEX = 'noindex, follow'

// `follow` is intentional: link equity still flows to the indexed hubs.
export const robotsFor = (indexed) => (indexed ? undefined : ROBOTS_NOINDEX)
