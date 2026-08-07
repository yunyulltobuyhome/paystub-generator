import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { calcFederalTax, calcFICA, calcStateTax } from '../utils/taxCalculator'
import { STATE_LIST } from '../utils/states'
import RelatedTools from './RelatedTools'
import EmbedSnippet from './EmbedSnippet'
import AdSlot from './AdSlot'
import { AD_SLOTS } from '../config/ads'

const num = (v) => parseFloat(v) || 0
const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
const fmt2 = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function RealHourlyWageCalc() {
  usePageMeta({
    title: 'Real Hourly Wage Calculator — What Your Job Actually Pays (2026)',
    description: 'Your salary divided by 2,080 is not what you earn. Add commute, unpaid overtime, work expenses, and taxes to find your real hourly wage — the number that tells you what an hour of your life is worth.',
    canonicalPath: '/real-hourly-wage-calculator',
  })

  const [salary, setSalary] = useState('')
  const [stateCode, setStateCode] = useState('CA')
  const [contractedHours, setContractedHours] = useState('40')
  const [unpaidOvertime, setUnpaidOvertime] = useState('')
  const [commuteMinutes, setCommuteMinutes] = useState('')
  const [commuteDays, setCommuteDays] = useState('5')
  const [prepMinutes, setPrepMinutes] = useState('')
  const [commuteCost, setCommuteCost] = useState('')
  const [workExpenses, setWorkExpenses] = useState('')
  const [childcare, setChildcare] = useState('')
  const [vacationWeeks, setVacationWeeks] = useState('2')
  const [result, setResult] = useState(null)

  const calculate = () => {
    const gross = num(salary)
    if (gross <= 0) return

    const weeksWorked = Math.max(1, 52 - num(vacationWeeks))

    // Take-home, using the same engine as the rest of the site.
    const federal = calcFederalTax(gross, 'single')
    const { ss, medicare } = calcFICA(gross)
    const state = calcStateTax(gross, stateCode)
    const netPay = gross - federal - ss - medicare - state

    // Money the job costs you that you would not otherwise spend.
    const annualCommuteCost = num(commuteCost) * 12
    const annualWorkExpenses = num(workExpenses) * 12
    const annualChildcare = num(childcare) * 12
    const jobCosts = annualCommuteCost + annualWorkExpenses + annualChildcare
    const realIncome = netPay - jobCosts

    // Hours the job takes, whether or not they are on the clock.
    const paidHoursPerWeek = num(contractedHours)
    const otPerWeek = num(unpaidOvertime)
    const commutePerWeek = (num(commuteMinutes) * 2 * num(commuteDays)) / 60
    const prepPerWeek = (num(prepMinutes) * num(commuteDays)) / 60
    const realHoursPerWeek = paidHoursPerWeek + otPerWeek + commutePerWeek + prepPerWeek

    const nominalHourly = gross / (paidHoursPerWeek * 52)
    const realHourly = realIncome / (realHoursPerWeek * weeksWorked)
    const totalRealHours = realHoursPerWeek * weeksWorked

    setResult({
      gross, netPay, federal, ss, medicare, state,
      jobCosts, annualCommuteCost, annualWorkExpenses, annualChildcare,
      realIncome,
      nominalHourly, realHourly,
      paidHoursPerWeek, otPerWeek, commutePerWeek, prepPerWeek, realHoursPerWeek,
      totalRealHours,
      weeksWorked,
      lossPct: nominalHourly > 0 ? (1 - realHourly / nominalHourly) * 100 : 0,
      extraHoursPerYear: (otPerWeek + commutePerWeek + prepPerWeek) * weeksWorked,
      unpaidDaysPerYear: ((otPerWeek + commutePerWeek + prepPerWeek) * weeksWorked) / 24,
    })
  }

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-xs font-semibold text-gray-700 mb-1'

  const FAQ = [
    { q: 'What is a real hourly wage?', a: 'It is what you actually keep, divided by all the time the job actually takes. Standard salary-to-hourly maths uses gross pay and 2,080 hours. Your real wage uses take-home pay after taxes, minus the costs the job creates, divided by paid hours plus unpaid overtime, commuting, and preparation time.' },
    { q: 'Why is my real hourly wage so much lower than my salary suggests?', a: 'Three things compound. Taxes remove 20-35% of gross. Job-related costs like commuting, parking, and childcare come out of what is left. And the hours are larger than the contract says once commuting and unpaid overtime are counted. A 25-35% gap between nominal and real is common.' },
    { q: 'Should I include childcare as a job cost?', a: 'Include it if you pay for it because you work. It is one of the largest job-related costs there is, and leaving it out can make a second household income look far more worthwhile than it is. If you would pay for the same care regardless, leave it out.' },
    { q: 'How do I use this number?', a: 'As a comparison tool. Run it for your current job and again for an offer — a role paying less with a short commute and no unpaid overtime often wins on real wage. It is also useful for purchasing decisions: dividing a price by your real hourly wage shows how many hours of your life it actually costs.' },
    { q: 'Does a remote job change the result much?', a: 'Usually a lot. Removing a 45-minute each-way commute gives back roughly 7.5 hours a week — nearly a full working day — plus the fuel, parking, and transit costs attached to it.' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Real Hourly Wage Calculator',
        'url': 'https://myfreepaystub.com/real-hourly-wage-calculator',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Calculate your true hourly wage after taxes, commute, unpaid overtime, and job-related expenses.',
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': FAQ.map((x) => ({ '@type': 'Question', 'name': x.q, 'acceptedAnswer': { '@type': 'Answer', 'text': x.a } })),
      }) }} />

      <div className="mb-6">
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold">Eye-opener</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-1">Real Hourly Wage Calculator</h1>
        <p className="text-sm text-gray-500">
          Your salary ÷ 2,080 is a fiction. Once taxes, the commute, unpaid overtime, and what the job
          costs you are counted, most people earn far less per hour than they think. Here's your real number.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Annual Salary *</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
              <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="70,000" className={`${inputClass} pl-7`} />
            </div>
          </div>
          <div>
            <label className={labelClass}>State</label>
            <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputClass}>
              {[...STATE_LIST].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Your Real Hours</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Contracted Hours / Week</label>
              <input type="number" step="0.5" value={contractedHours} onChange={(e) => setContractedHours(e.target.value)} placeholder="40" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Unpaid Overtime / Week</label>
              <input type="number" step="0.5" value={unpaidOvertime} onChange={(e) => setUnpaidOvertime(e.target.value)} placeholder="5" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Commute Each Way (min)</label>
              <input type="number" value={commuteMinutes} onChange={(e) => setCommuteMinutes(e.target.value)} placeholder="30" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Commuting Days / Week</label>
              <input type="number" step="0.5" value={commuteDays} onChange={(e) => setCommuteDays(e.target.value)} placeholder="5" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Getting Ready (min/day)</label>
              <input type="number" value={prepMinutes} onChange={(e) => setPrepMinutes(e.target.value)} placeholder="20" className={inputClass} />
              <p className="text-xs text-gray-400 mt-1">Time you'd skip if you didn't work</p>
            </div>
            <div>
              <label className={labelClass}>Weeks Off / Year</label>
              <input type="number" step="0.5" value={vacationWeeks} onChange={(e) => setVacationWeeks(e.target.value)} placeholder="2" className={inputClass} />
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">What the Job Costs You (monthly)</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Commuting', commuteCost, setCommuteCost, '200', 'Fuel, transit, parking'],
              ['Work Expenses', workExpenses, setWorkExpenses, '100', 'Clothes, lunches, coffee'],
              ['Childcare', childcare, setChildcare, '0', 'Only if you pay it to work'],
            ].map(([label, val, setter, ph, hint]) => (
              <div key={label}>
                <label className={labelClass}>{label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input type="number" value={val} onChange={(e) => setter(e.target.value)} placeholder={ph} className={`${inputClass} pl-7`} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{hint}</p>
              </div>
            ))}
          </div>
        </div>

        <button onClick={calculate} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Show My Real Hourly Wage
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 font-semibold uppercase">What You Think</p>
              <p className="text-2xl font-black text-gray-500 line-through">{fmt2(result.nominalHourly)}</p>
              <p className="text-xs text-gray-400 mt-0.5">salary ÷ paid hours</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
              <p className="text-xs text-purple-600 font-semibold uppercase">What You Earn</p>
              <p className="text-3xl font-black text-purple-700">{fmt2(result.realHourly)}</p>
              <p className="text-xs text-gray-400 mt-0.5">real hourly wage</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-5 text-center">
            <p className="text-sm text-purple-800">
              Your real wage is <strong>{result.lossPct.toFixed(0)}% lower</strong> than your salary implies.
            </p>
            {result.extraHoursPerYear > 0 && (
              <p className="text-xs text-purple-700 mt-2">
                You give the job <strong>{Math.round(result.extraHoursPerYear).toLocaleString('en-US')} unpaid hours a year</strong> —
                about {result.unpaidDaysPerYear.toFixed(0)} full 24-hour days of your life.
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Where It Goes</p>
            <div className="space-y-2 text-sm">
              {[
                ['Gross salary', result.gross, false],
                ['Federal income tax', -result.federal, true],
                ['Social Security & Medicare', -(result.ss + result.medicare), true],
                ...(result.state > 0 ? [['State income tax', -result.state, true]] : []),
                ['Take-home pay', result.netPay, false],
                ...(result.annualCommuteCost > 0 ? [['Commuting costs', -result.annualCommuteCost, true]] : []),
                ...(result.annualWorkExpenses > 0 ? [['Work expenses', -result.annualWorkExpenses, true]] : []),
                ...(result.annualChildcare > 0 ? [['Childcare', -result.annualChildcare, true]] : []),
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between border-b border-gray-50 py-1.5 ${sub ? 'text-gray-500 text-xs pl-3' : 'text-gray-700'}`}>
                  <span>{label}</span>
                  <span className={sub ? 'text-red-500' : 'font-semibold'}>{val < 0 ? `(${fmt0(-val)})` : fmt0(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-black text-purple-700">
                <span>What the job actually leaves you</span>
                <span>{fmt0(result.realIncome)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Hours the Job Really Takes</p>
            <div className="space-y-2 text-sm">
              {[
                ['Contracted hours', result.paidHoursPerWeek],
                ['Unpaid overtime', result.otPerWeek],
                ['Commuting', result.commutePerWeek],
                ['Getting ready', result.prepPerWeek],
              ].filter(([, v]) => v > 0).map(([l, v], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{l}</span>
                  <span className="font-semibold text-gray-800">{v.toFixed(1)} hrs/wk</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-black text-gray-800">
                <span>Real weekly commitment</span>
                <span>{result.realHoursPerWeek.toFixed(1)} hrs</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {Math.round(result.totalRealHours).toLocaleString('en-US')} hours a year across {result.weeksWorked} working weeks.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
            💡 <strong>Try this:</strong> divide the price of something you're considering by{' '}
            {fmt2(result.realHourly)}. A $1,200 purchase costs{' '}
            <strong>{Math.round(1200 / Math.max(result.realHourly, 0.01))} hours</strong> of your life at
            your real wage. Comparing a job offer? Run it again — a lower salary with no commute often wins.
          </div>
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8"><EmbedSnippet tool="real-hourly-wage-calculator" title="Real Hourly Wage Calculator" height="900" /></div>

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Why Salary ÷ 2,080 Lies to You</h2>
          <p className="leading-relaxed">
            The standard conversion assumes you are paid for every hour the job takes and that the money
            arrives untouched. Neither is true. Taxes take a fifth to a third of gross before you see it.
            The commute is time the job consumes but does not pay for. Unpaid overtime is the same. And
            some of what lands in your account goes straight back out on costs that exist only because
            you have this job.
          </p>
          <p className="leading-relaxed mt-3">
            Counting all of it gives a number you can actually reason with — and it is usually
            <strong> 25% to 40% below</strong> the figure on your offer letter.
          </p>
        </div>

        <AdSlot slot={AD_SLOTS.article} />

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How a Commute Eats a Salary</h2>
          <p className="leading-relaxed mb-3">
            Time lost per year to commuting alone, at five days a week for 50 weeks:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Each Way</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Per Week</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Per Year</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Working Days*</th>
                </tr>
              </thead>
              <tbody>
                {[15, 30, 45, 60, 90].map((m, i) => {
                  const wk = (m * 2 * 5) / 60
                  const yr = wk * 50
                  return (
                    <tr key={m} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200 font-medium">{m} min</td>
                      <td className="p-2 border border-gray-200">{wk.toFixed(1)} hrs</td>
                      <td className="p-2 border border-gray-200 text-blue-600 font-semibold">{Math.round(yr)} hrs</td>
                      <td className="p-2 border border-gray-200">{(yr / 8).toFixed(0)} days</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-2">*Equivalent 8-hour working days spent travelling, unpaid.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Next Steps</h2>
          <p className="leading-relaxed">
            If the gap surprised you, the useful follow-ups are working out{' '}
            <Link to="/net-to-gross-calculator" className="text-blue-600 hover:underline">the salary you would need</Link>{' '}
            to hit a target take-home, checking{' '}
            <Link to="/paycheck-checker" className="text-blue-600 hover:underline">whether your paycheck is even correct</Link>,
            or seeing what the same salary leaves you in{' '}
            <Link to="/paycheck-calculator" className="text-blue-600 hover:underline">a different state</Link>.
          </p>
        </div>

        <RelatedTools current="/real-hourly-wage-calculator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ Estimates for personal planning only — not tax or financial advice. Take-home pay assumes a
          single filer with the standard deduction and an approximate flat state rate, and ignores
          pre-tax benefits, credits, and local taxes. Which costs count as job-related is a judgement
          call; the result is a comparison aid, not an accounting of your finances.
        </div>
      </div>
    </div>
  )
}
