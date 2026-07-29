import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import { FICA } from '../data/stateTaxRates'
import AdSlot from './AdSlot'
import EmbedSnippet from './EmbedSnippet'
import { AD_SLOTS } from '../config/ads'
import RelatedTools from './RelatedTools'

// Federal unemployment tax: 6.0% on the first $7,000 of wages, but employers in
// states with compliant programs normally receive a 5.4% credit → 0.6% net.
const FUTA_WAGE_BASE = 7000
const FUTA_EFFECTIVE_RATE = 0.006

export default function EmployerCostCalc() {
  usePageMeta({
    title: 'Employee Cost Calculator 2026 — True Cost of an Employee to an Employer',
    description: 'Free employer payroll cost calculator. See the true annual cost of an employee: gross salary plus employer FICA, FUTA, state unemployment, workers comp, health insurance, and 401(k) match.',
    canonicalPath: '/employee-cost-calculator',
  })

  const [salary, setSalary] = useState('')
  const [sutaRate, setSutaRate] = useState('2.7')
  const [sutaBase, setSutaBase] = useState('12000')
  const [workersComp, setWorkersComp] = useState('1.0')
  const [healthMonthly, setHealthMonthly] = useState('700')
  const [retirementMatch, setRetirementMatch] = useState('3')
  const [otherCosts, setOtherCosts] = useState('')
  const [result, setResult] = useState(null)

  const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')

  const calculate = () => {
    const s = parseFloat(salary) || 0
    if (s <= 0) return

    const ssTaxable = Math.min(s, FICA.socialSecurityWageBase)
    const employerSS = ssTaxable * FICA.socialSecurityRate
    const employerMedicare = s * FICA.medicareRate // no employer match on additional Medicare
    const futa = Math.min(s, FUTA_WAGE_BASE) * FUTA_EFFECTIVE_RATE
    const suta = Math.min(s, parseFloat(sutaBase) || 0) * ((parseFloat(sutaRate) || 0) / 100)
    const comp = s * ((parseFloat(workersComp) || 0) / 100)
    const health = (parseFloat(healthMonthly) || 0) * 12
    const match = s * ((parseFloat(retirementMatch) || 0) / 100)
    const other = parseFloat(otherCosts) || 0

    const totalBurden = employerSS + employerMedicare + futa + suta + comp + health + match + other
    const totalCost = s + totalBurden

    setResult({
      salary: s,
      employerSS, employerMedicare, futa, suta, comp, health, match, other,
      totalBurden,
      totalCost,
      burdenPct: (totalBurden / s) * 100,
      hourly: totalCost / 2080,
      monthly: totalCost / 12,
    })
  }

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Employee Cost Calculator 2026',
        'url': 'https://myfreepaystub.com/employee-cost-calculator',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Calculate the true cost of an employee including employer payroll taxes, insurance, and benefits.',
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">True Cost of an Employee Calculator</h1>
        <p className="text-sm text-gray-500">
          An employee costs more than their salary. Add employer payroll taxes, insurance, and
          benefits to see what a hire really costs your business per year.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
        <div>
          <label className={labelClass}>Annual Salary</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="60,000" className={`${inputClass} pl-7`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>State Unemployment (SUTA) %</label>
            <input type="number" step="0.01" value={sutaRate} onChange={(e) => setSutaRate(e.target.value)} placeholder="2.7" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>SUTA Wage Base</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={sutaBase} onChange={(e) => setSutaBase(e.target.value)} placeholder="12,000" className={`${inputClass} pl-7`} />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 -mt-2">
          SUTA rates and wage bases are set by each state and vary by employer experience rating —
          check your state's rate notice and enter it here.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Workers' Comp %</label>
            <input type="number" step="0.01" value={workersComp} onChange={(e) => setWorkersComp(e.target.value)} placeholder="1.0" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>401(k) Match %</label>
            <input type="number" step="0.1" value={retirementMatch} onChange={(e) => setRetirementMatch(e.target.value)} placeholder="3" className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Health Premium / Month</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={healthMonthly} onChange={(e) => setHealthMonthly(e.target.value)} placeholder="700" className={`${inputClass} pl-7`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Other Annual Costs</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" value={otherCosts} onChange={(e) => setOtherCosts(e.target.value)} placeholder="2,000" className={`${inputClass} pl-7`} />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 -mt-2">
          Other costs might include equipment, software licences, training, or recruiting fees.
        </p>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Calculate True Employee Cost
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-sm text-blue-600 font-semibold mb-1">True Annual Cost</p>
            <p className="text-4xl font-black text-blue-700">{fmt0(result.totalCost)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {fmt0(result.monthly)}/month · ${result.hourly.toFixed(2)}/hour fully loaded
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 text-center">
            Employer burden adds <strong>{result.burdenPct.toFixed(1)}%</strong> on top of salary —
            about <strong>{fmt0(result.totalBurden)}</strong> a year.
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Cost Breakdown</p>
            <div className="space-y-2 text-sm">
              {[
                ['Base salary', result.salary],
                ['Employer Social Security (6.2%)', result.employerSS],
                ['Employer Medicare (1.45%)', result.employerMedicare],
                ['FUTA (federal unemployment)', result.futa],
                ['SUTA (state unemployment)', result.suta],
                ["Workers' compensation", result.comp],
                ['Health insurance', result.health],
                ['401(k) match', result.match],
                ...(result.other > 0 ? [['Other costs', result.other]] : []),
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className="font-semibold text-gray-800">{fmt0(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-black text-gray-800">
                <span>Total cost</span>
                <span>{fmt0(result.totalCost)}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ℹ️ Comparing a hire against a contractor? Use the{' '}
            <a href="/1099-vs-w2-calculator" className="underline font-semibold">1099 vs W-2 Calculator</a>.
            Need to issue pay stubs? Try the{' '}
            <a href="/multiple-paystubs" className="underline font-semibold">multiple pay stub generator</a>.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="employee-cost-calculator" title="Employee Cost Calculator" height="860" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What Does an Employee Actually Cost?</h2>
          <p className="leading-relaxed">
            A useful planning rule is that an employee costs <strong>1.25× to 1.4× their salary</strong>
            once mandatory payroll taxes and typical benefits are included. A $60,000 hire commonly
            costs $75,000–$84,000 a year in practice.
          </p>
          <p className="leading-relaxed mt-3">
            Some of that is legally required — the employer share of Social Security and Medicare,
            federal unemployment tax (FUTA), state unemployment tax (SUTA), and in almost every state
            workers' compensation insurance. The rest (health cover, retirement match, equipment) is
            discretionary but usually necessary to hire competitively.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Employer Payroll Taxes at a Glance (2026)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Tax</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Applies To</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Social Security', '6.2%', `First $${FICA.socialSecurityWageBase.toLocaleString('en-US')} of wages`],
                  ['Medicare', '1.45%', 'All wages (no cap)'],
                  ['FUTA', '0.6% effective', 'First $7,000 of wages'],
                  ['SUTA', 'Varies by state', 'State wage base'],
                  ["Workers' comp", 'Varies by risk class', 'Payroll'],
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
          <p className="text-xs text-gray-400 mt-2">
            FUTA is 6.0% before the standard 5.4% state credit, giving the 0.6% effective rate most
            employers pay.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'How much does an employee cost beyond their salary?', a: 'Typically 25–40% on top of base salary. Mandatory employer payroll taxes alone are roughly 8–10%, with health insurance and retirement benefits making up most of the remainder.' },
              { q: 'What payroll taxes does an employer pay?', a: 'Employers pay a matching 6.2% Social Security and 1.45% Medicare on wages, plus FUTA (federal unemployment) and SUTA (state unemployment). Income tax is withheld from the employee, not paid by the employer.' },
              { q: 'What is the difference between FUTA and SUTA?', a: 'FUTA is the federal unemployment tax — 6.0% on the first $7,000 of wages, usually reduced to 0.6% by a state credit. SUTA is the state equivalent; both the rate and wage base are set by your state and depend on your claims history.' },
              { q: 'Is a contractor cheaper than an employee?', a: 'On paper often yes, because you avoid employer payroll taxes and benefits — but contractors charge more to compensate, and misclassifying an employee as a contractor carries serious penalties. Classification is determined by IRS and state tests, not by cost.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/employee-cost-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Estimates for budgeting only — not tax, legal, accounting, or payroll advice. SUTA rates,
          wage bases, workers' compensation rates, and local payroll taxes vary by state, industry,
          and employer. Verify your figures with your state agency and a qualified payroll or tax
          professional.
        </div>
      </div>
    </div>
  )
}
