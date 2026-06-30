import { useParams, Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'
import { calcFederalTax } from '../utils/taxCalculator'
import { FICA } from '../data/stateTaxRates'
import { getStateBySlug, STATE_LIST } from '../utils/states'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blog/blogShared'

const SAMPLE_SALARY = 60000

const fmt = (n) => '$' + Math.round(Number(n || 0)).toLocaleString('en-US')
const pct = (r) => (r * 100).toFixed(2).replace(/\.?0+$/, '') + '%'

// Simple annual take-home estimate for a representative salary, consistent with the rest of the site.
function sampleTakeHome(rate) {
  const federal = calcFederalTax(SAMPLE_SALARY, 'single')
  const ss = Math.min(SAMPLE_SALARY, FICA.socialSecurityWageBase) * FICA.socialSecurityRate
  const medicare = SAMPLE_SALARY * FICA.medicareRate
  const state = SAMPLE_SALARY * rate
  const net = SAMPLE_SALARY - federal - ss - medicare - state
  return { federal, ss, medicare, state, net }
}

export default function StatePayStub() {
  const { stateSlug } = useParams()
  const state = getStateBySlug(stateSlug)

  usePageMeta({
    title: state
      ? `${state.name} Pay Stub & Paycheck Taxes (2026) — Free Generator | MyFreePayStub`
      : 'State Pay Stub Guides | MyFreePayStub',
    description: state
      ? `${state.name} paycheck taxes for 2026: state income tax rate, federal & FICA withholding, a sample take-home breakdown, pay stub requirements, and a free ${state.name} pay stub generator.`
      : 'Pay stub and paycheck tax guides for all 50 US states.',
    canonicalPath: state ? `/pay-stub/${state.slug}` : '/states',
  })

  if (!state) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-gray-800 mb-3">State not found</h1>
        <p className="text-sm text-gray-500 mb-6">We couldn't find that state page.</p>
        <Link to="/states" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
          Browse all states →
        </Link>
      </div>
    )
  }

  const hasTax = state.rate > 0
  const s = sampleTakeHome(state.rate)

  const FAQ = [
    {
      q: `Does ${state.name} have a state income tax?`,
      a: hasTax
        ? `Yes. ${state.name} levies a state income tax, applied here at an estimated effective rate of ${pct(state.rate)} for 2026. Your exact rate depends on your income and filing status.`
        : `No. ${state.name} is one of the US states with no state income tax, so your paycheck only has federal income tax and FICA (Social Security and Medicare) withheld.`,
    },
    {
      q: `How much is take-home pay on $60,000 in ${state.name}?`,
      a: `On a $60,000 salary (single filer, 2026), the estimated take-home pay in ${state.name} is about ${fmt(s.net)} per year after federal tax, Social Security, Medicare${hasTax ? `, and ${state.name} state tax` : ''}.`,
    },
    {
      q: `Are employers in ${state.name} required to provide pay stubs?`,
      a: `Most US states require employers to give employees an itemized statement of wages and deductions, though the exact rules vary. Check the ${state.name} Department of Labor for the specific requirements that apply to you.`,
    },
  ]

  const otherStates = STATE_LIST.filter((x) => x.code !== state.code).slice(0, 5)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline={`${state.name} Pay Stub & Paycheck Taxes (2026)`}
        description={`${state.name} state income tax, federal & FICA withholding, a sample take-home breakdown, and pay stub requirements for 2026.`}
        slug={`/pay-stub/${state.slug}`}
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">State Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          {state.name} Pay Stub & Paycheck Taxes (2026)
        </h1>
        <p className="text-sm text-gray-400">Updated June 2026 · State paycheck guide</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Whether you're checking your withholding or creating a pay stub for your records, here's how
          paychecks are taxed in <strong>{state.name}</strong> for 2026 — including the state income
          tax, federal tax, FICA, and a real take-home example.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Does {state.name} Have a State Income Tax?</h2>
          <div className={`rounded-xl border p-4 ${hasTax ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'}`}>
            <p className={`font-bold ${hasTax ? 'text-blue-800' : 'text-green-800'}`}>
              {hasTax ? `Yes — estimated ${pct(state.rate)} (2026)` : 'No state income tax 🎉'}
            </p>
            <p className={`text-xs mt-1 ${hasTax ? 'text-blue-700' : 'text-green-700'}`}>
              {hasTax
                ? `${state.name} withholds state income tax in addition to federal tax and FICA. The rate used here is a 2026 estimate; your actual rate depends on income and filing status.`
                : `${state.name} is one of nine states with no state income tax. Only federal income tax and FICA (Social Security + Medicare) come out of your paycheck.`}
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">2026 Paycheck Taxes in {state.name}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Tax</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Rate</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Federal Income Tax', '10% – 37%', 'Progressive, based on filing status'],
                  ['Social Security', '6.2%', 'On wages up to $184,500 (2026)'],
                  ['Medicare', '1.45%', 'All wages (+0.9% over $200k)'],
                  [`${state.name} State Tax`, hasTax ? `~${pct(state.rate)}` : '0%', hasTax ? 'Estimated 2026 effective rate' : 'No state income tax'],
                ].map(([tax, rate, note], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{tax}</td>
                    <td className="p-2 border border-gray-200 text-blue-600 font-semibold">{rate}</td>
                    <td className="p-2 border border-gray-200 text-gray-500">{note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Take-Home Pay on $60,000 in {state.name}</h2>
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Gross salary', SAMPLE_SALARY],
                ['Federal income tax', -s.federal],
                ['Social Security', -s.ss],
                ['Medicare', -s.medicare],
                ...(hasTax ? [[`${state.name} state tax`, -s.state]] : []),
              ].map(([label, val], i) => (
                <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                  <span className="text-gray-600">{label}</span>
                  <span className={val < 0 ? 'text-red-500' : 'font-semibold'}>{val < 0 ? `(${fmt(-val)})` : fmt(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-black text-emerald-700">
                <span>Estimated annual take-home</span>
                <span>{fmt(s.net)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Estimate for a single filer, 2026. Your actual take-home depends on deductions, credits,
              and local taxes. Use our calculator for your own numbers.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Pay Stub Requirements in {state.name}</h2>
          <p className="leading-relaxed">
            Most US states require employers to provide employees with an itemized pay statement
            showing gross wages, deductions, and net pay each pay period. The exact format and
            delivery rules vary by state. For the specific requirements that apply in {state.name},
            consult the {state.name} Department of Labor or a licensed payroll provider.
          </p>
        </section>

        <ToolCTA
          to="/"
          title={`Create a ${state.name} Pay Stub`}
          desc={`Generate a free pay stub with ${state.name} state tax, federal tax, and FICA calculated automatically for 2026 — no sign-up, no watermark.`}
          label="Create Free Pay Stub →"
        />

        <RelatedGuides items={[
          { to: '/paycheck-calculator', label: `Paycheck Calculator — your exact ${state.name} take-home` },
          { to: '/states', label: 'Browse paycheck guides for all 50 states' },
          ...otherStates.slice(0, 3).map((x) => ({ to: `/pay-stub/${x.slug}`, label: `${x.name} Pay Stub & Paycheck Taxes` })),
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
