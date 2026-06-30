import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page Not Found (404) — MyFreePayStub'
    let tag = document.querySelector('meta[name="robots"]')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'robots')
      document.head.appendChild(tag)
    }
    const prev = tag.getAttribute('content')
    tag.setAttribute('content', 'noindex, follow')
    return () => { if (prev) tag.setAttribute('content', prev); else tag.setAttribute('content', 'index, follow') }
  }, [])

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-5xl font-black text-blue-600 mb-2">404</p>
      <h1 className="text-2xl font-black text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-sm text-gray-500 mb-8">
        The page you're looking for doesn't exist or may have moved. Try one of our free tools instead:
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { to: '/', label: 'Pay Stub Generator' },
          { to: '/paycheck-calculator', label: 'Paycheck Calculator' },
          { to: '/self-employment-tax-calculator', label: 'Self-Employment Tax' },
          { to: '/states', label: 'Pay Stubs by State' },
          { to: '/guides', label: 'Guides' },
        ].map(({ to, label }) => (
          <Link key={to} to={to}
            className="text-sm bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 rounded-lg px-4 py-2 transition-colors">
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}
