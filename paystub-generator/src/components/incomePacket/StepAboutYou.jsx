import { useState } from 'react'
import { OCCUPATIONS, BUSINESS_TYPES, VERIFICATION_PERIODS } from '../../data/incomePacketPresets'

export default function StepAboutYou({ value, onChange, onNext }) {
  const [touched, setTouched] = useState(false)

  const set = (key, val) => onChange({ ...value, [key]: val })

  const needsOtherText = value.occupation === 'other'
  const isValid =
    value.name.trim().length > 0 &&
    value.occupation.length > 0 &&
    (!needsOtherText || value.occupationOther.trim().length > 0)

  const inputClass = "w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"
  const errorClass = "text-xs text-red-500 mt-1"

  const handleNext = () => {
    setTouched(true)
    if (isValid) onNext()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200/80 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">👤 About You</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input type="text" value={value.name} onChange={e => set('name', e.target.value)}
              placeholder="Jamie Rivera" className={inputClass} />
            {touched && !value.name.trim() && <p className={errorClass}>Name is required.</p>}
          </div>

          <div>
            <label className={labelClass}>Occupation *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OCCUPATIONS.map(o => (
                <button key={o.value} type="button" onClick={() => set('occupation', o.value)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all text-left ${
                    value.occupation === o.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>
            {touched && !value.occupation && <p className={errorClass}>Please select an occupation.</p>}
          </div>

          {needsOtherText && (
            <div>
              <label className={labelClass}>Please specify *</label>
              <input type="text" value={value.occupationOther} onChange={e => set('occupationOther', e.target.value)}
                placeholder="e.g. Independent Photographer" className={inputClass} />
              {touched && !value.occupationOther.trim() && <p className={errorClass}>Please describe your occupation.</p>}
            </div>
          )}

          <div>
            <label className={labelClass}>Business Type</label>
            <div className="grid grid-cols-2 gap-2">
              {BUSINESS_TYPES.map(b => (
                <button key={b.value} type="button" onClick={() => set('businessType', b.value)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                    value.businessType === b.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}>
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={labelClass}>Verification Period</label>
            <p className="text-xs text-gray-400 mb-2">How many recent months of income do you need to show?</p>
            <div className="grid grid-cols-3 gap-2">
              {VERIFICATION_PERIODS.map(p => (
                <button key={p.value} type="button" onClick={() => set('period', p.value)}
                  className={`py-2.5 px-3 rounded-lg text-sm font-medium border transition-all ${
                    value.period === p.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleNext}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
        Continue: Income →
      </button>
    </div>
  )
}
