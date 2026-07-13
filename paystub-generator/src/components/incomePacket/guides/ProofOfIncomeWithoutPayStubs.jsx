import { usePageMeta } from '../../../hooks/usePageMeta'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from '../../blog/blogShared'

const FAQ = [
  { q: 'How do I prove income if I don\'t get pay stubs?', a: 'Common alternatives include bank statements, tax returns (1099s, Schedule C), signed client invoices, and a self-prepared income summary organizing your monthly totals.' },
  { q: 'Will landlords accept self-employment income without pay stubs?', a: 'Many will, especially with supporting documentation like bank statements or tax returns. Requirements vary by landlord — an organized income summary can make self-employment income easier to evaluate.' },
  { q: 'What if my income varies a lot month to month?', a: 'Show several months (3-12) so a reviewer can see your average income rather than a single unusually high or low month.' },
]

export default function ProofOfIncomeWithoutPayStubs() {
  usePageMeta({
    title: 'How to Show Proof of Income Without Pay Stubs (2026) | MyFreePayStub',
    description: 'Self-employed, freelance, or gig income? Here\'s how to document your income for rental applications and loans without traditional pay stubs.',
    canonicalPath: '/how-to-prove-income/proof-of-income-without-pay-stubs',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="How to Show Proof of Income Without Pay Stubs"
        description="How to document income for rental applications and loans without traditional pay stubs."
        slug="/how-to-prove-income/proof-of-income-without-pay-stubs"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          How to Show Proof of Income Without Pay Stubs
        </h1>
        <p className="text-sm text-gray-400">Updated July 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          If you're self-employed, freelance, or work gig platforms, you likely don't receive a
          traditional pay stub — but you can still put together documentation that clearly shows
          what you earn.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Alternatives to Pay Stubs</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li><strong>Bank statements</strong> showing 2-6 months of consistent deposits</li>
            <li><strong>Tax returns</strong> — Schedule C, 1099-NEC, or 1099-K from the prior year</li>
            <li><strong>Client invoices or contracts</strong> showing agreed payment terms</li>
            <li><strong>Platform earnings history</strong> from rideshare, delivery, or freelance apps</li>
            <li><strong>A self-prepared income summary</strong> organizing your monthly totals into one document</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why an Organized Summary Helps</h2>
          <p className="leading-relaxed">
            A landlord or lender reviewing five different bank statements, a handful of 1099s, and a
            stack of invoices has to do a lot of manual work to figure out your typical monthly
            income. Organizing all of that into a single, readable summary — with monthly totals and
            a list of your income sources — makes the review much faster and clearer.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">A Note on Honesty</h2>
          <p className="leading-relaxed">
            Any income documentation you prepare should accurately reflect what you actually earn.
            Misrepresenting your income to a landlord, lender, or government agency is fraud and can
            carry serious legal consequences. Always enter truthful, accurate figures.
          </p>
        </section>

        <ToolCTA
          to="/income-verification-packet"
          title="Organize Your Income Into a Packet"
          desc="Turn your self-reported income into a clean PDF — free, no sign-up, nothing leaves your browser."
          label="Build My Income Packet →"
        />

        <RelatedGuides items={[
          { to: '/how-to-prove-income/proof-of-income-for-freelancers', label: 'Proof of Income for Freelancers' },
          { to: '/how-to-prove-income/what-is-an-income-verification-packet', label: 'What Is an Income Verification Packet?' },
          { to: '/guides/how-many-pay-stubs-for-apartment', label: 'How Many Pay Stubs Do You Need to Rent an Apartment?' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
