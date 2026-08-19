import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { calcFederalTax, calcFICA, calcStateTax, getPayPeriods } from '../utils/taxCalculator'
import { STATE_LIST } from '../utils/states'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

export default function Contribution401kCalc() {
  usePageMeta({
    title: '401(k) Paycheck Impact Calculator 2026 — How Much Will It Reduce My Pay?',
    description: 'Free 401(k) calculator. See how much a traditional 401(k) contribution actually reduces your take-home pay after the tax break, plus your employer match and total annual savings.',
    canonicalPath: '/401k-paycheck-calculator',
  })

  const [salary, setSalary] = useState('')
  const [contribPct, setContribPct] = useState('6')
  const [matchPct, setMatchPct] = useState('3')
  const [frequency, setFrequency] = useState('biweekly')
  const [filingStatus, setFilingStatus] = useState('single')
  const [stateCode, setStateCode] = useState('CA')
  const [result, setResult] = useState(null)

  const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
  const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const takeHome = (gross, preTax) => {
    const taxable = Math.max(0, gross - preTax)
    const federal = calcFederalTax(taxable, filingStatus)
    // FICA is NOT reduced by traditional 401(k) contributions.
    const { ss, medicare } = calcFICA(gross)
    const state = calcStateTax(taxable, stateCode)
    return { net: gross - preTax - federal - ss - medicare - state, federal, ss, medicare, state }
  }

  const calculate = () => {
    const s = parseFloat(salary) || 0
    if (s <= 0) return

    const contribution = s * ((parseFloat(contribPct) || 0) / 100)
    const match = s * ((parseFloat(matchPct) || 0) / 100)
    const periods = getPayPeriods(frequency)

    const without = takeHome(s, 0)
    const with401k = takeHome(s, contribution)

    const payCut = without.net - with401k.net
    const taxSaved = contribution - payCut

    setResult({
      salary: s,
      contribution,
      match,
      periods,
      without: without.net,
      with401k: with401k.net,
      payCut,
      taxSaved,
      totalSaved: contribution + match,
      perPeriodContribution: contribution / periods,
      perPeriodPayCut: payCut / periods,
      costPerDollar: contribution > 0 ? payCut / contribution : 0,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': '401(k) Paycheck Impact Calculator 2026',
        'url': 'https://myfreepaystub.com/401k-paycheck-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'See how much a traditional 401(k) contribution reduces take-home pay after the tax break, including employer match.',
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">401(k) Paycheck Impact Calculator</h1>
        <p className="text-sm text-gray-500">
          Contributing to a traditional 401(k) costs you less than you think, because it lowers your
          taxable income. See the real hit to your paycheck.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-4">
        <div>
          <label className={labelClass}>Annual Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="70,000" className={`${inputClass} pl-7`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Your Contribution (%)</label>
            <input type="number" step="0.5" value={contribPct} onChange={(e) => setContribPct(e.target.value)} placeholder="6" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Employer Match (%)</label>
            <input type="number" step="0.5" value={matchPct} onChange={(e) => setMatchPct(e.target.value)} placeholder="3" className={inputClass} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Pay Frequency</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[['weekly', 'Weekly'], ['biweekly', 'Bi-Weekly'], ['semimonthly', 'Semi-Monthly'], ['monthly', 'Monthly']].map(([v, l]) => (
              <button key={v} onClick={() => setFrequency(v)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  frequency === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {l}
              </button>
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
                }`}>
                {l}
              </button>
            ))}
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

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate Paycheck Impact
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Real Cost Per Paycheck</p>
            <p className="text-4xl font-extrabold text-blue-700">{fmt2(result.perPeriodPayCut)}</p>
            <p className="text-xs text-gray-500 mt-1">
              to save {fmt2(result.perPeriodContribution)} per paycheck
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 text-center">
            💡 Every <strong>$1.00</strong> you put into your 401(k) only reduces take-home pay by{' '}
            <strong>{fmt2(result.costPerDollar)}</strong> — the rest is tax you would have paid anyway.
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Annual contribution', result.contribution],
                ['Reduction in take-home pay', result.payCut],
                ['Tax savings', result.taxSaved],
                ['Employer match (free money)', result.match],
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-800">{fmt0(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-extrabold text-emerald-700">
                <span>Total into retirement</span>
                <span>{fmt0(result.totalSaved)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Take-home pay: {fmt0(result.without)} without 401(k) → {fmt0(result.with401k)} with it.
            </p>
          </div>

          {result.match > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
              🎁 Your employer adds <strong>{fmt0(result.match)}</strong> a year. Contributing less than
              the full match generally means receiving less of the match you are eligible for.
            </div>
          )}
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="401k-paycheck-calculator" title="401(k) Paycheck Impact Calculator" height="880" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Why a 401(k) Costs Less Than You Contribute</h2>
          <p className="leading-relaxed">
            Traditional 401(k) contributions come out of your pay <strong>before federal and state
            income tax</strong>. Putting in $200 a paycheck does not reduce your take-home by $200 —
            it reduces it by $200 minus the tax you no longer owe on that money. In a 22% federal
            bracket with state tax, the real cost is often closer to $150.
          </p>
          <p className="leading-relaxed mt-3">
            One important detail: 401(k) contributions do <strong>not</strong> reduce Social Security
            and Medicare (FICA) taxes. Those are still calculated on your full gross pay, which this
            calculator accounts for.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Traditional vs Roth 401(k)</h2>
          <p className="leading-relaxed">
            This calculator models a <strong>traditional</strong> 401(k), where you get the tax break
            now and pay income tax on withdrawals in retirement. A <strong>Roth</strong> 401(k) is the
            reverse: contributions come out of after-tax pay, so your paycheck drops by the full
            amount, but qualified withdrawals in retirement are tax free.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How much will a 401(k) reduce my paycheck?', a: 'Less than the amount you contribute. Because contributions are pre-tax for income tax purposes, a $500 monthly contribution might reduce take-home pay by only $370–$400 depending on your bracket and state.' },
              { q: 'Does a 401(k) reduce Social Security and Medicare taxes?', a: 'No. FICA taxes apply to your full gross wages regardless of traditional 401(k) contributions. Only federal and state income tax are reduced.' },
              { q: 'How much should I contribute to my 401(k)?', a: 'A common starting point is contributing at least enough to receive your full employer match, since that match is additional compensation you are otherwise not paid. Many financial planners suggest working toward 10–15% of income including the match, but the right amount depends on your circumstances.' },
              { q: 'Is there a limit on 401(k) contributions?', a: 'Yes. The IRS sets an annual employee deferral limit, with an additional catch-up amount for those aged 50 and over. Limits are adjusted each year, so check the current figures on IRS.gov or with your plan administrator.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/401k-paycheck-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Estimates for planning only — not tax, investment, or financial advice. This tool does not
          check IRS annual contribution limits, which change each year and depend on your age and plan.
          Confirm limits and your plan's match formula with your plan administrator, and consult a
          qualified professional before making retirement decisions.
        </div>
      </div>
    </div>
  )
}
