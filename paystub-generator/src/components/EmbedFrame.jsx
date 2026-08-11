import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import PaycheckCalc from './PaycheckCalc'
import HourlyToSalaryCalc from './HourlyToSalaryCalc'
import OvertimeCalc from './OvertimeCalc'
import BonusTaxCalc from './BonusTaxCalc'
import SelfEmploymentTaxCalc from './SelfEmploymentTaxCalc'
import TimeCardCalc from './TimeCardCalc'
import NetToGrossCalc from './NetToGrossCalc'
import ContractorRateCalc from './ContractorRateCalc'
import EmployerCostCalc from './EmployerCostCalc'
import PtoAccrualCalc from './PtoAccrualCalc'
import PayRaiseCalc from './PayRaiseCalc'
import Contribution401kCalc from './Contribution401kCalc'
import MileageCalc from './MileageCalc'
import TaxRefundCalc from './TaxRefundCalc'
import W4WithholdingCalc from './W4WithholdingCalc'
import RealHourlyWageCalc from './RealHourlyWageCalc'
import JobOfferCompare from './JobOfferCompare'

const EMBED_TOOLS = {
  'paycheck-calculator': { C: PaycheckCalc, title: 'Paycheck Calculator' },
  'hourly-to-salary-calculator': { C: HourlyToSalaryCalc, title: 'Hourly to Salary Calculator' },
  'overtime-calculator': { C: OvertimeCalc, title: 'Overtime Pay Calculator' },
  'bonus-tax-calculator': { C: BonusTaxCalc, title: 'Bonus Tax Calculator' },
  'self-employment-tax-calculator': { C: SelfEmploymentTaxCalc, title: 'Self-Employment Tax Calculator' },
  'time-card-calculator': { C: TimeCardCalc, title: 'Time Card Calculator' },
  'net-to-gross-calculator': { C: NetToGrossCalc, title: 'Net to Gross Calculator' },
  '1099-vs-w2-calculator': { C: ContractorRateCalc, title: '1099 vs W-2 Calculator' },
  'employee-cost-calculator': { C: EmployerCostCalc, title: 'Employee Cost Calculator' },
  'pto-accrual-calculator': { C: PtoAccrualCalc, title: 'PTO Accrual Calculator' },
  'pay-raise-calculator': { C: PayRaiseCalc, title: 'Pay Raise Calculator' },
  '401k-paycheck-calculator': { C: Contribution401kCalc, title: '401(k) Paycheck Calculator' },
  'mileage-reimbursement-calculator': { C: MileageCalc, title: 'Mileage Reimbursement Calculator' },
  'tax-refund-calculator': { C: TaxRefundCalc, title: 'Tax Refund Calculator' },
  'w4-withholding-calculator': { C: W4WithholdingCalc, title: 'W-4 Withholding Calculator' },
  'real-hourly-wage-calculator': { C: RealHourlyWageCalc, title: 'Real Hourly Wage Calculator' },
  'job-offer-comparison-calculator': { C: JobOfferCompare, title: 'Job Offer Comparison Calculator' },
}

export default function EmbedFrame() {
  const { tool } = useParams()
  const entry = EMBED_TOOLS[tool]

  // Embed pages must not be indexed (avoid duplicate content); the attribution
  // link points crawlers to the canonical page instead.
  useEffect(() => {
    let tag = document.querySelector('meta[name="robots"]')
    const prev = tag?.getAttribute('content')
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('name', 'robots')
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', 'noindex, follow')
    return () => { if (prev) tag.setAttribute('content', prev) }
  }, [])

  if (!entry) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center">
        <a href="https://myfreepaystub.com" className="text-blue-600 font-bold underline">
          MyFreePayStub — Free Pay Stub & Tax Tools
        </a>
      </div>
    )
  }

  const C = entry.C
  const target = `https://myfreepaystub.com/${tool}`

  return (
    <div className="min-h-screen bg-white">
      <C />
      <div className="border-t border-gray-200 py-3 text-center">
        <a href={target} target="_blank" rel="noopener"
          className="text-xs font-semibold text-blue-600 hover:underline">
          ⚡ Powered by MyFreePayStub — Free {entry.title}
        </a>
      </div>
    </div>
  )
}
