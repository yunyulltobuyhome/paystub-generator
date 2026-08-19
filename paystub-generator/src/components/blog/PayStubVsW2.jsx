import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ArticleJsonLd, ArticleByline, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const usd = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US')

// Worked reconciliation. Pre-tax health lowers every wage box; a traditional
// 401(k) lowers only the federal box — which is what makes Box 1 and Box 3
// differ by exactly the deferral.
const EX = { gross: 75000, health: 3600, k401: 6000 }
const box1 = EX.gross - EX.health - EX.k401
const box3 = EX.gross - EX.health
const box5 = box3

const FAQ = [
  { q: 'What is the difference between a pay stub and a W-2?', a: 'A pay stub covers one pay period and is issued by your employer every payday. A W-2 is an annual summary of taxable wages and withholding, issued once after year end and also filed with the IRS. You file taxes from the W-2, not from stubs.' },
  { q: 'Why does my W-2 show less than my salary?', a: `Because Box 1 is wages after pre-tax deductions, not gross pay. On a ${usd(EX.gross)} salary with ${usd(EX.health)} of pre-tax health premiums and a ${usd(EX.k401)} traditional 401(k) contribution, Box 1 reads ${usd(box1)}. Nothing is missing — those deductions came out before the wage was taxable.` },
  { q: 'Why are Box 1 and Box 3 different on my W-2?', a: `Because a traditional 401(k) reduces income-tax wages but not Social Security wages. Box 3 minus Box 1 should equal your 401(k) contribution for the year almost exactly — in our example ${usd(box3)} − ${usd(box1)} = ${usd(EX.k401)}. It is a quick way to check your own W-2.` },
  { q: 'Can I file my taxes with a pay stub?', a: 'You should not. Your final stub is a reasonable estimate, but it will not match Box 1 once pre-tax deductions and any imputed income are applied, and the IRS receives the W-2 directly. Filing from a stub is a common cause of a mismatch notice.' },
  { q: 'What if my W-2 is wrong?', a: 'Ask your employer for a corrected W-2 (Form W-2c) and show the figures you believe are right. Comparing against your final pay stub of the year is the usual way to spot it. If the employer will not correct it, the IRS has a process for reporting the discrepancy.' },
  { q: 'What if I never received a W-2?', a: 'Employers must furnish it by the end of January. If it has not arrived, check the address on file and any payroll portal first, then ask the employer. Your final December pay stub is useful evidence of what should be on it.' },
]

export default function PayStubVsW2() {
  usePageMeta({
    title: 'Pay Stub vs W-2: Why the Numbers Never Match (2026)',
    description: `Your W-2 will not match your salary or your final pay stub, and that is usually correct. A worked reconciliation of Box 1, Box 3 and Box 5 — and the one-line check that verifies your own W-2.`,
    canonicalPath: '/guides/pay-stub-vs-w2',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="Pay Stub vs W-2: Why the Numbers Never Match"
        description="What each document is for, and a worked reconciliation showing why W-2 Box 1, Box 3 and your final pay stub all show different figures."
        slug="/guides/pay-stub-vs-w2"
        faq={FAQ}
      />

      <ArticleByline slug="/guides/pay-stub-vs-w2" />

      <div className="mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          Pay Stub vs W-2: Why the Numbers Never Match
        </h1>
        <p className="text-sm text-gray-400">Worked reconciliation</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Most explanations of this stop at "a stub is per paycheck, a W-2 is annual". True, and not
          the thing anyone is actually confused about. The real question is why the W-2 shows a
          number that matches <strong>neither your salary nor your final pay stub</strong> — and why
          two boxes on the same form disagree with each other.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What each document is</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200/80 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm">Pay stub</p>
              <p className="text-xs mt-1 leading-relaxed">
                Issued every payday by your employer. Shows one period plus year-to-date running
                totals. Used to prove current income to landlords and lenders. Not filed with anyone.
              </p>
            </div>
            <div className="bg-white border border-gray-200/80 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm">W-2</p>
              <p className="text-xs mt-1 leading-relaxed">
                Issued once, by 31 January, for the previous year. Shows taxable wages and
                withholding. <strong>Also filed with the IRS and the SSA</strong>, which is why your
                return has to agree with it.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why the numbers differ — worked through</h2>
          <p className="leading-relaxed mb-3">
            Take someone earning {usd(EX.gross)}, paying {usd(EX.health)} a year in pre-tax health
            premiums and contributing {usd(EX.k401)} to a traditional 401(k). Here is what each
            document reports:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Figure</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Amount</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">What was removed</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Salary / final stub YTD gross', EX.gross, 'Nothing — this is gross pay'],
                  ['W-2 Box 1 — federal taxable wages', box1, 'Health premiums and 401(k)'],
                  ['W-2 Box 3 — Social Security wages', box3, 'Health premiums only'],
                  ['W-2 Box 5 — Medicare wages', box5, 'Health premiums only'],
                ].map(([label, val, note], i) => (
                  <tr key={label} className={i === 0 ? 'bg-blue-50' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium text-gray-800">{label}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold">{usd(val)}</td>
                    <td className="p-2 border border-gray-200 text-gray-600">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mt-3">
            Four different numbers, all correct. The rule underneath them is simple once stated:
            <strong> pre-tax insurance comes out of every wage box; a traditional 401(k) comes out of
            the federal box only.</strong> Your retirement deferral escapes income tax but never
            escapes Social Security and Medicare.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The one-line check on your own W-2</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <p className="font-bold text-blue-900 mb-2">Box 3 − Box 1 should equal your 401(k) contribution</p>
            <p className="text-xs text-blue-900 leading-relaxed">
              In the example above: {usd(box3)} − {usd(box1)} = <strong>{usd(EX.k401)}</strong>, exactly
              the amount deferred. Run the same subtraction on your own W-2 and compare it to the
              401(k) total on your final pay stub. If they match, the two boxes are consistent. If
              they do not, something is worth asking payroll about — most often a Roth contribution
              recorded as traditional, or a deferral applied to the wrong box.
            </p>
          </div>
          <p className="leading-relaxed mt-3">
            If you contribute to a <strong>Roth</strong> 401(k) instead, the subtraction gives zero:
            Roth money is taxed on the way in, so it never reduces Box 1. Seeing zero when you expected
            your contribution is the fastest way to discover your deferral is going somewhere other
            than you assumed.
          </p>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">When you need which</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Situation</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Use</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Filing your tax return', 'W-2 — the IRS already has a copy'],
                  ['Renting an apartment', 'Recent pay stubs; the W-2 may be requested as backup'],
                  ['Mortgage application', 'Both — stubs for current income, W-2s for history'],
                  ['Checking your current withholding', 'Pay stub, because it reflects today'],
                  ['Confirming annual income', 'W-2'],
                  ['Disputing pay for one period', 'The stub for that period'],
                ].map(([a, b], i) => (
                  <tr key={a} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{a}</td>
                    <td className="p-2 border border-gray-200 text-blue-600">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ToolCTA
          to="/paycheck-checker"
          title="Check this period's stub first"
          desc="A W-2 is only the sum of the year's stubs. Our checker verifies the FICA rates, overtime and net pay on the stub in front of you."
          label="Open Paycheck Checker →"
        />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Where this trips people up</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Filing from a final pay stub.</strong> It will not equal Box 1, the IRS has the real figure, and the mismatch generates a notice. Wait for the W-2.</li>
            <li><strong>Telling a lender the Box 1 number as your salary.</strong> Box 1 understates what you earn by the amount of your pre-tax deductions. For income questions, gross is the honest answer.</li>
            <li><strong>Expecting Box 3 to keep rising with a high salary.</strong> Social Security wages stop at the annual wage base, so Box 3 caps out while Box 5 does not — see our <Link to="/guides/what-is-fica-tax" className="text-blue-600 hover:underline">FICA guide</Link> for the cap and why it makes the effective rate fall.</li>
            <li><strong>Two W-2s after a job change.</strong> Each employer restarts your Social Security wage base at zero, so you may have over-paid Social Security across the two. That excess is refundable on your return, and nobody prompts you to claim it.</li>
            <li><strong>Assuming imputed income is an error.</strong> Employer-paid group life over the tax-free threshold, and some fringe benefits, are added to taxable wages without ever appearing as cash. They raise Box 1 above what you were paid.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How we produced the example</h2>
          <p className="leading-relaxed">
            The figures are arithmetic on stated assumptions — a single employer, one full year of
            employment, pre-tax Section 125 health premiums, and a traditional 401(k) deferral — not
            a real W-2. Real forms carry state boxes, dependent care benefits, HSA contributions
            coded in Box 12, and other items that shift the totals. This shows the mechanism, not
            your specific return. Our{' '}
            <Link to="/methodology" className="text-blue-600 hover:underline">methodology page</Link>{' '}
            sets out what we model and what we do not.
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

        <RelatedGuides items={[
          { to: '/guides/what-is-fica-tax', label: 'What Is FICA Tax? Why it is not 7.65% for everyone' },
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/guides/gross-vs-net-pay', label: 'Gross Pay vs Net Pay' },
          { to: '/paycheck-checker', label: 'Paycheck Checker — is your stub right?' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
