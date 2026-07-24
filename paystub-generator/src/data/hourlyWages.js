// Curated high-search-volume hourly wages for the programmatic
// "$X an hour is how much a year" pages — the sister cluster to the salary
// pages. Each page carries full annual/part-time conversions plus a
// 51-jurisdiction after-tax table, so this is a substantial (non-thin) set
// rather than hundreds of near-duplicate doorway pages.
export const HOURLY_WAGES = [
  10, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 30, 35, 40, 45, 50, 60, 75, 100,
]

export const hourlyWageSlug = (rate) => `${rate}-an-hour`

export const parseHourlyWageSlug = (slug) => {
  const m = /^(\d+)-an-hour$/.exec(slug || '')
  if (!m) return null
  const rate = parseInt(m[1], 10)
  return HOURLY_WAGES.includes(rate) ? rate : null
}

// Standard full-time assumption: 40 hrs/week × 52 weeks = 2,080 hrs/year.
export function hourlyToAnnual(rate, hoursPerWeek = 40) {
  return rate * hoursPerWeek * 52
}

// Full-time conversions from an hourly rate (before taxes).
export function hourlyConversions(rate) {
  const annual = rate * 40 * 52
  return {
    hourly: rate,
    daily: rate * 8,
    weekly: rate * 40,
    biweekly: rate * 80,
    monthly: annual / 12,
    annual,
  }
}

// Annual gross at common weekly-hour schedules — lets one page answer both
// full-time and part-time "how much a year" queries (a real edge over
// competitors that only show 40 hrs/week).
export const HOURS_SCHEDULES = [20, 25, 30, 35, 40]
