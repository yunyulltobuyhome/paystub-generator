import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import EmbedSnippet from './EmbedSnippet'
import RelatedTools from './RelatedTools'

export default function HourlyToSalaryCalc() {
  usePageMeta({
    title: 'Hourly to Salary Calculator — Convert Wage to Annual Income | MyFreePayStub',
    description: 'Free hourly to salary calculator. Convert your hourly wage to annual, monthly, weekly, and bi-weekly salary — or salary back to hourly. Instant results.',
  })

  const [mode, setMode] = useState('hourlyToSalary')
  const [hourlyRate, setHourlyRate] = useState('')
  const [annualSalary, setAnnualSalary] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [weeksPerYear, setWeeksPerYear] = useState('52')
  const [result, setResult] = useState(null)

  const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calculate = () => {
    const hrs = parseFloat(hoursPerWeek) || 40
    const wks = parseFloat(weeksPerYear) || 52

    if (mode === 'hourlyToSalary') {
      const rate = parseFloat(hourlyRate) || 0
      if (rate <= 0) return
      const annual = rate * hrs * wks
      setResult({
        annual,
        monthly: annual / 12,
        biweekly: annual / 26,
        weekly: rate * hrs,
        daily: rate * (hrs / 5),
        hourly: rate,
        hrs, wks,
        mode,
      })
    } else {
      const annual = parseFloat(annualSalary) || 0
      if (annual <= 0) return
      const hourly = annual / (hrs * wks)
      setResult({
        annual,
        monthly: annual / 12,
        biweekly: annual / 26,
        weekly: annual / wks,
        daily: annual / (wks * 5),
        hourly,
        hrs, wks,
        mode,
      })
    }
  }

  const inputClass = "w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Hourly to Salary Calculator",
        "url": "https://myfreepaystub.com/hourly-to-salary-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Convert hourly wage to annual salary and back. Free wage conversion calculator."
      })}} />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">
          Hourly to Salary Calculator
        </h1>
        <p className="text-sm text-gray-500">
          Convert your hourly wage to an annual salary, or your salary to an hourly rate.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-4">
        <div>
          <label className={labelClass}>Conversion</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'hourlyToSalary', label: 'Hourly → Salary' },
              { value: 'salaryToHourly', label: 'Salary → Hourly' },
            ].map(opt => (
              <button key={opt.value} onClick={() => { setMode(opt.value); setResult(null) }}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  mode === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {mode === 'hourlyToSalary' ? (
          <div>
            <label className={labelClass}>Hourly Rate</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" step="0.01" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
                placeholder="25.00" className={`${inputClass} pl-7`} />
            </div>
          </div>
        ) : (
          <div>
            <label className={labelClass}>Annual Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={annualSalary} onChange={e => setAnnualSalary(e.target.value)}
                placeholder="52,000" className={`${inputClass} pl-7`} />
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Hours / Week</label>
            <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)}
              placeholder="40" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Weeks / Year</label>
            <input type="number" value={weeksPerYear} onChange={e => setWeeksPerYear(e.target.value)}
              placeholder="52" className={inputClass} />
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Convert
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">
              {result.mode === 'hourlyToSalary' ? 'Equivalent Annual Salary' : 'Equivalent Hourly Rate'}
            </p>
            <p className="text-4xl font-extrabold text-blue-700">
              {result.mode === 'hourlyToSalary' ? fmt(result.annual) : fmt(result.hourly)}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Based on {result.hrs} hrs/week × {result.wks} weeks/year
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="font-semibold text-gray-700 mb-3 text-sm">Full Breakdown</p>
            <div className="space-y-2 text-sm">
              {[
                ['Hourly', result.hourly],
                ['Daily (8 hrs)', result.daily],
                ['Weekly', result.weekly],
                ['Bi-Weekly', result.biweekly],
                ['Monthly', result.monthly],
                ['Annual', result.annual],
              ].map(([label, val], i) => (
                <div key={i} className={`flex justify-between py-1.5 ${i === 5 ? 'border-t border-gray-200 pt-2 font-bold' : 'border-b border-gray-50'}`}>
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold">{fmt(val)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ This shows gross pay before taxes. For take-home pay after federal and state taxes,
            use our <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>.
          </div>
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="hourly-to-salary-calculator" title="Hourly to Salary Calculator" height="640" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How to Convert Hourly to Salary</h2>
          <p className="leading-relaxed">
            To convert an hourly wage to an annual salary, multiply your hourly rate by the number of
            hours you work per week, then by the number of weeks you work per year. For a standard
            full-time job: hourly rate × 40 hours × 52 weeks = annual salary. For example, $25/hour
            equals $52,000 per year ($25 × 40 × 52).
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Common Hourly to Salary Conversions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Hourly</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Weekly (40h)</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Annual</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['$15/hr', '$600', '$31,200'],
                  ['$20/hr', '$800', '$41,600'],
                  ['$25/hr', '$1,000', '$52,000'],
                  ['$30/hr', '$1,200', '$62,400'],
                  ['$40/hr', '$1,600', '$83,200'],
                  ['$50/hr', '$2,000', '$104,000'],
                ].map(([hr, wk, yr], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{hr}</td>
                    <td className="p-2 border border-gray-200">{wk}</td>
                    <td className="p-2 border border-gray-200 text-blue-600 font-semibold">{yr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <RelatedTools current="/hourly-to-salary-calculator" />
      </div>
    </div>
  )
}