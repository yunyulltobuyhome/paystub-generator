import { useState, useMemo } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  federalHolidays, buildPayDates, annotatePayDates, parseISO, toISO,
  FREQUENCIES, MONTH_NAMES, fmtDate,
} from '../utils/payrollCalendar'
import RelatedTools from './RelatedTools'
import AdSlot from './AdSlot'
import { AD_SLOTS } from '../config/ads'

const YEARS = [2026, 2027, 2028]

// First Friday of a year — the most common bi-weekly payday anchor, used so the
// page renders a complete, useful calendar before any interaction (and in the
// static HTML crawlers receive).
function firstFriday(year) {
  const d = new Date(year, 0, 1)
  while (d.getDay() !== 5) d.setDate(d.getDate() + 1)
  return d
}

export default function PayrollCalendarGenerator() {
  usePageMeta({
    title: '2026 Payroll Calendar Generator — Free Biweekly Pay Period Calendar',
    description: 'Free payroll calendar generator. Pick your pay frequency and first payday to get every pay date for 2026, with pay periods, bank holiday warnings, and 27-pay-period detection. Printable.',
    canonicalPath: '/payroll-calendar',
  })

  const [year, setYear] = useState(2026)
  const [frequency, setFrequency] = useState('biweekly')
  const [anchorIso, setAnchorIso] = useState(toISO(firstFriday(2026)))
  const [semiFirst, setSemiFirst] = useState('15')
  const [semiSecond, setSemiSecond] = useState('last')

  const holidays = useMemo(() => federalHolidays(year), [year])

  const rows = useMemo(() => {
    const anchor = parseISO(anchorIso)
    const dates = buildPayDates({
      year, frequency, anchor,
      semiFirst: semiFirst === 'last' ? 'last' : Number(semiFirst),
      semiSecond: semiSecond === 'last' ? 'last' : Number(semiSecond),
    })
    return annotatePayDates(dates, frequency, holidays)
  }, [year, frequency, anchorIso, semiFirst, semiSecond, holidays])

  const freqMeta = FREQUENCIES.find((f) => f.v === frequency) || FREQUENCIES[1]
  const isExtraPeriodYear =
    (frequency === 'biweekly' && rows.length === 27) || (frequency === 'weekly' && rows.length === 53)
  const conflicts = rows.filter((r) => r.needsAdjustment)

  const byMonth = useMemo(() => {
    const m = Array.from({ length: 12 }, () => [])
    for (const r of rows) m[r.date.getMonth()].push(r)
    return m
  }, [rows])

  const inputClass = 'w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm'
  const labelClass = 'block text-sm font-semibold text-gray-700 mb-1'

  const FAQ = [
    { q: 'How many pay periods are in a year?', a: 'Weekly pay gives 52 (occasionally 53), bi-weekly gives 26 (occasionally 27), semi-monthly always gives 24, and monthly always gives 12. The extra weekly or bi-weekly period happens because 52 weeks is slightly less than a full calendar year, so the dates drift forward.' },
    { q: 'What is a 27 pay period year and why does it matter?', a: 'Roughly every 11 years a bi-weekly schedule produces 27 paydays instead of 26. Salaried employees paid a fixed amount per period would receive an extra payment, so employers must decide in advance whether to absorb the cost or spread the annual salary across 27 periods. Set your first payday above and the generator tells you immediately.' },
    { q: 'What happens when payday falls on a weekend or holiday?', a: 'Banks do not process ACH transfers on weekends or federal holidays. Most employers move the payday to the preceding business day so employees are not paid late. The calendar below flags every affected date and shows the likely adjusted date.' },
    { q: 'What is the difference between semi-monthly and bi-weekly?', a: 'Semi-monthly pays twice a month on fixed dates (commonly the 15th and last day) for 24 paychecks a year. Bi-weekly pays every 14 days for 26 paychecks. Bi-weekly paydays always land on the same weekday; semi-monthly dates move around the week.' },
    { q: 'Is this payroll calendar official?', a: 'No. It is a planning tool generated from the schedule you enter. Your employer sets the actual pay dates, and their policy on weekend and holiday adjustments may differ from the common practice shown here.' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Payroll Calendar Generator',
        'url': 'https://myfreepaystub.com/payroll-calendar',
        'applicationCategory': 'BusinessApplication',
        'operatingSystem': 'Any',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': 'Generate a full-year payroll calendar with pay periods, bank holiday warnings, and 27-pay-period detection.',
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': FAQ.map((f) => ({ '@type': 'Question', 'name': f.q, 'acceptedAnswer': { '@type': 'Answer', 'text': f.a } })),
      }) }} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">{year} Payroll Calendar Generator</h1>
        <p className="text-sm text-gray-500">
          Every payday for the year, built from your own schedule — with pay periods, bank holiday
          warnings, and a heads-up if you land in a 27-pay-period year.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4 print:hidden">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Year</label>
            <select value={year} onChange={(e) => { const y = Number(e.target.value); setYear(y); setAnchorIso(toISO(firstFriday(y))) }} className={inputClass}>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Pay Frequency</label>
            <select value={frequency} onChange={(e) => setFrequency(e.target.value)} className={inputClass}>
              {FREQUENCIES.map((f) => <option key={f.v} value={f.v}>{f.label}</option>)}
            </select>
          </div>
        </div>

        {frequency === 'semimonthly' ? (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>First Payday of Month</label>
              <select value={semiFirst} onChange={(e) => setSemiFirst(e.target.value)} className={inputClass}>
                {[1, 5, 10, 15, 20, 25].map((d) => <option key={d} value={d}>{d}th</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Second Payday of Month</label>
              <select value={semiSecond} onChange={(e) => setSemiSecond(e.target.value)} className={inputClass}>
                <option value="last">Last day</option>
                {[15, 20, 25, 28, 30].map((d) => <option key={d} value={d}>{d}th</option>)}
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className={labelClass}>
              {frequency === 'monthly' ? 'Payday (day of month)' : 'Any Known Payday'}
            </label>
            <input type="date" value={anchorIso} onChange={(e) => setAnchorIso(e.target.value)} className={inputClass} />
            <p className="text-xs text-gray-400 mt-1">
              {frequency === 'monthly'
                ? 'The day of the month is used; short months fall back to the last day.'
                : 'Enter any single payday you know — the whole year is projected from it.'}
            </p>
          </div>
        )}

        <button onClick={() => window.print()} className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-blue-700">{rows.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Paydays in {year}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-emerald-700">{freqMeta.perYear}</p>
          <p className="text-xs text-gray-500 mt-0.5">Typical year</p>
        </div>
        <div className={`border rounded-xl p-3 text-center ${conflicts.length > 0 ? 'bg-amber-50 border-amber-200' : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-2xl font-black ${conflicts.length > 0 ? 'text-amber-700' : 'text-gray-700'}`}>{conflicts.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Need adjusting</p>
        </div>
      </div>

      {isExtraPeriodYear && (
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
          ⚠️ <strong>This is a {rows.length}-pay-period year.</strong> On this schedule {year} contains
          one more payday than the usual {freqMeta.perYear}. For salaried staff paid a fixed amount
          each period, that is an extra payroll run to budget for — employers typically either absorb
          the additional cost or divide the annual salary by {rows.length} instead of {freqMeta.perYear}.
        </div>
      )}

      <AdSlot slot={AD_SLOTS.result} />

      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base font-bold text-gray-800 mb-4">{year} Pay Schedule</h2>
        <div className="space-y-5">
          {byMonth.map((monthRows, m) => (
            monthRows.length === 0 ? null : (
              <div key={m}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">{MONTH_NAMES[m]}</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-2 border border-gray-200 font-semibold">Payday</th>
                        <th className="text-left p-2 border border-gray-200 font-semibold">Pay Period</th>
                        <th className="text-left p-2 border border-gray-200 font-semibold">Note</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthRows.map((r) => (
                        <tr key={r.iso} className={r.needsAdjustment ? 'bg-amber-50' : 'bg-white'}>
                          <td className="p-2 border border-gray-200 font-semibold text-gray-800 whitespace-nowrap">
                            {r.date.toLocaleDateString('en-US', { weekday: 'short' })} {fmtDate(r.date)}
                          </td>
                          <td className="p-2 border border-gray-200 text-gray-500 whitespace-nowrap">
                            {r.periodStart ? `${fmtDate(r.periodStart)} – ${fmtDate(r.periodEnd)}` : '—'}
                          </td>
                          <td className="p-2 border border-gray-200 text-gray-600">
                            {r.holiday
                              ? <span className="text-amber-700">{r.holiday} — likely paid {fmtDate(r.adjusted)}</span>
                              : r.isWeekend
                              ? <span className="text-amber-700">Weekend — likely paid {fmtDate(r.adjusted)}</span>
                              : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6">
        <h2 className="text-base font-bold text-gray-800 mb-3">{year} Federal Holidays (Banks Closed)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-2 border border-gray-200 font-semibold">Holiday</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Date</th>
                <th className="text-left p-2 border border-gray-200 font-semibold">Observed</th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((h, i) => (
                <tr key={h.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-2 border border-gray-200 font-medium">{h.name}</td>
                  <td className="p-2 border border-gray-200 text-gray-600">
                    {h.date.toLocaleDateString('en-US', { weekday: 'short' })} {fmtDate(h.date)}
                  </td>
                  <td className="p-2 border border-gray-200 text-gray-600">
                    {toISO(h.observed) !== toISO(h.date)
                      ? <span className="text-amber-700">{fmtDate(h.observed)}</span>
                      : 'Same day'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Direct deposits do not settle on these days. A payday landing on or just after a holiday is
          commonly moved earlier.
        </p>
      </div>

      <AdSlot slot={AD_SLOTS.article} />

      <div className="mt-8 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Pay Frequencies Compared</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Frequency</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Paychecks</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Weekly', '52 (sometimes 53)', 'Same weekday every week. Common in trades and hourly roles.'],
                  ['Bi-Weekly', '26 (sometimes 27)', 'Every 14 days. The most common US schedule; two months a year have three paydays.'],
                  ['Semi-Monthly', '24 always', 'Fixed dates such as the 15th and last day. Simpler for salaried payroll.'],
                  ['Monthly', '12 always', 'One payday a month. Least common for hourly staff.'],
                ].map(([a, b, c], i) => (
                  <tr key={a} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{a}</td>
                    <td className="p-2 border border-gray-200 text-blue-600 font-semibold">{b}</td>
                    <td className="p-2 border border-gray-200">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

        <RelatedTools current="/payroll-calendar" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ A planning tool, not an official payroll schedule and not legal or payroll advice. Your
          employer sets actual pay dates, and their handling of weekend and holiday paydays may
          differ from the common practice shown. Some states regulate pay frequency and timing —
          check your state labor department and your payroll provider before relying on these dates.
        </div>
      </div>
    </div>
  )
}
