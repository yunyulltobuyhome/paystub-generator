import { useParams, Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { HOURLY_WAGES, parseHourlyWageSlug, hourlyWageSlug, hourlyConversions, hourlyToAnnual, HOURS_SCHEDULES } from '../../data/hourlyWages'
import { takeHomeByState, federalTakeHome } from '../../utils/salaryTakeHome'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from '../blog/blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function HourlyWagePage() {
  const { hourlySlug: slug } = useParams()
  const rate = parseHourlyWageSlug(slug)

  usePageMeta({
    title: rate
      ? `$${rate} an Hour Is How Much a Year? (After Taxes, 2026) | MyFreePayStub`
      : 'Hourly Wage to Salary | MyFreePayStub',
    description: rate
      ? `$${rate} an hour is $${(rate * 2080).toLocaleString('en-US')} a year full-time. See your 2026 take-home pay after federal, state, and FICA taxes in all 50 states, plus monthly, weekly, and part-time breakdowns.`
      : 'What an hourly wage is per year, before and after taxes.',
    canonicalPath: rate ? `/hourly/${hourlyWageSlug(rate)}` : '/hourly',
  })

  if (!rate) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-gray-800 mb-3">Wage not found</h1>
        <p className="text-sm text-gray-500 mb-6">We don't have a page for that hourly wage yet.</p>
        <Link to="/hourly" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
          Browse all hourly wages →
        </Link>
      </div>
    )
  }

  const c = hourlyConversions(rate)
  const annual = c.annual
  const fed = federalTakeHome(annual)
  const byState = takeHomeByState(annual)
  const best = byState[0]
  const worst = byState[byState.length - 1]

  const conversionRows = [
    ['Hourly', fmt2(c.hourly)],
    ['Daily (8 hours)', fmt2(c.daily)],
    ['Weekly (40 hrs)', fmt2(c.weekly)],
    ['Bi-Weekly (80 hrs)', fmt2(c.biweekly)],
    ['Monthly', fmt0(c.monthly)],
    ['Annual (2,080 hrs)', fmt0(c.annual)],
  ]

  const FAQ = [
    { q: `How much is $${rate} an hour a year?`, a: `$${rate} an hour is ${fmt0(annual)} per year working full time — 40 hours a week for 52 weeks (2,080 hours). At 30 hours a week it's about ${fmt0(hourlyToAnnual(rate, 30))}, and at 20 hours a week about ${fmt0(hourlyToAnnual(rate, 20))}.` },
    { q: `How much is $${rate} an hour after taxes?`, a: `It depends on your state. After federal income tax and FICA alone, take-home is about ${fmt0(fed.net)} a year. With state income tax, 2026 take-home ranges from about ${fmt0(worst.net)} (in ${worst.name}) to ${fmt0(best.net)} (in no-income-tax states like ${best.name}).` },
    { q: `How much is $${rate} an hour a month?`, a: `$${rate} an hour is about ${fmt0(c.monthly)} a month before taxes, working full time. After federal tax and FICA, roughly ${fmt0(fed.net / 12)} a month — before state tax.` },
    { q: `Is $${rate} an hour a good wage?`, a: `Whether ${fmt2(rate)} an hour is enough depends on where you live and your hours. Full time it works out to ${fmt0(annual)} a year before tax; a common rule of thumb is that rent should be under 30% of your take-home pay. Use the calculator below to check your exact number for your state.` },
  ]

  const relatedRates = HOURLY_WAGES
    .filter((r) => r !== rate)
    .sort((a, b) => Math.abs(a - rate) - Math.abs(b - rate))
    .slice(0, 4)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline={`$${rate} an Hour Is How Much a Year? (After Taxes, 2026)`}
        description={`What $${rate} an hour is per year and take-home after taxes in every US state for 2026.`}
        slug={`/hourly/${hourlyWageSlug(rate)}`}
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Wage Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          ${rate} an Hour Is How Much a Year? (After Taxes, 2026)
        </h1>
        <p className="text-sm text-gray-400">Updated July 2026 · Single filer estimate</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-500 font-semibold uppercase">Per Year</p>
          <p className="text-2xl font-black text-blue-700">{fmt0(annual)}</p>
          <p className="text-xs text-gray-400 mt-0.5">40 hrs/week, before tax</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Take-Home</p>
          <p className="text-2xl font-black text-emerald-700">{fmt0(worst.net)}–{fmt0(best.net)}</p>
          <p className="text-xs text-gray-400 mt-0.5">/yr, varies by state</p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          <strong>${rate} an hour</strong> is <strong>{fmt0(annual)} a year</strong> working full time
          (40 hours a week, 52 weeks). Here's the full breakdown — monthly, weekly, and part-time pay,
          and what you actually keep after 2026 taxes in each state.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">${rate} an Hour Converted</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {conversionRows.map(([label, val], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 text-gray-600">{label}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold text-gray-800">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Based on 40 hours/week × 52 weeks (2,080 hours/year), before taxes.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">${rate} an Hour at Different Weekly Hours</h2>
          <p className="leading-relaxed mb-3">
            Not everyone works 40 hours. Here's what ${rate} an hour comes to per year at part-time
            and full-time schedules (before taxes).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Hours / Week</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Per Week</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Per Year</th>
                </tr>
              </thead>
              <tbody>
                {HOURS_SCHEDULES.map((h, i) => (
                  <tr key={h} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200">{h} hrs{h === 40 ? ' (full time)' : ''}</td>
                    <td className="p-2 border border-gray-200 text-right text-gray-500">{fmt0(rate * h)}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold text-gray-800">{fmt0(hourlyToAnnual(rate, h))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Take-Home Pay by State (2026)</h2>
          <p className="leading-relaxed mb-3">
            Estimated annual take-home for ${rate} an hour full time, single filer — highest first.
            Tap a state for its full paycheck guide.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">State</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">State Tax</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Take-Home</th>
                </tr>
              </thead>
              <tbody>
                {byState.map((s, i) => (
                  <tr key={s.code} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200">
                      <Link to={`/pay-stub/${s.slug}`} className="text-blue-600 hover:underline font-medium">{s.name}</Link>
                    </td>
                    <td className="p-2 border border-gray-200 text-right text-gray-500">{s.state > 0 ? fmt0(s.state) : '—'}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold text-gray-800">{fmt0(s.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ToolCTA
          to="/paycheck-calculator"
          title="Get Your Exact Take-Home Pay"
          desc={`See your precise paycheck at $${rate}/hour with your state, hours, filing status, and deductions.`}
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
          ...relatedRates.map((r) => ({ to: `/hourly/${hourlyWageSlug(r)}`, label: `$${r} an Hour a Year` })),
          { to: '/salary', label: 'Salary After Tax — by amount' },
          { to: '/hourly-to-salary-calculator', label: 'Hourly to Salary Calculator' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
