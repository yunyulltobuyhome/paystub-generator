import { useEffect } from 'react'

const SITE = 'https://myfreepaystub.com'

// Upsert a <meta> tag by attribute (name= or property=).
function setMeta(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

export function usePageMeta({ title, description, canonicalPath, robots }) {
  useEffect(() => {
    if (title) document.title = title
    if (description) setMeta('name', 'description', description)

    // Per-page robots directive. Used to keep near-duplicate programmatic
    // pages out of the index (see src/config/indexing.js) — they stay fully
    // usable for visitors and internal navigation, they are just not offered
    // to search engines as separate documents.
    setMeta('name', 'robots', robots || 'index, follow')

    // canonical — use an explicit canonicalPath when provided (e.g. for alias routes)
    const path = canonicalPath || window.location.pathname
    const url = `${SITE}${path}`
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // Per-page Open Graph + Twitter tags (otherwise every share shows the home title)
    if (title) {
      setMeta('property', 'og:title', title)
      setMeta('name', 'twitter:title', title)
    }
    if (description) {
      setMeta('property', 'og:description', description)
      setMeta('name', 'twitter:description', description)
    }
    setMeta('property', 'og:url', url)

    return () => {
      // 홈으로 돌아갈 때 기본값 복원
      document.title = 'Free Pay Stub Generator 2026 — No Sign-Up, Instant PDF | MyFreePayStub'
      setMeta('name', 'robots', 'index, follow')
    }
  }, [title, description, canonicalPath, robots])
}
