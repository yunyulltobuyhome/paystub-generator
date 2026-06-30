import { Link } from 'react-router-dom'

const SITE = 'https://myfreepaystub.com'

// Injects Article + (optional) FAQPage structured data so Google can index
// the guide as rich content. Call once near the top of each article.
export function ArticleJsonLd({ headline, description, slug, datePublished = '2026-06-30', dateModified = '2026-06-30', faq }) {
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${slug}` },
    author: { '@type': 'Organization', name: 'MyFreePayStub', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'MyFreePayStub',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` },
    },
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      {faq && faq.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map(f => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }) }} />
      )}
    </>
  )
}

// Funnel CTA — converts a reader into a tool user (the core revenue lever).
export function ToolCTA({ to = '/', title, desc, label = 'Try the Free Tool →' }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-6">
      <p className="font-bold text-blue-800 mb-1">{title}</p>
      <p className="text-blue-700 text-xs mb-3">{desc}</p>
      <Link to={to} className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        {label}
      </Link>
    </div>
  )
}

// Internal links to related guides/tools — boosts pages-per-session and crawl depth.
export function RelatedGuides({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mt-6">
      <p className="text-sm font-bold text-gray-800 mb-3">Related Guides & Tools</p>
      <div className="space-y-2">
        {items.map(({ to, label }) => (
          <Link key={to} to={to} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
            <span>→</span> {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export function ArticleDisclaimer() {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 mt-6">
      ⚠️ This guide is for informational purposes only and does not constitute tax, legal, or financial
      advice. Tax rules are complex and vary by individual situation. Always consult a qualified tax
      professional or CPA for personalised guidance.
    </div>
  )
}
