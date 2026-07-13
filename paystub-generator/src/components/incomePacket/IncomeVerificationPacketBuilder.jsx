import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import IPBProgressBar from './IPBProgressBar'
import StepAboutYou from './StepAboutYou'
import StepIncome from './StepIncome'
import StepExpenses from './StepExpenses'
import StepPreview from './StepPreview'
import { NO_PERSISTENCE_NOTICE } from '../../config/incomePacket'
import { OCCUPATIONS } from '../../data/incomePacketPresets'

function buildInitialData(presetOccupation) {
  const isValidPreset = OCCUPATIONS.some(o => o.value === presetOccupation)
  return {
    aboutYou: { name: '', occupation: isValidPreset ? presetOccupation : '', occupationOther: '', businessType: 'sole-prop', period: 3 },
    income: { monthly: [], sources: [] },
    expenses: { skipped: false, categories: {} },
  }
}

// All wizard data lives in this component's state only — never persisted to
// localStorage or a server (see src/config/incomePacket.js NO_PERSISTENCE_NOTICE).
export default function IncomeVerificationPacketBuilder() {
  usePageMeta({
    title: 'Income Verification Packet Builder — Organize Proof of Income (2026) | MyFreePayStub',
    description: 'Turn your self-reported income into a clean, professional income verification packet — built for freelancers, rideshare and delivery drivers, and gig workers. Free, no sign-up, nothing leaves your browser.',
    canonicalPath: '/income-verification-packet',
  })

  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [data, setData] = useState(() => buildInitialData(searchParams.get('occupation')))

  const goNext = () => setStep(s => Math.min(s + 1, 4))
  const goBack = () => setStep(s => Math.max(s - 1, 1))
  const startOver = () => { setData(buildInitialData(null)); setStep(1) }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Income Verification Packet Builder",
        "url": "https://myfreepaystub.com/income-verification-packet",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free tool that organizes self-reported income into a professional income verification packet PDF for freelancers and gig workers."
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What is an income verification packet?", "acceptedAnswer": { "@type": "Answer", "text": "It's a document that organizes your self-reported income — monthly totals, a profit and loss summary, and your income sources — into a single readable PDF, commonly used for rental applications, loans, or other income requests." } },
          { "@type": "Question", "name": "Is this an official or certified document?", "acceptedAnswer": { "@type": "Answer", "text": "No. This tool organizes the numbers you provide into a readable format. It is not issued or verified by any government agency, employer, or financial institution, and does not guarantee acceptance by any landlord or lender." } },
          { "@type": "Question", "name": "Is my income data saved anywhere?", "acceptedAnswer": { "@type": "Answer", "text": "No. Everything is processed in your browser and is never transmitted to or stored on a server. Your data is not saved to local storage either — closing or refreshing the page clears it." } }
        ]
      })}} />

      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-800 mb-1">Income Verification Packet Builder</h1>
        <p className="text-sm text-gray-500">
          Organize your self-reported income into a clean, professional PDF packet — built for
          freelancers, rideshare and delivery drivers, and gig workers.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6 text-xs text-blue-800 flex items-start gap-2">
        <span>⚠️</span>
        <span>{NO_PERSISTENCE_NOTICE}</span>
      </div>

      <IPBProgressBar current={step} />

      {step === 1 && (
        <StepAboutYou
          value={data.aboutYou}
          onChange={(aboutYou) => setData(d => ({ ...d, aboutYou }))}
          onNext={goNext}
        />
      )}

      {step === 2 && (
        <StepIncome
          value={data.income}
          period={data.aboutYou.period}
          onChange={(income) => setData(d => ({ ...d, income }))}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 3 && (
        <StepExpenses
          value={data.expenses}
          onChange={(expenses) => setData(d => ({ ...d, expenses }))}
          onNext={goNext}
          onBack={goBack}
        />
      )}

      {step === 4 && (
        <StepPreview data={data} onBack={goBack} onStartOver={startOver} />
      )}

      <div className="mt-10 space-y-6 text-sm text-gray-600">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What's in the Packet?</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Cover summary — your income snapshot and what's included</li>
            <li>Income summary — monthly totals over your chosen period</li>
            <li>Profit &amp; loss statement — income and expenses by category (if you add expenses)</li>
            <li>Income source list — the clients or platforms you were paid by</li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Who It's For</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🚗', title: 'Rideshare & Delivery', desc: 'Uber, Lyft, DoorDash, Instacart' },
              { icon: '💻', title: 'Freelancers', desc: 'Upwork, Fiverr, contract work' },
              { icon: '🛍️', title: 'Online Sellers', desc: 'Etsy, eBay, and similar platforms' },
              { icon: '📋', title: 'Consultants', desc: 'Anyone paid outside a W-2' },
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
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'What is an income verification packet?', a: 'A document that organizes your self-reported income — monthly totals, a profit and loss summary, and your income sources — into a single readable PDF, commonly used for rental applications, loans, or other income requests.' },
              { q: 'Is this an official or certified document?', a: 'No. This tool organizes the numbers you provide into a readable format. It is not issued or verified by any government agency, employer, or financial institution, and does not guarantee acceptance by any landlord or lender.' },
              { q: 'Is my income data saved anywhere?', a: 'No. Everything is processed in your browser and is never transmitted to or stored on a server. Your data is not saved to local storage either — closing or refreshing the page clears it.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          ⚠️ This tool helps you organize self-reported income information into a readable document.
          It is not legal, tax, or financial advice, and does not guarantee acceptance by any
          landlord, lender, or third party. Entering false or misleading income information is
          prohibited and may constitute fraud. You are solely responsible for the accuracy of
          everything you enter.
        </div>
      </div>
    </div>
  )
}
