import { Link } from 'react-router-dom'

const POSTS = [
  {
    slug: 'how-to-read-your-pay-stub',
    title: 'How to Read Your Pay Stub: A Complete Guide (2026)',
    desc: 'Understand every line on your pay stub — gross pay, FICA, federal tax, state tax, deductions, and net pay explained.',
    readTime: '5 min read',
    category: 'Guide',
  },
  {
    slug: 'what-is-ytd-on-a-paycheck',
    title: 'What Is YTD on a Paycheck? Year-to-Date Explained',
    desc: 'YTD means year-to-date — the running total of your gross pay, taxes, and deductions. Here\'s what each YTD figure means and why it matters.',
    readTime: '4 min read',
    category: 'Guide',
  },
  {
    slug: 'how-many-pay-stubs-for-apartment',
    title: 'How Many Pay Stubs Do You Need to Rent an Apartment?',
    desc: 'How many pay stubs landlords require, the 3× rent income rule, and proof-of-income alternatives for renters and the self-employed.',
    readTime: '4 min read',
    category: 'Guide',
  },
  {
    slug: 'gross-vs-net-pay',
    title: 'Gross Pay vs Net Pay: What\'s the Difference?',
    desc: 'Gross is before deductions, net is your take-home. How taxes and deductions turn one into the other, with a 2026 example.',
    readTime: '4 min read',
    category: 'Guide',
  },
  {
    slug: 'pay-stub-abbreviations',
    title: 'Pay Stub Abbreviations Explained (Cheat Sheet)',
    desc: 'A plain-English cheat sheet for YTD, FICA, OASDI, FED, SIT, 401(k) and every common pay stub code.',
    readTime: '3 min read',
    category: 'Guide',
  },
  {
    slug: 'what-is-fica-tax',
    title: 'What is FICA Tax? Social Security & Medicare Explained (2026)',
    desc: 'FICA is 7.65% of every paycheck. Here\'s what Social Security and Medicare taxes fund, how they\'re calculated, and the 2026 wage base.',
    readTime: '4 min read',
    category: 'Guide',
  },
  {
    slug: 'federal-vs-state-income-tax',
    title: 'Federal vs State Income Tax: What\'s the Difference? (2026)',
    desc: '2026 federal tax brackets, state rates for all 50 states, and a side-by-side comparison of living in a no-tax vs high-tax state.',
    readTime: '4 min read',
    category: 'Guide',
  },
  {
    slug: 'pay-stub-vs-w2',
    title: 'Pay Stub vs W-2: What\'s the Difference?',
    desc: 'Pay stubs and W-2s both relate to your earnings — but they serve very different purposes. Here\'s when you need each one.',
    readTime: '4 min read',
    category: 'Guide',
  },
  {
    slug: 'how-to-calculate-overtime',
    title: 'How to Calculate Overtime Pay (2026 FLSA Rules)',
    desc: 'Federal overtime rules, how to calculate time-and-a-half, who is exempt, and state-specific overtime laws explained.',
    readTime: '4 min read',
    category: 'Guide',
  },
]

export default function Blog() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-800 mb-2">Payroll & Tax Guides</h1>
      <p className="text-sm text-gray-400 mb-8">
        Free guides on pay stubs, payroll taxes, overtime, and more — updated for 2026.
      </p>
      <div className="space-y-4">
        {POSTS.map((post) => (
          <Link key={post.slug} to={`/guides/${post.slug}`}
            className="block bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:bg-blue-50 transition-all group">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                {post.category}
              </span>
              <span className="text-xs text-gray-400">{post.readTime}</span>
            </div>
            <h2 className="text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
              {post.title}
            </h2>
            <p className="text-xs text-gray-500 leading-relaxed">{post.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}