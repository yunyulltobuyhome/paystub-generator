export default function HowToCalculateOvertime() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          How to Calculate Overtime Pay (2026 FLSA Rules)
        </h1>
        <p className="text-sm text-gray-400">Updated June 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Under the Fair Labor Standards Act (FLSA), most US employees who work more than
          40 hours in a workweek must be paid overtime at a rate of at least 1.5 times
          their regular pay. Here's how it works, who qualifies, and how to calculate it.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Federal Overtime Rules (FLSA 2026)</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-xs">
            {[
              ['Overtime threshold', 'Over 40 hours per workweek'],
              ['Overtime rate', 'At least 1.5× regular rate ("time and a half")'],
              ['Who is covered', 'Most non-exempt hourly and some salaried workers'],
              ['Exempt salary threshold', '$684/week ($35,568/year) as of 2024 rules'],
              ['Calculated on', 'Workweek basis (7 consecutive days)'],
            ].map(([label, val], i) => (
              <div key={i} className="flex justify-between">
                <span className="text-blue-600 font-semibold">{label}</span>
                <span className="text-blue-800">{val}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Note: Some states have additional overtime rules (e.g., California requires daily
            overtime after 8 hours). Always check your state's labor laws.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How to Calculate Overtime Pay</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-3">Example: Hourly Worker</p>
              <div className="space-y-2 text-xs">
                {[
                  ['Regular hourly rate', '$20.00/hr'],
                  ['Hours worked this week', '48 hours'],
                  ['Regular hours (first 40)', '40 × $20 = $800.00'],
                  ['Overtime hours', '8 hours'],
                  ['Overtime rate (1.5×)', '8 × ($20 × 1.5) = 8 × $30 = $240.00'],
                  ['Total gross pay', '$800 + $240 = $1,040.00'],
                ].map(([label, val], i) => (
                  <div key={i} className={`flex justify-between py-1 ${i === 5 ? 'border-t border-gray-200 pt-2 font-bold' : ''}`}>
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <p className="font-semibold text-gray-700 mb-3">Example: Salaried Non-Exempt Worker</p>
              <div className="space-y-2 text-xs">
                {[
                  ['Weekly salary', '$700/week ($36,400/year)'],
                  ['Regular hours', '40 hours → regular rate = $700 ÷ 40 = $17.50/hr'],
                  ['Hours worked', '50 hours (10 hours overtime)'],
                  ['Regular pay', '$700.00 (salary covers first 40 hours)'],
                  ['Overtime premium (0.5× extra)', '10 × ($17.50 × 0.5) = $87.50'],
                  ['Total gross pay', '$700 + $87.50 = $787.50'],
                ].map(([label, val], i) => (
                  <div key={i} className={`flex justify-between py-1 ${i === 5 ? 'border-t border-gray-200 pt-2 font-bold' : ''}`}>
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Who is Exempt from Overtime?</h2>
          <p className="leading-relaxed mb-2">
            Certain categories of employees are "exempt" from FLSA overtime requirements,
            meaning they are not entitled to overtime pay regardless of hours worked.
            To be exempt, an employee generally must:
          </p>
          <ul className="ml-4 space-y-1 list-disc text-gray-600">
            <li>Be paid on a salary basis (not hourly)</li>
            <li>Earn at least $684/week ($35,568/year)</li>
            <li>Have job duties that qualify under an exemption category</li>
          </ul>
          <p className="leading-relaxed mt-2">
            Common exempt categories include executive, administrative, professional,
            computer employee, and outside sales exemptions. If you believe you're
            misclassified, consult the Department of Labor or an employment attorney.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">State Overtime Laws</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">State</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Daily OT Rule</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Weekly OT Rule</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['California', 'OT after 8 hrs/day; double time after 12 hrs', 'OT after 40 hrs'],
                  ['Nevada', 'OT after 8 hrs/day (if earning under $18.25/hr)', 'OT after 40 hrs'],
                  ['Alaska', 'OT after 8 hrs/day', 'OT after 40 hrs'],
                  ['All other states', 'No daily OT rule', 'OT after 40 hrs (federal FLSA)'],
                ].map(([state, daily, weekly], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{state}</td>
                    <td className="p-2 border border-gray-200">{daily}</td>
                    <td className="p-2 border border-gray-200">{weekly}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            State laws may provide greater protection than federal FLSA. When state and federal
            laws differ, the rule more beneficial to the employee generally applies.
          </p>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
          <p className="font-bold text-blue-800 mb-1">Calculate Your Overtime Pay Stub</p>
          <p className="text-blue-700 text-xs mb-3">
            Our free pay stub generator automatically calculates overtime at 1.5× for
            hourly workers who work over 80 hours in a biweekly period.
          </p>
          <a href="/" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Free Pay Stub →
          </a>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This article summarises general FLSA rules for informational purposes only.
          Overtime laws are complex and vary by state, industry, and employment classification.
          Consult the <a href="https://www.dol.gov/agencies/whd/overtime" target="_blank"
          rel="noopener noreferrer" className="underline">US Department of Labor</a> or
          an employment attorney for guidance specific to your situation.
        </div>
      </div>
    </div>
  )
}