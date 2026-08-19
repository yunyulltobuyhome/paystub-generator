import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

export default function OvertimeCalc() {
  usePageMeta({
    title: 'Overtime Pay Calculator 2026 — Time-and-a-Half & Double Time | MyFreePayStub',
    description: 'Free overtime pay calculator. Work out time-and-a-half (1.5×) or double-time (2×) pay from your hourly rate and overtime hours, with weekly and annual totals. 2026 FLSA rules.',
    canonicalPath: '/overtime-calculator',
  })

  const [rate, setRate] = useState('')
  const [regHours, setRegHours] = useState('40')
  const [otHours, setOtHours] = useState('')
  const [multiplier, setMultiplier] = useState('1.5')
  const [result, setResult] = useState(null)

  const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calculate = () => {
    const r = parseFloat(rate) || 0
    const reg = parseFloat(regHours) || 0
    const ot = parseFloat(otHours) || 0
    const mult = parseFloat(multiplier) || 1.5
    if (r <= 0) return
    const regularPay = r * reg
    const otRate = r * mult
    const otPay = otRate * ot
    const weekly = regularPay + otPay
    setResult({
      regularPay, otRate, otPay, weekly,
      annual: weekly * 52,
      ot, mult,
    })
  }

  const inputClass = "w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Overtime Pay Calculator 2026",
        "url": "https://myfreepaystub.com/overtime-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free overtime pay calculator for time-and-a-half and double-time pay, with weekly and annual totals."
      })}} />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Overtime Pay Calculator 2026</h1>
        <p className="text-sm text-gray-500">
          Calculate your time-and-a-half (1.5×) or double-time (2×) overtime pay, plus weekly and annual totals.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-4">
        <div>
          <label className={labelClass}>Hourly Rate</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" step="0.01" value={rate} onChange={e => setRate(e.target.value)} placeholder="25.00" className={`${inputClass} pl-7`} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Regular Hours / Week</label>
            <input type="number" value={regHours} onChange={e => setRegHours(e.target.value)} placeholder="40" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Overtime Hours / Week</label>
            <input type="number" value={otHours} onChange={e => setOtHours(e.target.value)} placeholder="10" className={inputClass} />
          </div>
        </div>
        <div>
          <label className={labelClass}>Overtime Multiplier</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ v: '1.5', l: 'Time-and-a-Half (1.5×)' }, { v: '2', l: 'Double Time (2×)' }].map(opt => (
              <button key={opt.v} onClick={() => setMultiplier(opt.v)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  multiplier === opt.v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.l}
              </button>
            ))}
          </div>
        </div>
        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate Overtime Pay
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Total Weekly Pay</p>
            <p className="text-4xl font-extrabold text-blue-700">{fmt(result.weekly)}</p>
            <p className="text-xs text-gray-400 mt-1">≈ {fmt(result.annual)} per year (× 52 weeks)</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Regular pay', result.regularPay],
                [`Overtime rate (${result.mult}×)`, result.otRate],
                [`Overtime pay (${result.ot} hrs)`, result.otPay],
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold">{fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-extrabold text-gray-800">
                <span>Total weekly pay</span>
                <span>{fmt(result.weekly)}</span>
              </div>
            </div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ This shows gross pay before taxes. For take-home pay after federal and state taxes, use our{' '}
            <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>,
            or create a full <a href="/" className="underline font-semibold">pay stub</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="overtime-calculator" title="Overtime Pay Calculator" height="640" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How Is Overtime Pay Calculated?</h2>
          <p className="leading-relaxed">
            Under the federal Fair Labor Standards Act (FLSA), most non-exempt employees must be paid
            at least <strong>1.5× their regular hourly rate</strong> for hours worked over 40 in a
            workweek. For example, a worker earning $25/hour is paid $37.50/hour for overtime. Some
            employers or states offer <strong>double time (2×)</strong> for holidays or very long shifts.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Overtime Pay Examples (Time-and-a-Half)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Hourly Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">OT Rate (1.5×)</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">10 OT Hours</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['$15/hr', '$22.50', '$225'],
                  ['$20/hr', '$30.00', '$300'],
                  ['$25/hr', '$37.50', '$375'],
                  ['$30/hr', '$45.00', '$450'],
                  ['$40/hr', '$60.00', '$600'],
                ].map(([a, b, c], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{a}</td>
                    <td className="p-2 border border-gray-200 text-blue-600 font-semibold">{b}</td>
                    <td className="p-2 border border-gray-200">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What is time-and-a-half?', a: 'Time-and-a-half means 1.5 times your regular hourly rate, the federal minimum overtime rate for non-exempt employees working over 40 hours per week.' },
              { q: 'Who is entitled to overtime pay?', a: 'Most hourly (non-exempt) employees are. Certain salaried executive, administrative, and professional employees who meet the FLSA salary and duties tests are exempt.' },
              { q: 'Is overtime taxed differently?', a: 'No. Overtime is taxed like regular wages; it can feel higher because the extra income may fall in a higher withholding bracket for that pay period, but the tax rate itself is the same.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/overtime-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This calculator is for estimation only and does not constitute legal or payroll advice.
          Overtime rules vary by state, industry, and job classification. See the{' '}
          <a href="https://www.dol.gov/agencies/whd/overtime" target="_blank" rel="noopener noreferrer" className="underline">US Department of Labor</a>{' '}
          or read our <a href="/guides/how-to-calculate-overtime" className="underline">overtime guide</a>.
        </div>
      </div>
    </div>
  )
}
