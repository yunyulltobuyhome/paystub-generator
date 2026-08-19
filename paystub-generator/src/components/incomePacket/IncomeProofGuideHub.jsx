import { Link } from 'react-router-dom'
import { usePageMeta } from '../../hooks/usePageMeta'
import { NICHE_LIST } from '../../data/nicheContent'

const ARTICLES = [
  {
    slug: 'what-is-an-income-verification-packet',
    title: 'What Is an Income Verification Packet?',
    desc: 'What\'s included in a packet, and who typically needs one.',
    readTime: '3 min read',
  },
  {
    slug: 'proof-of-income-for-freelancers',
    title: 'Proof of Income for Freelancers: A Complete Guide',
    desc: 'What counts as proof of income, how many months to show, and how to organize multiple clients.',
    readTime: '5 min read',
  },
  {
    slug: 'proof-of-income-without-pay-stubs',
    title: 'How to Show Proof of Income Without Pay Stubs',
    desc: 'Alternatives to pay stubs for self-employed, freelance, and gig income.',
    readTime: '4 min read',
  },
  {
    slug: 'profit-and-loss-statement-for-gig-workers',
    title: 'Profit and Loss Statement for Gig Workers',
    desc: 'What a P&L statement is, common expense categories, and why it helps.',
    readTime: '4 min read',
  },
]

export default function IncomeProofGuideHub() {
  usePageMeta({
    title: 'How to Prove Income as a Freelancer or Gig Worker (2026) | MyFreePayStub',
    description: 'Guides on proving income without pay stubs — for freelancers, rideshare and delivery drivers, online sellers, and other self-employed workers. Free income verification packet builder included.',
    canonicalPath: '/how-to-prove-income',
  })

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-2">How to Prove Income</h1>
      <p className="text-sm text-gray-400 mb-8">
        Guides for freelancers, gig workers, and the self-employed on documenting income —
        updated for 2026.
      </p>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8">
        <p className="font-bold text-blue-800 mb-1">Ready to build your packet?</p>
        <p className="text-blue-700 text-xs mb-3">
          Organize your income into a professional PDF in minutes — free, no sign-up.
        </p>
        <Link to="/income-verification-packet"
          className="inline-block bg-blue-600 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Build My Income Packet →
        </Link>
      </div>

      <h2 className="text-base font-bold text-gray-800 mb-3">Guides</h2>
      <div className="space-y-4 mb-8">
        {ARTICLES.map((post) => (
          <Link key={post.slug} to={`/how-to-prove-income/${post.slug}`}
            className="block bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:bg-blue-50 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Guide</span>
              <span className="text-xs text-gray-400">{post.readTime}</span>
            </div>
            <h3 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
              {post.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">{post.desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-base font-bold text-gray-800 mb-3">By Occupation</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {NICHE_LIST.map((n) => (
          <Link key={n.slug} to={`/for/${n.slug}`}
            className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
            <span className="text-2xl">{n.icon}</span>
            <div>
              <p className="text-sm font-bold text-gray-800 group-hover:text-blue-600">{n.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">Proof of income guide &amp; builder</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
