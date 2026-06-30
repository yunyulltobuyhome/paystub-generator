export default function PayStubVsW2() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          Pay Stub vs W-2: What's the Difference?
        </h1>
        <p className="text-sm text-gray-400">Updated June 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Both pay stubs and W-2 forms relate to your earnings and taxes — but they serve
          very different purposes and are issued at different times. Confusing them can
          lead to tax filing errors. Here's exactly what each document is and when you need it.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Quick Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Feature</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Pay Stub</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">W-2 Form</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['When issued', 'Each pay period', 'Once per year (by Jan 31)'],
                  ['Issued by', 'Employer (payroll system)', 'Employer (required by IRS)'],
                  ['Period covered', 'Single pay period + YTD', 'Full calendar year'],
                  ['Used for', 'Record-keeping, proof of income', 'Filing federal & state tax returns'],
                  ['Filed with IRS', 'No', 'Yes (employer files copy)'],
                  ['Official document', 'Varies by employer', 'Yes — IRS-required'],
                  ['Contains', 'Gross pay, deductions, net pay', 'Annual wages & tax withheld'],
                ].map(([feat, stub, w2], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{feat}</td>
                    <td className="p-2 border border-gray-200">{stub}</td>
                    <td className="p-2 border border-gray-200">{w2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What is a Pay Stub?</h2>
          <p className="leading-relaxed">
            A pay stub is a document issued with each paycheck that shows your earnings and
            deductions for that specific pay period. Most employers provide pay stubs digitally
            through a payroll portal, though some still issue paper stubs. Pay stubs show:
          </p>
          <ul className="mt-2 ml-4 space-y-1 list-disc text-gray-600">
            <li>Gross pay for the period</li>
            <li>Federal, state, and FICA tax withholding</li>
            <li>Pre-tax deductions (health insurance, 401k)</li>
            <li>Net take-home pay</li>
            <li>Year-to-date running totals</li>
          </ul>
          <p className="mt-3 leading-relaxed">
            Pay stubs are commonly used as proof of income for rental applications, mortgage
            pre-approvals, loan applications, and personal financial planning.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What is a W-2?</h2>
          <p className="leading-relaxed">
            A W-2 (Wage and Tax Statement) is an official IRS tax form that your employer
            must provide by January 31st each year. It summarises your entire year of earnings
            and tax withholding and is required to file your federal and state income tax returns.
            Your employer also sends a copy directly to the IRS and your state tax authority.
          </p>
          <p className="mt-3 leading-relaxed">
            Key W-2 boxes include: Box 1 (taxable wages), Box 2 (federal tax withheld),
            Boxes 3–6 (Social Security and Medicare wages and taxes), and Box 16–17 (state wages and tax).
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why Your Pay Stub and W-2 Might Not Match Exactly</h2>
          <p className="leading-relaxed mb-2">
            It's common to see differences between your last pay stub's YTD figures and
            your W-2. Common reasons include:
          </p>
          <ul className="ml-4 space-y-2 list-disc text-gray-600">
            <li><strong>Pre-tax deductions:</strong> 401(k), health insurance, and FSA contributions reduce your W-2 Box 1 wages but appear in your gross pay on your pay stub</li>
            <li><strong>Imputed income:</strong> Some employer benefits (like certain life insurance) are added to W-2 wages but don't appear on pay stubs</li>
            <li><strong>Rounding:</strong> Minor differences due to per-period rounding</li>
            <li><strong>Corrections:</strong> Any mid-year payroll corrections your employer made</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What If You Don't Have a Pay Stub?</h2>
          <p className="leading-relaxed">
            If you're self-employed, a freelancer, or your employer doesn't provide pay stubs,
            you can generate your own pay stub for personal record-keeping using a tool like
            MyFreePayStub. This can be useful for tracking your income, estimating your taxes,
            or providing income documentation for non-official purposes.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Note: A self-generated pay stub is not a substitute for a W-2 or an officially
            issued pay stub from a licensed payroll provider.
          </p>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
          <p className="font-bold text-blue-800 mb-1">Generate a Pay Stub for Free</p>
          <p className="text-blue-700 text-xs mb-3">
            Need a pay stub for record-keeping? Our free generator creates professional
            pay stubs with automatic 2026 tax calculations — no sign-up required.
          </p>
          <a href="/" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Free Pay Stub →
          </a>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This article is for informational purposes only and does not constitute
          tax or legal advice. Consult a qualified tax professional for guidance specific
          to your situation.
        </div>
      </div>
    </div>
  )
}