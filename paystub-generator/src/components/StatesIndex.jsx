import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { STATE_LIST } from '../utils/states'

export default function StatesIndex() {
  usePageMeta({
    title: 'Pay Stub & Paycheck Tax Guides for All 50 States (2026) | MyFreePayStub',
    description: 'State-by-state paycheck tax guides for 2026 — find your state\'s income tax rate, take-home pay examples, and pay stub requirements, then create a free pay stub.',
    canonicalPath: '/states',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 mb-2">Pay Stub Guides by State (2026)</h1>
      <p className="text-sm text-gray-400 mb-8">
        Pick your state to see its income tax rate, a take-home pay example, and pay stub
        requirements — then generate a free pay stub with the right taxes applied.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {STATE_LIST.map((s) => (
          <Link key={s.code} to={`/pay-stub/${s.slug}`}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50 transition-all group">
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{s.name}</span>
            <span className="text-xs text-gray-400">{s.rate > 0 ? `${(s.rate * 100).toFixed(1)}%` : 'No tax'}</span>
          </Link>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-8">
        <p className="font-bold text-blue-800 mb-1">Create a Pay Stub for Any State</p>
        <p className="text-blue-700 text-xs mb-3">
          Our free generator applies 2026 federal, state, and FICA taxes automatically for all 50 states.
        </p>
        <Link to="/" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Create Free Pay Stub →
        </Link>
      </div>
    </div>
  )
}
