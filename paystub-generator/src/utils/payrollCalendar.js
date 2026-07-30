// Pay-date math for the payroll calendar generator. Pure date arithmetic —
// no external data, no assumptions about any particular employer's policy.

const MS_DAY = 86400000

export const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export const parseISO = (s) => {
  const [y, m, d] = (s || '').split('-').map(Number)
  if (!y || !m || !d) return null
  const dt = new Date(y, m - 1, d)
  return Number.isNaN(dt.getTime()) ? null : dt
}

const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

// nth weekday of a month, e.g. nthWeekday(2026, 0, 1, 3) = 3rd Monday of January.
const nthWeekday = (year, month, weekday, n) => {
  const first = new Date(year, month, 1)
  const offset = (weekday - first.getDay() + 7) % 7
  return new Date(year, month, 1 + offset + (n - 1) * 7)
}

const lastWeekday = (year, month, weekday) => {
  const last = new Date(year, month + 1, 0)
  const offset = (last.getDay() - weekday + 7) % 7
  return new Date(year, month, last.getDate() - offset)
}

// The 11 US federal holidays. Banks close on these, which is why direct
// deposits scheduled around them are commonly delayed.
export function federalHolidays(year) {
  const fixed = [
    ["New Year's Day", new Date(year, 0, 1)],
    ['Juneteenth', new Date(year, 5, 19)],
    ['Independence Day', new Date(year, 6, 4)],
    ['Veterans Day', new Date(year, 10, 11)],
    ['Christmas Day', new Date(year, 11, 25)],
  ]
  const floating = [
    ['Martin Luther King Jr. Day', nthWeekday(year, 0, 1, 3)],
    ["Presidents' Day", nthWeekday(year, 1, 1, 3)],
    ['Memorial Day', lastWeekday(year, 4, 1)],
    ['Labor Day', nthWeekday(year, 8, 1, 1)],
    ['Columbus Day', nthWeekday(year, 9, 1, 2)],
    ['Thanksgiving Day', nthWeekday(year, 10, 4, 4)],
  ]

  return [...fixed, ...floating].map(([name, date]) => {
    // Saturday holidays are observed the preceding Friday, Sunday the following Monday.
    let observed = date
    if (date.getDay() === 6) observed = addDays(date, -1)
    else if (date.getDay() === 0) observed = addDays(date, 1)
    return { name, date, observed, iso: toISO(observed) }
  }).sort((a, b) => a.observed - b.observed)
}

export const FREQUENCIES = [
  { v: 'weekly', label: 'Weekly', perYear: 52 },
  { v: 'biweekly', label: 'Bi-Weekly (every 2 weeks)', perYear: 26 },
  { v: 'semimonthly', label: 'Semi-Monthly (twice a month)', perYear: 24 },
  { v: 'monthly', label: 'Monthly', perYear: 12 },
]

// Semi-monthly runs on two fixed calendar days (commonly the 15th and last day).
function semiMonthlyDates(year, firstDay, secondDay) {
  const out = []
  for (let m = 0; m < 12; m++) {
    const lastDom = new Date(year, m + 1, 0).getDate()
    for (const day of [firstDay, secondDay]) {
      const dom = day === 'last' ? lastDom : Math.min(Number(day), lastDom)
      out.push(new Date(year, m, dom))
    }
  }
  return out.sort((a, b) => a - b)
}

/**
 * Build every pay date in a calendar year.
 * `anchor` is any known pay date; the schedule is projected forward and
 * backward from it so the visitor doesn't have to find January's date.
 */
export function buildPayDates({ year, frequency, anchor, semiFirst = 15, semiSecond = 'last' }) {
  const start = new Date(year, 0, 1)
  const end = new Date(year, 11, 31)

  if (frequency === 'semimonthly') return semiMonthlyDates(year, semiFirst, semiSecond)

  if (frequency === 'monthly') {
    const dom = anchor ? anchor.getDate() : 1
    return Array.from({ length: 12 }, (_, m) => {
      const lastDom = new Date(year, m + 1, 0).getDate()
      return new Date(year, m, Math.min(dom, lastDom))
    })
  }

  const step = frequency === 'weekly' ? 7 : 14
  const base = anchor || new Date(year, 0, 1)
  // Walk back to the first pay date on or after Jan 1.
  const diffDays = Math.round((base - start) / MS_DAY)
  const stepsBack = Math.ceil(diffDays / step)
  let cursor = addDays(base, -stepsBack * step)
  if (cursor < start) cursor = addDays(cursor, step)

  const out = []
  while (cursor <= end) {
    out.push(cursor)
    cursor = addDays(cursor, step)
  }
  return out
}

/**
 * Annotate each pay date with the period it covers and any weekend/holiday
 * conflict. Employers commonly move a payday earlier when it lands on a
 * non-banking day, so these are surfaced as flags rather than adjustments.
 */
export function annotatePayDates(dates, frequency, holidays) {
  const holidayByIso = new Map(holidays.map((h) => [h.iso, h.name]))
  const step = frequency === 'weekly' ? 7 : frequency === 'biweekly' ? 14 : null

  return dates.map((date, i) => {
    let periodStart = null
    let periodEnd = null
    if (step) {
      periodEnd = addDays(date, -1)
      periodStart = addDays(date, -step)
    } else if (i > 0) {
      periodStart = addDays(dates[i - 1], 0)
      periodEnd = addDays(date, -1)
    }

    const dow = date.getDay()
    const isWeekend = dow === 0 || dow === 6
    const holiday = holidayByIso.get(toISO(date)) || null

    // Nearest preceding banking day, the usual employer practice.
    let adjusted = date
    while (adjusted.getDay() === 0 || adjusted.getDay() === 6 || holidayByIso.has(toISO(adjusted))) {
      adjusted = addDays(adjusted, -1)
    }

    return {
      date,
      iso: toISO(date),
      periodStart,
      periodEnd,
      isWeekend,
      holiday,
      needsAdjustment: isWeekend || !!holiday,
      adjusted,
    }
  })
}

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export const fmtDate = (d) =>
  d ? `${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getDate()}` : '—'
