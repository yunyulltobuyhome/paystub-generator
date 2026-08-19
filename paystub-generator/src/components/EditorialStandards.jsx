import { Link } from 'react-router-dom'
import { usePageMeta } from '../hooks/usePageMeta'

export default function EditorialStandards() {
  usePageMeta({
    title: 'Editorial Standards & Corrections Policy | MyFreePayStub',
    description: 'How MyFreePayStub content is written, checked, and corrected: our sourcing rules, why we publish our limitations, how we handle errors, how the site is funded, and what we will not do.',
    canonicalPath: '/editorial-standards',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        'headline': 'Editorial Standards and Corrections Policy',
        'description': 'How MyFreePayStub produces, reviews, and corrects its calculators and guides.',
        'publisher': { '@type': 'Organization', 'name': 'MyFreePayStub', 'url': 'https://myfreepaystub.com' },
        'mainEntityOfPage': 'https://myfreepaystub.com/editorial-standards',
      }) }} />

      <div className="mb-6">
        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full font-semibold">Trust</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">Editorial Standards</h1>
        <p className="text-sm text-gray-500">
          We publish tools about people's pay and taxes. That is a subject where being confidently
          wrong causes real harm, so these are the rules we hold ourselves to.
        </p>
      </div>

      <div className="space-y-8 text-sm text-gray-600">
        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Who publishes this site</h2>
          <p className="leading-relaxed">
            MyFreePayStub is an independent, self-funded site built and maintained by a small
            team of software developers. We are not a payroll provider, an accounting firm, or a
            licensed tax practice, and we do not employ CPAs or attorneys.
          </p>
          <p className="leading-relaxed mt-3">
            We say this plainly because it determines what you should use us for. Our competence is
            in implementing published rules correctly and explaining them clearly: bracket
            arithmetic, FICA percentages and caps, overtime multiples, date calculations. Our
            competence is <strong>not</strong> in advising on your particular situation. Where a
            question needs professional judgement, we say so and point you to someone qualified
            rather than guessing.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">How we source figures</h2>
          <ul className="space-y-2 leading-relaxed">
            <li><strong>Primary sources only.</strong> Tax and wage figures come from the IRS, the Social Security Administration, the Department of Labor, and state agencies — not from other calculator sites.</li>
            <li><strong>One source of truth.</strong> Every rate lives in a single place in our code. Our <Link to="/methodology" className="text-blue-600 hover:underline">methodology page</Link> renders directly from those constants, so the published figures cannot drift away from what the tools actually compute.</li>
            <li><strong>Editable where volatile.</strong> When a figure changes often and we cannot verify it for your tax year — the IRS mileage rate, state unemployment rates — we make it an input you control and link the official source, instead of asserting a number that may be stale.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">We publish what our tools get wrong</h2>
          <p className="leading-relaxed">
            Every calculator states its assumptions and its limits on the page itself, not buried in
            a terms document. Our state income tax model is a flat approximation and we say so in
            those words. We do not model local taxes, disability contributions, or most credits, and
            we list that openly on the{' '}
            <Link to="/methodology" className="text-blue-600 hover:underline">methodology page</Link>.
          </p>
          <p className="leading-relaxed mt-3">
            A tool that hides its error bars is more dangerous than one that admits them, because it
            invites you to rely on it further than it can carry you.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Corrections</h2>
          <p className="leading-relaxed mb-3">
            If you think a rate, formula, or statement here is wrong, tell us. We would rather be
            corrected than trusted incorrectly.
          </p>
          <ol className="space-y-2 list-decimal list-inside leading-relaxed">
            <li>Send the page, the figure you saw, and what you believe it should be, via our <Link to="/contact" className="text-blue-600 hover:underline">contact page</Link>.</li>
            <li>We check it against the primary source.</li>
            <li>Confirmed errors in a published rate are fixed at the source constant, which corrects every tool and the methodology page at once.</li>
            <li>We aim to respond within 24–48 hours.</li>
          </ol>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">How the site is funded</h2>
          <p className="leading-relaxed">
            Every tool is free, with no account, no paywall, no watermark, and no upsell. The site is
            supported by display advertising. Advertisers have no influence over our calculations,
            our guides, or which tools we build, and we do not accept payment for coverage or
            placement. Advertising is labelled where it appears.
          </p>
          <p className="leading-relaxed mt-3">
            See our <Link to="/privacy" className="text-blue-600 hover:underline">privacy policy</Link>{' '}
            for how advertising cookies work and how to opt out of personalised ads.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Your data stays in your browser</h2>
          <p className="leading-relaxed">
            Our tools calculate locally, in the page. Salary figures, hours, and pay stub details are
            never transmitted to us, never stored on a server, and never sold. Nothing you type into
            a calculator survives closing the tab. We do not ask for Social Security numbers or bank
            account details anywhere on the site, and we never will.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">What we will not do</h2>
          <ul className="space-y-2 leading-relaxed">
            <li>We will not present our documents as official, certified, or issued by any employer or agency. Generated pay stubs carry a notice stating exactly what they are.</li>
            <li>We will not build tools designed to misrepresent income to a landlord, lender, or agency.</li>
            <li>We will not claim affiliation with the IRS or any government body.</li>
            <li>We will not tell you what to do with your money, which job to take, or that any outcome is guaranteed.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Not professional advice</h2>
          <p className="leading-relaxed">
            Everything on this site is general information and estimation, provided for your own
            planning. It is not tax, legal, accounting, or financial advice, and using it does not
            create a professional relationship. For decisions that matter, consult a qualified
            professional who can look at your actual circumstances. Our full terms are on the{' '}
            <Link to="/terms" className="text-blue-600 hover:underline">terms of service</Link> page.
          </p>
        </section>
      </div>
    </div>
  )
}
