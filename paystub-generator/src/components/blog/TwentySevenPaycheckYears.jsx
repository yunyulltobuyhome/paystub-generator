import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { buildPayDates } from '../../utils/payrollCalendar'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const FIRST_YEAR = 2026
const LAST_YEAR = 2040
const WEEKDAYS = [
  { dow: 1, label: 'Monday' },
  { dow: 2, label: 'Tuesday' },
  { dow: 3, label: 'Wednesday' },
  { dow: 4, label: 'Thursday' },
  { dow: 5, label: 'Friday' },
]

const fmt0 = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')

// Count paydays in a year for a schedule whose payday always falls on the same
// weekday. Computed from the same date engine the payroll calendar tool uses,
// so this table is generated rather than transcribed — it cannot be stale and
// it cannot disagree with the tool.
function payCount(year, dow, frequency) {
  const anchor = new Date(year, 0, 1)
  while (anchor.getDay() !== dow) anchor.setDate(anchor.getDate() + 1)
  return buildPayDates({ year, frequency, anchor }).length
}

export default function TwentySevenPaycheckYears() {
  usePageMeta({
    title: 'Which Years Have 27 Paychecks? Every Year Through 2040, By Payday',
    description: 'We computed 27-paycheck (and 53-paycheck) years for every payday weekday from 2026 to 2040. Find your own payday in the table, see what the extra payroll run costs, and how employers handle it.',
    canonicalPath: '/guides/27-paycheck-years',
  })

  const { biweekly, weekly, noneYears, doubleYears } = useMemo(() => {
    const build = (frequency, extra) => {
      const rows = []
      for (let y = FIRST_YEAR; y <= LAST_YEAR; y++) {
        const hits = WEEKDAYS.filter((w) => payCount(y, w.dow, frequency) === extra).map((w) => w.label)
        rows.push({ year: y, hits })
      }
      return rows
    }
    const bi = build('biweekly', 27)
    return {
      biweekly: bi,
      weekly: build('weekly', 53),
      noneYears: bi.filter((r) => r.hits.length === 0).map((r) => r.year),
      doubleYears: bi.filter((r) => r.hits.length > 1).map((r) => r.year),
    }
  }, [])

  // Cost illustration, computed rather than asserted.
  const SAMPLE_SALARY = 60000
  const extraRun = SAMPLE_SALARY / 26
  const perPeriod27 = SAMPLE_SALARY / 27
  const perPeriodDrop = extraRun - perPeriod27

  const FAQ = [
    { q: 'Which years have 27 pay periods?', a: `It depends entirely on which weekday your payday falls on, which is why a single answer circulating online is usually wrong. On a bi-weekly schedule between ${FIRST_YEAR} and ${LAST_YEAR}, Thursday paydays hit 27 in 2026 and Friday paydays in 2027, while ${noneYears.slice(0, 4).join(', ')} give 27 to no weekday at all. The table on this page lists every combination.` },
    { q: 'Why does a 27th paycheck happen?', a: 'A bi-weekly schedule pays every 14 days, which is 364 days across 26 payments — one day short of a common year and two short of a leap year. That shortfall accumulates, and roughly every eleven years it pushes an extra payday into the calendar year.' },
    { q: 'Do salaried employees get paid extra in a 27-paycheck year?', a: `Only if the employer keeps the per-period amount the same. On a ${fmt0(SAMPLE_SALARY)} salary that means paying ${fmt0(extraRun)} more for the year. The alternative is dividing the annual salary by 27 instead of 26, which pays the same total but reduces every paycheck by about ${fmt0(perPeriodDrop)}.` },
    { q: 'Does this affect hourly employees?', a: 'Not in the same way. Hourly staff are paid for hours worked, so an extra pay date is simply another period, not extra money. The impact is on salaried staff paid a fixed amount per period, and on any deduction that is taken per paycheck rather than per month.' },
    { q: 'What about semi-monthly and monthly payroll?', a: 'Neither is ever affected. Semi-monthly is always exactly 24 pay periods and monthly always 12, because both are tied to calendar months rather than a fixed number of days. Only weekly and bi-weekly schedules drift.' },
  ]

  const Table = ({ rows, extra, normal, label }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-2 border border-gray-200 font-semibold">Year</th>
            {WEEKDAYS.map((w) => (
              <th key={w.dow} className="text-center p-2 border border-gray-200 font-semibold">{w.label.slice(0, 3)}</th>
            ))}
            <th className="text-left p-2 border border-gray-200 font-semibold">Affected paydays</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.year} className={r.hits.length > 0 ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-2 border border-gray-200 font-semibold text-gray-800">{r.year}</td>
              {WEEKDAYS.map((w) => (
                <td key={w.dow} className={`p-2 border border-gray-200 text-center ${r.hits.includes(w.label) ? 'font-black text-amber-700' : 'text-gray-400'}`}>
                  {r.hits.includes(w.label) ? extra : normal}
                </td>
              ))}
              <td className="p-2 border border-gray-200 text-gray-600">
                {r.hits.length ? r.hits.join(', ') : <span className="text-gray-300">none</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-gray-400 mt-2">{label}</p>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="Which Years Have 27 Paychecks? Every Year Through 2040, By Payday"
        description="Computed 27-paycheck and 53-paycheck years for every payday weekday from 2026 to 2040, with the cost of the extra payroll run."
        slug="/guides/27-paycheck-years"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-semibold">Original analysis</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          Which Years Have 27 Paychecks? Every Year Through 2040
        </h1>
        <p className="text-sm text-gray-400">
          Computed from our payroll date engine · {FIRST_YEAR}–{LAST_YEAR} · Updated August 2026
        </p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Search this question and you will get a single year as the answer. That answer is usually
          wrong for you, because <strong>whether a year has 27 paychecks depends on which weekday
          your payday falls on</strong> — and the same year can be a 26-paycheck year for one
          employer and a 27-paycheck year for the company next door.
        </p>
        <p className="leading-relaxed">
          So instead of publishing one date, we ran every payday weekday against every year from{' '}
          {FIRST_YEAR} to {LAST_YEAR} using the same date engine behind our{' '}
          <Link to="/payroll-calendar" className="text-blue-600 hover:underline">payroll calendar</Link>.
          Find your payday in the table and read across.
        </p>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-gray-800">{noneYears.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">years where no weekday is affected</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-amber-700">{doubleYears.length}</p>
            <p className="text-xs text-gray-500 mt-0.5">years where two weekdays are hit</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-gray-800">2–3</p>
            <p className="text-xs text-gray-500 mt-0.5">times each weekday is hit in 15 years</p>
          </div>
        </div>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Bi-weekly: which years give you 27 paychecks</h2>
          <Table rows={biweekly} extra={27} normal={26} label="Paydays per calendar year by payday weekday. Highlighted rows contain an extra pay period." />
          <p className="leading-relaxed mt-3">
            Two things in this table surprise most people. <strong>{noneYears.join(', ')} affect no
            weekday at all</strong> — if you read somewhere that one of those is a 27-paycheck year,
            it was wrong. And <strong>{doubleYears.join(' and ')} hit two weekdays each</strong>, so
            in those years neighbouring employers on different paydays are both affected.
          </p>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Weekly payroll: the 53-paycheck years</h2>
          <p className="leading-relaxed mb-3">
            Weekly schedules drift for the same reason, one year in the cycle earlier or later. The
            pattern lands on the identical years, because both schedules are driven by the same
            364-day arithmetic.
          </p>
          <Table rows={weekly} extra={53} normal={52} label="Weekly paydays per calendar year by payday weekday." />
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What the extra run actually costs</h2>
          <p className="leading-relaxed mb-3">
            The cost is easy to state precisely, which is why it is worth doing before the year
            starts rather than discovering it in December. For one salaried employee on{' '}
            {fmt0(SAMPLE_SALARY)}:
          </p>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Normal per-paycheck amount (÷26)', fmt0(extraRun)],
                ['Cost of the 27th run if you change nothing', fmt0(extraRun)],
                ['Per-paycheck amount if you divide by 27 instead', fmt0(perPeriod27)],
                ['Reduction in every paycheck under that approach', `−${fmt0(perPeriodDrop)}`],
              ].map(([l, v], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{l}</span>
                  <span className="font-semibold text-gray-800">{v}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Multiply the second line by headcount. Fifty employees at this salary is{' '}
              {fmt0(extraRun * 50)} of unbudgeted payroll, before employer taxes on it.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The two ways employers handle it — and which we would pick</h2>
          <p className="leading-relaxed mb-3">
            Both are legitimate. They differ in who absorbs the cost and how visible it is to staff.
          </p>
          <div className="space-y-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm mb-1">1. Keep the per-period amount, pay the extra run</p>
              <p className="text-xs leading-relaxed">
                Staff receive an additional {fmt0(extraRun)} for the year and nobody notices anything
                wrong. The employer carries the cost. Simple, popular, and the only option if
                offer letters state a per-paycheck figure rather than an annual one.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm mb-1">2. Divide the annual salary by 27</p>
              <p className="text-xs leading-relaxed">
                Total pay is unchanged and the employer carries no extra cost, but every paycheck
                drops by {fmt0(perPeriodDrop)}. Staff notice this immediately and read it as a pay
                cut unless it is explained in advance.
              </p>
            </div>
          </div>
          <p className="leading-relaxed mt-3">
            <strong>Our view:</strong> if you can absorb it, option 1 costs less in goodwill than it
            costs in cash. If you cannot, option 2 is defensible but only survives contact with staff
            if you tell them <em>before</em> the first reduced paycheck, in writing, with the annual
            total shown so they can see it is unchanged. Announcing it afterwards is where this
            usually goes wrong.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Where this actually goes wrong</h2>
          <p className="leading-relaxed mb-3">
            The extra payroll run is the part everyone plans for. These are the parts that catch
            people out:
          </p>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Switching to ÷27 partway through the year.</strong> If some paychecks were already issued at the ÷26 rate, dividing the remainder by 27 overpays for the year. The remaining periods have to absorb the difference, not the original figure.</li>
            <li><strong>Per-paycheck benefit deductions.</strong> A premium deducted every pay period is taken 27 times instead of 26 — employees over-contribute for the year unless the deduction is recalculated or skipped on one run.</li>
            <li><strong>Annual contribution limits.</strong> Retirement deferrals set as a flat dollar amount per paycheck can overshoot the annual cap on the 27th run.</li>
            <li><strong>Accrual assumptions.</strong> PTO accrued per pay period grants an extra allocation. Our <Link to="/pto-accrual-calculator" className="text-blue-600 hover:underline">accrual calculator</Link> lets you check the per-period figure against your policy.</li>
            <li><strong>Believing a single published year.</strong> As the table shows, the answer is different for a Monday payroll and a Thursday one.</li>
          </ul>
        </section>

        <ToolCTA
          to="/payroll-calendar"
          title="Check Your Own Year"
          desc="Enter any payday you know and get every pay date, the period each covers, bank holiday conflicts, and whether your year has the extra run."
          label="Open Payroll Calendar →"
        />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How we produced this table</h2>
          <p className="leading-relaxed">
            For each year and each weekday, we find the first occurrence of that weekday in January,
            then step forward in 14-day (or 7-day) intervals to the end of the year and count the
            dates that land inside it. The table on this page is generated by that function at build
            time rather than typed in, so it is derived from the same code that powers the{' '}
            <Link to="/payroll-calendar" className="text-blue-600 hover:underline">payroll calendar</Link>{' '}
            and cannot disagree with it. Our{' '}
            <Link to="/methodology" className="text-blue-600 hover:underline">methodology page</Link>{' '}
            covers how we handle dates and holidays generally.
          </p>
          <p className="leading-relaxed mt-3">
            One limitation worth stating: this assumes a payday that stays on the same weekday all
            year. If your employer shifts paydays for holidays in a way that moves the underlying
            schedule rather than just the deposit date, count from your own calendar instead.
          </p>
        </section>

        <RelatedGuides items={[
          { to: '/payroll-calendar', label: 'Payroll Calendar Generator — every pay date for your year' },
          { to: '/pto-accrual-calculator', label: 'PTO Accrual Calculator — per-period accrual' },
          { to: '/paycheck-calculator', label: 'Paycheck Calculator — take-home per period' },
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
