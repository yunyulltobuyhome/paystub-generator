export default function HowToReadPayStub() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          How to Read Your Pay Stub: A Complete Guide (2026)
        </h1>
        <p className="text-sm text-gray-400">Updated June 2026 · 5 min read</p>
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

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
          <p className="font-bold text-blue-800 mb-1">Generate Your Own Pay Stub</p>
          <p className="text-blue-700 text-xs mb-3">
            Need a pay stub for record-keeping? Our free generator calculates all the above
            automatically using 2026 IRS tax tables and your state's rates.
          </p>
          <a href="/" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Free Pay Stub →
          </a>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This guide is for informational purposes only and does not constitute tax or legal advice.
          Tax rules are complex and vary by individual situation. Always consult a qualified tax
          professional or CPA for personalised tax guidance.
        </div>
      </div>
    </div>
  )
}