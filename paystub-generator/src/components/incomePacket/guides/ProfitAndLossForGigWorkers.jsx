import { usePageMeta } from '../../../hooks/usePageMeta'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from '../../blog/blogShared'

const FAQ = [
  { q: 'What is a profit and loss statement?', a: 'A profit and loss (P&L) statement summarizes your income and expenses over a period, showing your net income after costs. For gig workers, it typically covers categories like mileage, supplies, and software.' },
  { q: 'Do I need a P&L statement to prove income?', a: 'It\'s not always required, but it can help — especially if you have significant business expenses. It shows a reviewer your realistic take-home income, not just gross earnings.' },
  { q: 'What expense categories should gig workers track?', a: 'Common categories include car and mileage, supplies, software and subscriptions, phone and internet, home office, and insurance — similar to IRS Schedule C categories.' },
]

export default function ProfitAndLossForGigWorkers() {
  usePageMeta({
    title: 'Profit and Loss Statement for Gig Workers: What It Is (2026) | MyFreePayStub',
    description: 'What a profit and loss (P&L) statement is, why gig workers and freelancers use one, common expense categories, and how to prepare one for income verification.',
    canonicalPath: '/how-to-prove-income/profit-and-loss-statement-for-gig-workers',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="Profit and Loss Statement for Gig Workers: What It Is and How to Prepare One"
        description="What a P&L statement is, why gig workers use one, and how to prepare one for income verification."
        slug="/how-to-prove-income/profit-and-loss-statement-for-gig-workers"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          Profit and Loss Statement for Gig Workers: What It Is and How to Prepare One
        </h1>
        <p className="text-sm text-gray-400">Updated July 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          If you drive, deliver, freelance, or sell online, your gross earnings and your actual
          take-home income can look very different once expenses are factored in. A profit and loss
          (P&L) statement bridges that gap.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What Is a P&L Statement?</h2>
          <p className="leading-relaxed">
            A profit and loss statement lists your <strong>total income</strong>, subtracts your
            <strong> business expenses</strong>, and shows your <strong>net income</strong> — what
            you actually keep. For gig workers, this is often simpler than a full business P&L: a
            list of income totals and a handful of expense categories is usually enough.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Common Expense Categories</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 border border-gray-200 font-semibold">Category</th>
                  <th className="text-left p-2 border border-gray-200 font-semibold">Examples</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Car & Mileage', 'Gas, maintenance, mileage for rideshare/delivery'],
                  ['Supplies', 'Packaging, materials, tools'],
                  ['Software & Subscriptions', 'Design tools, project management apps'],
                  ['Phone & Internet', 'Portion used for work'],
                  ['Home Office', 'Portion of rent/utilities used for work'],
                  ['Insurance', 'Business or vehicle insurance'],
                ].map(([cat, ex], i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 border border-gray-200 font-medium">{cat}</td>
                    <td className="p-2 border border-gray-200 text-gray-500">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why It Helps With Income Verification</h2>
          <p className="leading-relaxed">
            Showing gross income alone can overstate what you actually take home, especially for
            online sellers and delivery drivers with real costs. A simple P&L gives a landlord or
            lender a more accurate, honest picture — and it's optional if your situation doesn't
            need it.
          </p>
        </section>

        <ToolCTA
          to="/income-verification-packet"
          title="Build a P&L Statement in Minutes"
          desc="Enter your monthly income and expense categories, and get a clean profit & loss page included in your free income verification packet."
          label="Build My Income Packet →"
        />

        <RelatedGuides items={[
          { to: '/how-to-prove-income/proof-of-income-for-freelancers', label: 'Proof of Income for Freelancers' },
          { to: '/for/etsy-sellers', label: 'Proof of Income for Etsy Sellers' },
          { to: '/self-employment-tax-calculator', label: 'Self-Employment Tax Calculator (1099)' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
