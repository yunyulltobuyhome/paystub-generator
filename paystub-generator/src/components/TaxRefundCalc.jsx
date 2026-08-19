import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { calcFederalTax } from '../utils/taxCalculator'
import { STANDARD_DEDUCTIONS } from '../data/stateTaxRates'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import RelatedTools from './RelatedTools'
import { AD_SLOTS } from '../config/ads'

// Simplified Child Tax Credit model. Amounts and phase-out thresholds are set
// by Congress and change between tax years, so they are surfaced in the UI as
// stated assumptions rather than presented as settled fact.
const CTC_PER_CHILD = 2000
const CTC_PHASEOUT_START = { single: 200000, head: 200000, married: 400000 }
const CTC_PHASEOUT_RATE = 0.05 // $50 lost per $1,000 over the threshold

export default function TaxRefundCalc() {
  usePageMeta({
    title: 'Tax Refund Calculator 2026 — Estimate Your Federal Refund Free | MyFreePayStub',
    description: 'Free 2026 tax refund estimator. Enter your income, federal tax withheld, filing status, and dependents to estimate your federal refund or how much you owe. No sign-up, nothing stored.',
    canonicalPath: '/tax-refund-calculator',
  })

  const [income, setIncome] = useState('')
  const [withheld, setWithheld] = useState('')
  const [filingStatus, setFilingStatus] = useState('single')
  const [dependents, setDependents] = useState('0')
  const [otherIncome, setOtherIncome] = useState('')
  const [adjustments, setAdjustments] = useState('')
  const [result, setResult] = useState(null)

  const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')

  const calculate = () => {
    const wages = parseFloat(income) || 0
    const other = parseFloat(otherIncome) || 0
    const adj = parseFloat(adjustments) || 0
    const paid = parseFloat(withheld) || 0
    const kids = parseInt(dependents, 10) || 0
    if (wages <= 0 && other <= 0) return

    const grossIncome = wages + other
    const agi = Math.max(0, grossIncome - adj)
    const deduction = STANDARD_DEDUCTIONS[filingStatus] ?? STANDARD_DEDUCTIONS.single
    const taxableIncome = Math.max(0, agi - deduction)

    // calcFederalTax applies the standard deduction internally, so pass AGI.
    const taxBeforeCredits = calcFederalTax(agi, filingStatus)

    // Child tax credit with a simplified phase-out: the credit drops by $50 for
    // every $1,000 (or part thereof) of AGI above the filing-status threshold.
    const rawCredit = kids * CTC_PER_CHILD
    const threshold = CTC_PHASEOUT_START[filingStatus] ?? CTC_PHASEOUT_START.single
    const excess = Math.max(0, agi - threshold)
    const phaseOut = Math.ceil(excess / 1000) * (1000 * CTC_PHASEOUT_RATE)
    const credit = Math.max(0, rawCredit - phaseOut)

    const taxAfterCredits = Math.max(0, taxBeforeCredits - credit)
    const balance = paid - taxAfterCredits

    setResult({
      grossIncome, agi, deduction, taxableIncome,
      taxBeforeCredits, credit, taxAfterCredits,
      paid,
      balance,
      isRefund: balance >= 0,
      effectiveRate: agi > 0 ? taxAfterCredits / agi : 0,
      kids,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  const FAQ = [
    { q: 'How is a tax refund calculated?', a: 'A refund is simply the difference between what you already paid and what you actually owe. Your employer withholds tax from every paycheck based on your W-4. At filing, your real tax is worked out from your income, deductions, and credits — if withholding exceeded that number, the difference comes back as a refund.' },
    { q: 'Why is my refund smaller this year?', a: 'The most common reasons are a change in withholding on your W-4, a raise that moved more income into a higher bracket, a second job, losing a dependent credit as a child ages out, or extra untaxed income such as freelance work.' },
    { q: 'Is a big refund a good thing?', a: 'A large refund means you lent the government money interest-free during the year. Many people prefer to adjust their W-4 so that less is withheld and more lands in each paycheck, aiming for a refund near zero.' },
    { q: 'Does this calculator include state tax refunds?', a: 'No. This estimates your federal position only. State refunds are calculated separately under each state\'s own rules and brackets.' },
    { q: 'Why does my estimate differ from my tax software?', a: 'This tool uses the standard deduction and a simplified child tax credit. It does not model itemized deductions, education or energy credits, the earned income credit, self-employment tax, capital gains, or many other provisions. Treat it as a ballpark, not a return.' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Tax Refund Calculator 2026',
        'url': 'https://myfreepaystub.com/tax-refund-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Free federal tax refund estimator based on income, withholding, filing status, and dependents.',
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': FAQ.map((f) => ({
          '@type': 'Question', 'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
        })),
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Tax Refund Calculator 2026</h1>
        <p className="text-sm text-gray-500">
          Estimate your federal refund — or what you'll owe — from your income, the tax already
          withheld, and your dependents. Free, and nothing you type leaves your browser.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-4">
        <div>
          <label className={labelClass}>Annual Wages (W-2 Box 1)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} placeholder="65,000" className={`${inputClass} pl-7`} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Federal Tax Withheld (W-2 Box 2)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={withheld} onChange={(e) => setWithheld(e.target.value)} placeholder="7,200" className={`${inputClass} pl-7`} />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Find this on your W-2, or add up the federal tax lines on your pay stubs.
          </p>
        </div>

        <div>
          <label className={labelClass}>Filing Status</label>
          <div className="grid grid-cols-3 gap-2">
            {[['single', '👤 Single'], ['married', '💑 Married'], ['head', '🏠 Head of HH']].map(([v, l]) => (
              <button key={v} onClick={() => setFilingStatus(v)}
                className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                  filingStatus === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Children Under 17</label>
            <input type="number" min="0" value={dependents} onChange={(e) => setDependents(e.target.value)} placeholder="0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Other Income</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={otherIncome} onChange={(e) => setOtherIncome(e.target.value)} placeholder="0" className={`${inputClass} pl-7`} />
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Adjustments to Income <span className="text-gray-400 font-normal">(optional)</span></label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={adjustments} onChange={(e) => setAdjustments(e.target.value)} placeholder="0" className={`${inputClass} pl-7`} />
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Things like deductible IRA contributions or student loan interest that reduce your AGI.
          </p>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Estimate My Refund
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className={`border rounded-xl p-5 text-center ${result.isRefund ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`text-sm font-semibold mb-1 ${result.isRefund ? 'text-emerald-600' : 'text-red-600'}`}>
              {result.isRefund ? 'Estimated Refund' : 'Estimated Amount You Owe'}
            </p>
            <p className={`text-4xl font-extrabold ${result.isRefund ? 'text-emerald-700' : 'text-red-700'}`}>
              {fmt0(Math.abs(result.balance))}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {result.isRefund
                ? 'You withheld more than your estimated tax.'
                : 'Your withholding fell short of your estimated tax.'}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">How We Got There</p>
            <div className="space-y-2 text-sm">
              {[
                ['Total income', result.grossIncome, false],
                ['Adjusted gross income (AGI)', result.agi, false],
                ['Standard deduction', -result.deduction, true],
                ['Taxable income', result.taxableIncome, false],
                ['Federal tax before credits', result.taxBeforeCredits, false],
                ...(result.credit > 0 ? [['Child tax credit', -result.credit, true]] : []),
                ['Total federal tax', result.taxAfterCredits, false],
                ['Federal tax already withheld', -result.paid, true],
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between border-b border-gray-50 py-1.5 ${sub ? 'text-gray-500 text-xs pl-3' : 'text-gray-700'}`}>
                  <span>{label}</span>
                  <span className={sub ? 'text-red-500' : 'font-semibold'}>{val < 0 ? `(${fmt0(-val)})` : fmt0(val)}</span>
                </div>
              ))}
              <div className={`flex justify-between pt-2 font-extrabold ${result.isRefund ? 'text-emerald-700' : 'text-red-700'}`}>
                <span>{result.isRefund ? 'Refund' : 'Balance due'}</span>
                <span>{fmt0(Math.abs(result.balance))}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Effective federal tax rate: {(result.effectiveRate * 100).toFixed(1)}% of AGI.
              {result.kids > 0 && ' Child tax credit assumes $2,000 per qualifying child under 17, phased out above the income threshold.'}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Getting a large refund or a surprise bill? Your withholding may be off — check it with our{' '}
            <a href="/w4-withholding-calculator" className="underline font-semibold">W-4 Withholding Calculator</a>,
            or see your per-paycheck numbers in the{' '}
            <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="tax-refund-calculator" title="Tax Refund Calculator" height="860" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How a Federal Refund Actually Works</h2>
          <p className="leading-relaxed">
            A refund is not a bonus from the government — it is your own money coming back. Throughout
            the year your employer withholds federal income tax from each paycheck based on the W-4 you
            filled in. That withholding is only an estimate of what you will owe.
          </p>
          <p className="leading-relaxed mt-3">
            When you file, your actual liability is computed from your income, deductions, and credits.
            If you withheld <strong>more</strong> than that figure, the excess is refunded. If you
            withheld <strong>less</strong>, you owe the difference. The goal for most people is to land
            close to zero, so that money reaches them in each paycheck instead of a year later.
          </p>
        </div>

        <AdSlot slot={AD_SLOTS.article} />

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What This Estimator Includes — and What It Doesn't</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-gray-700 mb-2">✅ Included</p>
              <ul className="space-y-1 text-xs leading-relaxed">
                <li>Wages and other ordinary income</li>
                <li>Standard deduction by filing status</li>
                <li>Federal income tax brackets</li>
                <li>Child tax credit (simplified, with phase-out)</li>
                <li>Adjustments that reduce AGI</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">❌ Not included</p>
              <ul className="space-y-1 text-xs leading-relaxed">
                <li>Itemized deductions</li>
                <li>Earned income tax credit</li>
                <li>Education, childcare, and energy credits</li>
                <li>Self-employment tax and capital gains</li>
                <li>State and local taxes</li>
              </ul>
            </div>
          </div>
          <p className="leading-relaxed mt-4 text-xs">
            If any of the right-hand items apply to you, your real refund may differ substantially.
            Use tax software or a professional to prepare an actual return.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/tax-refund-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This is a simplified estimate for planning only — it is not tax advice, not a tax return,
          and not affiliated with or endorsed by the IRS. Credit amounts, phase-out thresholds, and
          deduction figures are set by law and change between tax years. Verify current figures at{' '}
          <a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer" className="underline">IRS.gov</a>{' '}
          and consult a qualified tax professional before making decisions or filing.
        </div>
      </div>
    </div>
  )
}
