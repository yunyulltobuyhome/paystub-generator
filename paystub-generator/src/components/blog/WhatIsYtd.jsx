import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { FICA } from '../../data/stateTaxRates'
import { ArticleJsonLd, ArticleByline, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const usd = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US')
const BASE = FICA.socialSecurityWageBase

// Mid-year job change: each employer restarts the Social Security wage base at
// zero, so combined wages above the cap get taxed twice. The excess is
// refundable, but only if you notice.
const JOB1 = 120000
const JOB2 = 90000
const combined = JOB1 + JOB2
const excessWages = Math.max(0, combined - BASE)
const refundable = excessWages * FICA.socialSecurityRate

const FAQ = [
  { q: 'What does YTD mean on a paycheck?', a: 'Year-to-date — the running total of a figure from 1 January through the current pay date. Your stub shows YTD alongside the current period for gross pay, each tax, and usually each deduction, so you can see the year accumulating.' },
  { q: 'Does YTD reset when I change jobs?', a: 'Yes, and this matters. A new employer starts your YTD at zero because they only report what they paid you. Your personal year-to-date income is the sum across employers, which no single pay stub shows.' },
  { q: 'Can I be over-charged Social Security after changing jobs?', a: `Yes, and it is common. Each employer applies the ${usd(BASE)} wage base independently. On ${usd(JOB1)} from one job and ${usd(JOB2)} from another, roughly ${usd(refundable)} of excess Social Security tax is withheld. It is refundable on your federal return, but nothing prompts you to claim it.` },
  { q: 'Why does my YTD gross not match my salary?', a: 'Part-year employment, unpaid leave, bonuses, overtime, and pay changes all move it. At year end, YTD gross should match your final gross for the year — but it will not match W-2 Box 1, which is after pre-tax deductions.' },
  { q: 'How do I use YTD to project my annual income?', a: 'Divide YTD gross by the number of pay periods completed, then multiply by the total periods in the year. It is reliable for steady salaried pay and unreliable if your hours vary or a bonus is coming.' },
  { q: 'Do landlords and lenders look at YTD?', a: 'Frequently. YTD is how they check that a recent stub is typical rather than an unusually good period, which is why stubs that show YTD totals are more useful in an application than ones that do not.' },
]

export default function WhatIsYtd() {
  usePageMeta({
    title: 'What Is YTD on a Paycheck? And the Refund Job-Changers Miss',
    description: `YTD is the running total from 1 January. It also resets when you change jobs — which can mean roughly ${usd(refundable)} of over-withheld Social Security that you have to claim back yourself. How to read, verify and project from YTD.`,
    canonicalPath: '/guides/what-is-ytd-on-a-paycheck',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="What Is YTD on a Paycheck? And the Refund Job-Changers Miss"
        description="What year-to-date figures mean, how to verify and project from them, and the excess Social Security withholding a mid-year job change creates."
        slug="/guides/what-is-ytd-on-a-paycheck"
        faq={FAQ}
      />

      <ArticleByline slug="/guides/what-is-ytd-on-a-paycheck" />

      <div className="mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          What Is YTD on a Paycheck?
        </h1>
        <p className="text-sm text-gray-400">2026 figures</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          YTD stands for <strong>year-to-date</strong>: the running total of a figure from 1 January
          to the current pay date. That definition takes one line. The reason to care is that YTD is
          the only part of a pay stub that lets you check your own year — and the one place a
          mid-year job change quietly costs people money.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What the YTD column tells you</h2>
          <p className="leading-relaxed mb-3">
            Most stubs place YTD beside each current-period figure. The useful ones:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">YTD line</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">What it is good for</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['YTD gross', 'Proving income to landlords and lenders; projecting your annual total'],
                  ['YTD federal tax', 'Checking whether you are on track to owe or be refunded'],
                  ['YTD Social Security', `Seeing how close you are to the ${usd(BASE)} wage cap`],
                  ['YTD Medicare', 'Confirming it kept running after Social Security stopped'],
                  ['YTD deductions', 'Confirming benefit premiums were taken the right number of times'],
                  ['YTD net', 'What has actually reached you so far this year'],
                ].map(([a, b], i) => (
                  <tr key={a} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium text-gray-800">{a}</td>
                    <td className="p-2 border border-gray-200">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The job-change trap</h2>
          <p className="leading-relaxed mb-3">
            Social Security tax applies only to the first {usd(BASE)} of wages each year. Your
            employer enforces that cap using <em>their</em> YTD figure — which starts at zero the day
            you join. If you change jobs mid-year and your combined pay crosses the cap, both
            employers withhold as though you had earned nothing elsewhere.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="font-bold text-blue-900 mb-2">Worked example</p>
            <div className="space-y-1 text-xs text-blue-900">
              <div className="flex justify-between"><span>Job 1, January to July</span><span>{usd(JOB1)}</span></div>
              <div className="flex justify-between"><span>Job 2, August to December</span><span>{usd(JOB2)}</span></div>
              <div className="flex justify-between font-semibold border-t border-blue-200 pt-1.5 mt-1.5"><span>Combined wages</span><span>{usd(combined)}</span></div>
              <div className="flex justify-between"><span>Social Security wage base</span><span>{usd(BASE)}</span></div>
              <div className="flex justify-between"><span>Wages taxed that should not have been</span><span>{usd(excessWages)}</span></div>
              <div className="flex justify-between font-bold border-t border-blue-200 pt-1.5 mt-1.5">
                <span>Excess Social Security withheld</span><span>{usd(refundable)}</span>
              </div>
            </div>
          </div>
          <p className="leading-relaxed mt-3">
            Neither employer did anything wrong — each applied the cap correctly to the wages they
            paid. The <strong>{usd(refundable)}</strong> is refundable when you file, as a credit for
            excess Social Security tax. But no stub shows it, no employer flags it, and if you do not
            claim it nobody returns it. Add your W-2s together at year end and check whether the
            combined Box 4 exceeds 6.2% of the wage base.
          </p>
          <p className="leading-relaxed mt-3">
            The same reset works against you in the other direction too: if you crossed the cap at
            your old job and enjoyed larger paychecks, the new employer starts charging Social
            Security again immediately.
          </p>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Using YTD to project your year</h2>
          <p className="leading-relaxed mb-3">
            Divide YTD gross by the pay periods completed, then multiply by the periods in the year.
            On a bi-weekly schedule, after 13 paychecks you are halfway through 26.
          </p>
          <p className="leading-relaxed">
            This is dependable for steady salaried pay and unreliable otherwise. It breaks when hours
            vary, when a bonus is still to come, when you started part-way through the year, or in a{' '}
            <Link to="/guides/27-paycheck-years" className="text-blue-600 hover:underline">27-paycheck year</Link>,
            where dividing by the usual 26 quietly overstates every period.
          </p>
        </section>

        <ToolCTA
          to="/paycheck-checker"
          title="Verify your YTD figures"
          desc="Enter this period's numbers and your YTD gross. We check the FICA rates against the wage cap and tell you whether the stub adds up."
          label="Open Paycheck Checker →"
        />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What to check on the YTD column</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Does YTD gross move by this period's gross?</strong> Each stub's YTD should be the previous one plus the current period. A jump or a stall is worth a question.</li>
            <li><strong>Is YTD Social Security about 6.2% of YTD gross?</strong> Until you reach the cap it should be, allowing for pre-tax insurance lowering the base.</li>
            <li><strong>Did Social Security stop while Medicare continued?</strong> That is correct behaviour once you pass {usd(BASE)}, not an error.</li>
            <li><strong>Were benefit premiums taken the expected number of times?</strong> YTD deductions divided by the premium should equal the number of paychecks so far.</li>
            <li><strong>Does the final stub of the year reconcile to your W-2?</strong> It will not match Box 1 exactly — see our <Link to="/guides/pay-stub-vs-w2" className="text-blue-600 hover:underline">pay stub vs W-2 guide</Link> for why, and how to check the difference is the right size.</li>
          </ul>
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
          <h2 className="text-base font-bold text-gray-800 mb-3">How we calculated the example</h2>
          <p className="leading-relaxed">
            The excess is the combined wages above the {usd(BASE)} wage base multiplied by the 6.2%
            employee Social Security rate, using the constants our calculators share. It assumes two
            employers, wages only, and no pre-tax deductions. The refundable credit applies to the
            employee share you over-paid; employers do not get their matching half back the same way.
            Our <Link to="/methodology" className="text-blue-600 hover:underline">methodology page</Link>{' '}
            lists the rates and what we do not model.
          </p>
        </section>

        <RelatedGuides items={[
          { to: '/guides/what-is-fica-tax', label: 'What Is FICA Tax? The wage cap explained' },
          { to: '/guides/pay-stub-vs-w2', label: 'Pay Stub vs W-2 — why the numbers differ' },
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/multiple-paystubs', label: 'Multiple Pay Stub Generator with YTD' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
