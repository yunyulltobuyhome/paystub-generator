import { useEffect, useState } from 'react'
import { getRecentMonths } from '../../utils/incomePacketDates'
import { PAYMENT_TYPES } from '../../data/incomePacketPresets'
import { LARGE_VALUE_WARNING_THRESHOLD } from '../../config/incomePacket'

let sourceIdCounter = 0
const nextSourceId = () => `src-${++sourceIdCounter}`

const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function StepIncome({ value, period, onChange, onNext, onBack }) {
  const [touched, setTouched] = useState(false)

  // Keep the monthly grid in sync with the period chosen in Step 1, preserving
  // any amounts already entered for months that are still in range.
  useEffect(() => {
    const expected = getRecentMonths(period)
    const currentKeys = value.monthly.map(m => m.key).join(',')
    const expectedKeys = expected.map(m => m.key).join(',')
    if (currentKeys !== expectedKeys) {
      const byKey = Object.fromEntries(value.monthly.map(m => [m.key, m.amount]))
      onChange({ ...value, monthly: expected.map(m => ({ ...m, amount: byKey[m.key] ?? '' })) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const setMonthAmount = (key, raw) => {
    const cleaned = raw === '' ? '' : String(Math.max(0, parseFloat(raw) || 0))
    onChange({
      ...value,
      monthly: value.monthly.map(m => m.key === key ? { ...m, amount: cleaned } : m),
    })
  }

  const addSource = () => {
    onChange({
      ...value,
      sources: [...value.sources, { id: nextSourceId(), clientName: '', amount: '', paymentType: '1099-NEC' }],
    })
  }
  const updateSource = (id, key, val) => {
    onChange({ ...value, sources: value.sources.map(s => s.id === id ? { ...s, [key]: val } : s) })
  }
  const removeSource = (id) => {
    onChange({ ...value, sources: value.sources.filter(s => s.id !== id) })
  }

  const monthlyTotal = value.monthly.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)
  const sourcesTotal = value.sources.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0)
  const isValid = monthlyTotal > 0

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"

  const handleNext = () => {
    setTouched(true)
    if (isValid) onNext()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">💵 Monthly Income</h2>
          <span className="text-xs text-gray-400">{value.monthly.length} months</span>
        </div>
        <div className="space-y-2">
          {value.monthly.map((m) => {
            const isLarge = parseFloat(m.amount) > LARGE_VALUE_WARNING_THRESHOLD
            return (
              <div key={m.key}>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-32 shrink-0">{m.label}</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input type="number" min="0" value={m.amount}
                      onChange={e => setMonthAmount(m.key, e.target.value)}
                      placeholder="0.00" className={`${inputClass} pl-7`} />
                  </div>
                </div>
                {isLarge && (
                  <p className="text-xs text-amber-600 mt-1 ml-[8.75rem]">
                    ⚠️ That's unusually high — double-check this amount.
                  </p>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
          <span className="text-sm font-semibold text-gray-700">Total ({value.monthly.length} months)</span>
          <span className="text-lg font-extrabold text-blue-700">{fmt(monthlyTotal)}</span>
        </div>
        {touched && !isValid && (
          <p className="text-xs text-red-500 mt-2">Enter at least one month of income to continue.</p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-base font-bold text-gray-800">📋 Income Sources</h2>
          <span className="text-xs text-gray-400 font-normal">Optional</span>
        </div>
        <p className="text-xs text-gray-400 mb-4">Clients, platforms, or payers you received this income from.</p>

        <div className="space-y-3">
          {value.sources.map((s) => (
            <div key={s.id} className="grid grid-cols-12 gap-2 items-center">
              <input value={s.clientName} onChange={e => updateSource(s.id, 'clientName', e.target.value)}
                placeholder="Client or platform name" className={`${inputClass} col-span-12 sm:col-span-5`} />
              <div className="relative col-span-6 sm:col-span-3">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                <input type="number" min="0" value={s.amount}
                  onChange={e => updateSource(s.id, 'amount', e.target.value === '' ? '' : String(Math.max(0, parseFloat(e.target.value) || 0)))}
                  placeholder="0.00" className={`${inputClass} pl-7`} />
              </div>
              <select value={s.paymentType} onChange={e => updateSource(s.id, 'paymentType', e.target.value)}
                className={`${inputClass} col-span-5 sm:col-span-3`}>
                {PAYMENT_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <button onClick={() => removeSource(s.id)} className="col-span-1 text-gray-300 hover:text-red-500 text-lg" title="Remove">×</button>
            </div>
          ))}
        </div>

        <button onClick={addSource} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">
          + Add Income Source
        </button>

        {value.sources.length > 0 && Math.abs(sourcesTotal - monthlyTotal) > 0.5 && (
          <p className="text-xs text-gray-400 mt-4 bg-gray-50 rounded-lg p-3">
            ℹ️ Your income sources total ({fmt(sourcesTotal)}) differs from your monthly income total ({fmt(monthlyTotal)}).
            That's OK — sources are just for reference in your packet.
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
          ← Back
        </button>
        <button onClick={handleNext}
          className="flex-[2] py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Continue: Expenses →
        </button>
      </div>
    </div>
  )
}
