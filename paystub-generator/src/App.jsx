import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, lazy, Suspense } from 'react'
import PayStubForm from './components/PayStubForm'
import PaycheckCalc from './components/PaycheckCalc'
import HourlyToSalaryCalc from './components/HourlyToSalaryCalc'
import SelfEmploymentTaxCalc from './components/SelfEmploymentTaxCalc'
import InvoiceGenerator from './components/InvoiceGenerator'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'
import About from './components/About'
import Contact from './components/Contact'
import Blog from './components/Blog'
import HowToReadPayStub from './components/blog/HowToReadPayStub'
import WhatIsFICA from './components/blog/WhatIsFICA'
import FederalVsStateTax from './components/blog/FederalVsStateTax'
import PayStubVsW2 from './components/blog/PayStubVsW2'
import HowToCalculateOvertime from './components/blog/HowToCalculateOvertime'
import WhatIsYtd from './components/blog/WhatIsYtd'
import PayStubsForApartment from './components/blog/PayStubsForApartment'
import GrossVsNetPay from './components/blog/GrossVsNetPay'
import PayStubAbbreviations from './components/blog/PayStubAbbreviations'
import MultiPayStub from './components/MultiPayStub'
import EmbedFrame from './components/EmbedFrame'
import EmploymentVerificationLetter from './components/EmploymentVerificationLetter'
import NotFound from './components/NotFound'
import CookieConsent, { openCookieSettings } from './components/CookieConsent'
import { useAnalytics } from './hooks/useAnalytics'
import OvertimeCalc from './components/OvertimeCalc'
import BonusTaxCalc from './components/BonusTaxCalc'
import StatesIndex from './components/StatesIndex'
import StatePayStub from './components/StatePayStub'
import IncomeProofGuideHub from './components/incomePacket/IncomeProofGuideHub'
import NicheLanding from './components/incomePacket/NicheLanding'
import WhatIsIncomeVerificationPacket from './components/incomePacket/guides/WhatIsIncomeVerificationPacket'
import ProofOfIncomeForFreelancers from './components/incomePacket/guides/ProofOfIncomeForFreelancers'
import ProofOfIncomeWithoutPayStubs from './components/incomePacket/guides/ProofOfIncomeWithoutPayStubs'
import ProfitAndLossForGigWorkers from './components/incomePacket/guides/ProfitAndLossForGigWorkers'

// Lazy-loaded: @react-pdf/renderer is large, so this route's JS only downloads
// when a visitor actually opens the Income Verification Packet Builder.
const IncomeVerificationPacketBuilder = lazy(() => import('./components/incomePacket/IncomeVerificationPacketBuilder'))

// Shared tool list — used by the desktop "Tools" dropdown and the mobile menu.
const TOOLS = [
  { path: '/', label: 'Pay Stub Generator' },
  { path: '/paycheck-calculator', label: 'Paycheck Calculator' },
  { path: '/hourly-to-salary-calculator', label: 'Hourly to Salary' },
  { path: '/overtime-calculator', label: 'Overtime Calculator' },
  { path: '/bonus-tax-calculator', label: 'Bonus Tax Calculator' },
  { path: '/self-employment-tax-calculator', label: 'Self-Employment Tax (1099)' },
  { path: '/multiple-paystubs', label: 'Multiple Pay Stubs' },
  { path: '/invoice-generator', label: 'Invoice Generator' },
  { path: '/employment-verification-letter', label: 'Employment Verification Letter' },
  { path: '/income-verification-packet', label: 'Income Verification Packet' },
]

function HomePage() {
  return (
    <>
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-black mb-3">Free Pay Stub Generator 2026</h1>
          <p className="text-blue-200 text-base mb-6">
            Create professional pay stubs in minutes. Auto-calculates federal & state taxes
            for all 50 states. No sign-up, no watermark, no fees.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {['✅ 2026 Tax Tables', '✅ All 50 States', '✅ No Sign-Up', '✅ Instant PDF', '✅ 4 Free Templates', '✅ Logo Upload'].map(t => (
              <span key={t} className="bg-blue-500/50 px-3 py-1 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <PayStubForm />

        <div className="mt-12 space-y-6 text-sm text-gray-600">
          {/* Free Tools cross-links */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">More Free Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { path: '/invoice-generator', icon: '📑', title: 'Invoice Generator', desc: 'Create & download invoices — free, no watermark' },
                { path: '/self-employment-tax-calculator', icon: '🧾', title: 'Self-Employment Tax Calculator', desc: '1099 & gig tax + quarterly payments' },
                { path: '/paycheck-calculator', icon: '💵', title: 'Paycheck Calculator', desc: 'Take-home pay after taxes — all 50 states' },
                { path: '/hourly-to-salary-calculator', icon: '🔄', title: 'Hourly to Salary Calculator', desc: 'Convert hourly wage to annual salary' },
                { path: '/overtime-calculator', icon: '⏱️', title: 'Overtime Pay Calculator', desc: 'Time-and-a-half & double-time pay' },
                { path: '/bonus-tax-calculator', icon: '🎁', title: 'Bonus Tax Calculator', desc: 'How much tax comes out of your bonus' },
                { path: '/multiple-paystubs', icon: '📄', title: 'Multiple Pay Stubs Generator', desc: 'Several stubs at once with YTD totals' },
                { path: '/employment-verification-letter', icon: '📝', title: 'Employment Verification Letter', desc: 'Proof-of-employment letter for rent or loans' },
                { path: '/income-verification-packet', icon: '📊', title: 'Income Verification Packet', desc: 'Organize gig & freelance income into a PDF packet' },
              ].map(({ path, icon, title, desc }) => (
                <Link key={path} to={path}
                  className="flex items-start gap-3 bg-gray-50 hover:bg-blue-50 rounded-xl p-3 transition-colors group">
                  <span className="text-2xl">{icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600">{title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">How to Generate a Free Pay Stub</h2>
            <ol className="space-y-2 list-decimal list-inside text-gray-600">
              {[
                'Enter your employer and employee information',
                'Add pay details — salary or hourly rate, pay frequency, and pay period dates',
                'Select your filing status and work state for accurate tax withholding',
                'Add any pre-tax deductions (health insurance, 401k, etc.)',
                'Preview your pay stub and print or save as PDF — completely free',
              ].map((step, i) => <li key={i}>{step}</li>)}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">Who Needs a Pay Stub?</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '👔', title: 'Employees', desc: 'Proof of income for loans, rentals, or mortgages' },
                { icon: '🏗️', title: 'Contractors & 1099', desc: 'Document income for tax filing and verification' },
                { icon: '💼', title: 'Small Business Owners', desc: 'Generate pay stubs for your team without payroll software' },
                { icon: '🚗', title: 'Gig Workers', desc: 'Track earnings from Uber, DoorDash, Upwork, and more' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-lg mb-1">{icon}</p>
                  <p className="font-semibold text-gray-800 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">2026 Payroll Tax Rates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 border border-gray-200 font-semibold">Tax</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Rate</th>
                    <th className="text-left p-2 border border-gray-200 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Federal Income Tax', '10% – 37%', 'Based on income & filing status'],
                    ['Social Security', '6.2%', 'On wages up to $184,500'],
                    ['Medicare', '1.45%', 'All wages (+ 0.9% over $200k)'],
                    ['State Income Tax', '0% – 13.3%', 'Varies by state (9 states = $0)'],
                  ].map(([tax, rate, note], i) => (
                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-2 border border-gray-200 font-medium">{tax}</td>
                      <td className="p-2 border border-gray-200 text-blue-600 font-semibold">{rate}</td>
                      <td className="p-2 border border-gray-200 text-gray-500">{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {[
                { q: 'Is this pay stub generator really free?', a: 'Yes — 100% free with no hidden fees, no watermark, and no sign-up required. Generate as many pay stubs as you need. Features that other sites charge for — multiple professional templates and company logo upload — are completely free here.' },
                { q: 'Can I choose a template and add my company logo?', a: 'Yes. Choose from 4 professional pay stub templates (Classic Blue, Modern Slate, Minimal B&W, and Corporate Green) and optionally upload your company logo. Your logo is processed entirely in your browser and never uploaded to a server.' },
                { q: 'Is it legal to generate your own pay stub?', a: 'Generating pay stubs for legitimate personal record-keeping is legal. However, using a pay stub to misrepresent your income to a lender, landlord, or government agency is fraud and is illegal. Always ensure all information entered is accurate and truthful.' },
                { q: 'How do I save the pay stub as a PDF?', a: 'Click "Print / Save PDF" after generating your stub. In the print dialog, select "Save as PDF" as the destination. This works on all modern browsers on desktop and mobile.' },
                { q: 'Will lenders or landlords accept this pay stub?', a: 'This tool generates pay stubs for personal record-keeping only. Whether a lender or landlord accepts it depends on their specific requirements. For official income verification, contact your employer or a licensed payroll provider.' },
              ].map((item, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                  <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">Pay Stub Guides by State</h2>
            <p className="text-xs text-gray-500 mb-3">
              See your state's income tax rate, a take-home pay example, and pay stub requirements.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { slug: 'california', name: 'California' },
                { slug: 'texas', name: 'Texas' },
                { slug: 'new-york', name: 'New York' },
                { slug: 'florida', name: 'Florida' },
                { slug: 'illinois', name: 'Illinois' },
                { slug: 'pennsylvania', name: 'Pennsylvania' },
              ].map(({ slug, name }) => (
                <Link key={slug} to={`/pay-stub/${slug}`}
                  className="text-xs bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                  {name}
                </Link>
              ))}
              <Link to="/states" className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1.5 font-semibold hover:bg-blue-700 transition-colors">
                All 50 states →
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">Payroll & Tax Guides</h2>
            <div className="space-y-2">
              {[
                { path: '/guides/how-to-read-your-pay-stub', title: 'How to Read Your Pay Stub' },
                { path: '/guides/what-is-ytd-on-a-paycheck', title: 'What is YTD on a Paycheck? Year-to-Date Explained' },
                { path: '/guides/how-many-pay-stubs-for-apartment', title: 'How Many Pay Stubs Do You Need to Rent an Apartment?' },
                { path: '/guides/gross-vs-net-pay', title: 'Gross Pay vs Net Pay: What\'s the Difference?' },
                { path: '/guides/pay-stub-abbreviations', title: 'Pay Stub Abbreviations Explained (Cheat Sheet)' },
                { path: '/guides/what-is-fica-tax', title: 'What is FICA Tax? Social Security & Medicare Explained' },
                { path: '/guides/federal-vs-state-income-tax', title: 'Federal vs State Income Tax: What\'s the Difference?' },
                { path: '/guides/pay-stub-vs-w2', title: 'Pay Stub vs W-2: What\'s the Difference?' },
                { path: '/guides/how-to-calculate-overtime', title: 'How to Calculate Overtime Pay (2026 FLSA Rules)' },
              ].map(({ path, title }) => (
                <Link key={path} to={path} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <span>→</span> {title}
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-3">Freelancer &amp; Gig Worker Guides</h2>
            <p className="text-xs text-gray-500 mb-3">
              Don't get a pay stub? Learn how to document your income and build a free
              income verification packet.
            </p>
            <div className="space-y-2 mb-3">
              {[
                { path: '/how-to-prove-income/what-is-an-income-verification-packet', title: 'What Is an Income Verification Packet?' },
                { path: '/how-to-prove-income/proof-of-income-for-freelancers', title: 'Proof of Income for Freelancers' },
                { path: '/how-to-prove-income/proof-of-income-without-pay-stubs', title: 'How to Show Proof of Income Without Pay Stubs' },
              ].map(({ path, title }) => (
                <Link key={path} to={path} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <span>→</span> {title}
                </Link>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { slug: 'uber-drivers', name: 'Rideshare' },
                { slug: 'doordash', name: 'Delivery' },
                { slug: 'upwork-freelancers', name: 'Freelancers' },
                { slug: 'etsy-sellers', name: 'Online Sellers' },
              ].map(({ slug, name }) => (
                <Link key={slug} to={`/for/${slug}`}
                  className="text-xs bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                  {name}
                </Link>
              ))}
              <Link to="/how-to-prove-income" className="text-xs bg-blue-600 text-white rounded-lg px-3 py-1.5 font-semibold hover:bg-blue-700 transition-colors">
                All guides →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

function SubPage({ backTo = '/', backLabel = '← Back', children }) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="px-4 py-4 print:hidden">
        <Link to={backTo} className="text-sm text-blue-600 hover:underline">{backLabel}</Link>
      </div>
      {children}
    </div>
  )
}

function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1">
            <span className="text-xl font-black text-blue-600">MyFree</span>
            <span className="text-xl font-black text-gray-700">PayStub</span>
            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">100% Free</span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-700 font-medium">
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-blue-600 transition-colors py-2">
                Tools
                <svg className="w-3 h-3 mt-0.5" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M3 4.5L6 7.5L9 4.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {/* pt-2 bridges the hover gap so the menu stays open */}
              <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-30">
                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-2 w-60">
                  {TOOLS.map(({ path, label }) => (
                    <Link key={path} to={path}
                      className="block px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <Link to="/states" className="hover:text-blue-600 transition-colors">States</Link>
            <Link to="/guides" className="hover:text-blue-600 transition-colors">Guides</Link>
            <Link to="/how-to-prove-income" className="hover:text-blue-600 transition-colors">Prove Income</Link>
            <Link to="/about" className="hover:text-blue-600 transition-colors">About</Link>
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden text-2xl text-gray-700"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {mobileMenuOpen && (
          <nav className="sm:hidden border-t border-gray-200">
            <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-3 pt-1 pb-1">Tools</p>
              {TOOLS.map(({ path, label }) => (
                <Link key={path} to={path} className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>{label}</Link>
              ))}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide px-3 pt-3 pb-1">Explore</p>
              <Link to="/states" className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>Pay Stubs by State</Link>
              <Link to="/guides" className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>Guides</Link>
              <Link to="/how-to-prove-income" className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>Prove Income</Link>
              <Link to="/about" className="text-sm text-gray-700 hover:text-blue-600 px-3 py-2 rounded" onClick={() => setMobileMenuOpen(false)}>About</Link>
            </div>
          </nav>
        )}
      </header>

      {children}

      <footer className="bg-white border-t border-gray-200 py-8 mt-8">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-800">
            <p className="font-bold mb-1">⚠️ Important Disclaimer</p>
            <p className="leading-relaxed">
              MyFreePayStub provides free tools for <strong>estimation and personal record-keeping purposes only</strong>.
              It is NOT a licensed payroll service, tax preparer, or financial advisor, and does not constitute
              official payroll documentation. All pay stubs, tax figures, and calculator results — including
              self-employment, paycheck, and quarterly tax estimates — are approximations based on 2026 IRS tables
              and simplified state rates, and <strong>do not constitute tax, legal, or financial advice</strong>.
              Actual amounts may vary; always verify with the IRS and a qualified CPA or tax professional.
              <strong> Intentionally falsifying income information is illegal and may constitute fraud under
              federal and state law.</strong> Users are solely responsible for the accuracy of all information entered.
            </p>
          </div>
          <div className="text-center text-xs text-gray-400 space-y-2">
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/invoice-generator" className="hover:text-blue-500 transition-colors">Invoice Generator</Link>
              <Link to="/self-employment-tax-calculator" className="hover:text-blue-500 transition-colors">Self-Employment Tax</Link>
              <Link to="/paycheck-calculator" className="hover:text-blue-500 transition-colors">Paycheck Calculator</Link>
              <Link to="/hourly-to-salary-calculator" className="hover:text-blue-500 transition-colors">Hourly to Salary</Link>
              <Link to="/overtime-calculator" className="hover:text-blue-500 transition-colors">Overtime Calculator</Link>
              <Link to="/bonus-tax-calculator" className="hover:text-blue-500 transition-colors">Bonus Tax Calculator</Link>
              <Link to="/multiple-paystubs" className="hover:text-blue-500 transition-colors">Multiple Pay Stubs</Link>
              <Link to="/employment-verification-letter" className="hover:text-blue-500 transition-colors">Verification Letter</Link>
              <Link to="/income-verification-packet" className="hover:text-blue-500 transition-colors">Income Packet Builder</Link>
              <Link to="/states" className="hover:text-blue-500 transition-colors">Pay Stubs by State</Link>
              <Link to="/how-to-prove-income" className="hover:text-blue-500 transition-colors">Prove Income</Link>
              <Link to="/about" className="hover:text-blue-500 transition-colors">About</Link>
              <Link to="/guides" className="hover:text-blue-500 transition-colors">Guides</Link>
              <Link to="/contact" className="hover:text-blue-500 transition-colors">Contact</Link>
              <Link to="/privacy" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
              <button onClick={openCookieSettings} className="hover:text-blue-500 transition-colors">Cookie settings</button>
            </div>
            <p>© 2026 MyFreePayStub — Free Pay Stub Generator</p>
            <p>For informational and record-keeping purposes only. Not a licensed payroll service.</p>
          </div>
        </div>
      </footer>

      <CookieConsent />

      <style>{`
        @media print {
          header, footer, button { display: none !important; }
          body { background: white !important; }
          #paystub-preview, #invoice-preview { border: 1px solid #ccc !important; }
          #letter-preview { border: 0 !important; }
        }
      `}</style>
    </div>
  )
}

function MainApp() {
  return (
    <Layout>
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/paycheck-calculator" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><PaycheckCalc /></SubPage>} />
          <Route path="/hourly-to-salary-calculator" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><HourlyToSalaryCalc /></SubPage>} />
          <Route path="/self-employment-tax-calculator" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><SelfEmploymentTaxCalc /></SubPage>} />
          <Route path="/1099-tax-calculator" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><SelfEmploymentTaxCalc /></SubPage>} />
          <Route path="/invoice-generator" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><InvoiceGenerator /></SubPage>} />
          <Route path="/employment-verification-letter" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><EmploymentVerificationLetter /></SubPage>} />
          <Route path="/income-verification-packet" element={
            <SubPage backTo="/" backLabel="← Back to Pay Stub Generator">
              <Suspense fallback={<div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-400 text-sm">Loading…</div>}>
                <IncomeVerificationPacketBuilder />
              </Suspense>
            </SubPage>
          } />
          <Route path="/how-to-prove-income" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><IncomeProofGuideHub /></SubPage>} />
          <Route path="/how-to-prove-income/what-is-an-income-verification-packet" element={<SubPage backTo="/how-to-prove-income" backLabel="← Back to Guides"><WhatIsIncomeVerificationPacket /></SubPage>} />
          <Route path="/how-to-prove-income/proof-of-income-for-freelancers" element={<SubPage backTo="/how-to-prove-income" backLabel="← Back to Guides"><ProofOfIncomeForFreelancers /></SubPage>} />
          <Route path="/how-to-prove-income/proof-of-income-without-pay-stubs" element={<SubPage backTo="/how-to-prove-income" backLabel="← Back to Guides"><ProofOfIncomeWithoutPayStubs /></SubPage>} />
          <Route path="/how-to-prove-income/profit-and-loss-statement-for-gig-workers" element={<SubPage backTo="/how-to-prove-income" backLabel="← Back to Guides"><ProfitAndLossForGigWorkers /></SubPage>} />
          <Route path="/for/:niche" element={<SubPage backTo="/how-to-prove-income" backLabel="← Back to Guides"><NicheLanding /></SubPage>} />
          <Route path="/overtime-calculator" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><OvertimeCalc /></SubPage>} />
          <Route path="/bonus-tax-calculator" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><BonusTaxCalc /></SubPage>} />
          <Route path="/states" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><StatesIndex /></SubPage>} />
          <Route path="/pay-stub/:stateSlug" element={<SubPage backTo="/states" backLabel="← Back to All States"><StatePayStub /></SubPage>} />
          <Route path="/about" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><About /></SubPage>} />
          <Route path="/contact" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><Contact /></SubPage>} />
          <Route path="/guides" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><Blog /></SubPage>} />
          <Route path="/guides/how-to-read-your-pay-stub" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><HowToReadPayStub /></SubPage>} />
          <Route path="/guides/what-is-fica-tax" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><WhatIsFICA /></SubPage>} />
          <Route path="/guides/federal-vs-state-income-tax" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><FederalVsStateTax /></SubPage>} />
          <Route path="/guides/pay-stub-vs-w2" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><PayStubVsW2 /></SubPage>} />
          <Route path="/guides/how-to-calculate-overtime" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><HowToCalculateOvertime /></SubPage>} />
          <Route path="/guides/what-is-ytd-on-a-paycheck" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><WhatIsYtd /></SubPage>} />
          <Route path="/guides/how-many-pay-stubs-for-apartment" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><PayStubsForApartment /></SubPage>} />
          <Route path="/guides/gross-vs-net-pay" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><GrossVsNetPay /></SubPage>} />
          <Route path="/guides/pay-stub-abbreviations" element={<SubPage backTo="/guides" backLabel="← Back to Guides"><PayStubAbbreviations /></SubPage>} />
          <Route path="/privacy" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><PrivacyPolicy /></SubPage>} />
          <Route path="/terms" element={<SubPage backTo="/" backLabel="← Back to Pay Stub Generator"><TermsOfService /></SubPage>} />
          <Route path="/multiple-paystubs" element={<MultiPayStub />} />
          <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

function Shell() {
  const { pathname } = useLocation()
  useAnalytics()
  // Embed pages render chrome-free (no header/footer) for use inside an iframe.
  if (pathname.startsWith('/embed/')) {
    return (
      <Routes>
        <Route path="/embed/:tool" element={<EmbedFrame />} />
      </Routes>
    )
  }
  return <MainApp />
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
