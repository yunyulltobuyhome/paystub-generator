import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'

const CONTACT_EMAIL = 'hello@myfreepaystub.com'

export default function Contact() {
  usePageMeta({
    title: 'Contact Us — MyFreePayStub',
    description: 'Contact the MyFreePayStub team. Report a tax-rate error, request a feature, ask a privacy/GDPR question, or get help with our free pay stub and tax tools. We reply within 24–48 hours.',
    canonicalPath: '/contact',
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('General Question')
  const [message, setMessage] = useState('')

  const inputClass = "w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"

  const mailtoHref = () => {
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[${subject}] MyFreePayStub`)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Contact Us</h1>
      <p className="text-sm text-gray-400 mb-8">
        We're a small team and we read every message. Get in touch with the MyFreePayStub team below.
      </p>

      <div className="space-y-6">
        {/* Reasons to contact */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">What can we help with?</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              { icon: '🧮', title: 'Tax rate or calculation errors', desc: 'Spotted an outdated rate? We verify against official IRS & state sources and fix it fast.' },
              { icon: '💡', title: 'Feature requests', desc: 'Tell us which calculator or option you\'d like us to add next.' },
              { icon: '🔒', title: 'Privacy & data requests', desc: 'Exercise your GDPR/CCPA rights or ask how your data is handled.' },
              { icon: '📣', title: 'Advertising & partnerships', desc: 'Questions about ads on the site or working together.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-3">
                <p className="font-semibold text-gray-800"><span className="mr-1">{icon}</span>{title}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Direct email */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-blue-800 mb-3">Email Us Directly</h2>
          <div className="space-y-2 text-sm text-blue-700">
            <p>📧 Email: <a href={`mailto:${CONTACT_EMAIL}`} className="underline font-semibold">{CONTACT_EMAIL}</a></p>
            <p>⏱️ Typical response time: within 24–48 hours (Mon–Fri)</p>
            <p>🌐 Website: myfreepaystub.com</p>
          </div>
        </div>

        {/* Compose form (opens your email client — no data leaves your browser) */}
        <div className="bg-white rounded-xl border border-gray-200/80 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-1">Send Us a Message</h2>
          <p className="text-xs text-gray-400 mb-4">
            This form opens your own email app with the details filled in — nothing is submitted to or stored on our servers.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className={inputClass}>
                <option>General Question</option>
                <option>Tax Calculation Issue</option>
                <option>Feature Request</option>
                <option>Privacy / Data Request</option>
                <option>Advertising / Partnership</option>
                <option>Report an Error</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="How can we help?"
                className={`${inputClass} resize-none`} />
            </div>
            <a href={mailtoHref()}
              className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-center text-sm">
              Open Email to Send
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-600 mb-1">Found a tax rate error?</p>
          <p>We update our tax tables regularly. If you spot an outdated rate or calculation error,
          please let us know and we'll review it within 24 hours. All reported issues are verified
          against official IRS and state revenue department sources before we publish a fix.</p>
        </div>
      </div>
    </div>
  )
}
