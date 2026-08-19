import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { calcFederalTax, calcFICA, calcStateTax } from '../utils/taxCalculator'
import { STATE_LIST } from '../utils/states'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

const PERIODS = { annual: 1, monthly: 12, semimonthly: 24, biweekly: 26, weekly: 52 }

function annualNetFor(annualGross, filingStatus, stateCode) {
  const federal = calcFederalTax(annualGross, filingStatus)
  const { ss, medicare } = calcFICA(annualGross)
  const state = calcStateTax(annualGross, stateCode)
  return { net: annualGross - federal - ss - medicare - state, federal, ss, medicare, state }
}

// Invert the tax calculation by bisection: find the gross salary whose
// after-tax result matches the take-home the user wants. Taxes rise
// monotonically with gross, so bisection converges reliably.
function grossForNet(targetAnnualNet, filingStatus, stateCode) {
  let lo = targetAnnualNet
  let hi = targetAnnualNet * 3 + 20000
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2
    if (annualNetFor(mid, filingStatus, stateCode).net < targetAnnualNet) lo = mid
    else hi = mid
  }
  return hi
}

export default function NetToGrossCalc() {
  usePageMeta({
    title: 'Net to Gross Salary Calculator 2026 — Reverse Paycheck / Gross-Up | MyFreePayStub',
    description: 'Work backwards from take-home pay to gross salary. Enter the net pay you want and your state, and see the gross salary and paycheck you need in 2026. Free reverse paycheck calculator.',
    canonicalPath: '/net-to-gross-calculator',
  })

  const [net, setNet] = useState('')
  const [period, setPeriod] = useState('monthly')
  const [filingStatus, setFilingStatus] = useState('single')
  const [stateCode, setStateCode] = useState('CA')
  const [result, setResult] = useState(null)

  const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')

  const calculate = () => {
    const wanted = parseFloat(net) || 0
    if (wanted <= 0) return
    const periodsPerYear = PERIODS[period]
    const targetAnnualNet = wanted * periodsPerYear
    const gross = grossForNet(targetAnnualNet, filingStatus, stateCode)
    const detail = annualNetFor(gross, filingStatus, stateCode)
    setResult({
      annualGross: gross,
      annualNet: detail.net,
      federal: detail.federal,
      ss: detail.ss,
      medicare: detail.medicare,
      state: detail.state,
      totalTax: detail.federal + detail.ss + detail.medicare + detail.state,
      periodsPerYear,
      periodLabel: period,
      wanted,
      effectiveRate: (detail.federal + detail.ss + detail.medicare + detail.state) / gross,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Net to Gross Salary Calculator 2026',
        'url': 'https://myfreepaystub.com/net-to-gross-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Reverse paycheck calculator: find the gross salary needed to reach a target take-home pay.',
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Net to Gross Salary Calculator</h1>
        <p className="text-sm text-gray-500">
          Know what you want to take home? Work backwards to the gross salary you need to ask for,
          after 2026 federal, state, and FICA taxes.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-4">
        <div>
          <label className={labelClass}>Take-Home Pay You Want</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" step="0.01" value={net} onChange={(e) => setNet(e.target.value)} placeholder="5,000" className={`${inputClass} pl-7`} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Per</label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {[['weekly', 'Week'], ['biweekly', '2 Weeks'], ['semimonthly', 'Semi-Mo'], ['monthly', 'Month'], ['annual', 'Year']].map(([v, l]) => (
              <button key={v} onClick={() => setPeriod(v)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  period === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
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
          <label className={labelClass}>Work State</label>
          <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputClass}>
            {[...STATE_LIST].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate Gross Salary Needed
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Gross Salary You Need</p>
            <p className="text-4xl font-extrabold text-blue-700">{fmt0(result.annualGross)}</p>
            <p className="text-xs text-gray-500 mt-1">
              per year · {fmt0(result.annualGross / result.periodsPerYear)} per {result.periodLabel === 'annual' ? 'year' : result.periodLabel.replace('semimonthly', 'semi-month').replace('biweekly', '2 weeks').replace('monthly', 'month').replace('weekly', 'week')} gross
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Where It Goes (Annual)</p>
            <div className="space-y-2 text-sm">
              {[
                ['Gross salary', result.annualGross, false],
                ['Federal income tax', -result.federal, true],
                ['Social Security', -result.ss, true],
                ['Medicare', -result.medicare, true],
                ...(result.state > 0 ? [['State income tax', -result.state, true]] : []),
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between border-b border-gray-50 py-1.5 ${sub ? 'text-gray-500 text-xs pl-3' : 'text-gray-700'}`}>
                  <span>{label}</span>
                  <span className={sub ? 'text-red-500' : 'font-semibold'}>{val < 0 ? `(${fmt0(-val)})` : fmt0(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-extrabold text-emerald-700">
                <span>Take-home pay</span>
                <span>{fmt0(result.annualNet)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Effective tax rate: {(result.effectiveRate * 100).toFixed(1)}% · You keep about{' '}
              {((1 - result.effectiveRate) * 100).toFixed(0)}¢ of every dollar.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Estimate based on standard deductions and a flat state rate. Pre-tax benefits (health
            insurance, 401k) reduce the gross you'd need. Check the exact paycheck with our{' '}
            <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="net-to-gross-calculator" title="Net to Gross Salary Calculator" height="760" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What Is a Net to Gross Calculation?</h2>
          <p className="leading-relaxed">
            Most calculators go one way: you enter a salary and see what's left after taxes. A
            <strong> net to gross</strong> (or "gross-up") calculation runs in reverse — you start
            with the take-home pay you actually need, and it finds the gross salary that produces it.
          </p>
          <p className="leading-relaxed mt-3">
            This is the number that matters when you're negotiating a salary, setting a freelance
            rate, or checking whether a job offer covers your rent and bills. Asking for "$60,000"
            is not the same as taking home $60,000 — in a high-tax state the difference can be
            $15,000 or more a year.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">When to Use It</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Salary negotiation</strong> — turn your target monthly budget into the number you ask for.</li>
            <li><strong>Job offers in different states</strong> — the same take-home needs a very different gross in California vs Texas.</li>
            <li><strong>Freelance and contract rates</strong> — work out the gross invoice amount that leaves you the income you need.</li>
            <li><strong>Relocation</strong> — see how much of a raise a move actually requires.</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How do you calculate gross pay from net pay?', a: 'You cannot simply add the tax rate back, because tax brackets are progressive — the extra gross is taxed at your top rate. This calculator solves it by testing gross amounts until the after-tax result matches your target take-home.' },
              { q: 'Why is the gross so much higher than the net I asked for?', a: 'Federal income tax, Social Security (6.2%), Medicare (1.45%), and state income tax all come out of gross pay. Combined, they commonly take 20–35% of a salary, so the gross needs to be meaningfully higher than your target take-home.' },
              { q: 'Does this include pre-tax deductions like 401(k) or health insurance?', a: 'No. Those lower your taxable income, so if you have them you would need slightly less gross than shown. Use the paycheck calculator to model them exactly.' },
              { q: 'Is this the same as a bonus gross-up?', a: 'It is the same idea. Employers "gross up" a bonus or relocation payment so the employee receives a specific amount after tax. Note that bonuses are often withheld at the flat 22% supplemental rate — see our bonus tax calculator.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/net-to-gross-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This calculator provides estimates for planning only and is not tax, legal, or financial
          advice. It uses standard deductions and an approximate flat state rate; your actual
          withholding depends on your W-4, local taxes, and benefits. Consult a qualified tax
          professional for advice specific to your situation.
        </div>
      </div>
    </div>
  )
}
