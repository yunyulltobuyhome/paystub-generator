import { EXPENSE_CATEGORIES } from '../../data/incomePacketPresets'

const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function StepExpenses({ value, onChange, onNext, onBack }) {
  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"

  const setCategory = (key, raw) => {
    const cleaned = raw === '' ? '' : String(Math.max(0, parseFloat(raw) || 0))
    onChange({ ...value, skipped: false, categories: { ...value.categories, [key]: cleaned } })
  }

  const total = EXPENSE_CATEGORIES.reduce((sum, c) => sum + (parseFloat(value.categories[c.key]) || 0), 0)

  const handleSkip = () => {
    onChange({ ...value, skipped: true })
    onNext()
  }

  const handleContinue = () => {
    onChange({ ...value, skipped: total === 0 })
    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-gray-800">🧾 Business Expenses</h2>
          <span className="text-xs text-gray-400 font-normal">Optional</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">
          Add this if you'd like a profit &amp; loss statement included in your packet. Skip if you only need an income summary.
        </p>

        <div className="space-y-2">
          {EXPENSE_CATEGORIES.map((c) => (
            <div key={c.key} className="flex items-center gap-3">
              <span className="text-sm text-gray-600 w-40 shrink-0">{c.label}</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input type="number" min="0" value={value.categories[c.key] ?? ''}
                  onChange={e => setCategory(c.key, e.target.value)}
                  placeholder="0.00" className={`${inputClass} pl-7`} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Total Expenses</span>
          <span className="text-lg font-black text-gray-800">{fmt(total)}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
          ← Back
        </button>
        {total === 0 ? (
          <button onClick={handleSkip}
            className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
            Skip: Preview →
          </button>
        ) : (
          <button onClick={handleContinue}
            className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
            Continue: Preview →
          </button>
        )}
      </div>
    </div>
  )
}
