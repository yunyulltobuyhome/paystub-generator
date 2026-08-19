import { useState } from 'react'
import { STATE_TAXES } from '../data/stateTaxRates'
import { STATE_LIST } from '../utils/states'
import { Link } from 'react-router-dom'
import { calcPayStub, getPayPeriods } from '../utils/taxCalculator'
import { usePageMeta } from '../hooks/usePageMeta'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

export default function PaycheckCalc() {
  usePageMeta({
    title: 'Free Paycheck Calculator 2026 — Take-Home Pay, All 50 States | MyFreePayStub',
    description: 'Free paycheck calculator for 2026. Estimate your take-home pay after federal, state, Social Security, and Medicare taxes. Salary or hourly, all 50 states. No sign-up.',
  })

  const [payType, setPayType] = useState('salary')
  const [salary, setSalary] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [hoursPerWeek, setHoursPerWeek] = useState('40')
  const [frequency, setFrequency] = useState('biweekly')
  const [filingStatus, setFilingStatus] = useState('single')
  const [stateCode, setStateCode] = useState('CA')
  const [result, setResult] = useState(null)

  const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calculate = () => {
    const periods = getPayPeriods(frequency)
    let grossPerPeriod = 0
    if (payType === 'salary') {
      grossPerPeriod = (parseFloat(salary) || 0) / periods
    } else {
      const rate = parseFloat(hourlyRate) || 0
      const hrs = parseFloat(hoursPerWeek) || 0
      const weeksPerPeriod = 52 / periods
      grossPerPeriod = rate * hrs * weeksPerPeriod
    }
    if (grossPerPeriod <= 0) return

    const res = calcPayStub({
      grossPay: grossPerPeriod,
      frequency,
      filingStatus,
      stateCode,
      ytdGross: 0,
      preDeductions: 0,
    })

    const annualGross = grossPerPeriod * periods
    const annualNet = res.netPay * periods

    setResult({ ...res, grossPerPeriod, annualGross, annualNet, periods, frequency })
  }

  const inputClass = "w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Free Paycheck Calculator 2026",
        "url": "https://myfreepaystub.com/paycheck-calculator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free paycheck calculator estimating take-home pay after federal, state, and FICA taxes for all 50 US states."
      })}} />

      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">
          Free Paycheck Calculator 2026
        </h1>
        <p className="text-sm text-gray-500">
          Estimate your take-home pay after federal, state, and FICA taxes. All 50 states, 2026 tax tables.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-4">
        <div>
          <label className={labelClass}>Pay Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[{ value: 'salary', label: '💼 Salary' }, { value: 'hourly', label: '⏰ Hourly' }].map(opt => (
              <button key={opt.value} onClick={() => { setPayType(opt.value); setResult(null) }}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  payType === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {payType === 'salary' ? (
          <div>
            <label className={labelClass}>Annual Salary</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={salary} onChange={e => setSalary(e.target.value)}
                placeholder="75,000" className={`${inputClass} pl-7`} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Hourly Rate</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input type="number" step="0.01" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)}
                  placeholder="25.00" className={`${inputClass} pl-7`} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Hours / Week</label>
              <input type="number" value={hoursPerWeek} onChange={e => setHoursPerWeek(e.target.value)}
                placeholder="40" className={inputClass} />
            </div>
          </div>
        )}

        <div>
          <label className={labelClass}>Pay Frequency</label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'weekly', label: 'Weekly' },
              { value: 'biweekly', label: 'Bi-Weekly' },
              { value: 'semimonthly', label: 'Semi-Monthly' },
              { value: 'monthly', label: 'Monthly' },
            ].map(opt => (
              <button key={opt.value} onClick={() => setFrequency(opt.value)}
                className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                  frequency === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Filing Status</label>
            <select value={filingStatus} onChange={e => setFilingStatus(e.target.value)} className={inputClass}>
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="head">Head of Household</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select value={stateCode} onChange={e => setStateCode(e.target.value)} className={inputClass}>
              {Object.entries(STATE_TAXES).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, st]) => (
                <option key={code} value={code}>{st.name}{st.rate === 0 ? ' (No Tax)' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={calculate}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate Take-Home Pay
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-600 font-semibold mb-1">
                  Take-Home Pay ({result.frequency})
                </p>
                <p className="text-4xl font-extrabold text-blue-700">{fmt(result.netPay)}</p>
                <p className="text-xs text-gray-400 mt-1">{fmt(result.annualNet)}/year</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Gross / period</p>
                <p className="text-xl font-bold text-gray-700">{fmt(result.grossPerPeriod)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-700 mb-2">Per-Paycheck Breakdown</p>
            {[
              ['Gross pay', result.grossPerPeriod, false],
              ['Federal income tax', result.federalTax, true],
              ['Social Security (6.2%)', result.socialSecurity, true],
              ['Medicare (1.45%)', result.medicare, true],
              [`${STATE_TAXES[stateCode]?.name} state tax`, result.stateTax, true],
            ].map(([label, val, isDeduction], i) => (
              <div key={i} className="flex justify-between">
                <span className="text-gray-500">{label}</span>
                <span className={isDeduction ? 'text-red-500 font-semibold' : 'font-semibold'}>
                  {isDeduction ? '- ' : ''}{fmt(val)}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-green-600">
              <span>Net take-home</span>
              <span>{fmt(result.netPay)}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-semibold text-gray-700 mb-3 text-sm">Annual Summary</p>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-400">Annual Gross</p>
                <p className="font-bold text-gray-800 mt-0.5">{fmt(result.annualGross)}</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-400">Annual Net</p>
                <p className="font-bold text-green-600 mt-0.5">{fmt(result.annualNet)}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="font-bold text-blue-800 mb-1">Need a Pay Stub?</p>
            <p className="text-blue-700 text-xs mb-3">
              Turn this calculation into a professional pay stub document — free, no sign-up.
            </p>
            <a href="/" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Create Free Pay Stub →
            </a>
          </div>

          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="paycheck-calculator" title="Paycheck Calculator" height="760" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How Is Take-Home Pay Calculated?</h2>
          <p className="leading-relaxed">
            Your take-home pay (net pay) is your gross pay minus federal income tax, state income tax,
            and FICA taxes (Social Security and Medicare). This calculator uses the 2026 IRS tax brackets,
            the $184,500 Social Security wage base, and current state tax rates to estimate your paycheck
            after all standard deductions.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How accurate is this paycheck calculator?', a: 'This calculator provides a close estimate using 2026 federal tax brackets, FICA rates, and state tax rates. Your actual paycheck may differ slightly due to pre-tax deductions (401k, health insurance), additional withholding elections on your W-4, or local city taxes.' },
              { q: 'Which states have no income tax?', a: 'Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, and Wyoming. If you work in these states, your take-home pay is higher because no state tax is withheld.' },
              { q: 'What is the difference between gross and net pay?', a: 'Gross pay is your total earnings before any deductions. Net pay (take-home pay) is what remains after federal tax, state tax, Social Security, and Medicare are withheld. Net pay is the amount deposited into your bank account.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      <div className="bg-white rounded-xl border border-gray-200/80 p-6 mt-6">
        <h2 className="text-base font-bold text-gray-800 mb-1">Paycheck Calculator by State</h2>
        <p className="text-xs text-gray-500 mb-4">
          Open a version pre-set to your state — each one also shows what the same salary would
          leave you in every other state.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {[...STATE_LIST].sort((a, b) => a.name.localeCompare(b.name)).map((st) => (
            <Link key={st.code} to={`/paycheck-calculator/${st.slug}`}
              className="text-xs text-gray-700 hover:text-blue-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-lg px-2 py-1.5 transition-all truncate">
              {st.name}
            </Link>
          ))}
        </div>
      </div>

      <RelatedTools current="/paycheck-calculator" />

      </div>
    </div>
  )
}