// Valuation model for comparing job offers.
//
// The premise: base salary is a bad way to choose between offers. A higher
// number in a high-tax state, with a long commute, a worse 401(k) match and an
// expensive health plan, routinely loses to a lower number that has none of
// those. This converts each offer into two comparable figures — what actually
// lands in your pocket over a year, and what an hour of your life is worth
// under that offer.
//
// Everything is derived from what the user types. No market data, no salary
// benchmarks, no claims about what any employer pays.

import { calcFederalTax, calcFICA, calcStateTax } from './taxCalculator'

export const WORK_WEEKS_DEFAULT = 50

export function valueOffer(offer, opts = {}) {
  const {
    label = 'Offer',
    baseSalary = 0,
    stateCode = 'CA',
    signingBonus = 0,
    annualBonusPct = 0,
    match401kPct = 0,
    healthMonthly = 0,
    ptoDays = 0,
    contractedHours = 40,
    commuteDays = 0,
    commuteMinutes = 0,
    commuteMonthly = 0,
    otherMonthly = 0,
  } = offer

  const filingStatus = opts.filingStatus || 'single'

  // ---- Cash compensation -------------------------------------------------
  const annualBonus = baseSalary * (annualBonusPct / 100)
  // Signing bonus is a first-year-only figure; it is reported separately so a
  // one-off payment cannot quietly inflate the ongoing comparison.
  const recurringGross = baseSalary + annualBonus
  const firstYearGross = recurringGross + signingBonus

  const taxOn = (gross) => {
    const federal = calcFederalTax(gross, filingStatus)
    const { ss, medicare } = calcFICA(gross)
    const state = calcStateTax(gross, stateCode)
    return { federal, ss, medicare, state, total: federal + ss + medicare + state }
  }

  const recurringTax = taxOn(recurringGross)
  const firstYearTax = taxOn(firstYearGross)

  const recurringNet = recurringGross - recurringTax.total
  const firstYearNet = firstYearGross - firstYearTax.total

  // ---- Benefits and costs ------------------------------------------------
  const employerMatch = baseSalary * (match401kPct / 100)
  const healthAnnual = healthMonthly * 12
  const commuteAnnual = commuteMonthly * 12
  const otherAnnual = otherMonthly * 12
  const jobCosts = healthAnnual + commuteAnnual + otherAnnual

  // The 401(k) match is real compensation, but it lands in a retirement account
  // rather than your bank, so it is tracked separately from spendable pay.
  const spendable = recurringNet - jobCosts
  const totalValue = spendable + employerMatch
  const firstYearTotalValue = (firstYearNet - jobCosts) + employerMatch

  // ---- Time ---------------------------------------------------------------
  const workWeeks = Math.max(1, (opts.workWeeks || WORK_WEEKS_DEFAULT))
  const commuteHoursPerWeek = (commuteMinutes * 2 * commuteDays) / 60
  const realHoursPerWeek = contractedHours + commuteHoursPerWeek
  const realHoursPerYear = realHoursPerWeek * workWeeks

  const nominalHourly = contractedHours > 0 ? baseSalary / (contractedHours * 52) : 0
  const realHourly = realHoursPerYear > 0 ? totalValue / realHoursPerYear : 0

  // PTO expressed in money, so an offer with more leave is not silently ignored.
  const ptoValue = (baseSalary / 260) * ptoDays

  return {
    label,
    stateCode,
    baseSalary,
    annualBonus,
    signingBonus,
    recurringGross,
    firstYearGross,
    tax: recurringTax,
    recurringNet,
    firstYearNet,
    employerMatch,
    healthAnnual,
    commuteAnnual,
    otherAnnual,
    jobCosts,
    spendable,
    totalValue,
    firstYearTotalValue,
    commuteHoursPerWeek,
    realHoursPerWeek,
    realHoursPerYear,
    nominalHourly,
    realHourly,
    ptoValue,
    ptoDays,
    effectiveTaxRate: recurringGross > 0 ? recurringTax.total / recurringGross : 0,
  }
}

/**
 * Value every offer and rank them. Ranking uses ongoing total value rather
 * than first-year, so a signing bonus cannot win a multi-year decision on its
 * own — but the first-year figure is kept so the user can see both.
 */
export function compareOffers(offers, opts = {}) {
  const valued = offers.map((o) => valueOffer(o, opts))
  const ranked = [...valued].sort((a, b) => b.totalValue - a.totalValue)
  const winner = ranked[0]
  const runnerUp = ranked[1]

  const byHourly = [...valued].sort((a, b) => b.realHourly - a.realHourly)
  const hourlyWinner = byHourly[0]

  // The interesting case: the offer with the biggest salary is not the one
  // that leaves you better off.
  const highestBase = [...valued].sort((a, b) => b.baseSalary - a.baseSalary)[0]
  const upsetOnValue = winner && highestBase && winner.label !== highestBase.label
  const upsetOnHourly = hourlyWinner && highestBase && hourlyWinner.label !== highestBase.label

  return {
    valued,
    ranked,
    winner,
    runnerUp,
    hourlyWinner,
    highestBase,
    upsetOnValue,
    upsetOnHourly,
    gap: winner && runnerUp ? winner.totalValue - runnerUp.totalValue : 0,
    baseGap: winner && highestBase ? highestBase.baseSalary - winner.baseSalary : 0,
  }
}
