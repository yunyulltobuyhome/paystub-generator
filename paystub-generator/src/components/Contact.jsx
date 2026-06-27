export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 mb-2">Contact Us</h1>
      <p className="text-sm text-gray-400 mb-8">Get in touch with the PayStubFree team</p>
      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-4">Send Us a Message</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <input type="text" placeholder="Your name"
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
              <input type="email" placeholder="your@email.com"
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
              <select className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm">
                <option>General Question</option>
                <option>Tax Calculation Issue</option>
                <option>Feature Request</option>
                <option>Report an Error</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea rows={5} placeholder="How can we help?"
                className="w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm resize-none" />
            </div>
            <a href="mailto:hello@paystubfree.com"
              className="block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-center text-sm">
              Send Message
            </a>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-blue-800 mb-3">Other Ways to Reach Us</h2>
          <div className="space-y-2 text-sm text-blue-700">
            <p>📧 Email: <a href="mailto:hello@paystubfree.com" className="underline">hello@paystubfree.com</a></p>
            <p>⏱️ Response time: within 24–48 hours</p>
            <p>🌐 Website: paystubfree.com</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-500">
          <p className="font-semibold text-gray-600 mb-1">Found a tax rate error?</p>
          <p>We update our tax tables regularly. If you spot an outdated rate or calculation error,
          please let us know and we'll fix it within 24 hours. All reported issues are reviewed
          by our team and verified against official IRS and state revenue department sources.</p>
        </div>
      </div>
    </div>
  )
}