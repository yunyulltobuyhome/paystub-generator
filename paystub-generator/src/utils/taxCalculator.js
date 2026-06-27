import {
  FEDERAL_BRACKETS_SINGLE,
  FEDERAL_BRACKETS_MFJ,
  FICA,
  STANDARD_DEDUCTIONS,
  STATE_TAXES,
} from '../data/stateTaxRates'

export function calcFederalTax(annualGross, filingStatus) {
  const deduction = filingStatus === 'married'
    ? STANDARD_DEDUCTIONS.married
    : filingStatus === 'head'
    ? STANDARD_DEDUCTIONS.head
    : STANDARD_DEDUCTIONS.single

  const taxableIncome = Math.max(0, annualGross - deduction)
  const brackets = filingStatus === 'married'
    ? FEDERAL_BRACKETS_MFJ
    : FEDERAL_BRACKETS_SINGLE

  let tax = 0
  for (const bracket of brackets) {
    if (taxableIncome <= bracket.min) break
    const taxable = Math.min(taxableIncome, bracket.max) - bracket.min
    tax += taxable * bracket.rate
  }
  return Math.max(0, tax)
}

export function calcFICA(annualGross) {
  const ssTaxable = Math.min(annualGross, FICA.socialSecurityWageBase)
  const ss = ssTaxable * FICA.socialSecurityRate
  const medicare = annualGross * FICA.medicareRate
  const additionalMedicare = annualGross > FICA.additionalMedicareThreshold
    ? (annualGross - FICA.additionalMedicareThreshold) * FICA.additionalMedicareRate
    : 0
  return { ss, medicare: medicare + additionalMedicare }
}

export function calcStateTax(annualGross, stateCode) {
  const state = STATE_TAXES[stateCode]
  if (!state) return 0
  return annualGross * state.rate
}

export function getPayPeriods(frequency) {
  const map = { weekly: 52, biweekly: 26, semimonthly: 24, monthly: 12 }
  return map[frequency] || 26
}

export function calcPayStub({
  grossPay,        // per period gross
  frequency,       // weekly | biweekly | semimonthly | monthly
  filingStatus,    // single | married | head
  stateCode,       // e.g. 'CA'
  ytdGross = 0,    // year-to-date gross BEFORE this period
  allowances = 0,  // additional withholding allowances
  preDeductions = 0, // pre-tax deductions (health insurance, 401k etc.)
}) {
  const periods = getPayPeriods(frequency)
  const annualGross = grossPay * periods
  const taxableGross = Math.max(0, grossPay - preDeductions)
  const annualTaxableGross = taxableGross * periods

  // Federal
  const annualFederal = calcFederalTax(annualTaxableGross, filingStatus)
  const periodFederal = annualFederal / periods

  // FICA (based on YTD)
  const fica = calcFICA(grossPay)
  const ytdAfterThis = ytdGross + grossPay
  // Social Security wage base check
  const ssAlreadyMaxed = ytdGross >= FICA.socialSecurityWageBase
  const ssTaxable = ssAlreadyMaxed
    ? 0
    : Math.min(grossPay, FICA.socialSecurityWageBase - ytdGross)
  const periodSS = ssTaxable * FICA.socialSecurityRate
  const periodMedicare = grossPay * FICA.medicareRate

  // State
  const annualState = calcStateTax(annualTaxableGross, stateCode)
  const periodState = annualState / periods

  const totalDeductions = periodFederal + periodSS + periodMedicare + periodState + preDeductions
  const netPay = grossPay - totalDeductions

  return {
    grossPay: Math.round(grossPay * 100) / 100,
    preDeductions: Math.round(preDeductions * 100) / 100,
    taxableGross: Math.round(taxableGross * 100) / 100,
    federalTax: Math.round(periodFederal * 100) / 100,
    socialSecurity: Math.round(periodSS * 100) / 100,
    medicare: Math.round(periodMedicare * 100) / 100,
    stateTax: Math.round(periodState * 100) / 100,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    netPay: Math.round(netPay * 100) / 100,
    // YTD
    ytdGross: Math.round(ytdAfterThis * 100) / 100,
    ytdFederal: Math.round((ytdGross / grossPay * periodFederal + periodFederal) * 100) / 100,
    ytdSS: Math.round(periodSS * 100) / 100,
    ytdMedicare: Math.round(periodMedicare * 100) / 100,
    ytdState: Math.round(periodState * 100) / 100,
    ytdNet: Math.round(netPay * 100) / 100,
    annualGross,
    periods,
    stateCode,
    stateName: STATE_TAXES[stateCode]?.name || stateCode,
    stateRate: STATE_TAXES[stateCode]?.rate || 0,
  }
}