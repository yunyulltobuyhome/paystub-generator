import { usePageMeta } from '../../../hooks/usePageMeta'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from '../../blog/blogShared'

const FAQ = [
  { q: 'What is an income verification packet?', a: 'A document that organizes self-reported income into a single readable PDF — typically a cover summary, monthly income totals, an optional profit and loss statement, and a list of income sources.' },
  { q: 'Is an income verification packet an official document?', a: 'No. It organizes the numbers you provide into a readable format. It is not issued or verified by any government agency, employer, or financial institution, and does not guarantee acceptance by any landlord or lender.' },
  { q: 'Who typically needs one?', a: 'Freelancers, rideshare and delivery drivers, online sellers, and other self-employed workers who don\'t receive traditional pay stubs and need to document income for a rental application, loan, or similar request.' },
]

export default function WhatIsIncomeVerificationPacket() {
  usePageMeta({
    title: 'What Is an Income Verification Packet? (2026 Guide) | MyFreePayStub',
    description: 'An income verification packet organizes self-reported income into a professional PDF for rental applications, loans, and more. Here\'s what\'s included and who needs one.',
    canonicalPath: '/how-to-prove-income/what-is-an-income-verification-packet',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="What Is an Income Verification Packet?"
        description="What an income verification packet includes, and who typically needs one."
        slug="/how-to-prove-income/what-is-an-income-verification-packet"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          What Is an Income Verification Packet?
        </h1>
        <p className="text-sm text-gray-400">Updated July 2026 · 3 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          An income verification packet is a single, organized document that presents your
          self-reported income clearly — built for people who don't get a traditional pay stub, like
          freelancers, gig workers, and other self-employed individuals.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What's Typically Included</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Cover summary</strong> — your name, occupation, and an income snapshot</li>
            <li><strong>Income summary</strong> — monthly totals over a chosen period (3, 6, or 12 months)</li>
            <li><strong>Profit &amp; loss statement</strong> (optional) — income minus business expenses</li>
            <li><strong>Income source list</strong> — the clients or platforms you were paid by</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Who Needs One?</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🚗', title: 'Rideshare & Delivery', desc: 'Uber, Lyft, DoorDash, Instacart' },
              { icon: '💻', title: 'Freelancers', desc: 'Upwork, Fiverr, contract work' },
              { icon: '🛍️', title: 'Online Sellers', desc: 'Etsy, eBay, and similar platforms' },
              { icon: '📋', title: 'Consultants', desc: 'Anyone paid outside a W-2' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg mb-1">{icon}</p>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-bold text-amber-800 mb-1">⚠️ What it isn't</p>
          <p className="text-amber-800 leading-relaxed text-xs">
            An income verification packet is not issued or verified by any government agency,
            employer, or financial institution — it organizes the numbers you provide. It doesn't
            guarantee acceptance by any landlord or lender. Always enter truthful, accurate
            information.
          </p>
        </section>

        <ToolCTA
          to="/income-verification-packet"
          title="Try the Income Verification Packet Builder"
          desc="Free, no sign-up. Nothing you enter is saved or sent to a server."
          label="Build My Packet →"
        />

        <RelatedGuides items={[
          { to: '/how-to-prove-income/proof-of-income-for-freelancers', label: 'Proof of Income for Freelancers' },
          { to: '/how-to-prove-income/profit-and-loss-statement-for-gig-workers', label: 'Profit and Loss Statement for Gig Workers' },
          { to: '/how-to-prove-income/proof-of-income-without-pay-stubs', label: 'How to Show Proof of Income Without Pay Stubs' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
