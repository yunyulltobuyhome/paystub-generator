import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

// Rates are user-editable because the IRS updates the standard mileage rate
// every year (and sometimes mid-year). Defaults are starting points only —
// the UI tells users to confirm the current rate on IRS.gov.
const PURPOSES = [
  { v: 'business', l: 'Business', rate: '0.70' },
  { v: 'medical', l: 'Medical / Moving', rate: '0.21' },
  { v: 'charity', l: 'Charitable', rate: '0.14' },
]

export default function MileageCalc() {
  usePageMeta({
    title: 'Mileage Reimbursement Calculator 2026 — IRS Standard Rate Deduction',
    description: 'Free mileage reimbursement calculator for business, medical, and charitable driving. Enter your miles and rate to work out your deduction or reimbursement — built for gig workers and freelancers.',
    canonicalPath: '/mileage-reimbursement-calculator',
  })

  const [purpose, setPurpose] = useState('business')
  const [rate, setRate] = useState('0.70')
  const [miles, setMiles] = useState('')
  const [weeklyMiles, setWeeklyMiles] = useState('')
  const [taxRate, setTaxRate] = useState('22')
  const [result, setResult] = useState(null)

  const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')

  const pickPurpose = (v) => {
    setPurpose(v)
    const p = PURPOSES.find((x) => x.v === v)
    if (p) setRate(p.rate)
  }

  const calculate = () => {
    const m = parseFloat(miles) || 0
    const r = parseFloat(rate) || 0
    if (m <= 0 || r <= 0) return

    const total = m * r
    const wk = parseFloat(weeklyMiles) || 0
    const tr = parseFloat(taxRate) || 0

    setResult({
      miles: m,
      rate: r,
      total,
      taxSaved: purpose === 'business' ? total * (tr / 100) : 0,
      isBusiness: purpose === 'business',
      weeklyProjection: wk > 0 ? { weekly: wk * r, monthly: wk * 4.33 * r, annual: wk * 52 * r, annualMiles: wk * 52 } : null,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Mileage Reimbursement Calculator',
        'url': 'https://myfreepaystub.com/mileage-reimbursement-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Calculate mileage reimbursement or deduction for business, medical, and charitable driving.',
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">Mileage Reimbursement Calculator</h1>
        <p className="text-sm text-gray-500">
          Work out what your driving is worth — for expense reimbursement or a business mileage
          deduction. Built with rideshare, delivery, and freelance drivers in mind.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className={labelClass}>Purpose of Driving</label>
          <div className="grid grid-cols-3 gap-2">
            {PURPOSES.map((p) => (
              <button key={p.v} onClick={() => pickPurpose(p.v)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  purpose === p.v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {p.l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Miles Driven</label>
            <input type="number" step="0.1" value={miles} onChange={(e) => setMiles(e.target.value)} placeholder="1,200" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Rate Per Mile</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" step="0.001" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="0.70" className={`${inputClass} pl-7`} />
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          ℹ️ The IRS updates its standard mileage rates every year. The defaults above are a starting
          point — confirm the current rate for your tax year on{' '}
          <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" target="_blank" rel="noopener noreferrer" className="underline font-semibold">IRS.gov</a>{' '}
          and edit the field if it differs. If your employer reimburses at a different rate, enter theirs.
        </div>

        {purpose === 'business' && (
          <div>
            <label className={labelClass}>Your Marginal Tax Rate (%)</label>
            <input type="number" step="1" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} placeholder="22" className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">Used to estimate what the deduction is worth in tax saved.</p>
          </div>
        )}

        <div>
          <label className={labelClass}>Typical Miles Per Week <span className="text-gray-400 font-normal">(optional)</span></label>
          <input type="number" step="1" value={weeklyMiles} onChange={(e) => setWeeklyMiles(e.target.value)} placeholder="250" className={inputClass} />
          <p className="text-xs text-gray-400 mt-1">Projects your monthly and annual mileage value.</p>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate Mileage Value
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">
              {result.isBusiness ? 'Deduction / Reimbursement' : 'Total Value'}
            </p>
            <p className="text-4xl font-black text-blue-700">{fmt2(result.total)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {result.miles.toLocaleString('en-US')} miles × {fmt2(result.rate)}/mile
            </p>
          </div>

          {result.isBusiness && result.taxSaved > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 text-center">
              💰 As a business deduction this could reduce your tax bill by roughly{' '}
              <strong>{fmt2(result.taxSaved)}</strong> at a {taxRate}% marginal rate.
            </div>
          )}

          {result.weeklyProjection && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">If You Drive That Every Week</p>
              <div className="space-y-2 text-sm">
                {[
                  ['Per week', result.weeklyProjection.weekly],
                  ['Per month', result.weeklyProjection.monthly],
                  ['Per year', result.weeklyProjection.annual],
                ].map(([label, val], i) => (
                  <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-800">{fmt0(val)}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                ≈ {Math.round(result.weeklyProjection.annualMiles).toLocaleString('en-US')} miles a year.
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Gig worker? Mileage is usually your largest deduction. Estimate your full tax bill with the{' '}
            <a href="/self-employment-tax-calculator" className="underline font-semibold">Self-Employment Tax Calculator</a>,
            and organize your earnings records with the{' '}
            <a href="/income-verification-packet" className="underline font-semibold">Income Verification Packet Builder</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="mileage-reimbursement-calculator" title="Mileage Reimbursement Calculator" height="860" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How Mileage Reimbursement Works</h2>
          <p className="leading-relaxed">
            The IRS publishes a <strong>standard mileage rate</strong> each year that represents the
            average cost of operating a vehicle — fuel, maintenance, insurance, and depreciation
            combined. Multiply your qualifying miles by that rate to get your deduction or
            reimbursement.
          </p>
          <p className="leading-relaxed mt-3">
            Employers are not required by federal law to reimburse mileage, though some states do
            require reimbursement of necessary business expenses. Many employers use the IRS rate
            because reimbursement at or below it is generally not taxable to the employee.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What Counts as Business Mileage?</h2>
          <ul className="space-y-2 leading-relaxed">
            <li>✅ Driving between job sites, clients, or offices</li>
            <li>✅ Trips to pick up supplies, equipment, or make deliveries</li>
            <li>✅ Rideshare and delivery driving while the app is on and you are working</li>
            <li>❌ Your normal commute between home and a regular workplace</li>
            <li>❌ Personal errands, even in a vehicle used for work</li>
          </ul>
          <p className="leading-relaxed mt-3">
            Keep a contemporaneous log with the date, purpose, and miles for each trip. Most rideshare
            and delivery apps provide an annual mileage summary you can use as a starting point,
            though it often understates the miles you can claim.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How do I calculate mileage reimbursement?', a: 'Multiply your qualifying business miles by the applicable rate per mile. For example, 1,200 miles at $0.70 per mile is $840. Always confirm the current-year IRS rate before filing.' },
              { q: 'Standard mileage rate or actual expenses — which is better?', a: 'The standard rate is far simpler and often larger for high-mileage drivers. Actual expenses (gas, repairs, insurance, depreciation) can be better for expensive vehicles with lower mileage. There are restrictions on switching methods, so ask a tax professional.' },
              { q: 'Can I deduct mileage as a W-2 employee?', a: 'Generally no. Unreimbursed employee business expenses are not deductible on federal returns for most employees under current law, though some states still allow it. Self-employed people and contractors can deduct business mileage.' },
              { q: 'Is mileage reimbursement taxable income?', a: 'Reimbursement at or below the IRS standard rate under an accountable plan is generally not taxable. Amounts above the standard rate, or paid without proper substantiation, may be treated as taxable wages.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/mileage-reimbursement-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Estimates only — not tax or legal advice. IRS standard mileage rates change annually and
          the rates pre-filled here may not match your tax year. Eligibility rules, recordkeeping
          requirements, and state reimbursement laws vary. Verify current rates at{' '}
          <a href="https://www.irs.gov/tax-professionals/standard-mileage-rates" target="_blank" rel="noopener noreferrer" className="underline">IRS.gov</a>{' '}
          and consult a qualified tax professional.
        </div>
      </div>
    </div>
  )
}
