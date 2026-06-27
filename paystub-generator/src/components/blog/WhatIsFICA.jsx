export default function WhatIsFICA() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          What is FICA Tax? Social Security & Medicare Explained (2026)
        </h1>
        <p className="text-sm text-gray-400">Updated June 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          If you look at your pay stub, you'll see two deductions labeled "Social Security"
          and "Medicare." Together, these make up FICA — one of the most misunderstood
          deductions on your paycheck. Here's exactly what FICA is, how it's calculated,
          and what you get in return.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What Does FICA Stand For?</h2>
          <p className="leading-relaxed">
            FICA stands for the <strong>Federal Insurance Contributions Act</strong>, a US federal
            law that requires employees and employers to contribute to two programs:
            Social Security and Medicare. These programs provide retirement benefits, disability
            insurance, and healthcare coverage for qualifying Americans.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">2026 FICA Tax Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Tax</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Employee Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Employer Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Wage Limit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Social Security', '6.2%', '6.2%', '$184,500 (2026)'],
                  ['Medicare', '1.45%', '1.45%', 'No limit'],
                  ['Additional Medicare', '0.9%', 'N/A (employee only)', 'Above $200,000'],
                  ['Total FICA (most workers)', '7.65%', '7.65%', 'Up to SS limit'],
                ].map(([tax, emp, er, limit], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{tax}</td>
                    <td className="p-2 border border-gray-200 text-blue-600 font-semibold">{emp}</td>
                    <td className="p-2 border border-gray-200">{er}</td>
                    <td className="p-2 border border-gray-200">{limit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">Source: IRS Topic No. 751. Rates effective January 1, 2026.</p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How FICA is Calculated</h2>
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="font-semibold text-gray-700">Example: $5,000 biweekly gross pay</p>
            {[
              ['Social Security (6.2%)', '$5,000 × 6.2%', '$310.00'],
              ['Medicare (1.45%)', '$5,000 × 1.45%', '$72.50'],
              ['Total FICA withheld', '', '$382.50'],
              ['Employer also pays', '$310 + $72.50', '$382.50'],
            ].map(([label, calc, result], i) => (
              <div key={i} className={`flex justify-between text-xs ${i === 2 ? 'font-bold border-t border-gray-200 pt-2' : ''}`}>
                <span className="text-gray-600">{label}</span>
                <span className="text-gray-400">{calc}</span>
                <span className="font-semibold">{result}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The Social Security Wage Base ($184,500 in 2026)</h2>
          <p className="leading-relaxed">
            Social Security tax only applies to wages up to the annual wage base — $184,500 in 2026.
            Once your year-to-date earnings exceed this amount, Social Security withholding stops
            for the rest of the calendar year. Medicare has no wage base limit.
          </p>
          <p className="leading-relaxed mt-2">
            High earners (over $200,000 for single filers, $250,000 for married filing jointly)
            also pay an Additional Medicare Tax of 0.9% on wages above those thresholds.
            Unlike regular FICA, employers do not match this additional tax.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What Do You Get For Your FICA Contributions?</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { title: '🧓 Social Security', items: ['Retirement benefits from age 62', 'Disability insurance (SSDI)', 'Survivors benefits for family', 'Requires 40 work credits (10 years)'] },
              { title: '🏥 Medicare', items: ['Hospital insurance from age 65 (Part A)', 'Medical insurance (Part B)', 'Prescription drug coverage (Part D)', 'Also covers some disabled workers under 65'] },
            ].map(({ title, items }) => (
              <div key={title} className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="font-bold text-blue-800 mb-2">{title}</p>
                <ul className="space-y-1 text-xs text-blue-700">
                  {items.map((item, i) => <li key={i}>• {item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">FICA for Self-Employed Workers</h2>
          <p className="leading-relaxed">
            If you're self-employed, you pay <strong>both the employee and employer portions</strong>
            of FICA — a total of 15.3% (12.4% Social Security + 2.9% Medicare) on net self-employment
            income. This is called the Self-Employment Tax. However, you can deduct half of your
            self-employment tax from your gross income on your federal tax return.
          </p>
        </section>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
          <p className="font-bold text-blue-800 mb-1">See FICA on Your Pay Stub</p>
          <p className="text-blue-700 text-xs mb-3">
            Generate a free pay stub to see exactly how Social Security and Medicare are
            calculated for your salary and state.
          </p>
          <a href="/" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Free Pay Stub →
          </a>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This article is for general informational purposes only. Tax rules change annually.
          Always verify current rates at <a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer"
          className="underline">irs.gov</a> or consult a qualified tax professional.
        </div>
      </div>
    </div>
  )
}