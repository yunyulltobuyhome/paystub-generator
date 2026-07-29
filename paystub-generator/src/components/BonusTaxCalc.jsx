import { useState } from 'react'
import { STATE_TAXES, FICA } from '../data/stateTaxRates'
import { usePageMeta } from '../hooks/usePageMeta'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

// IRS supplemental wage flat rates (2026)
const FED_SUPPLEMENTAL = 0.22       // up to $1,000,000
const FED_SUPPLEMENTAL_HIGH = 0.37  // portion over $1,000,000
const MILLION = 1_000_000

export default function BonusTaxCalc() {
  usePageMeta({
    title: 'Bonus Tax Calculator 2026 — How Much Tax on a Bonus? | MyFreePayStub',
    description: 'Free bonus tax calculator for 2026. See how much federal tax, Social Security, Medicare, and state tax come out of your bonus using the IRS 22% supplemental method — and your take-home.',
    canonicalPath: '/bonus-tax-calculator',
  })

  const [bonus, setBonus] = useState('')
  const [stateCode, setStateCode] = useState('CA')
  const [result, setResult] = useState(null)

  const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const pct = (n) => (n * 100).toFixed(1) + '%'

  const calculate = () => {
    const amt = parseFloat(bonus) || 0
    if (amt <= 0) return
    const federal = amt <= MILLION
      ? amt * FED_SUPPLEMENTAL
      : MILLION * FED_SUPPLEMENTAL + (amt - MILLION) * FED_SUPPLEMENTAL_HIGH
    const ss = amt * FICA.socialSecurityRate
    const medicare = amt * FICA.medicareRate
    const stateRate = STATE_TAXES[stateCode]?.rate || 0
    const state = amt * stateRate
    const totalTax = federal + ss + medicare + state
    const takeHome = amt - totalTax
    setResult({
      amt, federal, ss, medicare, state, totalTax, takeHome,
      effectiveRate: totalTax / amt,
      stateName: STATE_TAXES[stateCode]?.name || stateCode,
      hasState: stateRate > 0,
    })
  }

  const inputClass = "w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Bonus Tax Calculator 2026",
        "url": "https://myfreepaystub.com/bonus-tax-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Estimate the federal, state, and FICA tax on a bonus using the IRS 22% supplemental wage method, and see your take-home amount."
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "How much tax is taken out of a bonus in 2026?", "acceptedAnswer": { "@type": "Answer", "text": "Under the IRS percentage (supplemental) method, employers withhold a flat 22% federal tax on bonuses up to $1 million, plus 6.2% Social Security and 1.45% Medicare, and any state tax. Amounts over $1 million are withheld at 37%." } },
          { "@type": "Question", "name": "Why was my bonus taxed so high?", "acceptedAnswer": { "@type": "Answer", "text": "Bonuses are 'supplemental wages.' Many employers withhold a flat 22% for federal tax, which can be more or less than your normal rate. Any over-withholding is refunded when you file your tax return." } }
        ]
      })}} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">Bonus Tax Calculator 2026</h1>
        <p className="text-sm text-gray-500">
          See how much tax comes out of your bonus and what you actually take home, using the IRS
          22% supplemental wage method.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className={labelClass}>Bonus Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={bonus} onChange={e => setBonus(e.target.value)} placeholder="5,000" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Work State</label>
          <select value={stateCode} onChange={e => setStateCode(e.target.value)} className={inputClass}>
            {Object.entries(STATE_TAXES).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, st]) => (
              <option key={code} value={code}>{st.name}{st.rate === 0 ? ' (No Tax)' : ''}</option>
            ))}
          </select>
        </div>
        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate Bonus Tax
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Bonus Take-Home</p>
            <p className="text-4xl font-black text-blue-700">{fmt(result.takeHome)}</p>
            <p className="text-xs text-gray-400 mt-1">
              from {fmt(result.amt)} · {pct(result.effectiveRate)} withheld
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Federal tax (22% supplemental)', result.federal],
                ['Social Security (6.2%)', result.ss],
                ['Medicare (1.45%)', result.medicare],
                ...(result.hasState ? [[`${result.stateName} state tax`, result.state]] : []),
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="text-red-500">({fmt(val)})</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-bold text-gray-800">
                <span>Total withheld</span>
                <span className="text-red-500">({fmt(result.totalTax)})</span>
              </div>
              <div className="flex justify-between py-1.5 text-emerald-700 font-black">
                <span>Take-home</span>
                <span>{fmt(result.takeHome)}</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
            ℹ️ This uses the IRS flat 22% supplemental withholding method (37% over $1M) plus FICA and an
            estimated state rate. It shows <strong>withholding</strong>, not your final tax — over- or
            under-withholding is settled when you file. Social Security applies only up to the annual
            wage base. Not tax advice; consult a CPA for your situation.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="bonus-tax-calculator" title="Bonus Tax Calculator" height="640" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How Are Bonuses Taxed?</h2>
          <p className="leading-relaxed mb-3">
            The IRS treats bonuses as <strong>supplemental wages</strong>. Employers can withhold federal
            tax on them in one of two ways:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Percentage method:</strong> a flat 22% federal withholding on bonuses up to $1 million (37% on any amount above $1 million). This is the most common method.</li>
            <li><strong>Aggregate method:</strong> the bonus is added to your regular paycheck and withheld at your normal rate, which can be higher or lower than 22%.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            Either way, Social Security (6.2%), Medicare (1.45%), and any state income tax also apply.
            Withholding isn't your final tax bill — if too much is withheld, you get it back at tax time.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Why was my bonus taxed at 40%?', a: 'It likely felt that high because of the flat 22% federal supplemental rate plus 7.65% FICA and state tax. That is withholding, not your final tax rate — excess is refunded when you file.' },
              { q: 'Can I avoid tax on my bonus?', a: 'You cannot avoid it, but you can reduce taxable income by directing the bonus into a 401(k) or HSA if your employer allows it. Always check with a tax professional.' },
              { q: 'Is the bonus tax rate really 22%?', a: 'For federal withholding under the percentage method, yes — 22% on bonuses up to $1 million in 2026. Your actual tax owed depends on your total annual income.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/bonus-tax-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ℹ️ Want your full paycheck after taxes? Use our{' '}
          <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>{' '}
          or create a <a href="/" className="underline font-semibold">pay stub</a>.
        </div>
      </div>
    </div>
  )
}
