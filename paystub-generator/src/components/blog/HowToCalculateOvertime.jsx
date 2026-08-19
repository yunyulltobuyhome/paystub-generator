import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { ArticleJsonLd, ArticleByline, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'
import AdSlot from '../AdSlot'
import { AD_SLOTS } from '../../config/ads'

const usd = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const usd0 = (n) => '$' + Math.round(Number(n)).toLocaleString('en-US')

// Worked example of the regular-rate rule. A non-discretionary bonus has to be
// folded into the rate overtime is computed on; leaving it out is the most
// common way overtime is underpaid.
const EX = { rate: 20, hours: 50, bonus: 100 }
const otHours = EX.hours - 40
const straightTime = EX.rate * EX.hours
const regularRate = (straightTime + EX.bonus) / EX.hours     // total pay ÷ total hours
const naiveOtPremium = EX.rate * 0.5 * otHours               // premium on base rate only
const correctOtPremium = regularRate * 0.5 * otHours         // premium on the true regular rate
const weeklyShortfall = correctOtPremium - naiveOtPremium
const annualShortfall = weeklyShortfall * 52

const FAQ = [
  { q: 'How do I calculate overtime pay?', a: 'Take your regular rate — total pay for the week divided by total hours worked — and pay an extra half of it for every hour past 40, on top of the straight-time pay you already earned for those hours. For a simple hourly job with no bonuses that works out to the familiar 1.5× your hourly rate.' },
  { q: 'Does a bonus change my overtime rate?', a: `Yes, if it is non-discretionary — production, attendance, or safety bonuses, and most shift differentials. It must be added into the regular rate before overtime is computed. In our worked example a ${usd0(EX.bonus)} weekly bonus lifts the regular rate from ${usd(EX.rate)} to ${usd(regularRate)}, and leaving it out underpays about ${usd(weeklyShortfall)} a week.` },
  { q: 'Is overtime based on the workweek or the pay period?', a: 'The workweek. A fixed, recurring seven-day period is the unit under federal law. Working 30 hours one week and 50 the next in the same bi-weekly period is still 10 hours of overtime, even though the total is 80.' },
  { q: 'Am I entitled to overtime if I am salaried?', a: 'Possibly. Being paid a salary does not by itself make you exempt — exemption depends on meeting both a salary threshold and a duties test. Many salaried employees are non-exempt and legally owed overtime.' },
  { q: 'Does my state have different overtime rules?', a: 'Several do, and where they differ the rule more favourable to the employee applies. California and a few other states require daily overtime past 8 hours, and some have double-time rules. Check your state labor department for the specifics.' },
  { q: 'Can my employer average my hours across two weeks?', a: 'Generally no for non-exempt employees. Averaging two weeks to avoid an overtime obligation is not permitted under the standard FLSA rules; each workweek stands alone.' },
]

export default function HowToCalculateOvertime() {
  usePageMeta({
    title: 'How to Calculate Overtime Pay — Including the Bonus Rule Most People Miss',
    description: `Overtime is not always 1.5× your hourly rate. Non-discretionary bonuses must be folded into the regular rate first — a ${usd0(EX.bonus)} weekly bonus can mean roughly ${usd0(annualShortfall)} a year of underpaid overtime. Worked examples and the workweek rule.`,
    canonicalPath: '/guides/how-to-calculate-overtime',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="How to Calculate Overtime Pay — Including the Bonus Rule Most People Miss"
        description="How overtime is actually computed under the FLSA, including the regular-rate rule for non-discretionary bonuses, with worked examples."
        slug="/guides/how-to-calculate-overtime"
        faq={FAQ}
      />

      <ArticleByline slug="/guides/how-to-calculate-overtime" />

      <div className="mb-6">
        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          How to Calculate Overtime Pay
        </h1>
        <p className="text-sm text-gray-400">2026 FLSA rules · Worked examples</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Almost every explanation of overtime says "1.5× your hourly rate". That is right only when
          your hourly rate is the whole story — and for a large share of hourly workers it is not.
          The federal rule is built on your <strong>regular rate</strong>, which is not always the
          number on your offer letter.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The basic rule</h2>
          <p className="leading-relaxed">
            Under the federal Fair Labor Standards Act, non-exempt employees must receive at least
            one and a half times their regular rate for hours worked beyond 40 in a workweek. The
            workweek is a fixed, recurring seven-day period — <strong>not</strong> your pay period.
          </p>
          <p className="leading-relaxed mt-3">
            That distinction costs people money. Working 30 hours one week and 50 the next totals 80
            across a bi-weekly period, which looks like no overtime. It is 10 overtime hours, because
            each week stands on its own.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The regular rate is not always your hourly rate</h2>
          <p className="leading-relaxed mb-3">
            The regular rate is total pay for the week divided by total hours worked. Several things
            have to be included in "total pay" before the division:
          </p>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Non-discretionary bonuses</strong> — production, attendance, quality, safety, or anything promised in advance to encourage performance.</li>
            <li><strong>Shift differentials</strong> — extra per hour for nights or weekends.</li>
            <li><strong>Commissions</strong> earned during the period.</li>
            <li><strong>The value of some non-cash compensation.</strong></li>
          </ul>
          <p className="leading-relaxed mt-3">
            A genuinely discretionary bonus — decided after the fact, not promised, not tied to
            performance — is excluded. A holiday gift is discretionary. A "hit target, get $100"
            bonus is not, no matter what it is called.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Worked example: what the bonus rule is worth</h2>
          <p className="leading-relaxed mb-3">
            Someone earning {usd(EX.rate)}/hour works {EX.hours} hours in a week and receives a{' '}
            {usd0(EX.bonus)} attendance bonus. Here are the two calculations:
          </p>
          <div className="space-y-3">
            <div className="bg-white border border-gray-200/80 rounded-xl p-4">
              <p className="font-bold text-gray-800 text-sm mb-2">The common (incorrect) calculation</p>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span>Straight time, {EX.hours} hrs × {usd(EX.rate)}</span><span>{usd0(straightTime)}</span></div>
                <div className="flex justify-between"><span>Overtime premium, {otHours} hrs × {usd(EX.rate * 0.5)}</span><span>{usd(naiveOtPremium)}</span></div>
                <div className="flex justify-between"><span>Bonus</span><span>{usd0(EX.bonus)}</span></div>
                <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-1.5 mt-1.5">
                  <span>Total</span><span>{usd(straightTime + naiveOtPremium + EX.bonus)}</span>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
              <p className="font-bold text-emerald-900 text-sm mb-2">The correct calculation</p>
              <div className="space-y-1 text-xs text-emerald-900">
                <div className="flex justify-between"><span>Regular rate = ({usd0(straightTime)} + {usd0(EX.bonus)}) ÷ {EX.hours} hrs</span><span className="font-semibold">{usd(regularRate)}/hr</span></div>
                <div className="flex justify-between"><span>Straight time</span><span>{usd0(straightTime)}</span></div>
                <div className="flex justify-between"><span>Overtime premium, {otHours} hrs × {usd(regularRate * 0.5)}</span><span>{usd(correctOtPremium)}</span></div>
                <div className="flex justify-between"><span>Bonus</span><span>{usd0(EX.bonus)}</span></div>
                <div className="flex justify-between font-bold border-t border-emerald-200 pt-1.5 mt-1.5">
                  <span>Total</span><span>{usd(straightTime + correctOtPremium + EX.bonus)}</span>
                </div>
              </div>
            </div>
          </div>
          <p className="leading-relaxed mt-3">
            The gap is <strong>{usd(weeklyShortfall)} a week</strong> — around{' '}
            <strong>{usd0(annualShortfall)} a year</strong> if it recurs. It is small enough per
            paycheck to go unnoticed and large enough over a year to matter, which is exactly why it
            is one of the most frequently cited overtime errors.
          </p>
        </section>

        <AdSlot slot={AD_SLOTS.article} />

        <ToolCTA
          to="/overtime-calculator"
          title="Work out your own overtime"
          desc="Enter your rate, regular hours and overtime hours to see the split — or use the time card calculator if you need to total your week first."
          label="Open Overtime Calculator →"
        />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Who is actually entitled to overtime</h2>
          <p className="leading-relaxed mb-3">
            Being salaried does not make you exempt. Exemption generally requires <em>both</em> a
            salary at or above the applicable threshold <em>and</em> duties that fit a recognised
            exemption — executive, administrative, professional, outside sales, or certain computer
            roles. Failing either test means you are non-exempt and owed overtime.
          </p>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Job titles do not decide it.</strong> Calling a role "manager" does not create an exemption if the actual duties do not qualify.</li>
            <li><strong>Paying a salary does not decide it.</strong> A non-exempt employee can be paid a salary and still be owed overtime on top.</li>
            <li><strong>Agreeing to waive overtime does not decide it.</strong> The entitlement generally cannot be waived by agreement.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">State rules that override the federal floor</h2>
          <p className="leading-relaxed">
            Federal law is a floor, not a ceiling. Where a state rule is more generous, it applies.
            The common variations are <strong>daily overtime</strong> past 8 hours in a day,{' '}
            <strong>double time</strong> past a longer daily threshold, and <strong>seventh-day</strong>{' '}
            rules for consecutive days worked. California is the most cited example, but it is not
            the only one — check your own state labor department rather than assuming the federal
            rule is all that applies to you.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Checking your own pay</h2>
          <ul className="space-y-2 leading-relaxed">
            <li>Total your hours <strong>per workweek</strong>, not per pay period. Our <Link to="/time-card-calculator" className="text-blue-600 hover:underline">time card calculator</Link> does this and handles overnight shifts.</li>
            <li>Add every non-discretionary payment for that week before working out the regular rate.</li>
            <li>Compare the implied overtime rate on your stub to what the calculation gives. Our <Link to="/paycheck-checker" className="text-blue-600 hover:underline">paycheck checker</Link> flags overtime paid below 1.5×.</li>
            <li>If it looks short, ask payroll first — it is usually a setup issue rather than intent. If it is not resolved, the US Department of Labor and your state labor department handle wage complaints.</li>
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

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ⚠️ General information about how the calculation works, not legal advice, and not a
          determination about your situation. Exemption status, the regular-rate treatment of a
          specific payment, and state overrides all turn on facts this page cannot see. See the{' '}
          <a href="https://www.dol.gov/agencies/whd/overtime" target="_blank" rel="noopener noreferrer" className="underline">US Department of Labor</a>{' '}
          or an employment attorney for advice on your own pay.
        </div>

        <RelatedGuides items={[
          { to: '/overtime-calculator', label: 'Overtime Pay Calculator' },
          { to: '/time-card-calculator', label: 'Time Card Calculator — total your workweek' },
          { to: '/paycheck-checker', label: 'Paycheck Checker — is your overtime right?' },
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
