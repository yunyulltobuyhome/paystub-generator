import { usePageMeta } from '../../hooks/usePageMeta'
import { ArticleJsonLd, ArticleByline, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'

const FAQ = [
  { q: 'What does YTD mean on a pay stub?', a: 'YTD means year-to-date — the running total of an amount (gross, taxes, deductions, or net) from January 1st through the current pay period.' },
  { q: 'What does FICA mean on my paycheck?', a: 'FICA stands for the Federal Insurance Contributions Act — the combined Social Security (6.2%) and Medicare (1.45%) payroll taxes.' },
  { q: 'What does FED or FIT mean on a pay stub?', a: 'FED, FIT, or FWT refer to federal income tax withholding. SIT or ST refer to state income tax withholding.' },
]

const ABBREVIATIONS = [
  ['Gross', 'Total earnings before deductions'],
  ['Net', 'Take-home pay after all deductions'],
  ['YTD', 'Year-to-date running total'],
  ['FICA', 'Social Security + Medicare payroll tax'],
  ['SS / OASDI', 'Social Security tax (6.2%)'],
  ['MED / Medicare', 'Medicare tax (1.45%)'],
  ['FED / FIT / FWT', 'Federal income tax withholding'],
  ['SIT / ST', 'State income tax withholding'],
  ['FUTA / SUTA', 'Federal / state unemployment tax (employer)'],
  ['401(k)', 'Retirement plan contribution (pre-tax)'],
  ['HSA / FSA', 'Health / flexible spending account'],
  ['PTO', 'Paid time off'],
  ['OT', 'Overtime pay (usually 1.5×)'],
  ['Reg', 'Regular hours/pay'],
  ['EE / ER', 'Employee / employer portion'],
  ['Chk / Chk No', 'Check number'],
]

export default function PayStubAbbreviations() {
  usePageMeta({
    title: 'Pay Stub Abbreviations Explained (2026 Cheat Sheet) | MyFreePayStub',
    description: 'Confused by the codes on your pay stub? A plain-English cheat sheet for YTD, FICA, OASDI, FED, SIT, 401(k), and every common pay stub abbreviation.',
    canonicalPath: '/guides/pay-stub-abbreviations',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="Pay Stub Abbreviations Explained (Cheat Sheet)"
        description="A plain-English cheat sheet for every common pay stub abbreviation — YTD, FICA, OASDI, FED, SIT, 401(k) and more."
        slug="/guides/pay-stub-abbreviations"
        faq={FAQ}
      />

      <ArticleByline slug="/guides/pay-stub-abbreviations" />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          Pay Stub Abbreviations Explained (Cheat Sheet)
        </h1>
        <p className="text-sm text-gray-400">3 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Pay stubs are full of cryptic codes. Here's a plain-English cheat sheet for the
          abbreviations you're most likely to see on a US paycheck.
        </p>

        <section>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold w-40">Abbreviation</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {ABBREVIATIONS.map(([abbr, meaning], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-semibold text-blue-600">{abbr}</td>
                    <td className="p-2 border border-gray-200 text-gray-600">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ToolCTA
          to="/"
          title="Generate a Clearly-Labeled Pay Stub"
          desc="Our free generator produces a clean pay stub with every line clearly labeled — gross, each tax, deductions, net, and YTD."
          label="Create Free Pay Stub →"
        />

        <RelatedGuides items={[
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/guides/what-is-ytd-on-a-paycheck', label: 'What Is YTD on a Paycheck?' },
          { to: '/guides/gross-vs-net-pay', label: 'Gross Pay vs Net Pay' },
          { to: '/guides/what-is-fica-tax', label: 'What Is FICA Tax?' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
