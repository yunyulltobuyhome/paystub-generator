import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { STATE_LIST, STATE_MIN_WAGE, FEDERAL_MIN_WAGE } from '../../utils/states'
import RelatedTools from '../RelatedTools'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function MinimumWageHub() {
  usePageMeta({
    title: 'Minimum Wage by State 2026 — All 50 States Compared | MyFreePayStub',
    description: 'Minimum wage rates for all 50 states and DC in 2026, ranked highest to lowest, with hourly, weekly, and yearly pay. See how your state compares to the federal minimum wage.',
    canonicalPath: '/minimum-wage',
  })

  const ranked = STATE_LIST
    .filter((s) => STATE_MIN_WAGE[s.code] != null)
    .map((s) => ({ ...s, wage: STATE_MIN_WAGE[s.code] }))
    .sort((a, b) => b.wage - a.wage)

  const aboveFederal = ranked.filter((s) => s.wage > FEDERAL_MIN_WAGE).length
  const atFederal = ranked.filter((s) => s.wage <= FEDERAL_MIN_WAGE).length
  const highest = ranked[0]

  const FAQ = [
    { q: 'What is the federal minimum wage in 2026?', a: `The federal minimum wage is ${fmt2(FEDERAL_MIN_WAGE)} per hour and has been unchanged since 2009. States may set higher rates, and where they do, the higher rate generally applies.` },
    { q: 'Which state has the highest minimum wage?', a: `Among the states and DC listed here, ${highest.name} has the highest at ${fmt2(highest.wage)} an hour — about ${fmt0(highest.wage * 2080)} a year working full time. Some cities set even higher local rates.` },
    { q: 'What happens if state and federal minimum wage differ?', a: 'Covered employers must pay whichever rate is highest — federal, state, or local. A state rate below the federal minimum does not lower what a covered employer must pay.' },
    { q: 'How much is minimum wage a year?', a: `Multiply the hourly rate by 2,080 hours (40 hours a week for 52 weeks). At the federal minimum of ${fmt2(FEDERAL_MIN_WAGE)} that is about ${fmt0(FEDERAL_MIN_WAGE * 2080)} a year before taxes.` },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': FAQ.map((f) => ({
          '@type': 'Question', 'name': f.q,
          'acceptedAnswer': { '@type': 'Answer', 'text': f.a },
        })),
      }) }} />

      <h1 className="text-2xl font-black text-gray-800 mb-2">Minimum Wage by State (2026)</h1>
      <p className="text-sm text-gray-400 mb-6">
        Minimum wage rates for all 50 states and DC, ranked highest to lowest. Tap a state for its
        weekly, monthly, yearly, and after-tax breakdown.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-blue-700">{fmt2(FEDERAL_MIN_WAGE)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Federal floor</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-emerald-700">{aboveFederal}</p>
          <p className="text-xs text-gray-500 mt-0.5">Above federal</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
          <p className="text-xl font-black text-gray-700">{atFederal}</p>
          <p className="text-xs text-gray-500 mt-0.5">At federal rate</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 border border-gray-200 font-semibold text-xs">State</th>
              <th className="text-right p-2 border border-gray-200 font-semibold text-xs">Per Hour</th>
              <th className="text-right p-2 border border-gray-200 font-semibold text-xs">Per Year</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((s, i) => (
              <tr key={s.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2 border border-gray-200">
                  <Link to={`/minimum-wage/${s.slug}`} className="text-blue-600 hover:underline font-medium">{s.name}</Link>
                </td>
                <td className="p-2 border border-gray-200 text-right font-semibold text-gray-800">{fmt2(s.wage)}</td>
                <td className="p-2 border border-gray-200 text-right text-gray-500">{fmt0(s.wage * 2080)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdSlot slot={AD_SLOTS.article} />

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
        <p className="font-bold text-blue-800 mb-1">What's your take-home at that rate?</p>
        <p className="text-blue-700 text-xs mb-3">
          Enter your hours, state, and deductions to see exact pay after taxes.
        </p>
        <Link to="/paycheck-calculator" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Open Paycheck Calculator →
        </Link>
      </div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
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

        <RelatedTools current="/minimum-wage" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Rates are approximate and change frequently — many states adjust on January 1, and cities
          and counties often set higher local minimums. Tipped employees, minors, small employers, and
          certain industries may be subject to different rates. Informational only, not legal advice.
          Verify with the{' '}
          <a href="https://www.dol.gov/agencies/whd/minimum-wage/state" target="_blank" rel="noopener noreferrer" className="underline">US Department of Labor</a>{' '}
          or your state labor department.
        </div>
      </div>
    </div>
  )
}
