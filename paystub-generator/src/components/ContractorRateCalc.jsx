import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { calcFederalTax, calcFICA, calcStateTax } from '../utils/taxCalculator'
import { STATE_LIST } from '../utils/states'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

const SE_TAX_RATE = 0.153        // 12.4% Social Security + 2.9% Medicare
const SE_TAXABLE_PORTION = 0.9235 // net earnings subject to SE tax

export default function ContractorRateCalc() {
  usePageMeta({
    title: '1099 vs W-2 Calculator 2026 — What Hourly Rate Should a Contractor Charge?',
    description: 'Free 1099 vs W-2 calculator. See the contractor hourly rate you need to match an employee salary once self-employment tax, unpaid time off, and lost benefits are covered. 2026 rates.',
    canonicalPath: '/1099-vs-w2-calculator',
  })

  const [salary, setSalary] = useState('')
  const [stateCode, setStateCode] = useState('CA')
  const [ptoDays, setPtoDays] = useState('15')
  const [holidays, setHolidays] = useState('10')
  const [healthCost, setHealthCost] = useState('600')
  const [employerMatch, setEmployerMatch] = useState('3')
  const [billableHours, setBillableHours] = useState('1800')
  const [result, setResult] = useState(null)

  const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
  const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calculate = () => {
    const s = parseFloat(salary) || 0
    if (s <= 0) return

    const pto = parseFloat(ptoDays) || 0
    const hol = parseFloat(holidays) || 0
    const health = (parseFloat(healthCost) || 0) * 12
    const match = s * ((parseFloat(employerMatch) || 0) / 100)
    const billable = parseFloat(billableHours) || 1800

    // W-2 side: take-home after employee-side taxes.
    const w2Federal = calcFederalTax(s, 'single')
    const w2Fica = calcFICA(s)
    const w2State = calcStateTax(s, stateCode)
    const w2Net = s - w2Federal - w2Fica.ss - w2Fica.medicare - w2State

    // What the employee also receives that a contractor must self-fund.
    const benefitsValue = health + match
    const unpaidDaysValue = (s / 260) * (pto + hol)

    // Contractor gross needed so that after SE tax + income tax + self-funded
    // benefits, the contractor nets the same as the W-2 employee.
    // Solve by bisection over gross revenue.
    const contractorNetFor = (gross) => {
      const seTax = gross * SE_TAXABLE_PORTION * SE_TAX_RATE
      const halfSeDeduction = seTax / 2
      const taxableIncome = Math.max(0, gross - halfSeDeduction)
      const federal = calcFederalTax(taxableIncome, 'single')
      const state = calcStateTax(taxableIncome, stateCode)
      return gross - seTax - federal - state - benefitsValue
    }

    let lo = s
    let hi = s * 3 + 50000
    for (let i = 0; i < 60; i++) {
      const mid = (lo + hi) / 2
      if (contractorNetFor(mid) < w2Net) lo = mid
      else hi = mid
    }
    const requiredGross = hi

    const seTax = requiredGross * SE_TAXABLE_PORTION * SE_TAX_RATE
    const federal = calcFederalTax(Math.max(0, requiredGross - seTax / 2), 'single')
    const state = calcStateTax(Math.max(0, requiredGross - seTax / 2), stateCode)

    setResult({
      w2Salary: s,
      w2Net,
      w2Federal, w2Ss: w2Fica.ss, w2Medicare: w2Fica.medicare, w2State,
      benefitsValue, health, match, unpaidDaysValue,
      requiredGross,
      hourlyRate: requiredGross / billable,
      naiveRate: s / 2080,
      seTax, federal, state,
      billable,
      uplift: (requiredGross / s - 1) * 100,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': '1099 vs W-2 Contractor Rate Calculator 2026',
        'url': 'https://myfreepaystub.com/1099-vs-w2-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Compare 1099 contractor pay to a W-2 salary and find the hourly rate needed to break even after self-employment tax and benefits.',
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">1099 vs W-2 Calculator</h1>
        <p className="text-sm text-gray-500">
          Going contract? Find the hourly rate you need to charge to actually match a salaried job —
          after self-employment tax, unpaid time off, and the benefits you now pay for yourself.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className={labelClass}>Equivalent W-2 Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="90,000" className={`${inputClass} pl-7`} />
          </div>
        </div>

        <div>
          <label className={labelClass}>State</label>
          <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputClass}>
            {[...STATE_LIST].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Paid Vacation Days</label>
            <input type="number" value={ptoDays} onChange={(e) => setPtoDays(e.target.value)} placeholder="15" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Paid Holidays</label>
            <input type="number" value={holidays} onChange={(e) => setHolidays(e.target.value)} placeholder="10" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Health Premium / Month</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={healthCost} onChange={(e) => setHealthCost(e.target.value)} placeholder="600" className={`${inputClass} pl-7`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>401(k) Match (%)</label>
            <input type="number" step="0.1" value={employerMatch} onChange={(e) => setEmployerMatch(e.target.value)} placeholder="3" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Billable Hours / Year</label>
          <input type="number" value={billableHours} onChange={(e) => setBillableHours(e.target.value)} placeholder="1800" className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">
            2,080 is a full year with no time off. Most contractors bill 1,600–1,900 after vacation,
            gaps between clients, and admin time.
          </p>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate Contractor Rate
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Hourly Rate You Should Charge</p>
            <p className="text-4xl font-black text-blue-700">{fmt2(result.hourlyRate)}/hr</p>
            <p className="text-xs text-gray-500 mt-1">
              {fmt0(result.requiredGross)} a year over {result.billable.toLocaleString('en-US')} billable hours
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800">
            💡 A naive "salary ÷ 2,080" gives only <strong>{fmt2(result.naiveRate)}/hr</strong>. You need
            about <strong>{result.uplift.toFixed(0)}% more</strong> than the W-2 salary to break even —
            that gap is the single most common contractor pricing mistake.
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">What the Extra Covers</p>
            <div className="space-y-2 text-sm">
              {[
                ['Self-employment tax (15.3%)', result.seTax, 'You now pay both halves of Social Security and Medicare.'],
                ['Health insurance', result.health, 'No employer contribution.'],
                ['Lost 401(k) match', result.match, 'Free money an employer would have added.'],
                ['Unpaid time off', result.unpaidDaysValue, 'Vacation and holidays you no longer get paid for.'],
              ].map(([label, val, note], i) => (
                <div key={i} className="border-b border-gray-50 py-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-800">{fmt0(val)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Side by Side</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border border-gray-200 font-semibold text-xs"></th>
                    <th className="text-right p-2 border border-gray-200 font-semibold text-xs">W-2 Employee</th>
                    <th className="text-right p-2 border border-gray-200 font-semibold text-xs">1099 Contractor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-200 text-gray-600">Gross</td>
                    <td className="p-2 border border-gray-200 text-right">{fmt0(result.w2Salary)}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold">{fmt0(result.requiredGross)}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200 text-gray-600">Payroll / SE tax</td>
                    <td className="p-2 border border-gray-200 text-right text-red-500">({fmt0(result.w2Ss + result.w2Medicare)})</td>
                    <td className="p-2 border border-gray-200 text-right text-red-500">({fmt0(result.seTax)})</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 text-gray-600">Income tax (fed + state)</td>
                    <td className="p-2 border border-gray-200 text-right text-red-500">({fmt0(result.w2Federal + result.w2State)})</td>
                    <td className="p-2 border border-gray-200 text-right text-red-500">({fmt0(result.federal + result.state)})</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200 text-gray-600">Benefits you self-fund</td>
                    <td className="p-2 border border-gray-200 text-right">—</td>
                    <td className="p-2 border border-gray-200 text-right text-red-500">({fmt0(result.benefitsValue)})</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 font-bold">Net to you</td>
                    <td className="p-2 border border-gray-200 text-right font-black text-emerald-700">{fmt0(result.w2Net)}</td>
                    <td className="p-2 border border-gray-200 text-right font-black text-emerald-700">≈ {fmt0(result.w2Net)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Contractors also owe quarterly estimated taxes. Work yours out with the{' '}
            <a href="/self-employment-tax-calculator" className="underline font-semibold">Self-Employment Tax Calculator</a>,
            and bill clients with our free <a href="/invoice-generator" className="underline font-semibold">Invoice Generator</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="1099-vs-w2-calculator" title="1099 vs W-2 Calculator" height="900" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Why a 1099 Rate Must Be Higher Than a W-2 Salary</h2>
          <p className="leading-relaxed">
            A contract role that pays the same headline number as a salaried job is a significant
            pay cut. As a 1099 contractor you take on costs an employer used to absorb:
          </p>
          <ul className="space-y-2 leading-relaxed mt-3">
            <li><strong>Self-employment tax</strong> — employees split FICA with their employer (7.65% each). Contractors pay the full 15.3% themselves.</li>
            <li><strong>No paid time off</strong> — every vacation day, holiday, and sick day is unbilled.</li>
            <li><strong>Health insurance</strong> — the employer subsidy disappears.</li>
            <li><strong>No 401(k) match</strong> — an immediate loss of employer contributions.</li>
            <li><strong>Unbillable time</strong> — sales, invoicing, and gaps between contracts are unpaid.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            Once these are added up, contractors typically need <strong>25–50% more gross</strong> than
            the equivalent salary just to break even.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What Contractors Get in Return</h2>
          <p className="leading-relaxed">
            It is not all cost. Contractors can deduct legitimate business expenses (home office,
            equipment, software, mileage), may qualify for the qualified business income deduction,
            and can often contribute far more to a retirement plan such as a SEP-IRA or Solo 401(k)
            than an employee can. Those advantages are not modelled above, so treat the rate this
            calculator gives you as a floor, not a ceiling.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How much more should a 1099 contractor charge than a W-2 employee?', a: 'A common rule of thumb is 25–50% more, but the exact figure depends on your state, how much time off you take, and what you pay for health insurance. The calculator above works out your specific number instead of guessing.' },
              { q: 'How do I convert a salary to an hourly contract rate?', a: 'Do not just divide by 2,080. Divide the grossed-up amount by your realistic billable hours — usually 1,600 to 1,900 a year once vacation, admin, and gaps between clients are removed.' },
              { q: 'What is self-employment tax?', a: 'It is the contractor version of FICA: 12.4% Social Security plus 2.9% Medicare on 92.35% of net earnings. Half of it is deductible against income tax, which this calculator accounts for.' },
              { q: 'Is 1099 or W-2 better?', a: 'Neither is universally better. W-2 offers benefits, paid leave, and employer-paid payroll taxes; 1099 offers higher rates, deductible business expenses, and flexibility. Compare total value, not headline pay.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/1099-vs-w2-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Estimates for planning only — not tax, legal, or financial advice. Worker classification
          (whether a role may legally be 1099 rather than W-2) is decided by IRS and state rules, not
          by preference. Consult a qualified tax professional before making a decision.
        </div>
      </div>
    </div>
  )
}
