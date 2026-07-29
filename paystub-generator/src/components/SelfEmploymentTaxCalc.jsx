import { useState } from 'react'
import { STATE_TAXES, FICA } from '../data/stateTaxRates'
import { calcFederalTax, calcStateTax } from '../utils/taxCalculator'
import { usePageMeta } from '../hooks/usePageMeta'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

// Self-employment tax constants (2026)
const SE_BASE_FACTOR = 0.9235          // net earnings subject to SE tax
const SE_SS_RATE = 0.124               // 12.4% Social Security (both halves)
const SE_MEDICARE_RATE = 0.029         // 2.9% Medicare (both halves)

export default function SelfEmploymentTaxCalc() {
  usePageMeta({
    title: 'Self-Employment Tax Calculator 2026 — 1099 & Quarterly Estimated Taxes | MyFreePayStub',
    description: 'Free 2026 self-employment tax calculator for 1099 contractors, freelancers, and gig workers. Estimate SE tax, federal & state income tax, and your quarterly estimated tax payments. No sign-up.',
    canonicalPath: '/self-employment-tax-calculator',
  })

  const [netIncome, setNetIncome] = useState('')
  const [expenses, setExpenses] = useState('')
  const [w2Income, setW2Income] = useState('')
  const [filingStatus, setFilingStatus] = useState('single')
  const [stateCode, setStateCode] = useState('CA')
  const [result, setResult] = useState(null)

  const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmt0 = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US')
  const pct = (n) => (n * 100).toFixed(1) + '%'

  const calculate = () => {
    const gross1099 = parseFloat(netIncome) || 0
    const biz = parseFloat(expenses) || 0
    const w2 = parseFloat(w2Income) || 0
    const netProfit = Math.max(0, gross1099 - biz)
    if (netProfit <= 0) return

    // --- Self-employment (SECA) tax ---
    const seBase = netProfit * SE_BASE_FACTOR
    // Social Security portion is capped at the annual wage base, reduced by any W-2 wages already taxed
    const ssRemaining = Math.max(0, FICA.socialSecurityWageBase - w2)
    const ssTaxable = Math.min(seBase, ssRemaining)
    const seSocialSecurity = ssTaxable * SE_SS_RATE
    const seMedicare = seBase * SE_MEDICARE_RATE
    const seTax = seSocialSecurity + seMedicare

    // Half of SE tax is deductible (above-the-line) for income tax purposes
    const halfSEDeduction = seTax / 2

    // --- Federal income tax attributable to the SE income (stacked on top of W-2) ---
    const fedTotal = calcFederalTax(Math.max(0, w2 + netProfit - halfSEDeduction), filingStatus)
    const fedW2Only = calcFederalTax(w2, filingStatus)
    const federalIncomeTax = Math.max(0, fedTotal - fedW2Only)

    // --- State income tax (flat-rate approximation, consistent with the rest of the site) ---
    const stateTax = calcStateTax(netProfit, stateCode)

    const totalTax = seTax + federalIncomeTax + stateTax
    const afterTax = netProfit - totalTax
    const effectiveRate = netProfit > 0 ? totalTax / netProfit : 0
    const quarterly = totalTax / 4

    setResult({
      netProfit,
      seBase,
      seSocialSecurity,
      seMedicare,
      seTax,
      halfSEDeduction,
      federalIncomeTax,
      stateTax,
      totalTax,
      afterTax,
      effectiveRate,
      quarterly,
      stateName: STATE_TAXES[stateCode]?.name || stateCode,
    })
  }

  const inputClass = "w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"

  const QUARTERS = [
    ['Q1', 'Jan 1 – Mar 31, 2026', 'April 15, 2026'],
    ['Q2', 'Apr 1 – May 31, 2026', 'June 15, 2026'],
    ['Q3', 'Jun 1 – Aug 31, 2026', 'September 15, 2026'],
    ['Q4', 'Sep 1 – Dec 31, 2026', 'January 15, 2027'],
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Self-Employment Tax Calculator 2026",
        "url": "https://myfreepaystub.com/self-employment-tax-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free self-employment tax calculator for 1099 contractors, freelancers and gig workers. Estimates SE tax, federal and state income tax, and quarterly estimated tax payments for 2026."
      })}} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How much is self-employment tax in 2026?",
            "acceptedAnswer": { "@type": "Answer", "text": "Self-employment tax is 15.3% of your net self-employment earnings — 12.4% for Social Security (up to the annual wage base) plus 2.9% for Medicare. It is calculated on 92.35% of your net profit." }
          },
          {
            "@type": "Question",
            "name": "Do 1099 contractors have to pay quarterly taxes?",
            "acceptedAnswer": { "@type": "Answer", "text": "Generally, if you expect to owe $1,000 or more in tax for the year, the IRS requires you to make quarterly estimated tax payments. The 2026 due dates are April 15, June 15, September 15, and January 15, 2027." }
          },
          {
            "@type": "Question",
            "name": "Can I deduct part of my self-employment tax?",
            "acceptedAnswer": { "@type": "Answer", "text": "Yes. You can deduct one-half of your self-employment tax as an above-the-line deduction when calculating your federal income tax." }
          }
        ]
      })}} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">
          Self-Employment Tax Calculator 2026
        </h1>
        <p className="text-sm text-gray-500">
          For 1099 contractors, freelancers & gig workers. Estimate your SE tax, income tax, and
          quarterly estimated payments — so you know exactly how much to set aside.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className={labelClass}>1099 / Self-Employment Income (annual)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={netIncome} onChange={e => setNetIncome(e.target.value)}
              placeholder="60,000" className={`${inputClass} pl-7`} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Total income from 1099-NEC, 1099-K, gig apps, freelance, etc.</p>
        </div>

        <div>
          <label className={labelClass}>Business Expenses <span className="text-gray-400 font-normal">(optional)</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={expenses} onChange={e => setExpenses(e.target.value)}
              placeholder="8,000" className={`${inputClass} pl-7`} />
          </div>
          <p className="text-xs text-gray-400 mt-1">Mileage, supplies, home office, software, etc. Lowers your taxable profit.</p>
        </div>

        <div>
          <label className={labelClass}>W-2 Wages This Year <span className="text-gray-400 font-normal">(optional)</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={w2Income} onChange={e => setW2Income(e.target.value)}
              placeholder="0" className={`${inputClass} pl-7`} />
          </div>
          <p className="text-xs text-gray-400 mt-1">If you also have a regular W-2 job, enter those wages for a more accurate estimate.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Filing Status</label>
            <select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} className={inputClass}>
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="head">Head of Household</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select value={stateCode} onChange={e => setStateCode(e.target.value)} className={inputClass}>
              {Object.entries(STATE_TAXES).map(([code, s]) => (
                <option key={code} value={code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate My Taxes
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          {/* Quarterly highlight — the differentiator */}
          <div className="bg-blue-600 rounded-2xl p-5 text-center text-white">
            <p className="text-sm font-semibold text-blue-100 mb-1">Set aside each quarter</p>
            <p className="text-4xl font-black">{fmt0(result.quarterly)}</p>
            <p className="text-xs text-blue-100 mt-1">
              ≈ {fmt0(result.totalTax)} total estimated tax · {pct(result.effectiveRate)} effective rate
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="font-semibold text-gray-700 mb-3 text-sm">Estimated Tax Breakdown</p>
            <div className="space-y-2 text-sm">
              {[
                ['Net self-employment profit', result.netProfit, false],
                ['Self-employment tax (15.3%)', result.seTax, false],
                ['— Social Security portion', result.seSocialSecurity, true],
                ['— Medicare portion', result.seMedicare, true],
                ['Federal income tax (on 1099)', result.federalIncomeTax, false],
                [`State income tax (${result.stateName})`, result.stateTax, false],
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between py-1.5 border-b border-gray-50 ${sub ? 'pl-3 text-gray-400 text-xs' : 'text-gray-600'}`}>
                  <span>{label}</span>
                  <span className={sub ? '' : 'font-semibold'}>{fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between py-2 border-t border-gray-200 mt-1 font-bold text-gray-800">
                <span>Total estimated tax</span>
                <span>{fmt(result.totalTax)}</span>
              </div>
              <div className="flex justify-between py-1.5 text-emerald-700 font-bold">
                <span>Take-home after tax</span>
                <span>{fmt(result.afterTax)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              You may deduct half of your SE tax ({fmt(result.halfSEDeduction)}) when filing — this is
              already reflected in the federal income tax above.
            </p>
          </div>

          {/* Quarterly schedule */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="font-semibold text-gray-700 mb-3 text-sm">2026 Quarterly Estimated Tax Schedule</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border border-gray-200 font-semibold">Quarter</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Period</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Due Date</th>
                    <th className="text-right p-2 border border-gray-200 font-semibold">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {QUARTERS.map(([q, period, due], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200 font-medium">{q}</td>
                      <td className="p-2 border border-gray-200 text-gray-500">{period}</td>
                      <td className="p-2 border border-gray-200 text-gray-500">{due}</td>
                      <td className="p-2 border border-gray-200 text-right text-blue-600 font-semibold">{fmt0(result.quarterly)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Pay online via the IRS at <span className="font-medium">IRS.gov/payments</span> (Form 1040-ES).
              Most states have a separate estimated-tax process.
            </p>
          </div>

          {/* Tax disclaimer — prominent */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            <p className="font-bold mb-1">⚠️ Estimate only — not tax advice</p>
            This is a simplified estimate for planning purposes. It does not account for tax credits
            (e.g. QBI, child tax credit, EITC), itemized deductions, retirement contributions, local
            taxes, the additional 0.9% Medicare surtax, or your full personal situation. Actual amounts
            owed will differ. This is <strong>not tax, legal, or financial advice</strong>. Always
            verify with the <strong>IRS</strong> and a <strong>qualified CPA or tax professional</strong>
            before making payments or filing.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="self-employment-tax-calculator" title="Self-Employment Tax Calculator" height="820" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What Is Self-Employment Tax?</h2>
          <p className="leading-relaxed">
            When you work for an employer, you and the employer split Social Security and Medicare
            (FICA) taxes — you each pay 7.65%. When you're self-employed (a 1099 contractor,
            freelancer, or gig worker), you pay <strong>both halves</strong>: a combined
            <strong> 15.3% self-employment tax</strong> (12.4% Social Security + 2.9% Medicare).
            This is on top of regular federal and state income tax, which is why setting money aside
            each quarter is so important.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Who Needs to Pay Quarterly Estimated Taxes?</h2>
          <p className="leading-relaxed mb-3">
            The IRS generally requires quarterly estimated payments if you expect to owe
            <strong> $1,000 or more</strong> in tax for the year and don't have enough withheld from a
            W-2 job. This applies to most full-time freelancers and gig workers.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🚗', title: 'Rideshare & Delivery', desc: 'Uber, Lyft, DoorDash, Instacart' },
              { icon: '💻', title: 'Freelancers', desc: 'Upwork, Fiverr, contract work' },
              { icon: '🛠️', title: 'Independent Contractors', desc: 'Trades, consultants, 1099 roles' },
              { icon: '🏪', title: 'Small Sellers', desc: 'Etsy, eBay, online stores' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg mb-1">{icon}</p>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How is self-employment tax calculated?', a: 'Your net profit (income minus business expenses) is multiplied by 92.35%, then by 15.3%. The Social Security portion (12.4%) only applies up to the annual wage base; the Medicare portion (2.9%) applies to all earnings.' },
              { q: 'What are the 2026 quarterly due dates?', a: 'April 15, 2026 (Q1), June 15, 2026 (Q2), September 15, 2026 (Q3), and January 15, 2027 (Q4). If a date falls on a weekend or holiday, it moves to the next business day.' },
              { q: 'Can business expenses lower my tax?', a: 'Yes — legitimate business expenses reduce your net profit, which lowers both your self-employment tax and income tax. Keep accurate records and receipts.' },
              { q: 'Is this calculator a substitute for filing taxes?', a: 'No. This is a planning estimate only. It does not file taxes, does not account for every credit or deduction, and is not a substitute for professional tax advice or the IRS Form 1040-ES worksheet.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/self-employment-tax-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ℹ️ Need take-home pay for a W-2 job instead? Use our{' '}
          <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>.
        </div>
      </div>
    </div>
  )
}
