import { useParams, Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { SALARY_AMOUNTS, parseSalarySlug, salarySlug, salaryConversions } from '../../data/salaryAmounts'
import { takeHomeByState, federalTakeHome } from '../../utils/salaryTakeHome'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from '../blog/blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function SalaryAfterTax() {
  const { salarySlug: slug } = useParams()
  const amount = parseSalarySlug(slug)

  usePageMeta({
    title: amount
      ? `$${amount.toLocaleString('en-US')} a Year After Taxes & Per Hour (2026) | MyFreePayStub`
      : 'Salary After Tax | MyFreePayStub',
    description: amount
      ? `$${amount.toLocaleString('en-US')} a year is $${(amount / 2080).toFixed(2)}/hour. See your 2026 take-home pay after federal, state, and FICA taxes in all 50 states, plus monthly, biweekly, and weekly breakdowns.`
      : 'How much a salary is after taxes and per hour.',
    canonicalPath: amount ? `/salary/${salarySlug(amount)}` : '/salary',
  })

  if (!amount) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-3">Salary not found</h1>
        <p className="text-sm text-gray-500 mb-6">We don't have a page for that salary amount yet.</p>
        <Link to="/salary" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
          Browse all salaries →
        </Link>
      </div>
    )
  }

  const c = salaryConversions(amount)
  const fed = federalTakeHome(amount)
  const byState = takeHomeByState(amount)
  const best = byState[0]
  const worst = byState[byState.length - 1]
  const amountStr = amount.toLocaleString('en-US')

  const conversionRows = [
    ['Hourly (40 hrs/week)', fmt2(c.hourly)],
    ['Daily (8 hours)', fmt2(c.daily)],
    ['Weekly', fmt2(c.weekly)],
    ['Bi-Weekly', fmt2(c.biweekly)],
    ['Semi-Monthly', fmt2(c.semimonthly)],
    ['Monthly', fmt2(c.monthly)],
    ['Annual', fmt0(c.annual)],
  ]

  const FAQ = [
    { q: `How much is $${amountStr} a year per hour?`, a: `$${amountStr} per year is about ${fmt2(c.hourly)} per hour, based on a standard 40-hour week and 52 weeks (2,080 hours per year).` },
    { q: `How much is $${amountStr} a year after taxes?`, a: `It depends on your state. After federal income tax and FICA alone, take-home is about ${fmt0(fed.net)}. With state income tax, 2026 take-home ranges from about ${fmt0(worst.net)} (in ${worst.name}) to ${fmt0(best.net)} (in no-income-tax states like ${best.name}).` },
    { q: `How much is $${amountStr} a year per month after taxes?`, a: `Before state tax, roughly ${fmt0(fed.net / 12)} per month take-home. Your exact monthly amount depends on your state, filing status, and any pre-tax deductions.` },
  ]

  const relatedAmounts = SALARY_AMOUNTS
    .filter((a) => a !== amount)
    .sort((a, b) => Math.abs(a - amount) - Math.abs(b - amount))
    .slice(0, 4)

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline={`$${amountStr} a Year After Taxes and Per Hour (2026)`}
        description={`What $${amountStr} a year is per hour and take-home after taxes in every US state for 2026.`}
        slug={`/salary/${salarySlug(amount)}`}
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Salary Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          ${amountStr} a Year Is How Much an Hour &amp; After Taxes? (2026)
        </h1>
        <p className="text-sm text-gray-400">Updated July 2026 · Single filer estimate</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
          <p className="text-xs text-blue-500 font-semibold uppercase">Per Hour</p>
          <p className="text-2xl font-extrabold text-blue-700">{fmt2(c.hourly)}</p>
          <p className="text-xs text-gray-400 mt-0.5">40 hrs/week</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <p className="text-xs text-emerald-600 font-semibold uppercase">Take-Home</p>
          <p className="text-2xl font-extrabold text-emerald-700">{fmt0(worst.net)}–{fmt0(best.net)}</p>
          <p className="text-xs text-gray-400 mt-0.5">/yr, varies by state</p>
        </div>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          A <strong>${amountStr}</strong> annual salary works out to about <strong>{fmt2(c.hourly)} per hour</strong>{' '}
          for a full-time schedule. Here's the full breakdown — how it converts to hourly, weekly, and
          monthly pay, and what you actually take home after 2026 taxes in each state.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">${amountStr} a Year Converted</h2>
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
          <h2 className="text-base font-bold text-gray-800 mb-3">Federal Tax &amp; FICA Breakdown</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Gross salary', amount, false],
                ['Federal income tax', -fed.federal, true],
                ['Social Security (6.2%)', -fed.ss, true],
                ['Medicare (1.45%)', -fed.medicare, true],
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between border-b border-gray-50 py-1.5 ${sub ? 'text-gray-500 text-xs pl-3' : 'text-gray-700'}`}>
                  <span>{label}</span>
                  <span className={sub ? 'text-red-500' : 'font-semibold'}>{val < 0 ? `(${fmt0(-val)})` : fmt0(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-extrabold text-emerald-700">
                <span>Take-home (before state tax)</span>
                <span>{fmt0(fed.net)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Single filer, 2026 standard deduction. Nine states add no income tax on top of this.</p>
          </div>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Take-Home Pay by State (2026)</h2>
          <p className="leading-relaxed mb-3">
            Estimated annual take-home for ${amountStr} in every state, single filer — highest first.
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
          desc={`See your precise paycheck for a $${amountStr} salary with your state, filing status, and deductions.`}
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
          ...relatedAmounts.map((a) => ({ to: `/salary/${salarySlug(a)}`, label: `$${a.toLocaleString('en-US')} a Year After Taxes` })),
          { to: '/paycheck-calculator', label: 'Paycheck Calculator — all 50 states' },
          { to: '/hourly-to-salary-calculator', label: 'Hourly to Salary Calculator' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
