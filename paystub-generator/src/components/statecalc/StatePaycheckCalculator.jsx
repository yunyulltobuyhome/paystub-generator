import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { calcPayStub, getPayPeriods } from '../../utils/taxCalculator'
import { takeHomeForState } from '../../utils/salaryTakeHome'
import { STATE_LIST, getStateBySlug, NO_INCOME_TAX_CODES, STATE_MIN_WAGE } from '../../utils/states'
import { SALARY_AMOUNTS, salarySlug } from '../../data/salaryAmounts'
import RelatedTools from '../RelatedTools'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'
import { INDEX_CLUSTERS, robotsFor } from '../../config/indexing'

const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Baseline used for the always-visible comparison table, so the page carries
// real content for crawlers before anyone touches the calculator.
const DEFAULT_SALARY = 60000

export default function StatePaycheckCalculator() {
  const { stateSlug } = useParams()
  const state = getStateBySlug(stateSlug)

  const [payType, setPayType] = useState('salary')
  const [salary, setSalary] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [frequency, setFrequency] = useState('biweekly')
  const [filingStatus, setFilingStatus] = useState('single')
  const [result, setResult] = useState(null)

  usePageMeta({
    title: state
      ? `${state.name} Paycheck Calculator 2026 — Take-Home Pay After Taxes | MyFreePayStub`
      : 'Paycheck Calculator by State | MyFreePayStub',
    description: state
      ? `Free ${state.name} paycheck calculator for 2026. See your take-home pay after federal, ${state.name} state, Social Security, and Medicare taxes — and compare what the same salary would leave you in other states.`
      : 'Paycheck calculators for every US state.',
    canonicalPath: state ? `/paycheck-calculator/${state.slug}` : '/paycheck-calculator',
    robots: robotsFor(INDEX_CLUSTERS.statePaycheckCalculators),
  })

  if (!state) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-gray-800 mb-3">State not found</h1>
        <p className="text-sm text-gray-500 mb-6">We don't have a paycheck calculator page for that state.</p>
        <Link to="/paycheck-calculator" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
          Open the paycheck calculator →
        </Link>
      </div>
    )
  }

  const hasIncomeTax = state.rate > 0
  const minWage = STATE_MIN_WAGE[state.code]

  const calculate = () => {
    const periods = getPayPeriods(frequency)
    let grossPerPeriod = 0
    if (payType === 'salary') {
      grossPerPeriod = (parseFloat(salary) || 0) / periods
    } else {
      const rate = parseFloat(hourlyRate) || 0
      const hrs = parseFloat(hoursPerWeek) || 0
      grossPerPeriod = rate * hrs * (52 / periods)
    }
    if (grossPerPeriod <= 0) return

    const res = calcPayStub({ grossPay: grossPerPeriod, frequency, filingStatus, stateCode: state.code, ytdGross: 0, preDeductions: 0 })
    const annualGross = grossPerPeriod * periods
    setResult({ ...res, grossPerPeriod, annualGross, annualNet: res.netPay * periods, periods })
  }

  // The differentiator: what the same salary leaves you elsewhere. Computed
  // from whatever the visitor entered, falling back to a baseline salary so the
  // table is present in the static HTML too.
  const compareSalary = result?.annualGross || DEFAULT_SALARY
  const here = takeHomeForState(compareSalary, state.code)
  const comparison = STATE_LIST
    .filter((s) => s.code !== state.code)
    .map((s) => ({ ...s, ...takeHomeForState(compareSalary, s.code) }))
    .sort((a, b) => b.net - a.net)
  const bestElsewhere = comparison.slice(0, 5)
  const noTaxStates = comparison.filter((s) => NO_INCOME_TAX_CODES.includes(s.code)).slice(0, 3)
  const rankAmongAll = [...comparison, { code: state.code, net: here.net }]
    .sort((a, b) => b.net - a.net)
    .findIndex((s) => s.code === state.code) + 1

  const ladder = SALARY_AMOUNTS.filter((a) => a <= 150000).map((a) => ({ amount: a, ...takeHomeForState(a, state.code) }))

  const FAQ = [
    { q: `How do I calculate my paycheck in ${state.name}?`, a: `Start with your gross pay for the period, then subtract federal income tax, Social Security (6.2%), Medicare (1.45%)${hasIncomeTax ? `, and ${state.name} state income tax` : ''}. The calculator above does this for you — enter your salary or hourly rate and pay frequency.` },
    { q: `Does ${state.name} have a state income tax?`, a: hasIncomeTax
        ? `Yes. ${state.name} levies a state income tax, estimated here at about ${(state.rate * 100).toFixed(2)}% of taxable wages. That is withheld from each paycheck on top of federal tax and FICA.`
        : `No. ${state.name} is one of the states with no state income tax, so only federal income tax and FICA come out of your paycheck. That typically leaves noticeably more take-home pay than a high-tax state.` },
    { q: `How much is $${DEFAULT_SALARY.toLocaleString('en-US')} after taxes in ${state.name}?`, a: `A $${DEFAULT_SALARY.toLocaleString('en-US')} salary in ${state.name} leaves roughly ${fmt0(takeHomeForState(DEFAULT_SALARY, state.code).net)} a year after federal tax, FICA${hasIncomeTax ? ', and state tax' : ''} — about ${fmt0(takeHomeForState(DEFAULT_SALARY, state.code).net / 26)} per bi-weekly paycheck for a single filer.` },
    { q: `What is the minimum wage in ${state.name}?`, a: minWage != null
        ? `${state.name}'s minimum wage is approximately ${fmt2(minWage)} an hour, or about ${fmt0(minWage * 2080)} a year full time. See our ${state.name} minimum wage page for the full breakdown.`
        : `Check your state labor department for the current minimum wage.` },
  ]

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': `${state.name} Paycheck Calculator 2026`,
        'url': `https://myfreepaystub.com/paycheck-calculator/${state.slug}`,
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': `Free ${state.name} paycheck calculator with take-home pay after federal, state, and FICA taxes.`,
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': FAQ.map((f) => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })),
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">{state.name} Paycheck Calculator 2026</h1>
        <p className="text-sm text-gray-500">
          Work out your {state.name} take-home pay after federal, state, and FICA taxes — then see
          what the same salary would leave you in every other state.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-800">
          <span>📍</span>
          <span>Pre-set to <strong>{state.name}</strong>{hasIncomeTax ? ` — state income tax applied at about ${(state.rate * 100).toFixed(2)}%` : ' — no state income tax'}.</span>
        </div>

        <div>
          <label className={labelClass}>Pay Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[['salary', '💼 Salary'], ['hourly', '⏰ Hourly']].map(([v, l]) => (
              <button key={v} onClick={() => setPayType(v)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  payType === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>{l}</button>
            ))}
          </div>
        </div>

        {payType === 'salary' ? (
          <div>
            <label className={labelClass}>Annual Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="60,000" className={`${inputClass} pl-7`} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Hourly Rate</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input type="number" step="0.01" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="25.00" className={`${inputClass} pl-7`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Hours Per Week</label>
              <input type="number" step="0.5" value={hoursPerWeek} onChange={(e) => setHoursPerWeek(e.target.value)} placeholder="40" className={inputClass} />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>Pay Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[['weekly', 'Weekly'], ['biweekly', 'Bi-Weekly'], ['semimonthly', 'Semi-Monthly'], ['monthly', 'Monthly']].map(([v, l]) => (
              <button key={v} onClick={() => setFrequency(v)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  frequency === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>{l}</button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>Filing Status</label>
          <div className="grid grid-cols-3 gap-2">
            {[['single', '👤 Single'], ['married', '💑 Married'], ['head', '🏠 Head']].map(([v, l]) => (
              <button key={v} onClick={() => setFilingStatus(v)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  filingStatus === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>{l}</button>
            ))}
          </div>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate {state.name} Take-Home Pay
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Take-Home Per Paycheck</p>
            <p className="text-4xl font-black text-blue-700">{fmt2(result.netPay)}</p>
            <p className="text-xs text-gray-500 mt-1">{fmt0(result.annualNet)} a year · {fmt0(result.annualGross)} gross</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Per Paycheck Breakdown</p>
            <div className="space-y-2 text-sm">
              {[
                ['Gross pay', result.grossPerPeriod, false],
                ['Federal income tax', -result.federalTax, true],
                ['Social Security', -result.socialSecurity, true],
                ['Medicare', -result.medicare, true],
                ...(result.stateTax > 0 ? [[`${state.name} state tax`, -result.stateTax, true]] : []),
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between border-b border-gray-50 py-1.5 ${sub ? 'text-gray-500 text-xs pl-3' : 'text-gray-700'}`}>
                  <span>{label}</span>
                  <span className={sub ? 'text-red-500' : 'font-semibold'}>{val < 0 ? `(${fmt2(-val)})` : fmt2(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-black text-emerald-700">
                <span>Net pay</span>
                <span>{fmt2(result.netPay)}</span>
              </div>
            </div>
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        {/* The advantage other calculators don't offer: instant relocation comparison. */}
        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-1">
            The Same Salary in Other States
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            On {fmt0(compareSalary)} a year, {state.name} leaves you about{' '}
            <strong>{fmt0(here.net)}</strong> — ranking <strong>#{rankAmongAll} of 51</strong> for
            take-home pay. {result ? 'Based on the salary you entered.' : 'Enter your salary above to update this.'}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">State</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Take-Home</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">vs {state.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-blue-50">
                  <td className="p-2 border border-gray-200 font-bold text-blue-800">{state.name} (you)</td>
                  <td className="p-2 border border-gray-200 text-right font-bold text-blue-800">{fmt0(here.net)}</td>
                  <td className="p-2 border border-gray-200 text-right text-gray-400">—</td>
                </tr>
                {bestElsewhere.map((s) => {
                  const d = s.net - here.net
                  return (
                    <tr key={s.code} className="bg-white">
                      <td className="p-2 border border-gray-200">
                        <Link to={`/paycheck-calculator/${s.slug}`} className="text-blue-600 hover:underline font-medium">{s.name}</Link>
                      </td>
                      <td className="p-2 border border-gray-200 text-right font-semibold">{fmt0(s.net)}</td>
                      <td className={`p-2 border border-gray-200 text-right font-semibold ${d > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {d > 0 ? `+${fmt0(d)}` : d < 0 ? `−${fmt0(-d)}` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {hasIncomeTax && noTaxStates.length > 0 && (
            <p className="text-xs text-gray-500 mt-3">
              💡 Moving to a no-income-tax state like{' '}
              {noTaxStates.map((s, i) => (
                <span key={s.code}>
                  {i > 0 && (i === noTaxStates.length - 1 ? ' or ' : ', ')}
                  <Link to={`/paycheck-calculator/${s.slug}`} className="text-blue-600 hover:underline">{s.name}</Link>
                </span>
              ))}{' '}
              would keep roughly <strong>{fmt0(noTaxStates[0].net - here.net)}</strong> more of this
              salary each year — before accounting for differences in cost of living.
            </p>
          )}
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">{state.name} Take-Home Pay by Salary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Salary</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Annual Take-Home</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Bi-Weekly</th>
                </tr>
              </thead>
              <tbody>
                {ladder.map((r, i) => (
                  <tr key={r.amount} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200">
                      <Link to={`/salary/${salarySlug(r.amount)}`} className="text-blue-600 hover:underline font-medium">
                        ${r.amount.toLocaleString('en-US')}
                      </Link>
                    </td>
                    <td className="p-2 border border-gray-200 text-right font-semibold text-gray-800">{fmt0(r.net)}</td>
                    <td className="p-2 border border-gray-200 text-right text-gray-500">{fmt0(r.net / 26)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Single filer estimate, standard deduction, no pre-tax benefits.</p>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What Comes Out of a {state.name} Paycheck</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Federal income tax</strong> — based on your W-4, filing status, and the 2026 brackets.</li>
            <li><strong>Social Security</strong> — 6.2% of wages up to the annual wage base.</li>
            <li><strong>Medicare</strong> — 1.45% of all wages, plus 0.9% above the high-earner threshold.</li>
            <li>
              <strong>{state.name} state income tax</strong> —{' '}
              {hasIncomeTax
                ? `withheld from each paycheck, estimated here at about ${(state.rate * 100).toFixed(2)}% of taxable wages.`
                : `none. ${state.name} does not levy a state income tax on wages.`}
            </li>
            <li><strong>Pre-tax deductions</strong> — health insurance and traditional 401(k) contributions reduce taxable pay.</li>
          </ul>
          {minWage != null && (
            <p className="leading-relaxed mt-3">
              For reference, the{' '}
              <Link to={`/minimum-wage/${state.slug}`} className="text-blue-600 hover:underline">
                {state.name} minimum wage
              </Link>{' '}
              is about {fmt2(minWage)} an hour ({fmt0(minWage * 2080)} a year full time).
            </p>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">More for {state.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { to: `/pay-stub/${state.slug}`, icon: '📄', label: `${state.name} Pay Stub Guide`, desc: 'Taxes, requirements & free generator' },
              { to: `/minimum-wage/${state.slug}`, icon: '🏛️', label: `${state.name} Minimum Wage`, desc: 'Hourly, weekly & yearly pay' },
              { to: '/paycheck-calculator', icon: '💵', label: 'All-State Paycheck Calculator', desc: 'Switch states freely' },
              { to: '/time-card-calculator', icon: '⏰', label: 'Time Card Calculator', desc: 'Track hours & overtime' },
            ].map((l) => (
              <Link key={l.to} to={l.to}
                className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                <span className="text-xl shrink-0">{l.icon}</span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-gray-800 group-hover:text-blue-600">{l.label}</span>
                  <span className="block text-xs text-gray-500 mt-0.5">{l.desc}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <RelatedTools current="/paycheck-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Estimates for planning only — not tax, legal, or payroll advice. State income tax is
          modelled as an approximate flat rate and does not reflect brackets, local or city taxes,
          state disability or paid-leave contributions, or your specific W-4 elections. Your actual
          paycheck will differ. Verify with your payroll department or a qualified tax professional.
        </div>
      </div>
    </div>
  )
}
