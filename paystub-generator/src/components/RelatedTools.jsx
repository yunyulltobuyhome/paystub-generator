import { Link } from 'react-router-dom'

// Cross-link module shown at the foot of every tool page.
//
// Why it exists: a visitor who lands on one calculator from search and leaves
// generates a single page view. Surfacing the next logical tool lifts
// pages-per-session, which raises both total ad impressions and the odds the
// visitor finds what they actually came for. Ordering is intentional —
// each tool lists the ones a real user most plausibly needs next.
const TOOLS = {
  '/paycheck-calculator': { icon: '💵', title: 'Paycheck Calculator', desc: 'Take-home pay after taxes, all 50 states' },
  '/time-card-calculator': { icon: '⏰', title: 'Time Card Calculator', desc: 'Weekly timesheet with breaks & overtime' },
  '/hourly-to-salary-calculator': { icon: '🔄', title: 'Hourly to Salary', desc: 'Convert hourly wage to annual salary' },
  '/net-to-gross-calculator': { icon: '🔁', title: 'Net to Gross Calculator', desc: 'Work back from your target take-home' },
  '/overtime-calculator': { icon: '⏱️', title: 'Overtime Calculator', desc: 'Time-and-a-half & double-time pay' },
  '/pay-raise-calculator': { icon: '📈', title: 'Pay Raise Calculator', desc: 'New salary & what you actually keep' },
  '/bonus-tax-calculator': { icon: '🎁', title: 'Bonus Tax Calculator', desc: 'Tax withheld from your bonus' },
  '/401k-paycheck-calculator': { icon: '🏦', title: '401(k) Paycheck Impact', desc: 'Real cost of contributing per check' },
  '/pto-accrual-calculator': { icon: '🏖️', title: 'PTO Accrual Calculator', desc: 'Vacation earned per hour & paycheck' },
  '/self-employment-tax-calculator': { icon: '🧾', title: 'Self-Employment Tax', desc: '1099 tax & quarterly payments' },
  '/1099-vs-w2-calculator': { icon: '⚖️', title: '1099 vs W-2 Calculator', desc: 'Contract rate that matches a salary' },
  '/mileage-reimbursement-calculator': { icon: '🚗', title: 'Mileage Reimbursement', desc: 'Business & gig mileage value' },
  '/employee-cost-calculator': { icon: '🏢', title: 'True Cost of an Employee', desc: 'Employer taxes, benefits & burden' },
  '/tax-refund-calculator': { icon: '💰', title: 'Tax Refund Calculator', desc: 'Estimate your federal refund' },
  '/w4-withholding-calculator': { icon: '📋', title: 'W-4 Withholding Calculator', desc: 'Dial in your paycheck withholding' },
  '/invoice-generator': { icon: '📑', title: 'Invoice Generator', desc: 'Create invoices free, no watermark' },
  '/': { icon: '📄', title: 'Pay Stub Generator', desc: 'Create a pay stub PDF in seconds' },
  '/multiple-paystubs': { icon: '📚', title: 'Multiple Pay Stubs', desc: 'Several stubs at once with YTD' },
  '/employment-verification-letter': { icon: '📝', title: 'Verification Letter', desc: 'Proof-of-employment letter' },
  '/income-verification-packet': { icon: '📊', title: 'Income Packet Builder', desc: 'Organize gig income into a PDF' },
  '/salary': { icon: '📊', title: 'Salary After Tax', desc: 'Take-home by salary and state' },
  '/hourly': { icon: '🕐', title: '$X an Hour a Year', desc: 'Hourly wage to yearly pay' },
  '/minimum-wage': { icon: '🏛️', title: 'Minimum Wage by State', desc: '2026 rates for all 50 states' },
  '/payroll-calendar': { icon: '📅', title: 'Payroll Calendar Generator', desc: 'Paydays, periods & holiday alerts' },
}

// Hand-picked next steps per tool, most relevant first.
const RELATED = {
  '/paycheck-calculator': ['/time-card-calculator', '/payroll-calendar', '/net-to-gross-calculator', '/tax-refund-calculator'],
  '/time-card-calculator': ['/overtime-calculator', '/paycheck-calculator', '/hourly', '/'],
  '/hourly-to-salary-calculator': ['/hourly', '/paycheck-calculator', '/salary', '/pay-raise-calculator'],
  '/net-to-gross-calculator': ['/pay-raise-calculator', '/paycheck-calculator', '/salary', '/1099-vs-w2-calculator'],
  '/overtime-calculator': ['/time-card-calculator', '/paycheck-calculator', '/minimum-wage', '/'],
  '/pay-raise-calculator': ['/net-to-gross-calculator', '/paycheck-calculator', '/salary', '/401k-paycheck-calculator'],
  '/bonus-tax-calculator': ['/paycheck-calculator', '/tax-refund-calculator', '/401k-paycheck-calculator', '/'],
  '/401k-paycheck-calculator': ['/paycheck-calculator', '/tax-refund-calculator', '/pay-raise-calculator', '/net-to-gross-calculator'],
  '/pto-accrual-calculator': ['/time-card-calculator', '/paycheck-calculator', '/employee-cost-calculator', '/'],
  '/self-employment-tax-calculator': ['/1099-vs-w2-calculator', '/mileage-reimbursement-calculator', '/invoice-generator', '/income-verification-packet'],
  '/1099-vs-w2-calculator': ['/self-employment-tax-calculator', '/mileage-reimbursement-calculator', '/invoice-generator', '/employee-cost-calculator'],
  '/mileage-reimbursement-calculator': ['/self-employment-tax-calculator', '/1099-vs-w2-calculator', '/income-verification-packet', '/invoice-generator'],
  '/employee-cost-calculator': ['/1099-vs-w2-calculator', '/multiple-paystubs', '/paycheck-calculator', '/pto-accrual-calculator'],
  '/tax-refund-calculator': ['/w4-withholding-calculator', '/paycheck-calculator', '/bonus-tax-calculator', '/self-employment-tax-calculator'],
  '/w4-withholding-calculator': ['/tax-refund-calculator', '/paycheck-calculator', '/401k-paycheck-calculator', '/'],
  '/invoice-generator': ['/self-employment-tax-calculator', '/1099-vs-w2-calculator', '/income-verification-packet', '/mileage-reimbursement-calculator'],
  '/minimum-wage': ['/hourly', '/overtime-calculator', '/paycheck-calculator', '/time-card-calculator'],
  '/payroll-calendar': ['/paycheck-calculator', '/time-card-calculator', '/pto-accrual-calculator', '/'],
}

const DEFAULT_RELATED = ['/paycheck-calculator', '/time-card-calculator', '/salary', '/']

export default function RelatedTools({ current, title = 'Related Free Tools' }) {
  const paths = (RELATED[current] || DEFAULT_RELATED).filter((p) => p !== current && TOOLS[p]).slice(0, 4)
  if (paths.length === 0) return null

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 print:hidden">
      <h2 className="text-base font-bold text-gray-800 mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paths.map((path) => {
          const t = TOOLS[path]
          return (
            <Link key={path} to={path}
              className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group">
              <span className="text-xl shrink-0">{t.icon}</span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-gray-800 group-hover:text-blue-600">{t.title}</span>
                <span className="block text-xs text-gray-500 mt-0.5">{t.desc}</span>
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
