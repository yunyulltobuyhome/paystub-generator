import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { calcFICA } from '../../utils/taxCalculator'
import { FICA } from '../../data/stateTaxRates'
import { ArticleJsonLd, ArticleByline, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const usd = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US')
const BASE = FICA.socialSecurityWageBase
const SURTAX_AT = FICA.additionalMedicareThreshold

// Computed from the same engine the calculators use, so the numbers on this
// page are the numbers the tools produce.
const LADDER = [30000, 60000, 100000, 150000, BASE, 200000, 250000, 400000, 1000000]
const rows = LADDER.map((salary) => {
  const { ss, medicare } = calcFICA(salary)
  return { salary, ss, medicare, total: ss + medicare, effective: (ss + medicare) / salary }
})
const low = rows.find((r) => r.salary === 60000)
const high = rows.find((r) => r.salary === 1000000)

const FAQ = [
  { q: 'What is FICA tax?', a: `FICA (Federal Insurance Contributions Act) is the payroll tax that funds Social Security and Medicare. Employees pay 6.2% for Social Security and 1.45% for Medicare — 7.65% combined — and the employer pays the same again on top.` },
  { q: 'Is FICA the same percentage for everyone?', a: `No, and this surprises people. Social Security only applies to the first ${usd(BASE)} of wages in 2026, so above that the combined rate falls. A worker on ${usd(60000)} pays an effective 7.65%; someone on ${usd(1000000)} pays about ${(high.effective * 100).toFixed(2)}% — less than half the rate, because most of their pay is above the Social Security cap.` },
  { q: 'What is the 2026 Social Security wage base?', a: `${usd(BASE)}. Once your year-to-date wages pass it, Social Security withholding stops for the rest of the calendar year and your take-home rises. Medicare has no cap and continues on every dollar.` },
  { q: 'Why did my paycheck get bigger late in the year?', a: `If you earn more than ${usd(BASE)}, you hit the Social Security cap partway through the year. From that paycheck on, the 6.2% line disappears and your net pay rises by roughly that amount until January, when it resets.` },
  { q: 'Do self-employed people pay FICA?', a: 'Effectively yes, as self-employment tax: 15.3% (12.4% Social Security + 2.9% Medicare) on 92.35% of net earnings, because you are paying both the employee and employer halves. Half of it is deductible against income tax, which softens the blow.' },
  { q: 'Can I get out of paying FICA?', a: 'Almost never as an employee. Narrow exemptions exist — certain student workers at their own school, some religious objectors, and some non-resident visa holders — but for the overwhelming majority of US workers FICA is not optional and there is no election to reduce it. Unlike income tax, your W-4 does not change it.' },
]

export default function WhatIsFICA() {
  usePageMeta({
    title: 'What Is FICA Tax? Why It Is Not 7.65% For Everyone (2026)',
    description: `FICA is 7.65% of a normal paycheck — but only up to ${usd(BASE)}. We computed the effective rate across the income range: it falls to about ${(high.effective * 100).toFixed(1)}% for high earners. Here is why, and what it means for your pay stub.`,
    canonicalPath: '/guides/what-is-fica-tax',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="What Is FICA Tax? Why It Is Not 7.65% For Everyone (2026)"
        description="What Social Security and Medicare taxes fund, the 2026 rates and wage base, and the computed effective rate across the income range."
        slug="/guides/what-is-fica-tax"
        faq={FAQ}
      />

      <ArticleByline slug="/guides/what-is-fica-tax" />

      <div className="mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          What Is FICA Tax? And Why It Is Not 7.65% For Everyone
        </h1>
        <p className="text-sm text-gray-400">2026 rates · Figures computed from our tax engine</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Every explanation of FICA gives you the same number: 7.65%. It is correct for most people
          and it is the least interesting thing about the tax. The part worth understanding is that
          <strong> the rate you actually pay depends on how much you earn</strong> — and it goes
          <em> down</em> as income rises, which is the opposite of how income tax behaves.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What FICA is</h2>
          <p className="leading-relaxed mb-3">
            FICA is the payroll tax that funds two programmes. It comes out of gross pay before you
            see it, and it is split into two lines your pay stub usually shows separately:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200/80 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm">Social Security · 6.2%</p>
              <p className="text-xs mt-1 leading-relaxed">
                Often labelled OASDI or FICA-SS. Funds retirement, disability, and survivor benefits.
                Applies only to the first <strong>{usd(BASE)}</strong> of wages in 2026.
              </p>
            </div>
            <div className="bg-white border border-gray-200/80 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm">Medicare · 1.45%</p>
              <p className="text-xs mt-1 leading-relaxed">
                Often labelled FICA-MED. Funds hospital insurance for people 65+ and some disabled
                people. <strong>No wage cap</strong>, plus an extra 0.9% on wages above {usd(SURTAX_AT)}.
              </p>
            </div>
          </div>
          <p className="leading-relaxed mt-3">
            Your employer pays a matching 6.2% and 1.45% on top of your wages. That employer half
            never appears on your pay stub, but it is part of what you cost — our{' '}
            <Link to="/employee-cost-calculator" className="text-blue-600 hover:underline">employee cost calculator</Link>{' '}
            shows the full picture from the employer side.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The part most articles skip: FICA is regressive</h2>
          <p className="leading-relaxed mb-3">
            Because Social Security stops at {usd(BASE)} and Medicare does not, the combined
            percentage you pay is flat up to the cap and then falls steadily. We ran the calculation
            across the income range:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Annual wages</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Social Security</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Medicare</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Total FICA</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Effective rate</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const atCap = r.salary === BASE
                  return (
                    <tr key={r.salary} className={atCap ? 'bg-blue-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200 font-medium text-gray-800">
                        {usd(r.salary)}{atCap && <span className="text-blue-600 font-semibold"> ← cap</span>}
                      </td>
                      <td className="p-2 border border-gray-200 text-right">{usd(r.ss)}</td>
                      <td className="p-2 border border-gray-200 text-right">{usd(r.medicare)}</td>
                      <td className="p-2 border border-gray-200 text-right font-semibold">{usd(r.total)}</td>
                      <td className={`p-2 border border-gray-200 text-right font-semibold ${r.effective < 0.0765 ? 'text-amber-700' : 'text-gray-800'}`}>
                        {(r.effective * 100).toFixed(2)}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mt-3">
            Read the last column. It holds at exactly 7.65% all the way to the cap, then drops — a
            worker on {usd(60000)} pays <strong>{(low.effective * 100).toFixed(2)}%</strong> of their
            wages to FICA, while someone on {usd(1000000)} pays{' '}
            <strong>{(high.effective * 100).toFixed(2)}%</strong>. In dollar terms the high earner
            pays far more; as a share of income they pay less than half the rate.
          </p>
          <p className="leading-relaxed mt-3">
            This is not a loophole or an error. Social Security benefits are also capped, so the
            contribution is capped to match — you stop paying in because you stop accruing. Whether
            that is the right design is a live policy argument, but the mechanic is deliberate and
            it is worth knowing it exists before you compare your pay stub to someone else's.
          </p>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What this means for your paycheck</h2>
          <ul className="space-y-2 leading-relaxed">
            <li>
              <strong>If you earn under {usd(BASE)}:</strong> your FICA is 7.65% of gross, every
              paycheck, all year. It does not vary and your W-4 cannot change it.
            </li>
            <li>
              <strong>If you earn over {usd(BASE)}:</strong> you will cross the cap partway through
              the year and your take-home will jump on that paycheck — the 6.2% line stops. It
              resets every January, which is why January take-home is lower than December's.
            </li>
            <li>
              <strong>If you earn over {usd(SURTAX_AT)}:</strong> an additional 0.9% Medicare tax
              applies to the wages above that threshold only, not to your whole salary. Employers do
              not match this one.
            </li>
            <li>
              <strong>Pre-tax health insurance lowers FICA; 401(k) does not.</strong> Section 125
              premiums come out before FICA is calculated. Traditional 401(k) deferrals reduce income
              tax but are still fully subject to FICA — a distinction that trips up a lot of people
              checking their own stub.
            </li>
          </ul>
        </section>

        <ToolCTA
          to="/paycheck-checker"
          title="Check your own FICA lines"
          desc="Enter the numbers off your pay stub and we will tell you whether Social Security and Medicare were withheld at the right rate — including the cap and the surtax."
          label="Open Paycheck Checker →"
        />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Where people go wrong reading these lines</h2>
          <ul className="space-y-2 leading-relaxed">
            <li>
              <strong>Assuming a wrong-looking percentage means an error.</strong> If your Social
              Security line is not exactly 6.2% of gross, the usual explanation is pre-tax insurance
              lowering the base, not a payroll mistake.
            </li>
            <li>
              <strong>Expecting the cap to reset on your work anniversary.</strong> It is a calendar
              year. Changing jobs mid-year is the awkward case: the new employer starts your wage
              base at zero and will over-withhold Social Security. You claim the excess back on your
              federal return — it is not lost, but nobody tells you to look for it.
            </li>
            <li>
              <strong>Thinking a raise past the cap is taxed harder.</strong> The opposite: income
              above {usd(BASE)} escapes the 6.2% entirely, so a dollar earned above the cap keeps
              more of itself than a dollar below it, before income tax.
            </li>
            <li>
              <strong>Confusing FICA with federal income tax.</strong> They are separate lines with
              separate rules. FICA is a fixed percentage you cannot adjust; income tax withholding is
              driven by your W-4 and you can change it — see our{' '}
              <Link to="/w4-withholding-calculator" className="text-blue-600 hover:underline">W-4 calculator</Link>.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">If you are self-employed</h2>
          <p className="leading-relaxed">
            There is no employer to pay the other half, so you pay both: 15.3% self-employment tax,
            made up of 12.4% Social Security and 2.9% Medicare, charged on 92.35% of net earnings.
            The same {usd(BASE)} cap applies to the Social Security portion, and half of the total is
            deductible against your income tax. Our{' '}
            <Link to="/self-employment-tax-calculator" className="text-blue-600 hover:underline">self-employment tax calculator</Link>{' '}
            works this out including quarterly payments, and the{' '}
            <Link to="/1099-vs-w2-calculator" className="text-blue-600 hover:underline">1099 vs W-2 calculator</Link>{' '}
            shows how much extra you need to charge to absorb it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How we calculated the table</h2>
          <p className="leading-relaxed">
            Social Security is 6.2% of wages up to {usd(BASE)}; Medicare is 1.45% of all wages plus
            0.9% on the portion above {usd(SURTAX_AT)}. The table is generated by the same function
            our calculators call, so it cannot disagree with them. It assumes a single employer and
            wages only — other income, and the employer's matching half, are outside it. Full detail
            and sources are on our{' '}
            <Link to="/methodology" className="text-blue-600 hover:underline">methodology page</Link>.
          </p>
        </section>

        <RelatedGuides items={[
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/guides/gross-vs-net-pay', label: 'Gross Pay vs Net Pay' },
          { to: '/paycheck-checker', label: 'Paycheck Checker — is your stub right?' },
          { to: '/self-employment-tax-calculator', label: 'Self-Employment Tax Calculator' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
