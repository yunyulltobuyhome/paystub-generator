import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import {
  FEDERAL_BRACKETS_SINGLE, FEDERAL_BRACKETS_MFJ, FICA, STANDARD_DEDUCTIONS,
} from '../data/stateTaxRates'
import { STATE_LIST, NO_INCOME_TAX_CODES } from '../utils/states'
import { FEDERAL_MIN_WAGE } from '../data/minimumWage'

const usd = (n) => '$' + Number(n).toLocaleString('en-US')
const pct = (n) => (n * 100).toFixed(2).replace(/\.00$/, '') + '%'

// Rendered from the same constants the calculators use, so this page cannot
// drift out of sync with what the tools actually compute.
function BracketTable({ brackets, label }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 border border-gray-200 font-semibold">Taxable income</th>
              <th className="text-right p-2 border border-gray-200 font-semibold">Rate</th>
            </tr>
          </thead>
          <tbody>
            {brackets.map((b, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2 border border-gray-200">
                  {usd(b.min)} {b.max === Infinity ? 'and above' : `– ${usd(b.max)}`}
                </td>
                <td className="p-2 border border-gray-200 text-right font-semibold text-blue-600">{pct(b.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function Methodology() {
  usePageMeta({
    title: 'How We Calculate — Methodology, Rates & Sources | MyFreePayStub',
    description: 'Every rate, bracket, and formula behind our paycheck and tax calculators, published in full: 2026 federal brackets, FICA rates and wage base, standard deductions, our state tax model, its known limitations, and the official sources we work from.',
    canonicalPath: '/methodology',
  })

  const taxedStates = STATE_LIST.filter((s) => s.rate > 0)
  const highest = [...taxedStates].sort((a, b) => b.rate - a.rate)[0]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': 'How We Calculate — Methodology, Rates and Sources',
        'description': 'The rates, brackets, formulas and limitations behind the MyFreePayStub calculators.',
        'publisher': { '@type': 'Organization', 'name': 'MyFreePayStub', 'url': 'https://myfreepaystub.com' },
        'mainEntityOfPage': 'https://myfreepaystub.com/methodology',
      }) }} />

      <div className="mb-6">
        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-semibold">Transparency</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">How We Calculate</h1>
        <p className="text-sm text-gray-500">
          Our tools deal with your pay and your taxes, so you should be able to check our work.
          This page publishes every rate, bracket, and formula the calculators use — along with what
          they deliberately leave out.
        </p>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900 mb-8">
        <strong>The short version:</strong> these are estimating tools, not tax preparation software.
        They are accurate for the parts of payroll that follow fixed rules, and approximate for the
        parts that depend on your personal circumstances. Where we approximate, we say so below
        rather than hiding it.
      </div>

      <div className="space-y-8 text-sm text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">1. Federal income tax</h2>
          <p className="leading-relaxed mb-4">
            We apply the 2026 federal brackets progressively: each slice of your taxable income is
            taxed at its own rate, not your whole income at your top rate. Taxable income is your
            gross pay minus the standard deduction for your filing status.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <BracketTable brackets={FEDERAL_BRACKETS_SINGLE} label="Single filer" />
            <BracketTable brackets={FEDERAL_BRACKETS_MFJ} label="Married filing jointly" />
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Standard deductions applied</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[['Single', STANDARD_DEDUCTIONS.single], ['Married', STANDARD_DEDUCTIONS.married], ['Head of household', STANDARD_DEDUCTIONS.head]].map(([l, v]) => (
                <div key={l}>
                  <p className="text-lg font-extrabold text-gray-800">{usd(v)}</p>
                  <p className="text-xs text-gray-500">{l}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="leading-relaxed mt-3">
            <strong>What this misses:</strong> itemised deductions, tax credits other than the
            simplified child tax credit in our refund estimator, and the effect of your specific W-4
            entries. Head-of-household filers are given the correct standard deduction but are
            calculated on the single-filer bracket table.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">2. Social Security and Medicare (FICA)</h2>
          <p className="leading-relaxed mb-4">
            These are the parts of a paycheck that follow fixed rules, so our figures here should
            match your pay stub closely.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <tbody>
                {[
                  ['Social Security (employee share)', pct(FICA.socialSecurityRate)],
                  ['Social Security annual wage base', usd(FICA.socialSecurityWageBase)],
                  ['Medicare (employee share)', pct(FICA.medicareRate)],
                  ['Additional Medicare tax', pct(FICA.additionalMedicareRate)],
                  ['Additional Medicare threshold', usd(FICA.additionalMedicareThreshold)],
                ].map(([l, v], i) => (
                  <tr key={l} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 text-gray-600">{l}</td>
                    <td className="p-2 border border-gray-200 text-right font-semibold text-gray-800">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mt-3">
            Social Security stops once year-to-date wages pass the wage base; Medicare has no cap and
            gains the additional rate on wages above the threshold. Pre-tax health insurance reduces
            the wages FICA is charged on; traditional 401(k) contributions do not. Our{' '}
            <Link to="/paycheck-checker" className="text-blue-600 hover:underline">paycheck checker</Link>{' '}
            models all of these, which is why it can tell you whether your own stub is right.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">3. State income tax — our biggest approximation</h2>
          <p className="leading-relaxed">
            This is the part we are least precise about, and we would rather tell you plainly than
            imply more accuracy than we have.
          </p>
          <p className="leading-relaxed mt-3">
            We model each state as a <strong>single flat effective rate</strong> applied to taxable
            wages. Real state systems are more varied: many use progressive brackets, several have
            their own standard deductions, personal exemptions, or credits, and some cities levy
            their own income tax on top.
          </p>
          <div className="bg-white border border-gray-200 rounded-xl p-4 mt-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{NO_INCOME_TAX_CODES.length}</p>
                <p className="text-xs text-gray-500">states with no wage income tax</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{taxedStates.length}</p>
                <p className="text-xs text-gray-500">jurisdictions we apply a rate to</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-800">{pct(highest.rate)}</p>
                <p className="text-xs text-gray-500">highest rate we model ({highest.name})</p>
              </div>
            </div>
          </div>
          <p className="leading-relaxed mt-3">
            <strong>What this means for you:</strong> our state figures are reliable for comparing
            states against each other — the direction and rough size of the gap are right. They are
            not a substitute for your state's own withholding tables. We do not model local or city
            income taxes, state disability insurance, or paid family leave contributions at all.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">4. Hours, overtime and conversions</h2>
          <p className="leading-relaxed">
            Salary-to-hourly conversions assume a full-time schedule of 40 hours a week across 52
            weeks — 2,080 hours a year — unless a tool lets you set your own hours, in which case
            yours are used. Overtime defaults to 1.5× the base rate beyond 40 hours in a workweek,
            following the federal Fair Labor Standards Act, with the threshold and multiplier
            editable because state rules and job classifications differ. Our payroll calendar
            computes pay dates and the eleven federal holidays by date arithmetic, with no assumption
            about your employer's weekend or holiday policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">5. Minimum wage</h2>
          <p className="leading-relaxed">
            The federal floor we use is {'$'}{FEDERAL_MIN_WAGE.toFixed(2)} an hour. State figures are
            approximate and change often — many states adjust every January, and cities and counties
            frequently set higher local rates. Tipped employees, minors, trainees, and small
            employers may be subject to different rates entirely. Treat our{' '}
            <Link to="/minimum-wage" className="text-blue-600 hover:underline">minimum wage pages</Link>{' '}
            as a starting point and confirm against your state labor department before relying on a
            number.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">6. Where our figures come from</h2>
          <p className="leading-relaxed mb-3">
            We work from primary government sources rather than second-hand summaries:
          </p>
          <ul className="space-y-2">
            {[
              ['Internal Revenue Service', 'Federal brackets, standard deductions, supplemental withholding rate, standard mileage rates', 'https://www.irs.gov'],
              ['Social Security Administration', 'Social Security wage base and contribution rates', 'https://www.ssa.gov'],
              ['US Department of Labor, Wage and Hour Division', 'FLSA overtime rules, federal and state minimum wage', 'https://www.dol.gov/agencies/whd'],
              ['State revenue and labor departments', 'State income tax rates and state-specific pay rules', null],
            ].map(([name, what, url]) => (
              <li key={name} className="bg-white border border-gray-200 rounded-xl p-3">
                <p className="font-semibold text-gray-800 text-sm">
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{name}</a>
                  ) : name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{what}</p>
              </li>
            ))}
          </ul>
          <p className="leading-relaxed mt-3">
            MyFreePayStub is an independent site. We are not affiliated with, endorsed by, or acting
            on behalf of the IRS, the Social Security Administration, the Department of Labor, or any
            state agency.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">7. Known limitations</h2>
          <p className="leading-relaxed mb-3">
            Stated once, plainly, so you know when to stop trusting the number and ask a professional:
          </p>
          <ul className="space-y-2 leading-relaxed">
            <li>State income tax is a flat approximation, not bracket-accurate.</li>
            <li>Local and city income taxes are not modelled.</li>
            <li>State disability and paid-family-leave contributions are not modelled.</li>
            <li>Equity compensation, capital gains, and self-employment income beyond our dedicated 1099 tools are out of scope.</li>
            <li>Tax credits other than a simplified child tax credit are not applied.</li>
            <li>Cost-of-living differences between locations are never included in comparisons.</li>
            <li>Nothing here is tax, legal, or financial advice, and no tool files anything on your behalf.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">8. Keeping this current</h2>
          <p className="leading-relaxed">
            Rates change every year, and some change mid-year. Our tax constants live in one place in
            the codebase and this page renders directly from them, so what you read here is
            necessarily what the calculators are using — it cannot quietly fall out of date while the
            tools change. Where a figure is known to move often and we cannot verify it for your tax
            year, we make it an editable field and point you to the official source instead of
            asserting it.
          </p>
          <p className="leading-relaxed mt-3">
            Found a rate you believe is wrong? Please{' '}
            <Link to="/contact" className="text-blue-600 hover:underline">tell us</Link> — corrections
            are the fastest way this page gets better, and we would rather be corrected than
            confidently wrong. Our{' '}
            <Link to="/editorial-standards" className="text-blue-600 hover:underline">editorial standards</Link>{' '}
            explain how we handle reports.
          </p>
        </section>
      </div>
    </div>
  )
}
