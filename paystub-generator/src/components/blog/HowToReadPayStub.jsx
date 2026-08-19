import { usePageMeta } from '../../hooks/usePageMeta'
import { ArticleJsonLd, ArticleByline, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'

const FAQ = [
  { q: 'What does YTD mean on a pay stub?', a: 'YTD (year-to-date) totals show your cumulative gross pay, taxes, and deductions from January 1st through the current pay period. They are essential for verifying your W-2 at tax time.' },
  { q: 'What is the difference between gross pay and net pay?', a: 'Gross pay is your total earnings before any deductions. Net pay is your take-home amount after federal, state, and FICA taxes plus any pre-tax deductions are subtracted.' },
  { q: 'Why is Social Security not on my later pay stubs?', a: 'Social Security tax (6.2%) only applies up to the annual wage base ($184,500 in 2026). Once your year-to-date earnings exceed it, Social Security withholding stops for the rest of the year.' },
]

export default function HowToReadPayStub() {
  usePageMeta({
    title: 'How to Read Your Pay Stub: A Complete 2026 Guide | MyFreePayStub',
    description: 'Understand every line on your pay stub — gross pay, federal & state tax, Social Security, Medicare, pre-tax deductions, net pay, and YTD totals — explained for 2026.',
    canonicalPath: '/guides/how-to-read-your-pay-stub',
  })
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="How to Read Your Pay Stub: A Complete Guide (2026)"
        description="Understand every line on your pay stub — gross pay, federal & state tax, FICA, deductions, net pay, and YTD totals."
        slug="/guides/how-to-read-your-pay-stub"
        faq={FAQ}
      />

      <ArticleByline slug="/guides/how-to-read-your-pay-stub" />
      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          How to Read Your Pay Stub: A Complete Guide (2026)
        </h1>
        <p className="text-sm text-gray-400">5 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Most people glance at the "Net Pay" number on their pay stub and move on.
          But understanding every line on your pay stub can help you catch errors,
          plan your taxes, and make better financial decisions.
          Here's what every section means.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What is a Pay Stub?</h2>
          <p className="leading-relaxed">
            A pay stub (also called a paycheck stub, payslip, or earnings statement) is a document
            that shows the breakdown of your earnings and deductions for a specific pay period.
            It accompanies your paycheck or direct deposit and serves as a record of how your
            gross pay became your take-home pay.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The Key Sections of a Pay Stub</h2>

          <div className="space-y-4">
            {[
              {
                title: '1. Gross Pay',
                color: 'bg-blue-50 border-blue-200',
                titleColor: 'text-blue-700',
                desc: 'Your total earnings before any deductions. For salaried employees, this is your annual salary divided by the number of pay periods per year. For hourly workers, it\'s your hourly rate multiplied by hours worked. Gross pay is the starting point for all tax calculations.',
              },
              {
                title: '2. Federal Income Tax',
                color: 'bg-orange-50 border-orange-200',
                titleColor: 'text-orange-700',
                desc: 'The amount withheld for US federal income tax, based on your filing status (single, married, head of household) and the 2026 IRS tax brackets (10%–37%). This is calculated on your taxable income, which is your gross pay minus pre-tax deductions.',
              },
              {
                title: '3. Social Security Tax (FICA)',
                color: 'bg-orange-50 border-orange-200',
                titleColor: 'text-orange-700',
                desc: 'A flat 6.2% of your gross wages, up to the 2026 Social Security wage base of $184,500. Once your year-to-date earnings exceed $184,500, Social Security withholding stops for the rest of the year.',
              },
              {
                title: '4. Medicare Tax (FICA)',
                color: 'bg-orange-50 border-orange-200',
                titleColor: 'text-orange-700',
                desc: 'A flat 1.45% of all gross wages with no upper limit. High earners (over $200,000 for single filers) pay an additional 0.9% Additional Medicare Tax, which is also reflected here.',
              },
              {
                title: '5. State Income Tax',
                color: 'bg-orange-50 border-orange-200',
                titleColor: 'text-orange-700',
                desc: 'Withheld based on your work state\'s tax rate. Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. Other states range from 2.5% (Arizona) to 13.3% (California top rate).',
              },
              {
                title: '6. Pre-Tax Deductions',
                color: 'bg-green-50 border-green-200',
                titleColor: 'text-green-700',
                desc: 'Deductions taken before taxes are calculated. These reduce your taxable income, meaning you pay less federal and state tax. Common pre-tax deductions include: health insurance premiums, dental and vision insurance, 401(k) contributions, HSA contributions, and FSA contributions.',
              },
              {
                title: '7. Net Pay',
                color: 'bg-green-50 border-green-200',
                titleColor: 'text-green-700',
                desc: 'Your take-home pay — what actually lands in your bank account. Calculated as: Gross Pay − All Taxes − All Deductions = Net Pay. This is the number most people focus on, but understanding the deductions above helps you verify it\'s correct.',
              },
              {
                title: '8. Year-to-Date (YTD) Totals',
                color: 'bg-gray-50 border-gray-200',
                titleColor: 'text-gray-700',
                desc: 'Running totals of your gross pay, taxes, and deductions from January 1st through the current pay period. YTD figures are essential for verifying your W-2 at tax time and tracking your progress toward tax deductions and contribution limits.',
              },
            ].map((item) => (
              <div key={item.title} className={`rounded-xl border p-4 ${item.color}`}>
                <h3 className={`font-bold mb-2 ${item.titleColor}`}>{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How to Check Your Pay Stub for Errors</h2>
          <ol className="space-y-2 list-decimal list-inside text-gray-600">
            <li>Verify your filing status matches your W-4 on file with your employer</li>
            <li>Check that your gross pay matches your agreed salary or hours × rate</li>
            <li>Confirm Social Security stops being withheld after your YTD exceeds $184,500</li>
            <li>Verify your health insurance and 401(k) deductions match your enrollment elections</li>
            <li>Compare YTD totals with previous pay stubs to spot inconsistencies</li>
          </ol>
          <p className="mt-3 text-gray-500">
            If you spot an error, contact your HR or payroll department promptly. Payroll errors
            are more common than people think and are usually corrected in the next pay period.
          </p>
        </section>

        <ToolCTA
          to="/"
          title="Generate Your Own Pay Stub"
          desc="Need a pay stub for record-keeping? Our free generator calculates all the above automatically using 2026 IRS tax tables and your state's rates."
          label="Create Free Pay Stub →"
        />

        <RelatedGuides items={[
          { to: '/guides/what-is-ytd-on-a-paycheck', label: 'What Is YTD on a Paycheck?' },
          { to: '/guides/what-is-fica-tax', label: 'What Is FICA Tax? Social Security & Medicare Explained' },
          { to: '/guides/how-many-pay-stubs-for-apartment', label: 'How Many Pay Stubs Do You Need to Rent an Apartment?' },
          { to: '/paycheck-calculator', label: 'Paycheck Calculator — estimate your take-home pay' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}