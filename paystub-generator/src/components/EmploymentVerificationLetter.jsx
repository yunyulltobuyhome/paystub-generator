import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'

export default function EmploymentVerificationLetter() {
  usePageMeta({
    title: 'Free Employment Verification Letter Generator (2026) | MyFreePayStub',
    description: 'Create a professional employment verification letter template for free — for rental, loan, or general verification. Fill in the details, preview, and download as PDF. No sign-up.',
    canonicalPath: '/employment-verification-letter',
  })

  const [company, setCompany] = useState({ name: '', address: '', phone: '', email: '' })
  const [employee, setEmployee] = useState({ name: '', title: '', type: 'Full-time', status: 'currently', start: '', end: '' })
  const [comp, setComp] = useState({ include: false, payType: 'salary', amount: '' })
  const [letterDate, setLetterDate] = useState('')
  const [recipient, setRecipient] = useState({ org: '', addressee: 'To Whom It May Concern' })
  const [purpose, setPurpose] = useState('general verification')
  const [signer, setSigner] = useState({ name: '', title: '' })

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1"

  const fmtMoney = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const isFormer = employee.status === 'formerly'

  const compLine = comp.include && parseFloat(comp.amount) > 0
    ? (comp.payType === 'salary'
        ? `Their current annual salary is ${fmtMoney(comp.amount)}.`
        : `Their current pay rate is ${fmtMoney(comp.amount)} per hour.`)
    : ''

  const hasContent = company.name || employee.name

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Free Employment Verification Letter Generator",
        "url": "https://myfreepaystub.com/employment-verification-letter",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free tool to create an employment verification letter template for rental, loan, or general verification purposes."
      })}} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          { "@type": "Question", "name": "What is an employment verification letter?", "acceptedAnswer": { "@type": "Answer", "text": "An employment verification letter is a document from an employer confirming a person's employment status, job title, and sometimes salary. It is commonly requested for rental applications, loans, and background checks." } },
          { "@type": "Question", "name": "Who should sign an employment verification letter?", "acceptedAnswer": { "@type": "Answer", "text": "It must be completed and signed by an authorized representative of the actual employer, such as HR, a manager, or a company officer. A self-issued letter that misrepresents employment is fraud." } },
          { "@type": "Question", "name": "Is this employment verification letter official?", "acceptedAnswer": { "@type": "Answer", "text": "No. This tool produces a template only. To be valid it must be reviewed, completed, and signed by an authorized representative of the employer on the employer's behalf." } }
        ]
      })}} />

      <div className="mb-6 print:hidden">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-1">Employment Verification Letter Generator</h1>
        <p className="text-sm text-gray-500">
          Create a professional employment verification letter template for rental, loan, or general
          verification. Free, no sign-up, no watermark.
        </p>
      </div>

      {/* Prominent legal notice — this is the key safeguard */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-xs text-red-800 leading-relaxed print:hidden">
        <p className="font-bold mb-1">⚠️ Read before using</p>
        This tool creates a <strong>template only</strong>. A valid employment verification letter must be
        completed and <strong>signed by an authorized representative of the actual employer</strong> (e.g. HR
        or a manager). <strong>Do not use this to misrepresent employment, income, or job title.</strong>{' '}
        Providing false employment information to a lender, landlord, or government agency is fraud and is
        illegal. You are solely responsible for the accuracy and truthfulness of everything you enter.
      </div>

      {/* Editor */}
      <div className="space-y-4 print:hidden">
        <div className="bg-white rounded-xl border border-gray-200/80 p-5">
          <p className="text-sm font-bold text-gray-700 mb-3">Employer (Issuing Company)</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Company Name</label><input value={company.name} onChange={e => setCompany({ ...company, name: e.target.value })} className={inputClass} placeholder="Acme Corporation" /></div>
            <div><label className={labelClass}>Company Address</label><input value={company.address} onChange={e => setCompany({ ...company, address: e.target.value })} className={inputClass} placeholder="123 Main St, City, ST" /></div>
            <div><label className={labelClass}>Phone</label><input value={company.phone} onChange={e => setCompany({ ...company, phone: e.target.value })} className={inputClass} placeholder="(555) 123-4567" /></div>
            <div><label className={labelClass}>Email</label><input value={company.email} onChange={e => setCompany({ ...company, email: e.target.value })} className={inputClass} placeholder="hr@acme.com" /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-5">
          <p className="text-sm font-bold text-gray-700 mb-3">Employee</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Employee Name</label><input value={employee.name} onChange={e => setEmployee({ ...employee, name: e.target.value })} className={inputClass} placeholder="John Smith" /></div>
            <div><label className={labelClass}>Job Title</label><input value={employee.title} onChange={e => setEmployee({ ...employee, title: e.target.value })} className={inputClass} placeholder="Software Engineer" /></div>
            <div>
              <label className={labelClass}>Employment Type</label>
              <select value={employee.type} onChange={e => setEmployee({ ...employee, type: e.target.value })} className={inputClass}>
                {['Full-time', 'Part-time', 'Contract', 'Temporary'].map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select value={employee.status} onChange={e => setEmployee({ ...employee, status: e.target.value })} className={inputClass}>
                <option value="currently">Currently employed</option>
                <option value="formerly">Formerly employed</option>
              </select>
            </div>
            <div><label className={labelClass}>Start Date</label><input type="date" value={employee.start} onChange={e => setEmployee({ ...employee, start: e.target.value })} className={inputClass} /></div>
            {isFormer && <div><label className={labelClass}>End Date</label><input type="date" value={employee.end} onChange={e => setEmployee({ ...employee, end: e.target.value })} className={inputClass} /></div>}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <input id="incl" type="checkbox" checked={comp.include} onChange={e => setComp({ ...comp, include: e.target.checked })} />
            <label htmlFor="incl" className="text-sm text-gray-600">Include compensation</label>
          </div>
          {comp.include && (
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <label className={labelClass}>Pay Type</label>
                <select value={comp.payType} onChange={e => setComp({ ...comp, payType: e.target.value })} className={inputClass}>
                  <option value="salary">Annual salary</option>
                  <option value="hourly">Hourly rate</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" value={comp.amount} onChange={e => setComp({ ...comp, amount: e.target.value })} className={`${inputClass} pl-7`} placeholder={comp.payType === 'salary' ? '75,000' : '25.00'} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-5">
          <p className="text-sm font-bold text-gray-700 mb-3">Letter Details</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div><label className={labelClass}>Letter Date</label><input type="date" value={letterDate} onChange={e => setLetterDate(e.target.value)} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Purpose</label>
              <select value={purpose} onChange={e => setPurpose(e.target.value)} className={inputClass}>
                {['general verification', 'a rental application', 'a loan or mortgage application', 'immigration purposes', 'a background check'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div><label className={labelClass}>Addressed To</label><input value={recipient.addressee} onChange={e => setRecipient({ ...recipient, addressee: e.target.value })} className={inputClass} placeholder="To Whom It May Concern" /></div>
            <div><label className={labelClass}>Recipient Org <span className="text-gray-400 font-normal">(optional)</span></label><input value={recipient.org} onChange={e => setRecipient({ ...recipient, org: e.target.value })} className={inputClass} placeholder="ABC Property Management" /></div>
            <div><label className={labelClass}>Signer Name</label><input value={signer.name} onChange={e => setSigner({ ...signer, name: e.target.value })} className={inputClass} placeholder="Jane Doe" /></div>
            <div><label className={labelClass}>Signer Title</label><input value={signer.title} onChange={e => setSigner({ ...signer, title: e.target.value })} className={inputClass} placeholder="HR Manager" /></div>
          </div>
        </div>

        <button onClick={() => window.print()}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors">
          🖨️ Print / Save PDF
        </button>
      </div>

      {/* Live preview / printable letter */}
      {hasContent && (
        <div id="letter-preview" className="mt-8 bg-white border-2 border-gray-300 rounded-2xl p-8 sm:p-10 print:border-0 print:p-0 print:mt-0 text-sm text-gray-800 leading-relaxed">
          <div className="mb-6">
            <p className="font-extrabold text-lg">{company.name || 'Company Name'}</p>
            {company.address && <p className="text-gray-600">{company.address}</p>}
            {(company.phone || company.email) && (
              <p className="text-gray-600">{[company.phone, company.email].filter(Boolean).join(' · ')}</p>
            )}
          </div>

          {letterDate && <p className="mb-4">{letterDate}</p>}

          {recipient.org && <p className="mb-1 font-semibold">{recipient.org}</p>}
          <p className="mb-4">{recipient.addressee || 'To Whom It May Concern'},</p>

          <p className="font-bold mb-3">RE: Employment Verification for {employee.name || 'Employee Name'}</p>

          <p className="mb-3">
            This letter confirms that {employee.name || '[Employee Name]'} {isFormer ? 'was employed' : 'is currently employed'} at{' '}
            {company.name || '[Company Name]'} as a {employee.title || '[Job Title]'} on a {employee.type.toLowerCase()} basis
            {employee.start ? `, beginning ${employee.start}` : ''}{isFormer && employee.end ? ` and ending ${employee.end}` : ''}.
          </p>

          {compLine && <p className="mb-3">{compLine}</p>}

          <p className="mb-3">
            This letter is provided at the employee's request for {purpose} purposes.
            Should you require any additional information, please contact us
            {company.phone ? ` at ${company.phone}` : ''}{company.email ? `${company.phone ? ' or ' : ' at '}${company.email}` : ''}.
          </p>

          <p className="mb-8">Sincerely,</p>

          <div>
            <div className="w-56 border-b border-gray-400 mb-1" />
            <p className="font-semibold">{signer.name || 'Authorized Signer'}</p>
            <p className="text-gray-600">{signer.title || 'Title'}</p>
            <p className="text-gray-600">{company.name || 'Company Name'}</p>
          </div>

          <p className="mt-8 pt-4 border-t border-gray-200 text-[10px] text-gray-400">
            This letter is only valid when completed and signed by an authorized representative of the
            employer named above. Generated with MyFreePayStub.com.
          </p>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-10 space-y-6 text-sm text-gray-600 print:hidden">
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What Is an Employment Verification Letter?</h2>
          <p className="leading-relaxed">
            An employment verification letter (also called a proof-of-employment letter) is a document in
            which an employer confirms an individual's employment status, job title, dates of employment,
            and sometimes salary. It's most often requested by <strong>landlords, lenders, and
            background-check services</strong> to confirm that an applicant has stable income.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What to Include</h2>
          <ul className="space-y-2 list-disc list-inside">
            <li>Employer name, address, and contact details</li>
            <li>Employee's full name and job title</li>
            <li>Employment status (current or former) and type (full-time, part-time, etc.)</li>
            <li>Start date (and end date, if former)</li>
            <li>Salary or pay rate — only if the employee authorizes disclosing it</li>
            <li>Signature of an authorized company representative</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Who should write and sign it?', a: 'An authorized representative of the employer — typically HR, a supervisor, or a company officer. It should be printed on company letterhead and signed to be considered valid.' },
              { q: 'Should I include salary?', a: 'Only include compensation if the employee has requested or authorized it, since salary is sensitive information. Many verification letters confirm employment and title without stating salary.' },
              { q: 'Is this a legal or official document?', a: 'This tool provides a template only. It becomes a legitimate verification document once an authorized employer representative reviews, completes, and signs it. It is not legal advice.' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold text-gray-700 mb-1">{item.q}</p>
                <p className="text-gray-600 leading-relaxed text-xs">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ℹ️ Need to show income too? Create a <a href="/" className="underline font-semibold">pay stub</a> or
          estimate take-home pay with our <a href="/paycheck-calculator" className="underline font-semibold">Paycheck Calculator</a>.
        </div>
      </div>
    </div>
  )
}
