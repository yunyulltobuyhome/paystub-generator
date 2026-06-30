import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { GA_MEASUREMENT_ID } from '../config/analytics'

let initialized = false

// Loads GA4 once (when an ID is configured) and sends a page_view on every
// client-side route change — SPAs don't fire page views automatically.
export function useAnalytics() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID) return

    if (!initialized) {
      const s = document.createElement('script')
      s.async = true
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(s)
      window.dataLayer = window.dataLayer || []
      window.gtag = function () { window.dataLayer.push(arguments) }
      window.gtag('js', new Date())
      // We send page_view manually on route change, so disable the automatic one.
      window.gtag('config', GA_MEASUREMENT_ID, { send_page_view: false })
      initialized = true
    }

    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: pathname + search,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
  }, [pathname, search])
}
