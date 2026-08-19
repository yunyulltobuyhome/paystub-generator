import { Link } from 'react-router-dom'
import { guideMeta, formatDate } from '../../data/guideMeta'

const SITE = 'https://myfreepaystub.com'

// Injects Article + (optional) FAQPage structured data so Google can index
// the guide as rich content. Call once near the top of each article.
export function ArticleJsonLd({ headline, description, slug, datePublished, dateModified, faq }) {
  // Dates come from the shared guide register unless a caller overrides them,
  // so the structured data always matches the byline rendered on the page.
  const meta = guideMeta(slug)
  const published = datePublished || meta.published
  const modified = dateModified || meta.modified
  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished: published,
    dateModified: modified,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE}${slug}` },
    author: { '@type': 'Organization', name: 'MyFreePayStub', url: SITE },
    publisher: {
      '@type': 'Organization',
      name: 'MyFreePayStub',
      url: SITE,
      logo: { '@type': 'ImageObject', url: `${SITE}/favicon.svg` },
    },
  }
  // Breadcrumb trail (Home > section > page) — surfaces breadcrumbs in search results.
  const crumbs = [{ name: 'Home', url: `${SITE}/` }]
  if (slug.startsWith('/guides/')) crumbs.push({ name: 'Guides', url: `${SITE}/guides` })
  else if (slug.startsWith('/pay-stub/')) crumbs.push({ name: 'States', url: `${SITE}/states` })
  else if (slug.startsWith('/how-to-prove-income/')) crumbs.push({ name: 'How to Prove Income', url: `${SITE}/how-to-prove-income` })
  else if (slug.startsWith('/for/')) crumbs.push({ name: 'How to Prove Income', url: `${SITE}/how-to-prove-income` })
  crumbs.push({ name: headline, url: `${SITE}${slug}` })
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.name, item: c.url,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
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
// Visible attribution and dates. Search quality guidance expects a reader to be
// able to see who published a page and when it was last revised — not only a
// crawler parsing JSON-LD. The organisation is named rather than inventing a
// person, which matches what /editorial-standards says about who we are.
export function ArticleByline({ slug }) {
  const meta = guideMeta(slug)
  const revised = meta.modified !== meta.published
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 border-y border-gray-200/80 py-2.5 my-5">
      <Link to="/editorial-standards" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors">
        MyFreePayStub Editorial Team
      </Link>
      <span className="text-gray-300">·</span>
      <span>{revised ? 'Updated' : 'Published'} <time dateTime={meta.modified}>{formatDate(meta.modified)}</time></span>
      {revised && (
        <>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400">First published <time dateTime={meta.published}>{formatDate(meta.published)}</time></span>
        </>
      )}
      <span className="text-gray-300">·</span>
      <span>{meta.readTime} min read</span>
    </div>
  )
}

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
