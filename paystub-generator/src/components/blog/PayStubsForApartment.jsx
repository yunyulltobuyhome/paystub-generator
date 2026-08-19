import { usePageMeta } from '../../hooks/usePageMeta'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from './blogShared'

const FAQ = [
  { q: 'How many pay stubs do you need to rent an apartment?', a: 'Most landlords ask for your two or three most recent pay stubs to verify steady income, usually alongside proof that you earn about 3× the monthly rent.' },
  { q: 'What can I use as proof of income if I don\'t have pay stubs?', a: 'Common alternatives include bank statements, an offer or employment letter, tax returns or W-2s, and — for self-employed people — 1099s and invoices.' },
  { q: 'Do landlords accept self-generated pay stubs?', a: 'It depends entirely on the landlord. A self-generated pay stub is for personal record-keeping; misrepresenting income to a landlord is fraud. Always provide truthful, accurate documentation.' },
]

export default function PayStubsForApartment() {
  usePageMeta({
    title: 'How Many Pay Stubs Do You Need to Rent an Apartment? (2026) | MyFreePayStub',
    description: 'How many pay stubs landlords require for a rental application, the 3× rent income rule, proof-of-income alternatives, and what to do if you\'re self-employed.',
    canonicalPath: '/guides/how-many-pay-stubs-for-apartment',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline="How Many Pay Stubs Do You Need to Rent an Apartment?"
        description="How many pay stubs landlords require, the 3× rent rule, and proof-of-income alternatives for renters."
        slug="/guides/how-many-pay-stubs-for-apartment"
        faq={FAQ}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-extrabold text-gray-800 mt-3 mb-2">
          How Many Pay Stubs Do You Need to Rent an Apartment?
        </h1>
        <p className="text-sm text-gray-400">Updated June 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">
          When you apply for an apartment, landlords want proof you can reliably pay rent.
          Pay stubs are the most common way to show that — but how many do you actually need,
          and what if you're self-employed? Here's what to expect.
        </p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The Short Answer</h2>
          <p className="leading-relaxed">
            Most landlords and property managers ask for your <strong>two to three most recent pay
            stubs</strong>. This gives them a consistent picture of your income over the last one to
            two months. Some may also request the last 30 days, which usually works out to two
            biweekly stubs or two semi-monthly stubs.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">The 3× Rent Rule</h2>
          <p className="leading-relaxed">
            A widely used guideline is that your <strong>gross monthly income should be about three
            times the monthly rent</strong>. For example, for a $1,500/month apartment, many landlords
            want to see roughly $4,500/month in gross income. Your pay stubs are how they verify it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Proof of Income Without Traditional Pay Stubs</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🏦', title: 'Bank statements', desc: 'Show consistent deposits over 2–3 months' },
              { icon: '📄', title: 'Offer / employment letter', desc: 'Confirms salary and start date' },
              { icon: '🧾', title: 'Tax returns / W-2', desc: 'Annual income verification' },
              { icon: '💻', title: '1099s & invoices', desc: 'For freelancers and gig workers' },
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
          <h2 className="text-base font-bold text-gray-800 mb-3">Self-Employed or Gig Worker?</h2>
          <p className="leading-relaxed">
            If you're a freelancer, contractor, or gig worker, you may not receive traditional pay
            stubs. In that case, landlords typically accept bank statements, tax returns, 1099 forms,
            and invoices. Keeping organised records of your monthly income makes applications far
            smoother.
          </p>
        </section>

        <section className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="font-bold text-amber-800 mb-1">⚠️ A note on honesty</p>
          <p className="text-amber-800 leading-relaxed text-xs">
            Pay stubs you generate for yourself are for <strong>personal record-keeping only</strong>.
            Submitting false or inflated income documentation to a landlord is fraud and is illegal.
            Always provide truthful, accurate information.
          </p>
        </section>

        <ToolCTA
          to="/multiple-paystubs"
          title="Keep Your Income Records Organised"
          desc="Generate several consecutive pay stubs with year-to-date totals for your own record-keeping — free, no sign-up, no watermark."
          label="Open Multiple Pay Stubs Generator →"
        />

        <RelatedGuides items={[
          { to: '/guides/pay-stub-vs-w2', label: 'Pay Stub vs W-2: What\'s the Difference?' },
          { to: '/guides/how-to-read-your-pay-stub', label: 'How to Read Your Pay Stub' },
          { to: '/how-to-prove-income/proof-of-income-without-pay-stubs', label: 'How to Show Proof of Income Without Pay Stubs' },
          { to: '/self-employment-tax-calculator', label: 'Self-Employment Tax Calculator (1099)' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
