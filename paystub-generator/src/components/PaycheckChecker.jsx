import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { auditPaycheck } from '../utils/paycheckAudit'
import { STATE_LIST } from '../utils/states'
import { getPayPeriods } from '../utils/taxCalculator'
import RelatedTools from './RelatedTools'
import AdSlot from './AdSlot'
import { AD_SLOTS } from '../config/ads'

const num = (v) => parseFloat(v) || 0

export default function PaycheckChecker() {
  usePageMeta({
    title: 'Paycheck Checker — Is My Paycheck Correct? Free Pay Stub Audit (2026)',
    description: 'Free paycheck checker. Enter the numbers from your pay stub and instantly see whether your Social Security, Medicare, overtime, and net pay actually add up — and what to ask your employer.',
    canonicalPath: '/paycheck-checker',
  })

  const [payType, setPayType] = useState('hourly')
  const [frequency, setFrequency] = useState('biweekly')
  const [stateCode, setStateCode] = useState('CA')
  const [f, setF] = useState({
    gross: '', hourlyRate: '', regularHours: '', otHours: '',
    federal: '', socialSecurity: '', medicare: '', stateTax: '',
    preTaxHealth: '', retirement401k: '', otherDeductions: '', net: '', ytdGross: '',
  })
  const [result, setResult] = useState(null)

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))

  const run = () => {
    if (num(f.gross) <= 0) return
    const st = STATE_LIST.find((s) => s.code === stateCode)
    setResult(auditPaycheck({
      payType,
      gross: num(f.gross),
      hourlyRate: num(f.hourlyRate),
      regularHours: num(f.regularHours),
      otHours: num(f.otHours),
      federal: num(f.federal),
      socialSecurity: num(f.socialSecurity),
      medicare: num(f.medicare),
      stateTax: num(f.stateTax),
      preTaxHealth: num(f.preTaxHealth),
      retirement401k: num(f.retirement401k),
      otherDeductions: num(f.otherDeductions),
      net: num(f.net),
      ytdGross: num(f.ytdGross),
      stateHasIncomeTax: (st?.rate || 0) > 0,
      stateName: st?.name || 'your state',
      periodsPerYear: getPayPeriods(frequency),
    }))
  }

  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const inputClass = 'w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-xs font-semibold text-gray-700 mb-1'

  const Money = ({ k, label, hint }) => (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
        <input type="number" step="0.01" value={f[k]} onChange={(e) => set(k, e.target.value)}
          placeholder="0.00" className={`${inputClass} pl-7`} />
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  )

  const FAQ = [
    { q: 'How do I know if my paycheck is correct?', a: 'Check the parts that follow fixed rules. Social Security must be 6.2% of your FICA wages and Medicare 1.45%, overtime is normally 1.5x your rate beyond 40 hours a week, gross should equal your rate times your hours, and gross minus every deduction must equal your net pay. This tool checks all of those at once.' },
    { q: 'My Social Security deduction looks wrong. What causes that?', a: 'Most often pre-tax insurance, which lowers the wages Social Security is charged on, or hitting the annual wage cap after which the deduction stops entirely. If neither applies, the percentage should be exactly 6.2% and a mismatch is worth raising with payroll.' },
    { q: 'Why is no federal income tax being withheld from my paycheck?', a: 'That is usually a W-4 outcome rather than a mistake — low earnings, dependents claimed in Step 3, or an exempt claim will all produce $0. It is not an error by itself, but if it runs all year you may owe when you file.' },
    { q: 'What should I do if my paycheck is wrong?', a: 'Start with payroll or HR and ask them to walk through the specific line. Bring the stub and the figure you expected. Most discrepancies are data-entry or setup issues that are corrected on the next run. If pay was genuinely withheld or overtime unpaid, your state labor department and the US Department of Labor handle wage complaints.' },
    { q: 'Does this tool see my pay information?', a: 'No. Everything is calculated inside your browser and nothing is uploaded, stored, or shared. Closing the tab discards it.' },
  ]

  const sevStyle = {
    error: { box: 'bg-red-50 border-red-200', tag: 'bg-red-600', label: 'Does not add up' },
    check: { box: 'bg-amber-50 border-amber-200', tag: 'bg-amber-500', label: 'Worth asking about' },
    info: { box: 'bg-blue-50 border-blue-200', tag: 'bg-blue-500', label: 'Context' },
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Paycheck Checker',
        'url': 'https://myfreepaystub.com/paycheck-checker',
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Check whether the numbers on your pay stub add up — FICA rates, overtime multiples, and net pay.',
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': FAQ.map((x) => ({ '@type': 'Question', 'name': x.q, 'acceptedAnswer': { '@type': 'Answer', 'text': x.a } })),
      }) }} />

      <div className="mb-6">
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-semibold">Free · Nothing leaves your browser</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-1">Is My Paycheck Correct?</h1>
        <p className="text-sm text-gray-500">
          Most people never check. Type the numbers off your pay stub and this will tell you whether
          the math holds — and exactly what to ask your employer if it doesn't.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200/80 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Pay Type</label>
            <div className="grid grid-cols-2 gap-2">
              {[['hourly', 'Hourly'], ['salary', 'Salary']].map(([v, l]) => (
                <button key={v} onClick={() => setPayType(v)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                    payType === v ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelClass}>Pay Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputClass}>
              <option value="weekly">Weekly</option>
              <option value="biweekly">Bi-Weekly</option>
              <option value="semimonthly">Semi-Monthly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Work State</label>
          <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} className={inputClass}>
            {[...STATE_LIST].sort((a, b) => a.name.localeCompare(b.name)).map((s) => (
              <option key={s.code} value={s.code}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Earnings</p>
          <div className="grid grid-cols-2 gap-3">
            <Money k="gross" label="Gross Pay (this period) *" />
            {payType === 'hourly' && <Money k="hourlyRate" label="Your Hourly Rate" />}
          </div>
          {payType === 'hourly' && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className={labelClass}>Regular Hours</label>
                <input type="number" step="0.01" value={f.regularHours} onChange={(e) => set('regularHours', e.target.value)} placeholder="80" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Overtime Hours</label>
                <input type="number" step="0.01" value={f.otHours} onChange={(e) => set('otHours', e.target.value)} placeholder="0" className={inputClass} />
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Taxes Withheld</p>
          <div className="grid grid-cols-2 gap-3">
            <Money k="federal" label="Federal Income Tax" />
            <Money k="stateTax" label="State Income Tax" />
            <Money k="socialSecurity" label="Social Security / OASDI" />
            <Money k="medicare" label="Medicare" />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Other Deductions</p>
          <div className="grid grid-cols-2 gap-3">
            <Money k="preTaxHealth" label="Pre-Tax Insurance" hint="Health/dental/vision — lowers FICA" />
            <Money k="retirement401k" label="401(k) / Retirement" />
            <Money k="otherDeductions" label="Everything Else" hint="Union dues, garnishments, HSA…" />
            <Money k="ytdGross" label="YTD Gross (optional)" hint="Improves accuracy for high earners" />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <Money k="net" label="Net Pay — what you actually received *" />
        </div>

        <button onClick={run} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
          Check My Paycheck
        </button>
      </div>

      {result && (
        <div className="mt-6 space-y-4">
          <div className={`border rounded-xl p-5 text-center ${
            result.errors > 0 ? 'bg-red-50 border-red-200'
            : result.checks > 0 ? 'bg-amber-50 border-amber-200'
            : 'bg-emerald-50 border-emerald-200'
          }`}>
            <p className="text-4xl mb-1">{result.errors > 0 ? '🚩' : result.checks > 0 ? '⚠️' : '✅'}</p>
            <p className={`text-xl font-extrabold ${
              result.errors > 0 ? 'text-red-700' : result.checks > 0 ? 'text-amber-700' : 'text-emerald-700'
            }`}>
              {result.errors > 0
                ? `${result.errors} thing${result.errors > 1 ? 's' : ''} that doesn't add up`
                : result.checks > 0
                ? `${result.checks} thing${result.checks > 1 ? 's' : ''} worth asking about`
                : 'The math on your stub checks out'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {result.clean
                ? 'Every figure we can verify lines up with the standard rates.'
                : 'Findings below, each with the usual innocent explanation.'}
            </p>
          </div>

          {result.findings.length > 0 && (
            <div className="space-y-3">
              {result.findings.map((x, i) => {
                const s = sevStyle[x.severity]
                return (
                  <div key={i} className={`border rounded-xl p-4 ${s.box}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className={`${s.tag} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide`}>{s.label}</span>
                    </div>
                    <p className="font-bold text-gray-800 text-sm mb-1">{x.title}</p>
                    <p className="text-xs text-gray-700 leading-relaxed mb-2">{x.detail}</p>
                    <p className="text-xs text-gray-500 leading-relaxed"><strong>Why this often happens:</strong> {x.why}</p>
                  </div>
                )
              })}
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">What We Expected</p>
            <div className="space-y-2 text-sm">
              {[
                ['FICA wage base (gross − pre-tax insurance)', result.ficaBase],
                ['Expected Social Security (6.2%)', result.expectedSS],
                ['Expected Medicare (1.45%)', result.expectedMedicare],
                ['Total deductions you entered', result.totalDeductions],
                ['Net pay implied by your numbers', result.expectedNet],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{l}</span>
                  <span className="font-semibold text-gray-800">{fmt(v)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Effective tax rate on this paycheck: {(result.effectiveTaxRate * 100).toFixed(1)}%.
            </p>
          </div>

          {!result.clean && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-800">
              💬 <strong>How to raise it:</strong> ask payroll or HR to walk you through the specific
              line, with the stub in hand and the figure you expected. Most discrepancies are setup or
              data-entry issues fixed on the next run. If pay or overtime was genuinely not paid, your
              state labor department and the{' '}
              <a href="https://www.dol.gov/agencies/whd" target="_blank" rel="noopener noreferrer" className="underline font-semibold">US Department of Labor</a>{' '}
              handle wage complaints.
            </div>
          )}
          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What Can Actually Be Verified on a Pay Stub</h2>
          <p className="leading-relaxed mb-3">
            Some payroll numbers follow fixed rules, so they can be checked exactly. Others depend on
            choices only you and your employer know. This tool sticks to the first group.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Line</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rule</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Checkable?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Social Security', 'Exactly 6.2%, stops at the annual wage cap', 'Yes — exact'],
                  ['Medicare', '1.45%, no cap, +0.9% on high wages', 'Yes — exact'],
                  ['Net pay', 'Gross minus every deduction', 'Yes — arithmetic'],
                  ['Gross (hourly)', 'Rate × hours, overtime at 1.5×', 'Yes — arithmetic'],
                  ['Federal income tax', 'Depends on your W-4 elections', 'No — context only'],
                  ['State income tax', 'Varies by state and state form', 'Partly'],
                ].map(([a, b, c], i) => (
                  <tr key={a} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{a}</td>
                    <td className="p-2 border border-gray-200">{b}</td>
                    <td className={`p-2 border border-gray-200 font-semibold ${c.startsWith('Yes') ? 'text-emerald-600' : 'text-gray-400'}`}>{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AdSlot slot={AD_SLOTS.article} />

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">The Most Common Paycheck Mistakes</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Overtime at the wrong rate</strong> — paid straight time instead of 1.5×, or overtime calculated per pay period instead of per workweek.</li>
            <li><strong>Hours missing</strong> — an unrecorded shift, or time rounded against you every day.</li>
            <li><strong>Deduction taken twice</strong> — insurance premiums pulled on both stubs of a three-paycheck month.</li>
            <li><strong>Wrong state</strong> — withholding set to the company's home state rather than where you actually work.</li>
            <li><strong>Stale W-4</strong> — not wrong, but a life change you never filed leaves withholding far off.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            Reading every line first helps —{' '}
            <Link to="/guides/how-to-read-your-pay-stub" className="text-blue-600 hover:underline">our pay stub guide</Link>{' '}
            explains each abbreviation, and the{' '}
            <Link to="/guides/pay-stub-abbreviations" className="text-blue-600 hover:underline">abbreviation cheat sheet</Link>{' '}
            decodes the codes.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
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

        <RelatedTools current="/paycheck-checker" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ This is an arithmetic check for your own information — not legal, tax, or payroll advice,
          and not an audit or a determination that anyone did anything wrong. A flagged line very
          often has a legitimate explanation this tool cannot see, such as pre-tax benefits, multiple
          state withholding, supplemental wage rates, retroactive adjustments, or an exempt
          classification. Confirm anything you are unsure about with your payroll department, and
          contact your state labor department or the US Department of Labor for wage disputes.
        </div>
      </div>
    </div>
  )
}
