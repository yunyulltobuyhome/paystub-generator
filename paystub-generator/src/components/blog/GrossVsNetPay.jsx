import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { takeHomeByState, federalTakeHome, takeHomeForState } from '../../utils/salaryTakeHome'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const usd = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US')
const pc = (n) => (n * 100).toFixed(1) + '%'

// Every figure below is computed by the same engine the calculators use.
const LADDER = [40000, 60000, 80000, 100000, 150000]
const rows = LADDER.map((salary) => {
  const byState = takeHomeByState(salary)
  const best = byState[0]
  const worst = byState[byState.length - 1]
  const fed = federalTakeHome(salary)
  return {
    salary, best, worst, fed,
    keptFed: fed.net / salary,
    keptBest: best.net / salary,
    keptWorst: worst.net / salary,
    spread: best.net - worst.net,
  }
})
const mid = rows.find((r) => r.salary === 60000)
const top = rows[rows.length - 1]
const example = takeHomeForState(60000, 'CA')

const FAQ = [
  { q: 'What is the difference between gross pay and net pay?', a: 'Gross pay is what you earn before anything is taken out — the number in your offer letter. Net pay is what actually reaches your bank account after taxes and deductions. The gap is typically 20-35% of gross.' },
  { q: 'How much of my gross pay do I actually keep?', a: `It depends on income and state. Our computed figures for a single filer: about ${pc(mid.keptFed)} of a ${usd(60000)} salary survives federal tax and FICA, falling to roughly ${pc(mid.keptWorst)} in the highest-tax state we model. The share you keep drops as income rises, because federal brackets are progressive.` },
  { q: 'Why is my net pay lower than a calculator said?', a: 'Most online estimates only subtract taxes. Real pay stubs also carry health, dental and vision premiums, retirement contributions, and sometimes union dues, garnishments, or local taxes. Those are deductions, not taxes, and they can easily be another 10% of gross.' },
  { q: 'Does gross or net pay matter for a rental application?', a: 'Landlords almost always work from gross annual income, and the common rule of thumb is that rent should be under a third of it. Lenders vary — mortgage underwriting typically uses gross, while affordability checks may look at net. Read the request carefully before you send a number.' },
  { q: 'Which number goes on my tax return?', a: 'Neither exactly. Your W-2 Box 1 shows gross wages minus pre-tax deductions, which is why it is usually lower than your stated salary and does not match either the gross or net on your final pay stub.' },
]

export default function GrossVsNetPay() {
  usePageMeta({
    title: 'Gross Pay vs Net Pay: How Much You Actually Keep (2026)',
    description: `Gross is your salary; net is what arrives. We computed how much of each salary survives in every state: about ${pc(mid.keptFed)} of ${usd(60000)} after federal tax and FICA, and as little as ${pc(mid.keptWorst)} once state tax applies.`,
    canonicalPath: '/guides/gross-vs-net-pay',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="Gross Pay vs Net Pay: How Much You Actually Keep (2026)"
        description="The difference between gross and net pay, with the share of each salary that survives taxes computed across the income range and every state."
        slug="/guides/gross-vs-net-pay"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          Gross Pay vs Net Pay: How Much You Actually Keep
        </h1>
        <p className="text-sm text-gray-400">2026 rates · Figures computed from our tax engine · Updated August 2026</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Gross pay is the number in your offer letter. Net pay is the number in your bank account.
          The definition takes one sentence; the useful question is <strong>how big the gap is</strong>,
          and that turns out to depend on two things almost nobody accounts for when they accept a
          job: how much you earn, and which state you work in.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The two definitions, quickly</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200/80 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm">Gross pay</p>
              <p className="text-xs mt-1 leading-relaxed">
                Everything you earned in the period before anything is removed: base salary or hours
                worked, plus overtime, bonuses, commission, and tips. It is the top line of your pay
                stub and the figure used in most income requirements.
              </p>
            </div>
            <div className="bg-white border border-gray-200/80 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm">Net pay</p>
              <p className="text-xs mt-1 leading-relaxed">
                What is left after taxes and deductions — the amount actually deposited. It is the
                bottom line of your stub, and the only number that matters for what you can spend.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What actually comes out, in order</h2>
          <p className="leading-relaxed mb-3">
            Payroll removes things in a specific sequence, and the order matters because it changes
            what later items are calculated on. Using {usd(60000)} in California as a worked example:
          </p>
          <div className="bg-white border border-gray-200/80 rounded-xl p-5">
            <div className="space-y-2 text-sm">
              {[
                ['Gross pay', 60000, false],
                ['Federal income tax', -example.federal, true],
                ['Social Security (6.2%)', -example.ss, true],
                ['Medicare (1.45%)', -example.medicare, true],
                ['California state tax', -example.state, true],
              ].map(([label, val, sub], i) => (
                <div key={i} className={`flex justify-between border-b border-gray-50 py-1.5 ${sub ? 'text-gray-500 text-xs pl-3' : 'text-gray-700'}`}>
                  <span>{label}</span>
                  <span className={sub ? 'text-red-500' : 'font-semibold'}>{val < 0 ? `(${usd(-val)})` : usd(val)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-extrabold text-emerald-700">
                <span>Net pay</span>
                <span>{usd(example.net)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              {pc(example.net / 60000)} of gross survives — before any benefit deductions.
            </p>
          </div>
          <p className="leading-relaxed mt-3">
            <strong>Pre-tax deductions come out first.</strong> Health, dental and vision premiums
            are removed before tax is calculated, which is why they cost you less than their sticker
            price. <strong>Traditional 401(k) contributions</strong> reduce income tax but not FICA.
            <strong> Post-tax deductions</strong> — Roth contributions, garnishments, union dues —
            come out last and reduce net pay dollar for dollar.
          </p>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How much survives, computed</h2>
          <p className="leading-relaxed mb-3">
            We ran each salary through federal tax and FICA, then through every state, and took the
            best and worst outcome. Two patterns fall out that a definition never shows you:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Gross salary</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">No state tax</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Highest-tax state</th>
                  <th className="text-right p-2 border border-gray-200 font-semibold">Difference</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.salary} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium text-gray-800">{usd(r.salary)}</td>
                    <td className="p-2 border border-gray-200 text-right">
                      {usd(r.best.net)} <span className="text-gray-400">({pc(r.keptBest)})</span>
                    </td>
                    <td className="p-2 border border-gray-200 text-right">
                      {usd(r.worst.net)} <span className="text-gray-400">({pc(r.keptWorst)})</span>
                    </td>
                    <td className="p-2 border border-gray-200 text-right font-semibold text-amber-700">{usd(r.spread)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="leading-relaxed mt-3">
            <strong>First, the share you keep falls as you earn more.</strong> At {usd(40000)} about{' '}
            {pc(rows[0].keptFed)} of gross survives federal tax and FICA; at {usd(150000)} it is{' '}
            {pc(top.keptFed)}. That is progressive brackets working as designed, but it means a raise
            never lands in full — see our{' '}
            <Link to="/pay-raise-calculator" className="text-blue-600 hover:underline">pay raise calculator</Link>{' '}
            for what a specific one is worth after tax.
          </p>
          <p className="leading-relaxed mt-3">
            <strong>Second, the state gap widens with income.</strong> At {usd(40000)} the difference
            between the best and worst state is {usd(rows[0].spread)} a year. At {usd(150000)} it is{' '}
            <strong>{usd(top.spread)}</strong> — larger than many people's annual raise, decided
            entirely by which side of a state line they work on.
          </p>
        </section>

        <ToolCTA
          to="/paycheck-calculator"
          title="Work out your own net pay"
          desc="Enter your salary, state, pay frequency and deductions to see the exact gap between gross and net on your paycheck."
          label="Open Paycheck Calculator →"
        />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Which number do you need?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Situation</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Use</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Why</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Rental application', 'Gross', 'Landlords size rent against gross annual income'],
                  ['Mortgage application', 'Gross', 'Underwriting ratios are built on gross'],
                  ['Personal budgeting', 'Net', 'Only net is spendable'],
                  ['Comparing job offers', 'Net, minus job costs', 'Gross hides state tax and benefit differences'],
                  ['Negotiating salary', 'Gross', 'But work backwards from the net you need'],
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
          <p className="leading-relaxed mt-3">
            The last two are where people lose money. If you know the take-home you need, our{' '}
            <Link to="/net-to-gross-calculator" className="text-blue-600 hover:underline">net to gross calculator</Link>{' '}
            tells you the salary to ask for, and the{' '}
            <Link to="/job-offer-comparison-calculator" className="text-blue-600 hover:underline">offer comparison tool</Link>{' '}
            shows why the higher gross frequently loses.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Common mistakes</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Budgeting on gross.</strong> Dividing your salary by 12 overstates monthly income by a fifth to a third. It is the most common cause of a budget that never balances.</li>
            <li><strong>Assuming net is a fixed percentage.</strong> It is not — it falls as you earn more, and it moves whenever benefits, bonuses, or the Social Security cap come into play.</li>
            <li><strong>Comparing your net to a colleague's.</strong> Different W-4 entries, benefit elections, and retirement contributions make two identical salaries produce very different net pay. It usually is not a payroll error.</li>
            <li><strong>Expecting your W-2 to match.</strong> Box 1 is gross minus pre-tax deductions, so it matches neither figure on your final stub.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How we calculated these figures</h2>
          <p className="leading-relaxed">
            Each salary was run through the 2026 federal brackets with the single-filer standard
            deduction, Social Security and Medicare at statutory rates, and each state's income tax.
            The tables are generated by the same functions our calculators call. State tax is modelled
            as a flat effective rate, so treat the state comparison as directionally right rather than
            bracket-exact, and note that no benefit deductions are included — full detail and
            limitations are on our{' '}
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
          { to: '/guides/what-is-fica-tax', label: 'What Is FICA Tax? Why it is not 7.65% for everyone' },
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/net-to-gross-calculator', label: 'Net to Gross Calculator' },
          { to: '/paycheck-checker', label: 'Paycheck Checker — is your stub right?' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
