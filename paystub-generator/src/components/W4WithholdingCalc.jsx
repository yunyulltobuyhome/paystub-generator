import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { calcFederalTax, getPayPeriods } from '../utils/taxCalculator'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import RelatedTools from './RelatedTools'
import { AD_SLOTS } from '../config/ads'

export default function W4WithholdingCalc() {
  usePageMeta({
    title: 'W-4 Withholding Calculator 2026 — Adjust Your Paycheck Tax | MyFreePayStub',
    description: 'Free W-4 withholding calculator. See whether you are withholding too much or too little federal tax, and what extra withholding to enter on line 4(c) to hit your target refund.',
    canonicalPath: '/w4-withholding-calculator',
  })

  const [salary, setSalary] = useState('')
  const [filingStatus, setFilingStatus] = useState('single')
  const [frequency, setFrequency] = useState('biweekly')
  const [currentWithholding, setCurrentWithholding] = useState('')
  const [periodsRemaining, setPeriodsRemaining] = useState('')
  const [ytdWithheld, setYtdWithheld] = useState('')
  const [targetRefund, setTargetRefund] = useState('0')
  const [result, setResult] = useState(null)

  const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
  const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calculate = () => {
    const s = parseFloat(salary) || 0
    if (s <= 0) return

    const periods = getPayPeriods(frequency)
    const annualTax = calcFederalTax(s, filingStatus)
    const idealPerPeriod = annualTax / periods

    const current = parseFloat(currentWithholding) || 0
    const currentAnnual = current * periods
    const target = parseFloat(targetRefund) || 0

    // Projected year-end position if nothing changes.
    const projectedBalance = currentAnnual - annualTax

    // If the user told us where they are mid-year, work out the extra
    // withholding per remaining paycheck needed to land on their target.
    const ytd = parseFloat(ytdWithheld) || 0
    const remaining = parseFloat(periodsRemaining) || 0
    let extraPerPeriod = null
    if (remaining > 0) {
      const needed = annualTax + target - ytd
      const neededPerPeriod = needed / remaining
      extraPerPeriod = Math.max(0, neededPerPeriod - current)
    }

    setResult({
      annualTax,
      idealPerPeriod,
      current,
      currentAnnual,
      periods,
      projectedBalance,
      isOverWithholding: projectedBalance > 0,
      difference: Math.abs(current - idealPerPeriod),
      extraPerPeriod,
      remaining,
      target,
      hasCurrent: current > 0,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  const FAQ = [
    { q: 'What is a W-4 and when should I update it?', a: 'Form W-4 tells your employer how much federal income tax to withhold from each paycheck. Update it whenever your situation changes — a new job, marriage or divorce, a new child, a second job, or a large refund or bill last year.' },
    { q: 'How do I withhold more tax from my paycheck?', a: 'Enter an additional amount on line 4(c) of your W-4. That amount is withheld from every paycheck on top of the standard calculation. This is the simplest lever if you owed money last year.' },
    { q: 'How do I get more money in each paycheck?', a: 'If you consistently receive a large refund you are over-withholding. Claiming dependents on step 3, or reducing any extra withholding on line 4(c), lowers what comes out each pay period. Be careful not to under-withhold and owe at filing.' },
    { q: 'What does "exempt" on a W-4 mean?', a: 'Claiming exempt means no federal income tax is withheld. You may only claim it if you had no tax liability last year and expect none this year. Claiming it incorrectly can lead to a large bill and potential penalties.' },
    { q: 'Why did the W-4 stop using allowances?', a: 'The form was redesigned in 2020. Instead of counting allowances, it now asks directly about multiple jobs, dependents, other income, and deductions, which is intended to make withholding more accurate.' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'W-4 Withholding Calculator 2026',
        'url': 'https://myfreepaystub.com/w4-withholding-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Check whether your federal withholding is on track and how much extra to withhold on W-4 line 4(c).',
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
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">W-4 Withholding Calculator</h1>
        <p className="text-sm text-gray-500">
          Find out whether you're withholding too much or too little federal tax — and exactly what
          to put on line 4(c) to fix it.
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
          <label className={labelClass}>Federal Tax Withheld Per Paycheck</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" step="0.01" value={currentWithholding} onChange={(e) => setCurrentWithholding(e.target.value)} placeholder="220.00" className={`${inputClass} pl-7`} />
          </div>
          <p className="text-xs text-gray-400 mt-1">The "Federal Income Tax" line on your most recent pay stub.</p>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Mid-Year Correction (optional)</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Federal Tax Withheld YTD</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input type="number" value={ytdWithheld} onChange={(e) => setYtdWithheld(e.target.value)} placeholder="4,200" className={`${inputClass} pl-7`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Paychecks Left This Year</label>
              <input type="number" value={periodsRemaining} onChange={(e) => setPeriodsRemaining(e.target.value)} placeholder="10" className={inputClass} />
            </div>
          </div>
          <div className="mt-3">
            <label className={labelClass}>Target Refund</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={targetRefund} onChange={(e) => setTargetRefund(e.target.value)} placeholder="0" className={`${inputClass} pl-7`} />
            </div>
            <p className="text-xs text-gray-400 mt-1">Enter 0 to break even — the goal for most people.</p>
          </div>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Check My Withholding
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Ideal Withholding Per Paycheck</p>
            <p className="text-4xl font-extrabold text-blue-700">{fmt2(result.idealPerPeriod)}</p>
            <p className="text-xs text-gray-500 mt-1">
              To break even on {fmt0(result.annualTax)} of estimated annual federal tax
            </p>
          </div>

          {result.hasCurrent && (
            <div className={`border rounded-xl p-4 text-sm ${result.isOverWithholding ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
              {result.isOverWithholding ? (
                <>💸 You're withholding <strong>{fmt2(result.difference)} more</strong> than needed each
                paycheck. On track for a refund of about <strong>{fmt0(result.projectedBalance)}</strong> —
                that's your own money you could be receiving during the year instead.</>
              ) : (
                <>⚠️ You're withholding <strong>{fmt2(result.difference)} less</strong> than needed each
                paycheck. On track to <strong>owe about {fmt0(Math.abs(result.projectedBalance))}</strong> at
                filing. Consider adding extra withholding on line 4(c).</>
              )}
            </div>
          )}

          {result.extraPerPeriod !== null && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">W-4 Line 4(c) — Extra Withholding</p>
              {result.extraPerPeriod > 0 ? (
                <>
                  <p className="text-3xl font-extrabold text-gray-800">{fmt2(result.extraPerPeriod)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Enter this on line 4(c) of a new W-4 and give it to your employer. Across your
                    remaining {result.remaining} paychecks it closes the gap to your{' '}
                    {result.target > 0 ? `${fmt0(result.target)} target refund` : 'break-even target'}.
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">
                  ✅ No extra withholding needed — your current rate already meets your target for the
                  rest of the year.
                </p>
              )}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Estimated annual federal tax', result.annualTax],
                ['Ideal per paycheck', result.idealPerPeriod],
                ...(result.hasCurrent ? [
                  ['Your current per paycheck', result.current],
                  ['Your annual pace', result.currentAnnual],
                ] : []),
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-800">{fmt0(val)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Based on {result.periods} pay periods a year and the standard deduction for your filing status.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Want to see the full-year picture? Run the numbers through our{' '}
            <a href="/tax-refund-calculator" className="underline font-semibold">Tax Refund Calculator</a>,
            or check take-home pay in the{' '}
            <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="w4-withholding-calculator" title="W-4 Withholding Calculator" height="900" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How to Fill Out a W-4</h2>
          <ol className="space-y-3 list-decimal list-inside leading-relaxed">
            <li><strong>Step 1 — Personal information.</strong> Your name, address, Social Security number, and filing status. Everyone completes this.</li>
            <li><strong>Step 2 — Multiple jobs.</strong> Complete only if you hold more than one job or you're married filing jointly and your spouse also works. Skipping this is the most common cause of under-withholding.</li>
            <li><strong>Step 3 — Dependents.</strong> Claim the child tax credit and credits for other dependents here. This reduces withholding.</li>
            <li><strong>Step 4 — Other adjustments.</strong> Line 4(a) for other income, 4(b) for deductions beyond the standard deduction, and <strong>4(c) for extra withholding per paycheck</strong> — the simplest dial for fine-tuning.</li>
            <li><strong>Step 5 — Sign.</strong> The form isn't valid until signed. Give it to your employer's payroll or HR, not to the IRS.</li>
          </ol>
        </div>

        <AdSlot slot={AD_SLOTS.article} />

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Owed Money Last Year? Got a Huge Refund?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Situation</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">What It Means</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">W-4 Fix</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Large refund', 'Over-withholding all year', 'Claim dependents in step 3, or reduce line 4(c)'],
                  ['Owed a lot', 'Under-withholding', 'Add extra withholding on line 4(c)'],
                  ['Near zero', 'Well calibrated', 'No change needed'],
                  ['Second job started', 'Withholding assumes one job', 'Complete step 2'],
                ].map(([a, b, c], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{a}</td>
                    <td className="p-2 border border-gray-200">{b}</td>
                    <td className="p-2 border border-gray-200 text-blue-600">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

        <RelatedTools current="/w4-withholding-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Simplified estimate for planning only — not tax advice, and not affiliated with or
          endorsed by the IRS. Actual employer withholding follows the IRS percentage-method tables
          and accounts for factors this tool does not model. For the official tool see the{' '}
          <a href="https://www.irs.gov/individuals/tax-withholding-estimator" target="_blank" rel="noopener noreferrer" className="underline">IRS Tax Withholding Estimator</a>,
          and consult a qualified tax professional about your situation.
        </div>
      </div>
    </div>
  )
}
