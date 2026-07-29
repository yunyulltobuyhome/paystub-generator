import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const emptyDay = () => ({ in: '', out: '', breakMins: '' })

// Hours between two "HH:MM" strings, handling overnight shifts (out < in).
function shiftHours(inTime, outTime, breakMins) {
  if (!inTime || !outTime) return 0
  const [ih, im] = inTime.split(':').map(Number)
  const [oh, om] = outTime.split(':').map(Number)
  if ([ih, im, oh, om].some((n) => Number.isNaN(n))) return 0
  let mins = (oh * 60 + om) - (ih * 60 + im)
  if (mins < 0) mins += 24 * 60 // overnight shift
  mins -= parseFloat(breakMins) || 0
  return Math.max(0, mins / 60)
}

export default function TimeCardCalc() {
  usePageMeta({
    title: 'Free Time Card Calculator — Weekly Timesheet with Breaks & Overtime (2026)',
    description: 'Free online time card calculator. Add clock in/out times and breaks for each day to get daily hours, weekly totals, overtime, and total pay. Handles overnight shifts. No sign-up.',
    canonicalPath: '/time-card-calculator',
  })

  const [days, setDays] = useState(DAYS.map(emptyDay))
  const [rate, setRate] = useState('')
  const [otAfter, setOtAfter] = useState('40')
  const [otMultiplier, setOtMultiplier] = useState('1.5')

  const setDay = (i, key, val) =>
    setDays((prev) => prev.map((d, idx) => (idx === i ? { ...d, [key]: val } : d)))

  const reset = () => setDays(DAYS.map(emptyDay))

  const fmtH = (n) => Number(n).toFixed(2)
  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const dailyHours = days.map((d) => shiftHours(d.in, d.out, d.breakMins))
  const totalHours = dailyHours.reduce((a, b) => a + b, 0)

  const otThreshold = parseFloat(otAfter) || 40
  const regularHours = Math.min(totalHours, otThreshold)
  const overtimeHours = Math.max(0, totalHours - otThreshold)

  const r = parseFloat(rate) || 0
  const mult = parseFloat(otMultiplier) || 1.5
  const regularPay = regularHours * r
  const overtimePay = overtimeHours * r * mult
  const totalPay = regularPay + overtimePay

  const hasEntries = totalHours > 0

  const inputClass = 'w-full px-2 py-2 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Time Card Calculator',
        'url': 'https://myfreepaystub.com/time-card-calculator',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Free weekly time card and timesheet calculator with breaks, overnight shifts, overtime, and total pay.',
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">Time Card Calculator</h1>
        <p className="text-sm text-gray-500">
          Enter clock in/out times and break minutes for each day. Totals update as you type —
          overnight shifts and overtime are handled automatically.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold text-xs">Day</th>
                <th className="text-left p-2 border border-gray-200 font-semibold text-xs">Clock In</th>
                <th className="text-left p-2 border border-gray-200 font-semibold text-xs">Clock Out</th>
                <th className="text-left p-2 border border-gray-200 font-semibold text-xs">Break (min)</th>
                <th className="text-right p-2 border border-gray-200 font-semibold text-xs">Hours</th>
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day, i) => (
                <tr key={day} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2 border border-gray-200 text-gray-600 text-xs whitespace-nowrap">{day.slice(0, 3)}</td>
                  <td className="p-1 border border-gray-200">
                    <input type="time" value={days[i].in} onChange={(e) => setDay(i, 'in', e.target.value)} className={inputClass} />
                  </td>
                  <td className="p-1 border border-gray-200">
                    <input type="time" value={days[i].out} onChange={(e) => setDay(i, 'out', e.target.value)} className={inputClass} />
                  </td>
                  <td className="p-1 border border-gray-200">
                    <input type="number" min="0" value={days[i].breakMins} onChange={(e) => setDay(i, 'breakMins', e.target.value)} placeholder="30" className={inputClass} />
                  </td>
                  <td className="p-2 border border-gray-200 text-right font-semibold text-gray-800">
                    {dailyHours[i] > 0 ? fmtH(dailyHours[i]) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
          <div>
            <label className={labelClass}>Hourly Rate <span className="text-gray-400 font-normal">(optional)</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="25.00" className={`${inputClass} pl-7`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Overtime After</label>
            <input type="number" value={otAfter} onChange={(e) => setOtAfter(e.target.value)} placeholder="40" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>OT Multiplier</label>
            <select value={otMultiplier} onChange={(e) => setOtMultiplier(e.target.value)} className={inputClass}>
              <option value="1.5">1.5× (time-and-a-half)</option>
              <option value="2">2× (double time)</option>
              <option value="1">1× (no premium)</option>
            </select>
          </div>
        </div>

        <button onClick={reset} className="mt-4 text-xs text-gray-500 hover:text-blue-600 underline">
          Clear all days
        </button>
      </div>

      {hasEntries && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">Total Hours This Week</p>
            <p className="text-4xl font-black text-blue-700">{fmtH(totalHours)}</p>
            {r > 0 && <p className="text-xs text-gray-500 mt-1">Total pay: <strong>{fmt(totalPay)}</strong> (gross, before taxes)</p>}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-gray-50 py-1.5">
                <span className="text-gray-600">Regular hours</span>
                <span className="font-semibold">{fmtH(regularHours)}{r > 0 && <span className="text-gray-400 font-normal"> · {fmt(regularPay)}</span>}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 py-1.5">
                <span className="text-gray-600">Overtime hours ({mult}×)</span>
                <span className="font-semibold">{fmtH(overtimeHours)}{r > 0 && <span className="text-gray-400 font-normal"> · {fmt(overtimePay)}</span>}</span>
              </div>
              <div className="flex justify-between pt-2 font-black text-gray-800">
                <span>Total</span>
                <span>{fmtH(totalHours)} hrs{r > 0 && ` · ${fmt(totalPay)}`}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Totals are gross hours and pay before taxes. For take-home pay after federal and state
            taxes, use our <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>,
            or turn these hours into a <a href="/" className="underline font-semibold">pay stub</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="time-card-calculator" title="Time Card Calculator" height="900" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How to Use This Time Card Calculator</h2>
          <ol className="space-y-2 list-decimal list-inside leading-relaxed">
            <li>Enter the time you clocked in and out for each day you worked.</li>
            <li>Add unpaid break minutes (a 30-minute lunch is typical) — these are subtracted automatically.</li>
            <li>Optionally add your hourly rate to see gross pay for the week.</li>
            <li>Set the overtime threshold (40 hours under federal FLSA rules) and multiplier.</li>
          </ol>
          <p className="leading-relaxed mt-3">
            Overnight shifts are supported: if your clock-out time is earlier than your clock-in time,
            the calculator treats it as crossing midnight.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Converting Minutes to Decimal Hours</h2>
          <p className="leading-relaxed mb-3">
            Payroll systems use decimal hours, not minutes. This calculator converts for you, but here's
            the reference chart:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Minutes</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Decimal</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Minutes</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Decimal</th>
                </tr>
              </thead>
              <tbody>
                {[['5', '0.08', '35', '0.58'], ['10', '0.17', '40', '0.67'], ['15', '0.25', '45', '0.75'],
                  ['20', '0.33', '50', '0.83'], ['25', '0.42', '55', '0.92'], ['30', '0.50', '60', '1.00']].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, j) => (
                      <td key={j} className={`p-2 border border-gray-200 ${j % 2 === 1 ? 'text-blue-600 font-semibold' : ''}`}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Does this time card calculator handle overnight shifts?', a: 'Yes. If your clock-out time is earlier than your clock-in time (for example, in at 10:00 PM and out at 6:00 AM), the calculator assumes the shift crossed midnight and counts 8 hours.' },
              { q: 'Are breaks paid or unpaid?', a: 'The break minutes you enter are treated as unpaid and subtracted from the shift. Under federal rules, short breaks (usually under 20 minutes) are generally paid, while bona fide meal periods of 30 minutes or more are generally unpaid. State rules vary.' },
              { q: 'When does overtime start?', a: 'Under the federal FLSA, non-exempt employees earn overtime after 40 hours in a workweek. Some states (such as California) also require daily overtime after 8 hours — you can change the threshold above.' },
              { q: 'Is my timesheet data saved?', a: 'No. Everything you type stays in your browser for this session only. Nothing is uploaded, stored, or shared.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This calculator is for estimation only and is not legal, payroll, or tax advice. Overtime
          and break rules vary by state, industry, and job classification. See the{' '}
          <a href="https://www.dol.gov/agencies/whd/flsa" target="_blank" rel="noopener noreferrer" className="underline">US Department of Labor</a>{' '}
          or read our <a href="/guides/how-to-calculate-overtime" className="underline">overtime guide</a>.
        </div>
      </div>
    </div>
  )
}
