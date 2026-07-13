import { useParams, Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { NICHE_CONTENT, NICHE_LIST } from '../../data/nicheContent'
import { ArticleJsonLd, ToolCTA, RelatedGuides, ArticleDisclaimer } from '../blog/blogShared'

export default function NicheLanding() {
  const { niche } = useParams()
  const data = NICHE_CONTENT[niche]

  usePageMeta({
    title: data
      ? `Proof of Income for ${data.label} (2026) | MyFreePayStub`
      : 'Proof of Income Guides | MyFreePayStub',
    description: data
      ? `How ${data.label.toLowerCase()} can show proof of income for rental applications and loans — where to find your ${data.platforms} earnings records, and how to organize them into a free income verification packet.`
      : 'Proof of income guides for freelancers and gig workers.',
    canonicalPath: data ? `/for/${niche}` : '/how-to-prove-income',
  })

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-gray-800 mb-3">Page not found</h1>
        <p className="text-sm text-gray-500 mb-6">We couldn't find a guide for that occupation.</p>
        <Link to="/how-to-prove-income" className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700">
          Browse all guides →
        </Link>
      </div>
    )
  }

  const otherNiches = NICHE_LIST.filter((n) => n.slug !== niche).slice(0, 3)

  const faq = data.faq.map(f => ({ q: f.q, a: f.a }))

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <ArticleJsonLd
        headline={`Proof of Income for ${data.label}`}
        description={`How ${data.label.toLowerCase()} can document income for rental applications and loans.`}
        slug={`/for/${niche}`}
        faq={faq}
      />

      <div className="mb-6">
        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-semibold">Guide</span>
        <h1 className="text-2xl font-black text-gray-800 mt-3 mb-2">
          <span className="mr-1">{data.icon}</span> Proof of Income for {data.label}
        </h1>
        <p className="text-sm text-gray-400">Updated July 2026 · 4 min read</p>
      </div>

      <div className="space-y-6 text-sm text-gray-600">
        <p className="leading-relaxed text-base">{data.intro}</p>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Where to Find Your Income Records</h2>
          <ul className="space-y-2 list-disc list-inside">
            {data.records.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why an Income Packet Helps</h2>
          <p className="leading-relaxed">{data.scenario}</p>
        </section>

        <ToolCTA
          to={`/income-verification-packet?occupation=${data.occupationPreset}`}
          title={`Build Your ${data.label} Income Packet`}
          desc={`Organize your ${data.platforms} income into a clean PDF packet — free, no sign-up, nothing leaves your browser.`}
          label="Build My Packet →"
        />

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {data.faq.map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <RelatedGuides items={[
          { to: '/how-to-prove-income', label: 'All Proof of Income Guides' },
          ...otherNiches.map((n) => ({ to: `/for/${n.slug}`, label: `Proof of Income for ${n.label}` })),
          { to: '/self-employment-tax-calculator', label: 'Self-Employment Tax Calculator (1099)' },
        ]} />

        <ArticleDisclaimer />
      </div>
    </div>
  )
}
