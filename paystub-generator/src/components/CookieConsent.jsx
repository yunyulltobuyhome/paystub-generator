import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const STORAGE_KEY = 'cookie-consent'

// Other components (e.g. the footer "Cookie settings" link) can reopen the banner
// by dispatching this event.
export const openCookieSettings = () => window.dispatchEvent(new Event('open-cookie-settings'))

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show on first visit only (no stored choice yet)
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true)
    } catch {
      setVisible(true)
    }
    const reopen = () => setVisible(true)
    window.addEventListener('open-cookie-settings', reopen)
    return () => window.removeEventListener('open-cookie-settings', reopen)
  }, [])

  const choose = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, value)
      localStorage.setItem(STORAGE_KEY + '-at', new Date().toISOString())
    } catch { /* ignore storage errors */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    // Non-blocking bottom bar — does not overlay or hide page content from users or crawlers.
    <div className="fixed bottom-0 inset-x-0 z-50 print:hidden">
      <div className="max-w-3xl mx-auto m-3 bg-white border border-gray-200 shadow-lg rounded-2xl p-4 sm:flex sm:items-center sm:gap-4">
        <p className="text-xs text-gray-600 leading-relaxed flex-1">
          We use cookies for advertising (Google AdSense) and basic analytics. Anything you type into
          our tools stays in your browser. See our{' '}
          <Link to="/privacy" className="text-blue-600 underline font-semibold">Privacy Policy</Link>.
        </p>
        <div className="flex gap-2 mt-3 sm:mt-0 shrink-0">
          <button onClick={() => choose('rejected')}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Reject
          </button>
          <button onClick={() => choose('accepted')}
            className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
