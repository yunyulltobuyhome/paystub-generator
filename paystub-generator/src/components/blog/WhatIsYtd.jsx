import { usePageMeta } from '../../hooks/usePageMeta'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'

const FAQ = [
  { q: 'What does YTD mean on a paycheck?', a: 'YTD stands for "year-to-date." It shows the running total of a value — such as gross pay, taxes, or deductions — from January 1st of the current year through your most recent pay period.' },
  { q: 'Why is YTD important?', a: 'YTD figures let you verify your W-2 at tax time, track progress toward the Social Security wage base and 401(k) limits, and confirm your withholding is on track for the year.' },
  { q: 'Does YTD reset each year?', a: 'Yes. YTD totals reset to zero on January 1st and accumulate again throughout the new calendar year.' },
]

export default function WhatIsYtd() {
  usePageMeta({
    title: 'What Is YTD on a Paycheck? Year-to-Date Explained (2026) | MyFreePayStub',
    description: 'YTD means year-to-date — the running total of your gross pay, taxes, and deductions for the year. Learn what each YTD figure on your pay stub means and why it matters.',
    canonicalPath: '/guides/what-is-ytd-on-a-paycheck',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="What Is YTD on a Paycheck? Year-to-Date Explained"
        description="What YTD (year-to-date) means on a pay stub, what each YTD figure represents, and why it matters at tax time."
        slug="/guides/what-is-ytd-on-a-paycheck"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          What Is YTD on a Paycheck? Year-to-Date Explained
        </h1>
        <p className="text-sm text-gray-400">Updated June 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          If you've ever looked closely at your pay stub, you've probably seen the letters
          "YTD" next to several numbers. YTD stands for <strong>year-to-date</strong> — and
          understanding it is one of the easiest ways to stay on top of your taxes and earnings.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What Does YTD Mean?</h2>
          <p className="leading-relaxed">
            YTD (year-to-date) is the cumulative total of a value from <strong>January 1st of the
            current calendar year through your most recent pay period</strong>. Instead of showing
            just what you earned this paycheck, a YTD figure shows everything you've earned (or had
            withheld) so far this year. On January 1st, all YTD values reset to zero and start over.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Common YTD Figures on Your Pay Stub</h2>
          <div className="space-y-3">
            {[
              { title: 'YTD Gross Pay', desc: 'Your total earnings before any taxes or deductions, added up for the year so far.' },
              { title: 'YTD Federal Tax', desc: 'Total federal income tax withheld from your paychecks this year.' },
              { title: 'YTD Social Security & Medicare', desc: 'Total FICA contributions so far. Social Security stops once your YTD gross passes the $184,500 wage base in 2026.' },
              { title: 'YTD State Tax', desc: 'Total state income tax withheld this year (if your state has income tax).' },
              { title: 'YTD Deductions', desc: 'Cumulative pre-tax and post-tax deductions such as health insurance and 401(k) contributions.' },
              { title: 'YTD Net Pay', desc: 'Your total take-home pay for the year so far.' },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-1">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why YTD Numbers Matter</h2>
          <ul className="space-y-2 list-disc list-inside text-gray-600">
            <li><strong>Verify your W-2:</strong> Your final YTD figures for the year should match the boxes on your W-2.</li>
            <li><strong>Track contribution limits:</strong> YTD 401(k) and HSA totals help you stay under (or hit) annual limits.</li>
            <li><strong>Watch the Social Security cap:</strong> Once YTD gross passes $184,500 in 2026, Social Security withholding stops.</li>
            <li><strong>Catch payroll errors early:</strong> Comparing YTD across pay stubs makes inconsistencies easy to spot.</li>
          </ul>
        </section>

        <ToolCTA
          to="/"
          title="See Your YTD Totals on a Pay Stub"
          desc="Our free pay stub generator fills in YTD gross, taxes, and net pay automatically. Need several months at once? Use the multiple pay stubs generator."
          label="Create Free Pay Stub →"
        />

        <RelatedGuides items={[
          { to: '/multiple-paystubs', label: 'Generate Multiple Pay Stubs with YTD Totals' },
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/guides/what-is-fica-tax', label: 'What Is FICA Tax? Social Security & Medicare' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
