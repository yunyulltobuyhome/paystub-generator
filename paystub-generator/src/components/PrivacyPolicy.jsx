import { usePageMeta } from '../hooks/usePageMeta'

export default function PrivacyPolicy() {
  usePageMeta({
    title: 'Privacy Policy — MyFreePayStub',
    description: 'How MyFreePayStub handles your data: tool inputs stay in your browser, our use of cookies and Google AdSense, personalised-ads opt-out options, and your GDPR/CCPA privacy rights.',
    canonicalPath: '/privacy',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: June 30, 2026</p>

      <div className="space-y-8 text-sm text-gray-600">
        <section className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          <h2 className="text-base font-bold text-blue-800 mb-2">🔒 Key Privacy Facts</h2>
          <ul className="space-y-2 text-blue-700">
            <li>✅ Everything you type into our tools (names, pay, deductions, invoice details) is processed <strong>entirely in your browser</strong> and is never sent to or stored on our servers.</li>
            <li>✅ We do <strong>not</strong> sell your personal information.</li>
            <li>✅ No account or sign-up is required.</li>
            <li>ℹ️ We use cookies for advertising (Google AdSense) and basic analytics. You can accept or reject non-essential cookies via our cookie banner, and change your choice any time using <strong>“Cookie settings”</strong> in the footer.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">1. Who We Are</h2>
          <p className="leading-relaxed">
            This website (“MyFreePayStub”, “we”, “us”, or “our”) provides free online pay stub,
            invoice, and tax-estimation tools for informational and record-keeping purposes. We are
            not a licensed payroll provider, financial institution, or tax advisory service. For any
            privacy question or request, contact us at{' '}
            <a href="mailto:hello@myfreepaystub.com" className="text-blue-500 hover:underline">hello@myfreepaystub.com</a>.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">2. Information You Enter Into Our Tools</h2>
          <p className="leading-relaxed mb-3">
            When you use our generators and calculators, you may enter information such as employer
            and employee names, salary or hourly rate, tax filing status and US state, deduction
            amounts, invoice and client details, and any company logo you choose to upload.
          </p>
          <p className="leading-relaxed">
            <strong>This information is processed entirely within your browser using JavaScript.</strong>
            It is never transmitted to, stored on, or accessed by our servers or any third party. Any
            logo you add is read locally in your browser and is not uploaded. We have no technical
            ability to view or retrieve what you enter. When you close or refresh the page, that data
            is permanently cleared from your device's memory.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">3. Cookies and Similar Technologies</h2>
          <p className="leading-relaxed mb-3">
            We and our partners use cookies and similar technologies to deliver advertising, measure
            traffic, and remember your preferences. The categories we use are:
          </p>
          <ul className="space-y-2 ml-4 list-disc text-gray-600">
            <li><strong>Essential / preference cookies:</strong> remember your cookie-consent choice (stored locally in your browser) so we don't ask repeatedly. These are required for the site to respect your selection.</li>
            <li><strong>Advertising cookies (Google AdSense):</strong> see Section 4.</li>
            <li><strong>Analytics cookies:</strong> anonymised, aggregated measurement (e.g. how many people visit and which pages are popular). This does not identify you and never includes what you type into the tools.</li>
          </ul>
          <p className="leading-relaxed mt-3">
            When you first visit, a cookie banner lets you <strong>Accept</strong> or <strong>Reject</strong>
            non-essential (advertising/analytics) cookies. You can change your choice at any time via
            <strong> “Cookie settings”</strong> in the footer.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">4. Google AdSense & Third-Party Advertising</h2>
          <p className="leading-relaxed mb-3">
            This site is supported by advertising served through <strong>Google AdSense</strong>.
            Google and its <a href="https://support.google.com/admanager/answer/9012903" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">certified third-party partners</a> use
            cookies and device identifiers to serve and measure ads.
          </p>
          <ul className="space-y-2 ml-4 list-disc text-gray-600">
            <li>
              Third-party vendors, including Google, use cookies to serve ads based on your prior
              visits to this and other websites.
            </li>
            <li>
              Google's use of advertising cookies enables it and its partners to serve ads to you
              based on your visits to this site and/or other sites on the Internet.
            </li>
            <li>
              You can opt out of personalised advertising by Google in your{' '}
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Ads Settings</a>.
            </li>
            <li>
              You can opt out of personalised advertising from many other vendors at{' '}
              <a href="https://optout.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">aboutads.info/choices</a>{' '}
              (US) and{' '}
              <a href="https://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">youronlinechoices.eu</a>{' '}
              (EU/UK).
            </li>
            <li>
              For more on how Google uses data from sites that use its services, see{' '}
              <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                google.com/policies/technologies/partner-sites
              </a>.
            </li>
          </ul>
          <p className="leading-relaxed mt-3">
            For users in the European Economic Area, the United Kingdom, and Switzerland, Google
            operates under a consent framework. Where required, personalised ads are shown only with
            your consent; if you reject advertising cookies, you may still see non-personalised ads.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">5. Legal Bases for Processing (UK/EU GDPR)</h2>
          <p className="leading-relaxed mb-3">
            If you are in the UK or EEA, we process the limited personal data described above on the
            following legal bases under the UK GDPR and EU GDPR:
          </p>
          <ul className="space-y-2 ml-4 list-disc text-gray-600">
            <li><strong>Consent</strong> (Art. 6(1)(a)) — for advertising and analytics cookies. You may withdraw consent at any time via “Cookie settings”.</li>
            <li><strong>Legitimate interests</strong> (Art. 6(1)(f)) — to keep the site secure, prevent abuse, and run essential measurement, balanced against your rights.</li>
            <li><strong>Legal obligation</strong> (Art. 6(1)(c)) — where we must retain or disclose information to comply with the law.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">6. Your Privacy Rights</h2>
          <p className="leading-relaxed mb-3">
            Depending on where you live (including under the UK/EU GDPR and the California CCPA/CPRA),
            you may have the right to:
          </p>
          <ul className="space-y-1 ml-4 list-disc text-gray-600">
            <li>access the personal data we hold about you;</li>
            <li>request correction or deletion of your data;</li>
            <li>object to or restrict certain processing, including personalised advertising;</li>
            <li>withdraw consent at any time;</li>
            <li>data portability; and</li>
            <li>lodge a complaint with your data protection authority (e.g. the UK ICO).</li>
          </ul>
          <p className="leading-relaxed mt-3">
            Because the data you enter into our tools never reaches us, most requests will relate to
            cookies/advertising. To exercise any right, email{' '}
            <a href="mailto:hello@myfreepaystub.com" className="text-blue-500 hover:underline">hello@myfreepaystub.com</a>{' '}
            and we will respond within the time required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">7. Data Security & Retention</h2>
          <p className="leading-relaxed">
            Because tool inputs are processed locally in your browser and are not transmitted to us,
            there is no central database of your entries that could be breached. We retain only the
            minimal, non-identifying information needed for advertising and analytics for as long as
            permitted by those providers. We recommend not entering highly sensitive data (such as
            Social Security or bank account numbers) into any online tool.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">8. Children's Privacy</h2>
          <p className="leading-relaxed">
            This website is not directed at children under 13 (or the equivalent minimum age in your
            country), and we do not knowingly collect data from them. If you believe a child has
            provided personal data, please contact us and we will delete it.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">9. International Visitors</h2>
          <p className="leading-relaxed">
            Our advertising and analytics partners may process data in the United States and other
            countries. Where required, such transfers rely on appropriate safeguards such as the
            Standard Contractual Clauses.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">10. Changes to This Policy</h2>
          <p className="leading-relaxed">
            We may update this Privacy Policy from time to time. Changes will be posted on this page
            with a new “last updated” date. Continued use of the website after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-base font-bold text-gray-800 mb-3">11. Contact</h2>
          <p className="leading-relaxed">
            For any questions about this Privacy Policy or your data, contact us at{' '}
            <a href="mailto:hello@myfreepaystub.com" className="text-blue-500 hover:underline">
              hello@myfreepaystub.com
            </a>.
          </p>
        </section>
      </div>
    </div>
  )
}
