import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'

const FREQUENCIES = {
  weekly:     { label: 'Weekly',      perYear: 52 },
  biweekly:   { label: 'Bi-Weekly',   perYear: 26 },
  semimonthly:{ label: 'Semi-Monthly',perYear: 24 },
  monthly:    { label: 'Monthly',     perYear: 12 },
}

// 2026 단순 추정 세율 (federal + FICA). 정확 계산은 메인 폼에서 안내.
const FED_RATE = 0.12      // 평균 유효 연방세율(추정)
const SS_RATE = 0.062
const SS_CAP = 184500
const MEDICARE_RATE = 0.0145

export default function MultiPayStub() {
  usePageMeta({
    title: 'Free Paystub Generator with YTD — Create Multiple Pay Stubs at Once (2026)',
    description: 'Generate multiple pay stubs at once with automatic year-to-date (YTD) totals. Free, no sign-up, no watermark. Weekly, bi-weekly, semi-monthly & monthly pay periods.',
  })

  const [company, setCompany] = useState('')
  const [employee, setEmployee] = useState('')
  const [frequency, setFrequency] = useState('biweekly')
  const [grossPerPeriod, setGrossPerPeriod] = useState('')
  const [numStubs, setNumStubs] = useState('3')
  const [firstPayDate, setFirstPayDate] = useState('')
  const [stateRate, setStateRate] = useState('')
  const [results, setResults] = useState(null)

  const fmt = (n) => '$' + (Math.round(n * 100) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const addDays = (dateStr, days) => {
    const d = new Date(dateStr)
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
  }

  const generate = () => {
    const gross = parseFloat(grossPerPeriod) || 0
    const count = Math.min(Math.max(parseInt(numStubs) || 1, 1), 12)
    const stRate = (parseFloat(stateRate) || 0) / 100
    const freq = FREQUENCIES[frequency]
    const daysBetween = Math.round(365 / freq.perYear)

    let ytdGross = 0, ytdFed = 0, ytdState = 0, ytdSS = 0, ytdMed = 0, ytdNet = 0
    const stubs = []

    for (let i = 0; i < count; i++) {
      const fed = gross * FED_RATE
      const st = gross * stRate
      // SS는 연 상한 적용
      const ssThisPeriod = ytdGross < SS_CAP
        ? Math.min(gross, SS_CAP - ytdGross) * SS_RATE
        : 0
      const med = gross * MEDICARE_RATE
      const net = gross - fed - st - ssThisPeriod - med

      ytdGross += gross
      ytdFed += fed
      ytdState += st
      ytdSS += ssThisPeriod
      ytdMed += med
      ytdNet += net

      stubs.push({
        index: i + 1,
        payDate: firstPayDate ? addDays(firstPayDate, daysBetween * i) : `Period ${i + 1}`,
        gross, fed, st, ss: ssThisPeriod, med, net,
        ytdGross, ytdFed, ytdState, ytdSS, ytdMed, ytdNet,
      })
    }
    setResults({ stubs, company, employee, freqLabel: freq.label })
  }

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"

  if (results) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4 print:hidden">
          <h1 className="text-xl font-black text-gray-800">{results.stubs.length} Pay Stubs Generated</h1>
          <div className="flex gap-2">
            <button onClick={() => setResults(null)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg">← Edit</button>
            <button onClick={() => window.print()} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg">🖨️ Print / Save PDF</button>
          </div>
        </div>

        {results.stubs.map((s) => (
          <div key={s.index} id="invoice-preview" className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden mb-6 print:break-after-page">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
              <div>
                <p className="font-bold text-gray-800">{results.company || 'Company Name'}</p>
                <p className="text-xs text-gray-500">Employee: {results.employee || '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Pay Date</p>
                <p className="font-semibold text-gray-700 text-sm">{s.payDate}</p>
                <p className="text-xs text-gray-400 mt-1">{results.freqLabel}</p>
              </div>
            </div>
            <div className="px-6 py-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-gray-200 text-gray-400 uppercase">
                    <th className="text-left pb-2">Description</th>
                    <th className="text-right pb-2">Current</th>
                    <th className="text-right pb-2">YTD</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Gross Pay', s.gross, s.ytdGross, 'text-gray-800 font-semibold'],
                    ['Federal Tax', -s.fed, -s.ytdFed, 'text-red-500'],
                    ['State Tax', -s.st, -s.ytdState, 'text-red-500'],
                    ['Social Security', -s.ss, -s.ytdSS, 'text-red-500'],
                    ['Medicare', -s.med, -s.ytdMed, 'text-red-500'],
                  ].map(([label, cur, ytd, cls], i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 text-gray-600">{label}</td>
                      <td className={`py-2 text-right ${cls}`}>{fmt(cur)}</td>
                      <td className={`py-2 text-right ${cls}`}>{fmt(ytd)}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-gray-300">
                    <td className="py-2 font-black text-emerald-700">Net Pay</td>
                    <td className="py-2 text-right font-black text-emerald-700">{fmt(s.net)}</td>
                    <td className="py-2 text-right font-black text-emerald-700">{fmt(s.ytdNet)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-6 py-2 bg-gray-50 text-center">
              <p className="text-xs text-gray-400">For record-keeping purposes only. Estimates — not an official payroll document.</p>
            </div>
          </div>
        ))}

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 print:hidden">
          ⚠️ These figures use simplified estimated tax rates for illustration and record-keeping only.
          They are not official payroll documents and may differ from actual withholdings.
          Creating falsified pay stubs to misrepresent income is illegal (18 U.S.C. § 1343).
          For exact per-state withholding, use our main paycheck calculator.
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Multiple Pay Stubs Generator with YTD",
        "url": "https://myfreepaystub.com/multiple-paystubs",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free tool to generate multiple consecutive pay stubs at once with automatic year-to-date (YTD) totals for weekly, bi-weekly, semi-monthly and monthly pay periods."
      })}} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">Multiple Pay Stubs Generator with YTD</h1>
        <p className="text-sm text-gray-500">Generate several consecutive pay stubs at once with automatic year-to-date totals. Free, no sign-up.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={labelClass}>Company Name</label><input value={company} onChange={e => setCompany(e.target.value)} className={inputClass} placeholder="Acme Inc." /></div>
          <div><label className={labelClass}>Employee Name</label><input value={employee} onChange={e => setEmployee(e.target.value)} className={inputClass} placeholder="John Smith" /></div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Pay Frequency</label>
            <select value={frequency} onChange={e => setFrequency(e.target.value)} className={inputClass}>
              {Object.entries(FREQUENCIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Number of Stubs</label>
            <select value={numStubs} onChange={e => setNumStubs(e.target.value)} className={inputClass}>
              {[1,2,3,4,5,6,8,10,12].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Gross Pay Per Period</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={grossPerPeriod} onChange={e => setGrossPerPeriod(e.target.value)} className={`${inputClass} pl-7`} placeholder="2,500" />
            </div>
          </div>
          <div><label className={labelClass}>First Pay Date</label><input type="date" value={firstPayDate} onChange={e => setFirstPayDate(e.target.value)} className={inputClass} /></div>
        </div>
        <div>
          <label className={labelClass}>State Tax Rate (%) <span className="text-gray-400 font-normal">optional</span></label>
          <input type="number" value={stateRate} onChange={e => setStateRate(e.target.value)} className={inputClass} placeholder="e.g. 5" />
          <p className="text-xs text-gray-400 mt-1">Leave blank for no-state-tax states (TX, FL, WA, etc.)</p>
        </div>
        <button onClick={generate} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">
          Generate {numStubs} Pay Stubs →
        </button>
      </div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What is YTD on a Pay Stub?</h2>
          <p className="leading-relaxed">YTD (Year-to-Date) shows the total amount earned and deducted from the start of the calendar year up to the current pay date. Lenders, landlords, and accountants often look at YTD figures to verify income. This tool calculates YTD automatically across multiple pay periods, so each stub correctly accumulates totals.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Can I generate multiple pay stubs at once?', a: 'Yes. Choose how many stubs you need (up to 12) and the tool generates them in sequence with running year-to-date totals — no need to re-enter data for each one.' },
              { q: 'How is YTD calculated?', a: 'Each pay stub adds the current period\'s gross, taxes, and net pay to the running total from previous periods, giving an accurate year-to-date figure on every stub.' },
              { q: 'Are these official pay stubs?', a: 'No. These are estimates for personal record-keeping only, using simplified tax rates. They are not official payroll documents. For exact per-state withholding, use our main paycheck calculator.' },
            ].map((it, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4"><p className="font-semibold text-gray-700 mb-1">{it.q}</p><p className="text-gray-600 text-xs leading-relaxed">{it.a}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}