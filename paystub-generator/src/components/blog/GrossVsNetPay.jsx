import { usePageMeta } from '../../hooks/usePageMeta'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'

const FAQ = [
  { q: 'What is the difference between gross pay and net pay?', a: 'Gross pay is your total earnings before any deductions. Net pay (take-home pay) is what remains after taxes and deductions are subtracted — the amount deposited into your bank account.' },
  { q: 'Why is my net pay so much lower than my gross pay?', a: 'Federal income tax, state income tax, Social Security (6.2%), Medicare (1.45%), and any pre-tax deductions like health insurance and 401(k) all come out of gross pay, which can reduce it by 20–35% or more.' },
  { q: 'Is gross or net pay used for renting an apartment?', a: 'Landlords usually look at gross monthly income (often requiring about 3× the rent), but they verify it using pay stubs that show both gross and net.' },
]

export default function GrossVsNetPay() {
  usePageMeta({
    title: 'Gross Pay vs Net Pay: What\'s the Difference? (2026) | MyFreePayStub',
    description: 'Gross pay is before deductions; net pay is your take-home. Learn how taxes and deductions turn gross into net, with a worked 2026 example.',
    canonicalPath: '/guides/gross-vs-net-pay',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="Gross Pay vs Net Pay: What's the Difference?"
        description="How taxes and deductions turn gross pay into net (take-home) pay, with a 2026 example."
        slug="/guides/gross-vs-net-pay"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          Gross Pay vs Net Pay: What's the Difference?
        </h1>
        <p className="text-sm text-gray-400">Updated June 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Two of the most important numbers on any pay stub are <strong>gross pay</strong> and
          <strong> net pay</strong>. Knowing the difference helps you budget, check your paycheck for
          errors, and answer income questions on loan or rental applications.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Gross Pay</h2>
          <p className="leading-relaxed">
            Gross pay is your <strong>total earnings before any deductions</strong>. For salaried
            employees it's the annual salary divided by the number of pay periods; for hourly workers
            it's hours worked × hourly rate (plus overtime). Gross pay is the figure used to calculate
            your taxes.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Net Pay (Take-Home Pay)</h2>
          <p className="leading-relaxed">
            Net pay is what's left <strong>after all taxes and deductions</strong> — the amount that
            actually lands in your bank account. The formula is simple:
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mt-3 text-center font-semibold text-gray-700">
            Gross Pay − Taxes − Deductions = Net Pay
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Worked Example: $5,000 Gross (Biweekly)</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Gross pay', '$5,000.00', false],
                ['Federal income tax', '(~$540)', true],
                ['Social Security (6.2%)', '($310)', true],
                ['Medicare (1.45%)', '($72.50)', true],
                ['State tax (varies)', '(~$230)', true],
                ['Pre-tax deductions (401k, health)', '(~$300)', true],
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between border-b border-gray-50 py-1.5 ${sub ? 'text-gray-500 text-xs pl-3' : 'text-gray-700'}`}>
                  <span>{label}</span><span className={sub ? 'text-red-500' : 'font-semibold'}>{val}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-black text-emerald-700">
                <span>Net pay (approx.)</span><span>≈ $3,547</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Illustrative single-filer estimate — your actual amounts vary by state and elections.</p>
          </div>
        </section>

        <ToolCTA
          to="/paycheck-calculator"
          title="See Your Own Gross vs Net"
          desc="Enter your salary or hourly rate to see your exact take-home pay after federal, state, and FICA taxes for 2026."
          label="Open Paycheck Calculator →"
        />

        <RelatedGuides items={[
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/guides/pay-stub-abbreviations', label: 'Pay Stub Abbreviations Explained' },
          { to: '/guides/what-is-fica-tax', label: 'What Is FICA Tax?' },
          { to: '/', label: 'Free Pay Stub Generator' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
