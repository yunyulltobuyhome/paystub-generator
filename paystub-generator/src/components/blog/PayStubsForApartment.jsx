import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { takeHomeForState } from '../../utils/salaryTakeHome'
import { ArticleJsonLd, ArticleByline, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const usd = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US')
const pc = (n) => (n * 100).toFixed(1) + '%'

// The 3x rule: annual gross must be at least 40x monthly rent (i.e. monthly
// gross >= 3x rent). Computed against actual take-home to show the gap.
const LADDER = [40000, 50000, 60000, 75000, 100000]
const rows = LADDER.map((salary) => {
  const qualifiesFor = salary / 40          // max monthly rent under the 3x rule
  const netMonthly = takeHomeForState(salary, 'CA').net / 12
  const affordable = netMonthly * 0.30      // the 30%-of-take-home guideline
  return {
    salary, qualifiesFor, netMonthly, affordable,
    shareOfNet: qualifiesFor / netMonthly,
    overshoot: qualifiesFor - affordable,
  }
})
const low = rows[0]
const high = rows[rows.length - 1]

const FAQ = [
  { q: 'How many pay stubs do landlords ask for?', a: 'Two to three consecutive recent stubs is the norm, covering roughly the last 30 to 60 days. Some ask for a month, some for three. Anything older than 60 days is usually rejected as stale, so gather them close to when you apply.' },
  { q: 'What is the 3x rent rule?', a: 'A screening shortcut where your gross monthly income must be at least three times the monthly rent — equivalently, annual gross of at least 40 times the rent. It is a landlord filter, not a budgeting rule, and it is applied to gross pay rather than what you actually take home.' },
  { q: 'Can I rent if I do not have pay stubs?', a: 'Usually yes. Offer letters, bank statements showing deposits, tax returns, 1099s, or a letter from your employer are all commonly accepted. Self-employed and gig applicants normally lead with tax returns plus recent bank statements, and an organised summary helps considerably.' },
  { q: 'Do landlords verify pay stubs with employers?', a: 'Larger property managers frequently do — by calling the employer, using a verification service, or requiring the offer letter and bank deposits to line up. Submitting anything inaccurate risks the application and, depending on what was submitted, can carry legal consequences.' },
  { q: 'What if I earn enough but only just?', a: 'Options that commonly work: a co-signer or guarantor, offering a larger deposit or a few months up front, showing savings, or a longer lease term. Ask what the landlord will accept rather than assuming rejection — screening thresholds are often negotiable in a soft rental market.' },
]

export default function PayStubsForApartment() {
  usePageMeta({
    title: 'How Many Pay Stubs to Rent an Apartment — And Why 3x Rent Is Not Affordable',
    description: `Landlords want two to three recent stubs and gross income of 3x the rent. We computed what that leaves you: rent at ${pc(low.shareOfNet)} to ${pc(high.shareOfNet)} of actual take-home pay, well past the 30% guideline. Here is what to send and what to check.`,
    canonicalPath: '/guides/how-many-pay-stubs-for-apartment',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="How Many Pay Stubs to Rent an Apartment — And Why 3x Rent Is Not Affordable"
        description="What landlords ask for, and the computed gap between qualifying under the 3x gross rule and affording the rent out of take-home pay."
        slug="/guides/how-many-pay-stubs-for-apartment"
        faq={FAQ}
      />

      <ArticleByline slug="/guides/how-many-pay-stubs-for-apartment" />

      <div className="mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          How Many Pay Stubs Do You Need to Rent an Apartment?
        </h1>
        <p className="text-sm text-gray-400">Figures computed from our tax engine</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          The short answer is <strong>two to three consecutive recent stubs</strong>, covering the
          last 30 to 60 days. The longer and more useful answer is that the income test they apply
          to those stubs is measured against your <em>gross</em> pay — and qualifying for a rent does
          not mean you can afford it.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What to send</h2>
          <div className="bg-white border border-gray-200/80 rounded-xl p-5">
            <ul className="space-y-2 leading-relaxed">
              <li><strong>2–3 consecutive stubs</strong>, most recent first. Consecutive matters — gaps look like missing income.</li>
              <li><strong>Dated within 60 days.</strong> Older stubs are commonly rejected outright.</li>
              <li><strong>Showing year-to-date totals.</strong> YTD lets a landlord sanity-check that your recent pay is typical rather than a good month.</li>
              <li><strong>Legible and complete</strong>, including the employer name and pay period dates. Cropped screenshots get queried.</li>
            </ul>
          </div>
          <p className="leading-relaxed mt-3">
            If you are paid weekly, send four so the period covered matches what a bi-weekly
            applicant would send. Landlords are comparing a window of time, not a count of documents.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The 3x rule, and what it actually leaves you</h2>
          <p className="leading-relaxed mb-3">
            Most screening uses gross monthly income of at least three times the rent. Separately,
            the affordability advice everyone repeats is to keep rent under 30% of income. Those two
            rules are usually quoted side by side as if they agree. They do not, because one is
            measured on gross and the other should be measured on what reaches your account.
          </p>
          <p className="leading-relaxed mb-3">
            We ran the 3x threshold against computed take-home pay:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Gross salary</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Qualifies for rent</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Monthly take-home</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Rent as % of take-home</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.salary} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium text-gray-800">{usd(r.salary)}</td>
                    <td className="p-2 border border-gray-200 text-right">{usd(r.qualifiesFor)}/mo</td>
                    <td className="p-2 border border-gray-200 text-right">{usd(r.netMonthly)}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold text-amber-700">{pc(r.shareOfNet)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mt-3">
            The last column is the point. Renting at the very top of what you qualify for puts
            between <strong>{pc(low.shareOfNet)} and {pc(high.shareOfNet)} of your take-home pay</strong>{' '}
            into rent — not 30%. And it gets worse as you earn more, because a larger share of a
            bigger salary goes to tax, so gross and net drift further apart.
          </p>
          <p className="leading-relaxed mt-3">
            On {usd(60000)}, the 3x rule clears you for {usd(rows[2].qualifiesFor)} a month. Thirty
            percent of your actual take-home is {usd(rows[2].affordable)}. That{' '}
            <strong>{usd(rows[2].overshoot)} a month</strong> gap is the difference between passing a
            landlord's filter and having money left over.
          </p>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Two numbers to work out before you apply</h2>
          <ul className="space-y-2 leading-relaxed">
            <li>
              <strong>The rent you qualify for:</strong> annual gross ÷ 40. This is the ceiling a
              landlord will apply, and it is worth knowing before you view places you cannot pass
              screening for.
            </li>
            <li>
              <strong>The rent you can carry:</strong> 30% of monthly take-home. Use our{' '}
              <Link to="/paycheck-calculator" className="text-blue-600 hover:underline">paycheck calculator</Link>{' '}
              for your real net, since it depends on your state and deductions. If the two numbers
              are far apart, the second one is the honest budget.
            </li>
          </ul>
          <p className="leading-relaxed mt-3">
            Neither is a rule you must obey. Plenty of people in expensive cities pay well over 30%
            of net rent by necessity. The value is in knowing which number you are looking at, rather
            than discovering the gap after signing.
          </p>
        </section>

        <ToolCTA
          to="/paycheck-calculator"
          title="Find your real monthly take-home"
          desc="Enter your salary, state and deductions to get the net figure your rent budget should actually be built on."
          label="Open Paycheck Calculator →"
        />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">If you do not have pay stubs</h2>
          <p className="leading-relaxed mb-3">
            Freelance, contract, and gig income is normal and most landlords have seen it. What they
            need is evidence that is hard to fake and easy to check:
          </p>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Last year's tax return</strong> — the strongest single document, because it was filed.</li>
            <li><strong>Bank statements</strong> showing three to six months of deposits, which corroborate the return.</li>
            <li><strong>1099s</strong> from each client or platform.</li>
            <li><strong>Signed contracts or an offer letter</strong> if the income is new.</li>
            <li><strong>A clear summary</strong> tying it together, so nobody has to reconstruct your income from a pile of PDFs. Our <Link to="/income-verification-packet" className="text-blue-600 hover:underline">income verification packet builder</Link> assembles one.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            Our guide on{' '}
            <Link to="/how-to-prove-income/proof-of-income-without-pay-stubs" className="text-blue-600 hover:underline">proving income without pay stubs</Link>{' '}
            covers this in more detail for self-employed applicants.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Where applications go wrong</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Sending non-consecutive stubs.</strong> It reads as hiding a gap even when nothing is wrong. Send the run.</li>
            <li><strong>Leading with an unusually good period.</strong> If a commission month makes your stub unrepresentative, the YTD total will contradict it. Explain it up front instead.</li>
            <li><strong>Applying at the very top of the 3x range.</strong> You may pass and then be uncomfortable for a year — see the table above.</li>
            <li><strong>Overstating income.</strong> Verification services and employer calls are routine, and inaccurate documents can carry consequences well beyond a declined application.</li>
            <li><strong>Ignoring the other criteria.</strong> Credit history, rental references, and employment length often matter as much as the income multiple. Meeting 3x is not automatic approval.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How we calculated these figures</h2>
          <p className="leading-relaxed">
            Take-home is computed with the 2026 federal brackets, the single-filer standard
            deduction, Social Security and Medicare at statutory rates, and California state tax as a
            representative high-tax state — the same functions our calculators use. No benefit
            deductions are included, so real take-home is typically lower still and the gap in the
            table is, if anything, understated. Screening practices vary by landlord and by state;
            this is a description of a common convention, not a legal standard. Full detail is on our{' '}
            <Link to="/methodology" className="text-blue-600 hover:underline">methodology page</Link>.
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
          { to: '/guides/gross-vs-net-pay', label: 'Gross Pay vs Net Pay — how much you keep' },
          { to: '/how-to-prove-income/proof-of-income-without-pay-stubs', label: 'Proof of Income Without Pay Stubs' },
          { to: '/income-verification-packet', label: 'Income Verification Packet Builder' },
          { to: '/employment-verification-letter', label: 'Employment Verification Letter' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
