import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

const FREQUENCIES = [
  { v: 'weekly', l: 'Weekly', periods: 52 },
  { v: 'biweekly', l: 'Bi-Weekly', periods: 26 },
  { v: 'semimonthly', l: 'Semi-Monthly', periods: 24 },
  { v: 'monthly', l: 'Monthly', periods: 12 },
]

export default function PtoAccrualCalc() {
  usePageMeta({
    title: 'PTO Accrual Calculator 2026 — Vacation Time Earned Per Hour & Paycheck',
    description: 'Free PTO accrual calculator. Convert annual vacation days into an hourly accrual rate, see how much PTO you earn each paycheck, and project your balance. No sign-up.',
    canonicalPath: '/pto-accrual-calculator',
  })

  const [annualDays, setAnnualDays] = useState('15')
  const [hoursPerDay, setHoursPerDay] = useState('8')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [frequency, setFrequency] = useState('biweekly')
  const [currentBalance, setCurrentBalance] = useState('')
  const [periodsElapsed, setPeriodsElapsed] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [result, setResult] = useState(null)

  const fmtH = (n) => Number(n || 0).toFixed(2)
  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calculate = () => {
    const days = parseFloat(annualDays) || 0
    const hpd = parseFloat(hoursPerDay) || 8
    const hpw = parseFloat(hoursPerWeek) || 40
    if (days <= 0) return

    const annualHours = days * hpd
    const workHoursPerYear = hpw * 52
    const perHourWorked = annualHours / workHoursPerYear
    const freq = FREQUENCIES.find((f) => f.v === frequency) || FREQUENCIES[1]
    const perPeriod = annualHours / freq.periods

    const elapsed = parseFloat(periodsElapsed) || 0
    const start = parseFloat(currentBalance) || 0
    const projected = start + perPeriod * elapsed

    const rate = parseFloat(hourlyRate) || 0

    setResult({
      annualHours,
      annualDays: days,
      perHourWorked,
      perPeriod,
      periodLabel: freq.l.toLowerCase(),
      periodsPerYear: freq.periods,
      perMonth: annualHours / 12,
      projected,
      projectedDays: projected / hpd,
      hasProjection: elapsed > 0 || start > 0,
      cashValue: rate > 0 ? projected * rate : 0,
      rate,
      hpd,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'PTO Accrual Calculator 2026',
        'url': 'https://myfreepaystub.com/pto-accrual-calculator',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Convert annual vacation days into hourly PTO accrual rates and project your paid time off balance.',
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">PTO Accrual Calculator</h1>
        <p className="text-sm text-gray-500">
          Turn your annual vacation allowance into an accrual rate per hour worked and per paycheck,
          then project your balance.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>PTO Days Per Year</label>
            <input type="number" step="0.5" value={annualDays} onChange={(e) => setAnnualDays(e.target.value)} placeholder="15" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Hours Per Work Day</label>
            <input type="number" step="0.5" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)} placeholder="8" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Hours Worked Per Week</label>
          <input type="number" step="0.5" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} placeholder="40" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Pay Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {FREQUENCIES.map((f) => (
              <button key={f.v} onClick={() => setFrequency(f.v)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  frequency === f.v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {f.l}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Project Your Balance (optional)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Starting Balance (hrs)</label>
              <input type="number" step="0.01" value={currentBalance} onChange={(e) => setCurrentBalance(e.target.value)} placeholder="40" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Pay Periods Elapsed</label>
              <input type="number" value={periodsElapsed} onChange={(e) => setPeriodsElapsed(e.target.value)} placeholder="12" className={inputClass} />
            </div>
          </div>
          <div className="mt-3">
            <label className={labelClass}>Hourly Rate <span className="text-gray-400 font-normal">(to value your PTO)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="25.00" className={`${inputClass} pl-7`} />
            </div>
          </div>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate PTO Accrual
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Accrual Rate</p>
            <p className="text-4xl font-black text-blue-700">{result.perHourWorked.toFixed(4)}</p>
            <p className="text-xs text-gray-500 mt-1">PTO hours earned per hour worked</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Per pay period', `${fmtH(result.perPeriod)} hrs`],
                ['Per month', `${fmtH(result.perMonth)} hrs`],
                ['Per year', `${fmtH(result.annualHours)} hrs (${result.annualDays} days)`],
                ['Per hour worked', `${result.perHourWorked.toFixed(4)} hrs`],
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-800">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {result.hasProjection && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide mb-2">Projected Balance</p>
              <p className="text-3xl font-black text-emerald-700">{fmtH(result.projected)} hrs</p>
              <p className="text-sm text-emerald-800 mt-1">
                ≈ {result.projectedDays.toFixed(1)} days off
                {result.rate > 0 && <> · worth <strong>{fmt(result.cashValue)}</strong> at {fmt(result.rate)}/hr</>}
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Your employer's policy governs how PTO actually accrues, carries over, and is paid out.
            Check your employee handbook for caps and waiting periods.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="pto-accrual-calculator" title="PTO Accrual Calculator" height="880" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How PTO Accrual Works</h2>
          <p className="leading-relaxed">
            Most US employers grant paid time off in one of two ways. With a <strong>lump-sum grant</strong>,
            your whole annual allowance appears at the start of the year. With <strong>accrual</strong>,
            you earn PTO gradually — a set number of hours each pay period, or a fraction of an hour
            for every hour you work.
          </p>
          <p className="leading-relaxed mt-3">
            The standard accrual formula is: <strong>annual PTO hours ÷ annual work hours</strong>. Someone
            with 15 days (120 hours) of PTO working 2,080 hours a year accrues 0.0577 hours of PTO for
            every hour worked — about 4.62 hours per bi-weekly paycheck.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Common PTO Accrual Rates (Full Time)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">PTO Days</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Hours/Year</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Per Hour Worked</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Bi-Weekly</th>
                </tr>
              </thead>
              <tbody>
                {[10, 15, 20, 25, 30].map((d, i) => {
                  const hrs = d * 8
                  return (
                    <tr key={d} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200 font-medium">{d} days</td>
                      <td className="p-2 border border-gray-200">{hrs} hrs</td>
                      <td className="p-2 border border-gray-200 text-blue-600 font-semibold">{(hrs / 2080).toFixed(4)}</td>
                      <td className="p-2 border border-gray-200">{(hrs / 26).toFixed(2)} hrs</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How do I calculate my PTO accrual rate?', a: 'Divide your total annual PTO hours by the hours you work in a year. For 15 days (120 hours) at 40 hours a week, that is 120 ÷ 2,080 = 0.0577 PTO hours per hour worked.' },
              { q: 'How much PTO do I earn per paycheck?', a: 'Divide annual PTO hours by the number of pay periods: 26 for bi-weekly, 24 for semi-monthly, 12 for monthly, 52 for weekly.' },
              { q: 'Does unused PTO have to be paid out when I leave?', a: 'It depends on the state and your employer policy. Some states treat accrued vacation as earned wages that must be paid out; others leave it to company policy. Check your state labor department and your handbook.' },
              { q: 'What is a PTO accrual cap?', a: 'Many employers cap how much PTO you can bank. Once you hit the cap you stop accruing until you use some time — often called a "use it or lose it" or accrual ceiling policy, which some states restrict.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/pto-accrual-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ For estimation only — not legal, HR, or payroll advice. PTO accrual, carryover, caps, and
          payout on termination are governed by your employer's written policy and by state law, which
          varies considerably. Verify with your HR department.
        </div>
      </div>
    </div>
  )
}
