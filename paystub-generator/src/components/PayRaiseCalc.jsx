import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { calcFederalTax, calcFICA, calcStateTax } from '../utils/taxCalculator'
import { STATE_LIST } from '../utils/states'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

function netFor(gross, stateCode) {
  const federal = calcFederalTax(gross, 'single')
  const { ss, medicare } = calcFICA(gross)
  const state = calcStateTax(gross, stateCode)
  return gross - federal - ss - medicare - state
}

export default function PayRaiseCalc() {
  usePageMeta({
    title: 'Pay Raise Calculator 2026 — New Salary, Percentage Increase & Take-Home',
    description: 'Free pay raise calculator. Enter your current pay and a raise as a percentage or dollar amount to see your new salary, the increase per paycheck, and your take-home after taxes.',
    canonicalPath: '/pay-raise-calculator',
  })

  const [current, setCurrent] = useState('')
  const [mode, setMode] = useState('percent')
  const [amount, setAmount] = useState('')
  const [stateCode, setStateCode] = useState('CA')
  const [inflation, setInflation] = useState('3')
  const [result, setResult] = useState(null)

  const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
  const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calculate = () => {
    const cur = parseFloat(current) || 0
    const amt = parseFloat(amount) || 0
    if (cur <= 0 || amt === 0) return

    const raiseAmount = mode === 'percent' ? cur * (amt / 100) : amt
    const newSalary = cur + raiseAmount
    const pct = (raiseAmount / cur) * 100

    const curNet = netFor(cur, stateCode)
    const newNet = netFor(newSalary, stateCode)
    const netGain = newNet - curNet

    const infl = parseFloat(inflation) || 0
    const realGain = pct - infl

    setResult({
      current: cur,
      newSalary,
      raiseAmount,
      pct,
      curNet,
      newNet,
      netGain,
      keptPct: raiseAmount > 0 ? (netGain / raiseAmount) * 100 : 0,
      realGain,
      infl,
      perMonth: raiseAmount / 12,
      perBiweekly: raiseAmount / 26,
      netPerBiweekly: netGain / 26,
      netPerMonth: netGain / 12,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Pay Raise Calculator 2026',
        'url': 'https://myfreepaystub.com/pay-raise-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Calculate a new salary after a raise, the percentage increase, and how much of the raise you actually keep after taxes.',
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">Pay Raise Calculator</h1>
        <p className="text-sm text-gray-500">
          See your new salary after a raise — and, more importantly, how much of it you actually
          keep once taxes and inflation take their share.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className={labelClass}>Current Annual Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="65,000" className={`${inputClass} pl-7`} />
          </div>
        </div>

        <div>
          <label className={labelClass}>Raise Type</label>
          <div className="grid grid-cols-2 gap-2">
            {[['percent', 'Percentage (%)'], ['dollar', 'Dollar Amount ($)']].map(([v, l]) => (
              <button key={v} onClick={() => setMode(v)}
                className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                  mode === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={labelClass}>{mode === 'percent' ? 'Raise Percentage' : 'Raise Amount'}</label>
          <div className="relative">
            {mode === 'dollar' && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>}
            <input type="number" step="0.1" value={amount} onChange={(e) => setAmount(e.target.value)}
              placeholder={mode === 'percent' ? '5' : '4,000'}
              className={`${inputClass} ${mode === 'dollar' ? 'pl-7' : ''}`} />
            {mode === 'percent' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>State</label>
            <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputClass}>
              {[...STATE_LIST].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Inflation Rate (%)</label>
            <input type="number" step="0.1" value={inflation} onChange={(e) => setInflation(e.target.value)} placeholder="3" className={inputClass} />
          </div>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate Raise
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">New Annual Salary</p>
            <p className="text-4xl font-black text-blue-700">{fmt0(result.newSalary)}</p>
            <p className="text-xs text-gray-500 mt-1">
              +{fmt0(result.raiseAmount)} ({result.pct.toFixed(2)}% increase)
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 text-center">
            <p className="text-sm text-emerald-600 font-semibold mb-1">What You Actually Take Home</p>
            <p className="text-3xl font-black text-emerald-700">+{fmt0(result.netGain)}/yr</p>
            <p className="text-xs text-emerald-800 mt-1">
              {fmt2(result.netPerBiweekly)} more per bi-weekly paycheck ·
              you keep {result.keptPct.toFixed(0)}% of the raise
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Before vs After</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border border-gray-200 font-semibold text-xs"></th>
                    <th className="text-right p-2 border border-gray-200 font-semibold text-xs">Before</th>
                    <th className="text-right p-2 border border-gray-200 font-semibold text-xs">After</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-gray-200 text-gray-600">Gross salary</td>
                    <td className="p-2 border border-gray-200 text-right">{fmt0(result.current)}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold">{fmt0(result.newSalary)}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="p-2 border border-gray-200 text-gray-600">Take-home (est.)</td>
                    <td className="p-2 border border-gray-200 text-right">{fmt0(result.curNet)}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold">{fmt0(result.newNet)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-gray-200 text-gray-600">Per month (gross)</td>
                    <td className="p-2 border border-gray-200 text-right">{fmt0(result.current / 12)}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold">{fmt0(result.newSalary / 12)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className={`border rounded-xl p-4 text-sm ${result.realGain >= 0 ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {result.realGain >= 0
              ? <>📈 After {result.infl}% inflation this is a <strong>real raise of about {result.realGain.toFixed(2)}%</strong> — your buying power went up.</>
              : <>📉 After {result.infl}% inflation this is a <strong>real pay cut of about {Math.abs(result.realGain).toFixed(2)}%</strong> — the raise does not keep pace with rising prices.</>}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Negotiating? Work out the salary you need from your target take-home with the{' '}
            <a href="/net-to-gross-calculator" className="underline font-semibold">Net to Gross Calculator</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="pay-raise-calculator" title="Pay Raise Calculator" height="800" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How to Calculate a Pay Raise</h2>
          <p className="leading-relaxed">
            To find a raise percentage, divide the increase by your old salary and multiply by 100.
            A $3,000 raise on a $60,000 salary is 3,000 ÷ 60,000 × 100 = <strong>5%</strong>.
          </p>
          <p className="leading-relaxed mt-3">
            The number that matters more is what reaches your bank account. Because a raise sits on
            top of your existing income, it is taxed at your <strong>marginal rate</strong> — typically
            you keep 65–80% of it. A 5% raise rarely means 5% more spending money.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Raise Percentage Quick Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Current Salary</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">3% Raise</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">5% Raise</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">10% Raise</th>
                </tr>
              </thead>
              <tbody>
                {[40000, 50000, 60000, 75000, 100000].map((s, i) => (
                  <tr key={s} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">${s.toLocaleString('en-US')}</td>
                    <td className="p-2 border border-gray-200">${(s * 1.03).toLocaleString('en-US')}</td>
                    <td className="p-2 border border-gray-200 text-blue-600 font-semibold">${(s * 1.05).toLocaleString('en-US')}</td>
                    <td className="p-2 border border-gray-200">${(s * 1.10).toLocaleString('en-US')}</td>
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
              { q: 'What is a good annual raise?', a: 'Typical US merit increases run about 3–4% a year, roughly tracking inflation. Promotions and job changes usually deliver more — often 10–20%. A raise below the inflation rate is effectively a pay cut in real terms.' },
              { q: 'Why is my raise so small in my paycheck?', a: 'The extra income is taxed at your marginal rate, and Social Security, Medicare, and state tax all apply. Benefit deductions may rise too. Keeping roughly 70% of a raise is normal.' },
              { q: 'Will a raise push me into a higher tax bracket and cost me money?', a: 'No. US tax brackets are marginal, so only the income above the bracket threshold is taxed at the higher rate. A raise always leaves you with more after-tax money than before.' },
              { q: 'How do I ask for a raise?', a: 'Come with market data for your role and location, a written record of your results, and a specific number. Working backwards from the take-home you need — see our net to gross calculator — helps you name a figure with confidence.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/pay-raise-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Estimates for planning only — not tax or financial advice. Take-home figures assume a
          single filer, standard deduction, and an approximate flat state rate; your actual result
          depends on your W-4, benefits, and local taxes.
        </div>
      </div>
    </div>
  )
}
