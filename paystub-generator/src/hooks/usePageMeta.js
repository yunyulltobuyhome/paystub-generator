import { useEffect } from 'react'

export function usePageMeta({ title, description }) {
  useEffect(() => {
    if (title) document.title = title

    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }

    // canonical
    const path = window.location.pathname
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `https://myfreepaystub.com${path}`)

    return () => {
      // 홈으로 돌아갈 때 기본값 복원
      document.title = 'Free Pay Stub Generator 2026 — No Sign-Up, Instant PDF | MyFreePayStub'
    }
  }, [title, description])
}