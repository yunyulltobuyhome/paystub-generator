import { usePageMeta } from '../../../hooks/usePageMeta'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from '../../blog/blogShared'

const FAQ = [
  { q: 'What counts as proof of income for a freelancer?', a: 'Bank statements, tax returns (Schedule C, 1099s), invoices, client contracts, and a self-prepared income summary are all commonly accepted forms of proof of income for freelancers.' },
  { q: 'How many months of income should I show?', a: 'Most landlords and lenders want to see 3-6 months of recent, consistent income. Longer periods (up to 12 months) can help smooth out seasonal or inconsistent freelance income.' },
  { q: 'Do I need an accountant to prepare proof of income?', a: 'No. You can organize your own income and expense records into a clear document. An accountant is useful for tax filing, but not required for personal income documentation.' },
]

export default function ProofOfIncomeForFreelancers() {
  usePageMeta({
    title: 'Proof of Income for Freelancers: A Complete Guide (2026) | MyFreePayStub',
    description: 'How freelancers can document income for rental applications, loans, and other income requests — without traditional pay stubs. What to include, how many months to show, and free tools to help.',
    canonicalPath: '/how-to-prove-income/proof-of-income-for-freelancers',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="Proof of Income for Freelancers: A Complete Guide"
        description="How freelancers can document income for rental applications, loans, and other requests without traditional pay stubs."
        slug="/how-to-prove-income/proof-of-income-for-freelancers"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          Proof of Income for Freelancers: A Complete Guide (2026)
        </h1>
        <p className="text-sm text-gray-400">Updated July 2026 · 5 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          Without a traditional employer, freelancers don't get a standard pay stub — but landlords,
          lenders, and other institutions still need to see reliable proof of income. Here's what
          typically counts, and how to organize it.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What Counts as Proof of Income?</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🏦', title: 'Bank statements', desc: 'Show consistent deposits over 2-6 months' },
              { icon: '📄', title: 'Tax returns', desc: 'Schedule C, 1099-NEC, 1099-K from the prior year' },
              { icon: '🧾', title: 'Invoices & contracts', desc: 'Documents from clients showing agreed pay' },
              { icon: '📊', title: 'Self-prepared summary', desc: 'An organized income and expense document' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg mb-1">{icon}</p>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How Many Months Should You Show?</h2>
          <p className="leading-relaxed">
            Most landlords and lenders want <strong>3-6 months</strong> of recent, consistent income.
            If your freelance income varies a lot month to month, showing up to 12 months can help
            demonstrate a stable average, rather than a single unusually high or low month.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Organizing Multiple Clients</h2>
          <p className="leading-relaxed">
            Many freelancers get paid by several clients on different schedules, which can make raw
            bank statements confusing to read. A clear income summary — total monthly income, plus a
            list of your clients or platforms — is often easier for a reviewer to evaluate than a
            stack of individual invoices.
          </p>
        </section>

        <ToolCTA
          to="/income-verification-packet"
          title="Organize Your Freelance Income"
          desc="Turn your monthly income and client list into a clean, professional PDF packet — free, no sign-up, nothing leaves your browser."
          label="Build My Income Packet →"
        />

        <RelatedGuides items={[
          { to: '/how-to-prove-income/proof-of-income-without-pay-stubs', label: 'How to Show Proof of Income Without Pay Stubs' },
          { to: '/how-to-prove-income/profit-and-loss-statement-for-gig-workers', label: 'Profit and Loss Statement for Gig Workers' },
          { to: '/for/upwork-freelancers', label: 'Proof of Income for Upwork Freelancers' },
          { to: '/self-employment-tax-calculator', label: 'Self-Employment Tax Calculator (1099)' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
