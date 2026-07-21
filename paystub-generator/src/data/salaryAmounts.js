// Curated high-search-volume salary amounts for the programmatic
// "$X a year after taxes / how much an hour" pages. Kept to a substantial,
// non-thin set (each page carries a full 51-jurisdiction take-home table plus
// conversions), rather than hundreds of near-duplicate doorway pages.
export const SALARY_AMOUNTS = [
  30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000,
  75000, 80000, 85000, 90000, 100000, 110000, 120000, 150000,
]

export const salarySlug = (amount) => `${amount}-after-tax`

export const parseSalarySlug = (slug) => {
  const m = /^(\d+)-after-tax$/.exec(slug || '')
  if (!m) return null
  const amount = parseInt(m[1], 10)
  return SALARY_AMOUNTS.includes(amount) ? amount : null
}

// Assumes a standard full-time schedule (40 hrs/week, 52 weeks, 2080 hrs/year).
export function salaryConversions(annual) {
  return {
    hourly: annual / 2080,
    daily: annual / 260,
    weekly: annual / 52,
    biweekly: annual / 26,
    semimonthly: annual / 24,
    monthly: annual / 12,
    annual,
  }
}
