import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { SALARY_AMOUNTS, salarySlug, salaryConversions } from '../../data/salaryAmounts'

const fmt2 = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function SalaryHub() {
  usePageMeta({
    title: 'Salary After Tax & Hourly Conversions (2026) | MyFreePayStub',
    description: 'See how much common salaries are per hour and after taxes in every US state for 2026 — from $30,000 to $150,000 a year, with full monthly, weekly, and biweekly breakdowns.',
    canonicalPath: '/salary',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Salary After Tax &amp; Per Hour</h1>
      <p className="text-sm text-gray-400 mb-8">
        Pick a salary to see its hourly rate and 2026 take-home pay in all 50 states — plus weekly,
        biweekly, and monthly breakdowns.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {SALARY_AMOUNTS.map((a) => {
          const c = salaryConversions(a)
          return (
            <Link key={a} to={`/salary/${salarySlug(a)}`}
              className="flex flex-col bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600">${a.toLocaleString('en-US')}/yr</span>
              <span className="text-xs text-gray-400">{fmt2(c.hourly)}/hr</span>
            </Link>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-8">
        <p className="font-bold text-blue-800 mb-1">Need your exact paycheck?</p>
        <p className="text-blue-700 text-xs mb-3">
          Enter your salary, state, and deductions in our free 2026 paycheck calculator.
        </p>
        <Link to="/paycheck-calculator" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Open Paycheck Calculator →
        </Link>
      </div>
    </div>
  )
}
