import { useParams, Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { STATE_LIST, getStateBySlug, STATE_MIN_WAGE, FEDERAL_MIN_WAGE } from '../../utils/states'
import { takeHomeForState } from '../../utils/salaryTakeHome'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from '../blog/blogShared'
import RelatedTools from '../RelatedTools'
import AdSlot from '../AdSlot'
import { INDEX_CLUSTERS, robotsFor } from '../../config/indexing'
import { AD_SLOTS } from '../../config/ads'

const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function MinimumWagePage() {
  const { stateSlug } = useParams()
  const state = getStateBySlug(stateSlug)
  const wage = state ? STATE_MIN_WAGE[state.code] : null

  usePageMeta({
    title: state
      ? `${state.name} Minimum Wage 2026 — Hourly, Weekly & Yearly Pay | MyFreePayStub`
      : 'Minimum Wage by State | MyFreePayStub',
    description: state
      ? `${state.name}'s minimum wage is about ${fmt2(wage)} an hour in 2026 — roughly ${fmt0(wage * 2080)} a year full time. See weekly, monthly, and after-tax take-home pay, plus how it compares to the federal minimum.`
      : 'Minimum wage rates for all 50 states.',
    canonicalPath: state ? `/minimum-wage/${state.slug}` : '/minimum-wage',
    robots: robotsFor(INDEX_CLUSTERS.minimumWageStates),
  })

  if (!state || wage == null) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-gray-800 mb-3">State not found</h1>
        <p className="text-sm text-gray-500 mb-6">We don't have a minimum wage page for that state.</p>
        <Link to="/minimum-wage" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
          Browse all states →
        </Link>
      </div>
    )
  }

  const annual = wage * 2080
  const th = takeHomeForState(annual, state.code)
  const atFederal = wage === FEDERAL_MIN_WAGE
  const aboveFederal = wage > FEDERAL_MIN_WAGE
  const diff = wage - FEDERAL_MIN_WAGE

  const rows = [
    ['Hourly', fmt2(wage)],
    ['Daily (8 hours)', fmt2(wage * 8)],
    ['Weekly (40 hours)', fmt2(wage * 40)],
    ['Bi-Weekly (80 hours)', fmt2(wage * 80)],
    ['Monthly', fmt0(annual / 12)],
    ['Annual (2,080 hours)', fmt0(annual)],
  ]

  // Neighbouring states by rate, for internal linking.
  const others = STATE_LIST
    .filter((s) => s.code !== state.code && STATE_MIN_WAGE[s.code] != null)
    .sort((a, b) => Math.abs(STATE_MIN_WAGE[a.code] - wage) - Math.abs(STATE_MIN_WAGE[b.code] - wage))
    .slice(0, 4)

  const FAQ = [
    { q: `What is the minimum wage in ${state.name} in 2026?`, a: `${state.name}'s minimum wage is approximately ${fmt2(wage)} per hour. ${atFederal ? `That matches the federal minimum wage of ${fmt2(FEDERAL_MIN_WAGE)}, which applies because the state has not set a higher rate.` : `That is ${fmt2(Math.abs(diff))} ${aboveFederal ? 'above' : 'below'} the federal minimum of ${fmt2(FEDERAL_MIN_WAGE)}.`} Cities and counties may set higher local rates, and states adjust their rates periodically.` },
    { q: `How much is ${state.name}'s minimum wage per year?`, a: `Working full time — 40 hours a week for 52 weeks — ${fmt2(wage)} an hour is about ${fmt0(annual)} a year before taxes, or roughly ${fmt0(annual / 12)} a month.` },
    { q: `What is minimum wage after taxes in ${state.name}?`, a: `A full-time minimum wage worker in ${state.name} takes home roughly ${fmt0(th.net)} a year after estimated federal income tax, Social Security, Medicare${th.state > 0 ? ', and state income tax' : ''}. Actual withholding depends on your W-4 and personal circumstances.` },
    { q: 'Can a city have a higher minimum wage than the state?', a: 'Yes. Many cities and counties set local minimum wages above their state rate. Where federal, state, and local minimums differ, employers generally must pay whichever is highest.' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline={`${state.name} Minimum Wage 2026`}
        description={`${state.name} minimum wage rate for 2026 with weekly, monthly, yearly, and after-tax breakdowns.`}
        slug={`/minimum-wage/${state.slug}`}
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Minimum Wage</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          {state.name} Minimum Wage (2026)
        </h1>
        <p className="text-sm text-gray-400">Updated July 2026 · Rates change — verify before relying on this</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-500 font-semibold uppercase">Per Hour</p>
          <p className="text-3xl font-black text-blue-700">{fmt2(wage)}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            {atFederal ? 'federal floor' : aboveFederal ? `${fmt2(diff)} above federal` : 'below federal'}
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Per Year</p>
          <p className="text-3xl font-black text-emerald-700">{fmt0(annual)}</p>
          <p className="text-xs text-gray-400 mt-0.5">full time, before tax</p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          The minimum wage in <strong>{state.name}</strong> is approximately{' '}
          <strong>{fmt2(wage)} per hour</strong> in 2026. Full time that works out to about{' '}
          <strong>{fmt0(annual)} a year</strong> before taxes.{' '}
          {atFederal
            ? `${state.name} has not set a state minimum above the federal floor, so the federal rate of ${fmt2(FEDERAL_MIN_WAGE)} applies.`
            : aboveFederal
            ? `That is ${fmt2(diff)} an hour more than the federal minimum wage of ${fmt2(FEDERAL_MIN_WAGE)} — about ${fmt0(diff * 2080)} more a year.`
            : `Where a state rate is lower than the federal minimum, covered employers must generally pay the federal rate of ${fmt2(FEDERAL_MIN_WAGE)}.`}
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">{state.name} Minimum Wage Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {rows.map(([label, val], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 text-gray-600">{label}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold text-gray-800">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Based on 40 hours/week × 52 weeks, before taxes and deductions.</p>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Minimum Wage After Taxes in {state.name}</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Gross annual pay', annual, false],
                ['Federal income tax', -th.federal, true],
                ['Social Security (6.2%)', -th.ss, true],
                ['Medicare (1.45%)', -th.medicare, true],
                ...(th.state > 0 ? [[`${state.name} state tax`, -th.state, true]] : []),
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between border-b border-gray-50 py-1.5 ${sub ? 'text-gray-500 text-xs pl-3' : 'text-gray-700'}`}>
                  <span>{label}</span>
                  <span className={sub ? 'text-red-500' : 'font-semibold'}>{val < 0 ? `(${fmt0(-val)})` : fmt0(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-black text-emerald-700">
                <span>Estimated take-home</span>
                <span>{fmt0(th.net)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              About {fmt0(th.net / 12)} a month. Single filer estimate — your actual withholding varies.
            </p>
          </div>
        </section>

        <ToolCTA
          to="/paycheck-calculator"
          title={`Calculate Your Exact ${state.name} Paycheck`}
          desc="Enter your real hours, rate, and deductions to see precise take-home pay."
          label="Open Paycheck Calculator →"
        />

        <section>
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

        <RelatedGuides items={[
          ...others.map((s) => ({ to: `/minimum-wage/${s.slug}`, label: `${s.name} Minimum Wage (${fmt2(STATE_MIN_WAGE[s.code])})` })),
          { to: `/pay-stub/${state.slug}`, label: `${state.name} Paycheck & Pay Stub Guide` },
          { to: '/minimum-wage', label: 'Minimum Wage in All 50 States' },
        ]} />

        <RelatedTools current="/minimum-wage" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Minimum wage rates are approximate and change frequently — many states adjust on January 1,
          and cities and counties often set higher local rates. Tipped employees, minors, small
          employers, and certain industries may be subject to different rates. This page is
          informational only and is not legal advice. Always verify with the{' '}
          <a href="https://www.dol.gov/agencies/whd/minimum-wage/state" target="_blank" rel="noopener noreferrer" className="underline">US Department of Labor</a>{' '}
          or your state labor department.
        </div>

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
