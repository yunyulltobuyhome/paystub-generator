import { usePageMeta } from '../../hooks/usePageMeta'
import { ArticleJsonLd, ArticleByline, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'

const FAQ = [
  { q: 'What is the difference between federal and state income tax?', a: 'Federal income tax is set by the IRS and applies nationwide using progressive brackets (10%–37%). State income tax is set by each state — some have no income tax, others use flat or progressive rates up to about 13.3%.' },
  { q: 'Which states have no income tax?', a: 'Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming.' },
]

export default function FederalVsStateTax() {
  usePageMeta({
    title: 'Federal vs State Income Tax: What\'s the Difference? (2026) | MyFreePayStub',
    description: '2026 federal tax brackets, state income tax rates for all 50 states, and a side-by-side comparison of living in a no-tax vs high-tax state.',
    canonicalPath: '/guides/federal-vs-state-income-tax',
  })
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="Federal vs State Income Tax: What's the Difference? (2026)"
        description="2026 federal tax brackets, state rates for all 50 states, and a no-tax vs high-tax state comparison."
        slug="/guides/federal-vs-state-income-tax"
        faq={FAQ}
      />

      <ArticleByline slug="/guides/federal-vs-state-income-tax" />
      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          Federal vs State Income Tax: What's the Difference? (2026)
        </h1>
        <p className="text-sm text-gray-400">4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          When you look at your pay stub, you'll typically see two separate income tax withholdings:
          federal income tax and state income tax. While both reduce your take-home pay,
          they work differently, fund different programs, and vary significantly in amount.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Federal Income Tax</h2>
          <p className="leading-relaxed mb-3">
            Federal income tax is collected by the IRS and funds federal government programs
            including national defense, Social Security, Medicare, federal highways, and more.
            It uses a <strong>progressive tax bracket system</strong> — meaning higher income
            is taxed at higher rates, but only the portion within each bracket.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">2026 Bracket</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Single</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Married Filing Jointly</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['10%', 'Up to $11,925', 'Up to $23,850'],
                  ['12%', '$11,925 – $48,475', '$23,850 – $96,950'],
                  ['22%', '$48,475 – $103,350', '$96,950 – $206,700'],
                  ['24%', '$103,350 – $197,300', '$206,700 – $394,600'],
                  ['32%', '$197,300 – $250,525', '$394,600 – $501,050'],
                  ['35%', '$250,525 – $626,350', '$501,050 – $751,600'],
                  ['37%', 'Over $626,350', 'Over $751,600'],
                ].map(([rate, single, mfj], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-bold text-blue-600">{rate}</td>
                    <td className="p-2 border border-gray-200">{single}</td>
                    <td className="p-2 border border-gray-200">{mfj}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Source: IRS Rev. Proc. 2025-xx. Standard deduction: $16,100 (single) / $32,200 (MFJ) in 2026.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">State Income Tax</h2>
          <p className="leading-relaxed mb-3">
            State income tax is collected by your state government and funds state programs
            including schools, roads, police, and public services. State tax rates vary enormously
            — from zero in nine states to over 13% in California.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Category</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">States</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rate</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['No state income tax', 'TX, FL, NV, WA, WY, SD, TN, AK, NH', '0%'],
                  ['Low rate (flat)', 'IN (3%), PA (3.07%), CO (4.4%)', '3–4.4%'],
                  ['Medium rate', 'GA (5.5%), MA (5%), AZ (2.5%)', '2.5–5.5%'],
                  ['High rate', 'CA (up to 13.3%), HI (8%), MN (9.85%)', '8–13.3%'],
                ].map(([cat, states, rate], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{cat}</td>
                    <td className="p-2 border border-gray-200 text-gray-500">{states}</td>
                    <td className="p-2 border border-gray-200 font-semibold text-orange-600">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Key Differences at a Glance</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Feature</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Federal Tax</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">State Tax</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Who collects it', 'IRS (federal government)', 'State revenue department'],
                  ['Rate structure', 'Progressive (10%–37%)', 'Varies — flat or progressive'],
                  ['Applies everywhere', 'Yes — all 50 states', 'No — 9 states have $0'],
                  ['Standard deduction', '$16,100 (single, 2026)', 'Varies by state'],
                  ['Filed with', 'Form 1040 (April 15)', 'State return (varies)'],
                  ['What it funds', 'Federal programs', 'State programs'],
                ].map(([feat, fed, state], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{feat}</td>
                    <td className="p-2 border border-gray-200">{fed}</td>
                    <td className="p-2 border border-gray-200">{state}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Example: $75,000 Salary in California vs Texas</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                state: '🌵 Texas (no state tax)',
                items: [
                  ['Gross pay', '$75,000'],
                  ['Federal tax (est.)', '~$9,500'],
                  ['Social Security', '$4,650'],
                  ['Medicare', '$1,088'],
                  ['State tax', '$0'],
                  ['Estimated take-home', '~$59,762'],
                ],
                color: 'bg-green-50 border-green-200',
                titleColor: 'text-green-700',
              },
              {
                state: '🌊 California (9.3% rate)',
                items: [
                  ['Gross pay', '$75,000'],
                  ['Federal tax (est.)', '~$9,500'],
                  ['Social Security', '$4,650'],
                  ['Medicare', '$1,088'],
                  ['State tax (est.)', '~$3,750'],
                  ['Estimated take-home', '~$56,012'],
                ],
                color: 'bg-orange-50 border-orange-200',
                titleColor: 'text-orange-700',
              },
            ].map(({ state, items, color, titleColor }) => (
              <div key={state} className={`rounded-xl border p-4 ${color}`}>
                <p className={`font-bold mb-3 text-sm ${titleColor}`}>{state}</p>
                {items.map(([label, val], i) => (
                  <div key={i} className={`flex justify-between text-xs py-1 ${i === items.length - 1 ? 'border-t border-gray-200 pt-2 font-bold' : ''}`}>
                    <span className="text-gray-600">{label}</span>
                    <span>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Illustrative estimates only. Actual tax depends on deductions, credits, and individual circumstances.
          </p>
        </section>

        <ToolCTA
          to="/paycheck-calculator"
          title="Calculate Your Exact Withholding"
          desc="Use our free paycheck calculator to see federal and state tax withholding calculated automatically for your salary and state."
          label="Open Paycheck Calculator →"
        />

        <RelatedGuides items={[
          { to: '/guides/what-is-fica-tax', label: 'What Is FICA Tax? Social Security & Medicare' },
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/paycheck-calculator', label: 'Paycheck Calculator — all 50 states' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}