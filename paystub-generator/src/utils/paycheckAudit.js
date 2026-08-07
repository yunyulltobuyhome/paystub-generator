// Arithmetic audit of a pay stub the user reads off their own paycheck.
//
// Everything here is checkable math — FICA percentages, gross = rate x hours,
// overtime multiples, and whether the deductions actually sum to the net pay.
// It deliberately does NOT try to reproduce federal income tax withholding,
// which depends on W-4 elections the visitor may not know; that is reported as
// context, never as a discrepancy.
//
// Every finding is phrased as something to ASK about and ships with the common
// innocent explanation, because most mismatches have one.

import { FICA } from '../data/stateTaxRates'

const SEV = { error: 'error', check: 'check', info: 'info' }

const near = (a, b, tol) => Math.abs(a - b) <= tol

export function auditPaycheck(input) {
  const {
    payType = 'hourly',
    gross = 0,
    hourlyRate = 0,
    regularHours = 0,
    otHours = 0,
    otMultiplier = 1.5,
    federal = 0,
    socialSecurity = 0,
    medicare = 0,
    stateTax = 0,
    preTaxHealth = 0,     // Section 125 — reduces the FICA base
    retirement401k = 0,   // reduces income-tax base but NOT the FICA base
    otherDeductions = 0,
    net = 0,
    ytdGross = 0,
    stateHasIncomeTax = true,
    stateName = 'your state',
    periodsPerYear = 26,
  } = input

  const findings = []
  const add = (severity, title, detail, why) => findings.push({ severity, title, detail, why })

  // ---- 1. Does the stub add up at all? -------------------------------------
  const totalDeductions = federal + socialSecurity + medicare + stateTax + preTaxHealth + retirement401k + otherDeductions
  const expectedNet = gross - totalDeductions
  const netGap = net - expectedNet
  if (gross > 0 && net > 0 && !near(net, expectedNet, 1)) {
    add(SEV.error,
      'Your net pay does not match gross minus deductions',
      `Gross minus everything you listed comes to ${money(expectedNet)}, but you entered ${money(net)} as take-home — a difference of ${money(Math.abs(netGap))}.`,
      'Usually this means a deduction is missing from what you entered (union dues, garnishment, local or city tax, an HSA or FSA contribution). If you have listed every line on the stub, the arithmetic on the stub itself is worth questioning.')
  }

  // ---- 2. Social Security: a fixed 6.2% with a hard annual cap -------------
  const ficaBase = Math.max(0, gross - preTaxHealth)
  const ssRemainingRoom = Math.max(0, FICA.socialSecurityWageBase - ytdGross)
  const ssTaxable = ytdGross > 0 ? Math.min(ficaBase, ssRemainingRoom) : ficaBase
  const expectedSS = ssTaxable * FICA.socialSecurityRate
  const ssTol = Math.max(1, expectedSS * 0.02)

  if (gross > 0) {
    if (ytdGross > 0 && ssRemainingRoom === 0) {
      add(SEV.info,
        'You have hit the Social Security wage cap',
        `Your year-to-date earnings exceed ${money(FICA.socialSecurityWageBase)}, so no further Social Security tax should be withheld this year.`,
        'Seeing $0 of Social Security on this stub is correct once you pass the cap. Medicare has no cap and continues.')
    } else if (!near(socialSecurity, expectedSS, ssTol)) {
      const overUnder = socialSecurity > expectedSS ? 'more' : 'less'
      add(SEV.check,
        `Social Security withheld looks ${overUnder} than 6.2%`,
        `On a FICA base of ${money(ficaBase)} you would expect about ${money(expectedSS)}. Your stub shows ${money(socialSecurity)}.`,
        'Social Security is a flat 6.2% for employees, so this line is usually exact. Common explanations: pre-tax insurance you have not entered above (it lowers the FICA base), or year-to-date earnings crossing the annual wage cap mid-period.')
    }
  }

  // ---- 3. Medicare: 1.45%, plus a 0.9% surtax on wages above the threshold --
  // The surtax applies only to the portion of wages ABOVE the threshold, not to
  // the whole paycheck, so the split has to be modelled or high earners get
  // flagged incorrectly.
  const baseMedicare = ficaBase * FICA.medicareRate
  let expectedMedicare = baseMedicare
  let surtaxNote = ''

  if (ytdGross > 0) {
    const surtaxable = Math.min(ficaBase, Math.max(0, (ytdGross + ficaBase) - FICA.additionalMedicareThreshold))
    expectedMedicare = baseMedicare + surtaxable * FICA.additionalMedicareRate
    if (surtaxable > 0) surtaxNote = ' (including the 0.9% additional Medicare tax on the part of your wages above the high-earner threshold)'
  }

  // Without year-to-date figures we cannot tell where the surtax kicks in, so
  // anything between the plain rate and the full surtaxed rate is accepted.
  const medFloor = baseMedicare
  const medCeil = ytdGross > 0 ? expectedMedicare : ficaBase * (FICA.medicareRate + FICA.additionalMedicareRate)
  const medTol = Math.max(1, expectedMedicare * 0.02)
  const medicareOk = ytdGross > 0
    ? near(medicare, expectedMedicare, medTol)
    : medicare >= medFloor - medTol && medicare <= medCeil + medTol

  if (gross > 0 && !medicareOk) {
    add(SEV.check,
      'Medicare withheld does not match the standard rate',
      `On a FICA base of ${money(ficaBase)} you would expect about ${money(expectedMedicare)}${surtaxNote}. Your stub shows ${money(medicare)}.`,
      'Medicare is a flat 1.45% with no wage cap, rising by 0.9% on wages above the high-earner threshold. Pre-tax insurance lowers the base; 401(k) contributions do not.')
  }

  // ---- 4. Hourly pay: does gross equal what you actually worked? -----------
  if (payType === 'hourly' && hourlyRate > 0 && regularHours > 0) {
    const expectedRegular = hourlyRate * regularHours
    const expectedOT = hourlyRate * otMultiplier * otHours
    const expectedGross = expectedRegular + expectedOT
    if (!near(gross, expectedGross, Math.max(1, expectedGross * 0.01))) {
      add(SEV.check,
        'Gross pay does not match your rate times your hours',
        `${regularHours} hrs at ${money(hourlyRate)}${otHours > 0 ? ` plus ${otHours} OT hrs at ${otMultiplier}x` : ''} comes to ${money(expectedGross)}, but your gross shows ${money(gross)}.`,
        'Check whether the stub includes a shift differential, bonus, tips, or paid leave that you have not counted — or whether some hours were missed.')
    }
  }

  // ---- 5. Overtime actually paid at a premium ------------------------------
  if (payType === 'hourly' && otHours > 0 && hourlyRate > 0 && gross > 0) {
    const impliedOtPay = gross - hourlyRate * regularHours
    const impliedRate = impliedOtPay / otHours
    if (impliedRate > 0 && impliedRate < hourlyRate * 1.49) {
      add(SEV.check,
        'Your overtime may not be paid at time-and-a-half',
        `Your overtime hours appear to be paid at roughly ${money(impliedRate)}/hr, which is about ${(impliedRate / hourlyRate).toFixed(2)}x your base rate rather than 1.5x.`,
        'Under the federal FLSA most non-exempt employees must receive at least 1.5x their regular rate beyond 40 hours in a workweek. Some roles are exempt, and the "regular rate" can include bonuses, so confirm your classification before concluding anything.')
    }
  }

  // ---- 6. Hours over 40 with no overtime line ------------------------------
  const weeksInPeriod = periodsPerYear === 52 ? 1 : periodsPerYear === 26 ? 2 : periodsPerYear === 24 ? 2 : 4.33
  if (payType === 'hourly' && otHours === 0 && regularHours > 40 * weeksInPeriod) {
    add(SEV.check,
      'You worked over 40 hours a week with no overtime shown',
      `You entered ${regularHours} regular hours for a period covering about ${weeksInPeriod} week(s), with no overtime hours.`,
      'Non-exempt employees generally earn overtime past 40 hours in a workweek. If you are salaried-exempt this is expected. Note that overtime is measured per workweek, not per pay period.')
  }

  // ---- 7. State income tax present or absent -------------------------------
  if (gross > 0 && stateHasIncomeTax && stateTax === 0) {
    add(SEV.info,
      `No ${stateName} state income tax withheld`,
      `${stateName} does levy a state income tax, but your stub shows none withheld.`,
      'This can be legitimate: you may live in a state with a reciprocity agreement, have claimed exempt on your state form, or earn below the withholding threshold. If none of those apply, it is worth raising with payroll — under-withholding now means a bill at filing.')
  }
  if (gross > 0 && !stateHasIncomeTax && stateTax > 0) {
    add(SEV.check,
      `State tax withheld in a state with no income tax`,
      `${stateName} has no state income tax, but ${money(stateTax)} was withheld.`,
      'You may be withheld for a different state where you work, or this line may be a local tax or a state disability/paid-leave contribution rather than income tax.')
  }

  // ---- 8. Federal withholding context (never a "discrepancy") --------------
  if (gross > 0 && federal === 0) {
    add(SEV.info,
      'No federal income tax withheld',
      'Your stub shows $0 of federal income tax.',
      'This is common and often correct — it happens when income is low enough, when you claim dependents on your W-4, or if you claimed exempt. It is not an error by itself, but if it continues all year you may owe at filing.')
  }

  const errors = findings.filter((f) => f.severity === SEV.error).length
  const checks = findings.filter((f) => f.severity === SEV.check).length

  return {
    findings,
    errors,
    checks,
    infos: findings.filter((f) => f.severity === SEV.info).length,
    clean: errors === 0 && checks === 0,
    expectedNet,
    netGap,
    expectedSS,
    expectedMedicare,
    ficaBase,
    totalDeductions,
    effectiveTaxRate: gross > 0 ? (federal + socialSecurity + medicare + stateTax) / gross : 0,
  }
}

function money(n) {
  return '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
