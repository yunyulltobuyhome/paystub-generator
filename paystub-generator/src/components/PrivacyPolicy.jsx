export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: June 27, 2026</p>

      <div className="space-y-8 text-sm text-gray-600">
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-blue-800 mb-2">🔒 Key Privacy Facts</h2>
          <ul className="space-y-2 text-blue-700">
            <li>✅ We do <strong>not</strong> collect, store, or transmit any personal information you enter</li>
            <li>✅ All calculations happen <strong>entirely in your browser</strong> — nothing is sent to our servers</li>
            <li>✅ We do <strong>not</strong> sell, share, or disclose your data to any third party</li>
            <li>✅ No account or sign-up is required to use this tool</li>
            <li>✅ When you close the browser tab, all entered data is permanently gone</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">1. Who We Are</h2>
          <p className="leading-relaxed">
            This website ("PayStubFree", "we", "us", or "our") provides a free online pay stub
            generation tool for informational and record-keeping purposes. We are not a licensed
            payroll provider, financial institution, or tax advisory service.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">2. Information You Enter</h2>
          <p className="leading-relaxed mb-3">
            When you use our pay stub generator, you may enter information such as:
          </p>
          <ul className="space-y-1 ml-4 list-disc text-gray-600">
            <li>Employer and employee names and addresses</li>
            <li>Salary, hourly rate, and pay period information</li>
            <li>Tax filing status and US state</li>
            <li>Deduction amounts</li>
          </ul>
          <p className="leading-relaxed mt-3">
            <strong>This information is processed entirely within your browser using JavaScript.</strong>
            It is never transmitted to, stored on, or accessed by our servers or any third party.
            We have no technical ability to view, access, or retrieve any data you enter into this tool.
            When you close or refresh the page, all entered data is permanently deleted from your device's memory.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">3. Cookies and Analytics</h2>
          <p className="leading-relaxed mb-3">
            We may use the following limited, non-personal data collection:
          </p>
          <ul className="space-y-2 ml-4 list-disc text-gray-600">
            <li>
              <strong>Google AdSense:</strong> We display advertising through Google AdSense.
              Google may use cookies to serve ads based on your prior visits to this or other websites.
              You can opt out of personalised advertising at{' '}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer"
                className="text-blue-500 hover:underline">google.com/settings/ads</a>.
            </li>
            <li>
              <strong>Analytics:</strong> We may use anonymised, aggregated analytics (such as Google Analytics)
              to understand how many people visit the site and which pages are most used.
              This data does not identify you personally and does not include any information you enter into the tool.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">4. No Data Sharing</h2>
          <p className="leading-relaxed">
            We do not sell, rent, trade, or otherwise share any personal information with third parties,
            because we do not collect any personal information. The data you enter into the pay stub
            generator is not accessible to us and therefore cannot be shared.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">5. Data Security</h2>
          <p className="leading-relaxed">
            Because all data processing occurs locally in your browser and no data is transmitted
            to our servers, there is no central database that could be breached.
            We strongly recommend that you do not enter sensitive information (such as Social Security
            Numbers or bank account details) into any online tool, including this one, unless you
            are confident in the security of your own device and network.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">6. Children's Privacy</h2>
          <p className="leading-relaxed">
            This website is not directed at children under the age of 13. We do not knowingly
            collect any information from children under 13. If you believe a child has used this
            tool and you have concerns, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">7. Changes to This Policy</h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with an updated date. Continued use of the website after changes constitutes acceptance
            of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">8. Contact</h2>
          <p className="leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at{' '}
            <a href="mailto:hello@paystubfree.com" className="text-blue-500 hover:underline">
              hello@paystubfree.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}