import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { HOURLY_WAGES, hourlyWageSlug, hourlyConversions } from '../../data/hourlyWages'

const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')

export default function HourlyWageHub() {
  usePageMeta({
    title: 'Hourly Wage to Yearly Salary — After-Tax Charts (2026) | MyFreePayStub',
    description: 'See what common hourly wages add up to per year — before and after taxes in every US state for 2026 — from $10 to $100 an hour, with weekly, biweekly, and monthly breakdowns.',
    canonicalPath: '/hourly',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">$X an Hour Is How Much a Year?</h1>
      <p className="text-sm text-gray-400 mb-8">
        Pick an hourly wage to see its yearly, monthly, and weekly pay — plus 2026 take-home
        after taxes in all 50 states, and what it comes to at part-time hours.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {HOURLY_WAGES.map((r) => {
          const c = hourlyConversions(r)
          return (
            <Link key={r} to={`/hourly/${hourlyWageSlug(r)}`}
              className="flex flex-col bg-white border border-gray-200 rounded-xl px-3 py-3 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600">${r}/hr</span>
              <span className="text-xs text-gray-400">{fmt0(c.annual)}/yr</span>
            </Link>
          )
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-8">
        <p className="font-bold text-blue-800 mb-1">Want your exact take-home pay?</p>
        <p className="text-blue-700 text-xs mb-3">
          Enter your wage, hours, state, and deductions in our free 2026 paycheck calculator.
        </p>
        <Link to="/paycheck-calculator" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Open Paycheck Calculator →
        </Link>
      </div>
    </div>
  )
}
