import { usePageMeta } from '../hooks/usePageMeta'

export default function About() {
  usePageMeta({
    title: 'About MyFreePayStub — Free Pay Stub & Tax Tools',
    description: 'MyFreePayStub offers free pay stub, invoice, and tax tools for US employees, freelancers, contractors, and small businesses — no sign-up, no watermark. Learn who we are and how the site is funded.',
    canonicalPath: '/about',
  })
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 mb-2">About MyFreePayStub</h1>
      <p className="text-sm text-gray-400 mb-8">Free pay stub generator for US employees, contractors & small businesses</p>

      <div className="space-y-8 text-sm text-gray-600">
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-blue-800 mb-3">What is MyFreePayStub?</h2>
          <p className="leading-relaxed text-blue-700">
            MyFreePayStub is a free online pay stub generator built for US employees, freelancers,
            contractors, and small business owners. We provide accurate pay stub estimates using
            official 2026 IRS tax tables and state tax rates for all 50 states — completely free,
            with no sign-up, no watermark, and no hidden fees.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Why We Built This</h2>
          <p className="leading-relaxed">
            Most pay stub generators online charge $5–$10 per stub or require a subscription.
            For freelancers, gig workers, and small business owners who just need a simple record
            of their earnings, that's unnecessary. MyFreePayStub was built to provide a genuinely
            free, accurate, and easy-to-use alternative — with no strings attached.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Our Data Sources</h2>
          <p className="leading-relaxed mb-3">
            All tax rates and calculations are based on official US government publications,
            updated for the 2026 tax year.
          </p>
          <div className="space-y-2">
            {[
              { name: 'IRS Publication 15-T — Federal Income Tax Withholding', url: 'https://www.irs.gov/publications/p15t' },
              { name: 'IRS — Social Security & Medicare Tax Rates 2026', url: 'https://www.irs.gov/taxtopics/tc751' },
              { name: 'IRS — FICA Wage Base 2026 ($184,500)', url: 'https://www.irs.gov/businesses/small-businesses-self-employed/payroll-taxes' },
              { name: 'State Revenue Departments — 50-State Tax Rates', url: 'https://www.taxfoundation.org/data/all/state/state-income-tax-rates/' },
            ].map((s) => (
              <div key={s.name} className="bg-gray-50 rounded-lg p-3">
                <a href={s.url} target="_blank" rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-xs">↗ {s.name}</a>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">What We Do and Don't Do</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-bold text-green-700 mb-2 text-xs">✅ We DO</p>
              <ul className="space-y-1 text-xs text-green-700">
                <li>Calculate estimated federal & state taxes</li>
                <li>Generate professional pay stub documents</li>
                <li>Support salary & hourly workers</li>
                <li>Cover all 50 US states + DC</li>
                <li>Update for 2026 IRS tax tables</li>
              </ul>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="font-bold text-red-700 mb-2 text-xs">❌ We DON'T</p>
              <ul className="space-y-1 text-xs text-red-700">
                <li>File payroll taxes with the IRS</li>
                <li>Issue official W-2 or 1099 forms</li>
                <li>Store any of your personal data</li>
                <li>Provide licensed payroll services</li>
                <li>Guarantee legal compliance</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">How It's Free</h2>
          <p className="leading-relaxed">
            MyFreePayStub is supported by Google AdSense advertising — small, non-intrusive ads
            that appear on our pages. This allows us to keep the tool completely free for everyone.
            All calculations happen in your browser — we never see your data.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Important Disclaimer</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            <p className="font-bold mb-2">⚠️ For informational purposes only</p>
            <p className="leading-relaxed">
              MyFreePayStub is not a licensed payroll provider, tax adviser, or financial services company.
              Pay stubs generated by this tool are estimates for personal record-keeping only and do not
              constitute official payroll documents. Tax calculations may not reflect your exact withholding
              due to individual circumstances, local taxes, or other factors. Always consult a licensed
              payroll provider or CPA for official payroll processing and tax compliance.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">Contact</h2>
          <p className="leading-relaxed">
            Questions, feedback, or found an error in our tax rates?{' '}
            <a href="mailto:hello@myfreepaystub.com" className="text-blue-500 hover:underline">
              hello@myfreepaystub.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}