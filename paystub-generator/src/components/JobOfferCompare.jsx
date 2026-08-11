import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { compareOffers } from '../utils/offerCompare'
import { STATE_LIST } from '../utils/states'
import RelatedTools from './RelatedTools'
import EmbedSnippet from './EmbedSnippet'
import AdSlot from './AdSlot'
import { AD_SLOTS } from '../config/ads'

const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const n = (v) => parseFloat(v) || 0

// Pre-filled with a realistic pair so the comparison is fully rendered on load —
// good for the visitor (instant demonstration) and for crawlers, which see a
// complete worked example rather than an empty form.
const SEED = [
  { label: 'Offer A', baseSalary: '95000', stateCode: 'CA', signingBonus: '', annualBonusPct: '5',
    match401kPct: '3', healthMonthly: '250', ptoDays: '15', contractedHours: '40',
    commuteDays: '5', commuteMinutes: '45', commuteMonthly: '220', otherMonthly: '' },
  { label: 'Offer B', baseSalary: '88000', stateCode: 'TX', signingBonus: '', annualBonusPct: '8',
    match401kPct: '5', healthMonthly: '120', ptoDays: '20', contractedHours: '40',
    commuteDays: '0', commuteMinutes: '0', commuteMonthly: '', otherMonthly: '' },
]

const BLANK = { label: 'Offer C', baseSalary: '', stateCode: 'NY', signingBonus: '', annualBonusPct: '',
  match401kPct: '', healthMonthly: '', ptoDays: '', contractedHours: '40',
  commuteDays: '', commuteMinutes: '', commuteMonthly: '', otherMonthly: '' }

export default function JobOfferCompare() {
  usePageMeta({
    title: 'Job Offer Comparison Calculator — Which Offer Is Actually Better? (2026)',
    description: 'Compare job offers side by side on what actually matters: take-home pay after state taxes, 401(k) match, health premiums, PTO, and commute. The highest salary often loses. Free, no sign-up.',
    canonicalPath: '/job-offer-comparison-calculator',
  })

  const [offers, setOffers] = useState(SEED)
  const [filingStatus, setFilingStatus] = useState('single')

  const set = (i, k, v) => setOffers((p) => p.map((o, idx) => (idx === i ? { ...o, [k]: v } : o)))
  const addOffer = () => setOffers((p) => (p.length < 3 ? [...p, { ...BLANK }] : p))
  const removeOffer = (i) => setOffers((p) => (p.length > 2 ? p.filter((_, idx) => idx !== i) : p))

  const result = useMemo(() => compareOffers(
    offers.map((o) => ({
      label: o.label || 'Offer',
      baseSalary: n(o.baseSalary),
      stateCode: o.stateCode,
      signingBonus: n(o.signingBonus),
      annualBonusPct: n(o.annualBonusPct),
      match401kPct: n(o.match401kPct),
      healthMonthly: n(o.healthMonthly),
      ptoDays: n(o.ptoDays),
      contractedHours: n(o.contractedHours) || 40,
      commuteDays: n(o.commuteDays),
      commuteMinutes: n(o.commuteMinutes),
      commuteMonthly: n(o.commuteMonthly),
      otherMonthly: n(o.otherMonthly),
    })),
    { filingStatus },
  ), [offers, filingStatus])

  const hasData = offers.some((o) => n(o.baseSalary) > 0)
  const anySigning = result.valued.some((v) => v.signingBonus > 0)

  const inputClass = 'w-full px-2.5 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-xs font-semibold text-gray-600 mb-1'

  const Field = ({ i, k, label, prefix, suffix, ph }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        {prefix && <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>}
        <input type="number" step="any" value={offers[i][k]} onChange={(e) => set(i, k, e.target.value)}
          placeholder={ph} className={`${inputClass} ${prefix ? 'pl-6' : ''} ${suffix ? 'pr-7' : ''}`} />
        {suffix && <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">{suffix}</span>}
      </div>
    </div>
  )

  const FAQ = [
    { q: 'How do you compare two job offers with different salaries?', a: 'Convert both to what actually reaches you over a year. Start from base pay plus bonus, subtract federal, state, and FICA taxes, subtract what the job costs you (health premiums, commuting), then add the employer 401(k) match. A $7,000 salary difference routinely reverses once state tax and a commute are included.' },
    { q: 'Is a higher salary in a high-tax state worth it?', a: 'Often not. Moving from a no-income-tax state to one taxing around 9% costs roughly 9% of gross straight away, so the higher offer needs to clear that gap before it is even level. This tool shows the crossover point for your specific numbers.' },
    { q: 'How much is a 401(k) match actually worth?', a: 'A 5% match on a $90,000 salary is $4,500 a year of additional compensation you would otherwise have to fund yourself. It is real money, though it lands in a retirement account rather than your bank, so it is counted separately from spendable pay here.' },
    { q: 'Should a signing bonus decide my choice?', a: 'Be careful. A signing bonus is paid once, so it flatters the first year and does nothing thereafter. This calculator ranks offers on ongoing value and reports the first-year figure separately, so a one-off payment cannot win a multi-year decision on its own.' },
    { q: 'How do I put a value on a commute?', a: 'Two ways, both of which matter. It costs money (fuel, transit, parking) and it costs time the job consumes but does not pay for. A 45-minute each-way commute is 7.5 unpaid hours a week — nearly a full working day — which is why the real hourly figure often separates offers that look close on salary.' },
    { q: 'Does this account for cost of living differences?', a: 'No. It compares taxes, benefits, and job costs, not housing or groceries. A city with lower taxes may have higher rent. Treat the result as the pay-and-benefits half of the decision.' },
  ]

  const medal = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Job Offer Comparison Calculator',
        'url': 'https://myfreepaystub.com/job-offer-comparison-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Compare job offers on take-home pay after state taxes, 401(k) match, health premiums, PTO, and commute.',
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': FAQ.map((x) => ({ '@type': 'Question', 'name': x.q, 'acceptedAnswer': { '@type': 'Answer', 'text': x.a } })),
      }) }} />

      <div className="mb-6">
        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-semibold">Decision tool</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-1">Job Offer Comparison Calculator</h1>
        <p className="text-sm text-gray-500">
          The bigger salary is not always the better offer. Compare what each one actually leaves you
          after state taxes, benefits, and the commute — the numbers recruiters never put side by side.
        </p>
      </div>

      {hasData && result.winner && (
        <div className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-2xl p-6 mb-6">
          <p className="text-xs uppercase tracking-wide text-blue-200 font-semibold mb-1">Better offer</p>
          <p className="text-3xl font-black mb-1">{result.winner.label}</p>
          <p className="text-blue-100 text-sm">
            Worth <strong className="text-white">{fmt0(result.gap)} more a year</strong> than the next
            best, once taxes, benefits, and job costs are counted.
          </p>
          {result.upsetOnValue && result.baseGap > 0 && (
            <div className="mt-4 bg-white/15 rounded-xl p-3 text-sm">
              ⚡ <strong>Plot twist:</strong> {result.winner.label} has the{' '}
              <strong>lower base salary</strong> — {fmt0(result.baseGap)} less than{' '}
              {result.highestBase.label} — and still comes out ahead.
            </div>
          )}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-blue-200">Annual value</p>
              <p className="text-xl font-black">{fmt0(result.winner.totalValue)}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-xs text-blue-200">Real hourly</p>
              <p className="text-xl font-black">{fmt2(result.winner.realHourly)}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">The Offers</h2>
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-500">Filing</label>
            <select value={filingStatus} onChange={(e) => setFilingStatus(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5">
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="head">Head of household</option>
            </select>
          </div>
        </div>

        <div className={`grid gap-4 ${offers.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
          {offers.map((o, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-3">
              <div className="flex items-center gap-2">
                <input type="text" value={o.label} onChange={(e) => set(i, 'label', e.target.value)}
                  className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300" />
                {offers.length > 2 && (
                  <button onClick={() => removeOffer(i)} className="text-gray-300 hover:text-red-500 text-lg leading-none px-1" aria-label="Remove offer">×</button>
                )}
              </div>

              <Field i={i} k="baseSalary" label="Base Salary" prefix="$" ph="90,000" />
              <div>
                <label className={labelClass}>State</label>
                <select value={o.stateCode} onChange={(e) => set(i, 'stateCode', e.target.value)} className={inputClass}>
                  {[...STATE_LIST].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
                    <option key={s.code} value={s.code}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Field i={i} k="annualBonusPct" label="Bonus" suffix="%" ph="10" />
                <Field i={i} k="match401kPct" label="401(k) Match" suffix="%" ph="4" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field i={i} k="healthMonthly" label="Health /mo" prefix="$" ph="200" />
                <Field i={i} k="ptoDays" label="PTO Days" ph="15" />
              </div>
              <Field i={i} k="signingBonus" label="Signing Bonus" prefix="$" ph="0" />

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Commute</p>
                <div className="grid grid-cols-2 gap-2">
                  <Field i={i} k="commuteDays" label="Days /wk" ph="5" />
                  <Field i={i} k="commuteMinutes" label="Min each way" ph="30" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Field i={i} k="commuteMonthly" label="Cost /mo" prefix="$" ph="150" />
                  <Field i={i} k="otherMonthly" label="Other /mo" prefix="$" ph="0" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {offers.length < 3 && (
          <button onClick={addOffer} className="mt-4 w-full py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-colors">
            + Add a third offer
          </button>
        )}
      </div>

      {hasData && (
        <>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 mb-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Side by Side</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border border-gray-200 font-semibold">&nbsp;</th>
                    {result.valued.map((v) => (
                      <th key={v.label} className="text-right p-2 border border-gray-200 font-semibold whitespace-nowrap">
                        {result.winner?.label === v.label && '🥇 '}{v.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Base salary', (v) => fmt0(v.baseSalary), false],
                    ['Annual bonus', (v) => fmt0(v.annualBonus), false],
                    ['Gross (recurring)', (v) => fmt0(v.recurringGross), true],
                    ['Federal tax', (v) => `(${fmt0(v.tax.federal)})`, false],
                    ['State tax', (v) => v.tax.state > 0 ? `(${fmt0(v.tax.state)})` : '—', false],
                    ['Social Security + Medicare', (v) => `(${fmt0(v.tax.ss + v.tax.medicare)})`, false],
                    ['Take-home pay', (v) => fmt0(v.recurringNet), true],
                    ['Health premiums', (v) => v.healthAnnual > 0 ? `(${fmt0(v.healthAnnual)})` : '—', false],
                    ['Commuting cost', (v) => v.commuteAnnual > 0 ? `(${fmt0(v.commuteAnnual)})` : '—', false],
                    ['Other costs', (v) => v.otherAnnual > 0 ? `(${fmt0(v.otherAnnual)})` : '—', false],
                    ['Spendable', (v) => fmt0(v.spendable), true],
                    ['+ 401(k) match', (v) => v.employerMatch > 0 ? fmt0(v.employerMatch) : '—', false],
                    ['Total annual value', (v) => fmt0(v.totalValue), 'win'],
                    ...(anySigning ? [['First-year value (incl. signing)', (v) => fmt0(v.firstYearTotalValue), false]] : []),
                    ['Hours per week (incl. commute)', (v) => `${v.realHoursPerWeek.toFixed(1)}`, false],
                    ['Real hourly value', (v) => fmt2(v.realHourly), 'win'],
                    ['PTO value', (v) => v.ptoDays > 0 ? `${fmt0(v.ptoValue)} (${v.ptoDays}d)` : '—', false],
                  ].map(([label, fn, emphasis], ri) => (
                    <tr key={ri} className={emphasis ? 'bg-blue-50/60' : ri % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className={`p-2 border border-gray-200 ${emphasis ? 'font-bold text-gray-800' : 'text-gray-600'}`}>{label}</td>
                      {result.valued.map((v) => {
                        const best = emphasis === 'win' && (
                          (label === 'Real hourly value' && result.hourlyWinner?.label === v.label) ||
                          (label === 'Total annual value' && result.winner?.label === v.label))
                        return (
                          <td key={v.label} className={`p-2 border border-gray-200 text-right whitespace-nowrap ${
                            best ? 'font-black text-emerald-700' : emphasis ? 'font-bold text-gray-800' : 'text-gray-600'
                          }`}>{fn(v)}</td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {anySigning && (
              <p className="text-xs text-gray-400 mt-3">
                Ranking uses ongoing annual value. A signing bonus is paid once, so it is shown as a
                separate first-year line rather than folded into the comparison.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Ranked</h2>
            <div className="space-y-3">
              {result.ranked.map((v, i) => (
                <div key={v.label} className={`flex items-center gap-3 p-3 rounded-xl border ${
                  i === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'
                }`}>
                  <span className="text-2xl shrink-0">{medal[i] || '•'}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 text-sm">{v.label}</p>
                    <p className="text-xs text-gray-500">
                      {fmt0(v.baseSalary)} base · {fmt2(v.realHourly)}/hr real · {v.realHoursPerWeek.toFixed(1)} hrs/wk
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-black text-gray-800">{fmt0(v.totalValue)}</p>
                    {i > 0 && <p className="text-xs text-red-500">−{fmt0(result.winner.totalValue - v.totalValue)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </>
      )}

      <div className="mt-8"><EmbedSnippet tool="job-offer-comparison-calculator" title="Job Offer Comparison Calculator" height="1100" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Why the Bigger Salary Often Loses</h2>
          <p className="leading-relaxed">
            Recruiters compare offers on one number because it is the only one they control. Four
            things routinely overturn it:
          </p>
          <ul className="space-y-2 leading-relaxed mt-3">
            <li><strong>State income tax.</strong> The same salary can differ by 9-10% of gross depending purely on where you work. That gap alone swallows most raises.</li>
            <li><strong>The 401(k) match.</strong> Going from a 3% to a 5% match on $90,000 is $1,800 a year of pay that never appears in the salary line.</li>
            <li><strong>Health premiums.</strong> The difference between a $120 and a $350 monthly premium is $2,760 a year out of take-home.</li>
            <li><strong>The commute.</strong> 45 minutes each way is 7.5 unpaid hours a week plus fuel and parking — it lowers your real hourly rate far more than most people expect.</li>
          </ul>
        </div>

        <AdSlot slot={AD_SLOTS.article} />

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What to Ask Before You Accept</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>What is the exact 401(k) match formula and vesting schedule?</strong> A match you lose by leaving in under three years is worth less than it looks.</li>
            <li><strong>What will my monthly premium be for the plan I would actually pick?</strong> Ask for the employee-plus-family figure if that applies to you.</li>
            <li><strong>How is the bonus determined, and what did it actually pay out last year?</strong> "Up to 15%" and "15%" are different offers.</li>
            <li><strong>Is remote or hybrid contractual or discretionary?</strong> A commute that can be reinstated is a commute.</li>
            <li><strong>Does PTO roll over, and is it paid out if I leave?</strong> This varies by state and policy.</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
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

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Next Steps</h2>
          <p className="leading-relaxed">
            Decided which offer you want? Work out{' '}
            <Link to="/net-to-gross-calculator" className="text-blue-600 hover:underline">the salary you need to ask for</Link>{' '}
            to hit a target take-home, check{' '}
            <Link to="/real-hourly-wage-calculator" className="text-blue-600 hover:underline">what your current job really pays per hour</Link>,
            or see the full paycheck breakdown in{' '}
            <Link to="/paycheck-calculator" className="text-blue-600 hover:underline">your new state</Link>.
            Once you start, our{' '}
            <Link to="/paycheck-checker" className="text-blue-600 hover:underline">paycheck checker</Link>{' '}
            confirms the first stub matches what you agreed.
          </p>
        </div>

        <RelatedTools current="/job-offer-comparison-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Estimates for personal decision-making only — not tax, legal, financial, or career advice.
          Take-home figures assume the standard deduction and an approximate flat state rate, and do
          not model local or city taxes, pre-tax elections, equity or stock compensation, relocation
          packages, or differences in cost of living between locations. Confirm every figure against
          the written offer before deciding.
        </div>
      </div>
    </div>
  )
}
