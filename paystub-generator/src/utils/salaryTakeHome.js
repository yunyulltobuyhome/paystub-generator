import { calcFederalTax, calcFICA, calcStateTax } from './taxCalculator'
import { STATE_LIST } from './states'

// Annual take-home for a single filer in one state (federal + FICA + flat state
// estimate). Mirrors the site's existing calculator methodology.
export function takeHomeForState(annualGross, stateCode) {
  const federal = calcFederalTax(annualGross, 'single')
  const { ss, medicare } = calcFICA(annualGross)
  const state = calcStateTax(annualGross, stateCode)
  const totalTax = federal + ss + medicare + state
  return {
    federal, ss, medicare, state,
    totalTax,
    net: annualGross - totalTax,
  }
}

// Take-home in every state + DC, sorted highest net first (best states on top).
export function takeHomeByState(annualGross) {
  return STATE_LIST
    .map((s) => ({ ...s, ...takeHomeForState(annualGross, s.code) }))
    .sort((a, b) => b.net - a.net)
}

// Federal + FICA only (state-independent) — the baseline before state tax.
export function federalTakeHome(annualGross) {
  const federal = calcFederalTax(annualGross, 'single')
  const { ss, medicare } = calcFICA(annualGross)
  return { federal, ss, medicare, net: annualGross - federal - ss - medicare }
}
