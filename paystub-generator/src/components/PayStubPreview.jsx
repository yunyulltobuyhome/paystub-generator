// Professional pay stub templates — free here, paid on most competitor sites.
export const TEMPLATES = {
  classic: {
    label: 'Classic Blue',
    header: 'bg-blue-600 text-white',
    headerSub: 'text-blue-200',
    accent: 'text-blue-600',
    netBox: 'bg-blue-50',
    netLabel: 'text-blue-500',
    netValue: 'text-blue-700',
    border: 'border-gray-300',
  },
  modern: {
    label: 'Modern Slate',
    header: 'bg-slate-800 text-white',
    headerSub: 'text-slate-300',
    accent: 'text-slate-700',
    netBox: 'bg-slate-100',
    netLabel: 'text-slate-500',
    netValue: 'text-slate-800',
    border: 'border-slate-400',
  },
  minimal: {
    label: 'Minimal B&W',
    header: 'bg-white text-gray-900 border-b-2 border-gray-900',
    headerSub: 'text-gray-500',
    accent: 'text-gray-900',
    netBox: 'bg-gray-100',
    netLabel: 'text-gray-500',
    netValue: 'text-gray-900',
    border: 'border-gray-400',
  },
  corporate: {
    label: 'Corporate Green',
    header: 'bg-emerald-700 text-white',
    headerSub: 'text-emerald-100',
    accent: 'text-emerald-700',
    netBox: 'bg-emerald-50',
    netLabel: 'text-emerald-600',
    netValue: 'text-emerald-700',
    border: 'border-emerald-300',
  },
}

export default function PayStubPreview({ result, template = 'classic', logo = null }) {
  const { form } = result
  const t = TEMPLATES[template] || TEMPLATES.classic
  const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const deductions = [
    { label: 'Federal Income Tax', amount: result.federalTax },
    { label: 'Social Security (6.2%)', amount: result.socialSecurity },
    { label: 'Medicare (1.45%)', amount: result.medicare },
    ...(result.stateTax > 0 ? [{ label: `${result.stateName} State Tax`, amount: result.stateTax }] : []),
    ...(parseFloat(form.health) > 0 ? [{ label: 'Health Insurance', amount: parseFloat(form.health) }] : []),
    ...(parseFloat(form.dental) > 0 ? [{ label: 'Dental Insurance', amount: parseFloat(form.dental) }] : []),
    ...(parseFloat(form.vision) > 0 ? [{ label: 'Vision Insurance', amount: parseFloat(form.vision) }] : []),
    ...(parseFloat(form.retirement401k) > 0 ? [{ label: '401(k) Contribution', amount: parseFloat(form.retirement401k) }] : []),
    ...(parseFloat(form.otherDeduction) > 0 ? [{ label: form.otherDeductionLabel || 'Other Deduction', amount: parseFloat(form.otherDeduction) }] : []),
  ]

  return (
    <div id="paystub-preview" className={`bg-white border-2 ${t.border} rounded-2xl overflow-hidden print:border-gray-400`}>
      {/* Header */}
      <div className={`${t.header} px-6 py-4`}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-center gap-3 min-w-0">
            {logo && (
              <img src={logo} alt="Company logo" className="h-12 w-12 object-contain rounded bg-white/90 p-1 shrink-0" />
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-black truncate">{form.companyName || 'Company Name'}</h1>
              <p className={`${t.headerSub} text-sm mt-0.5`}>{form.companyAddress}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className={`${t.headerSub} text-xs`}>PAY STUB</p>
            {form.checkNumber && <p className="text-sm font-bold">Check #{form.checkNumber}</p>}
          </div>
        </div>
      </div>

      {/* Employee + Pay Period */}
      <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Employee</p>
          <p className="font-bold text-gray-800">{form.employeeName || 'Employee Name'}</p>
          {form.employeeAddress && <p className="text-xs text-gray-500 mt-0.5">{form.employeeAddress}</p>}
          {form.employeeId && <p className="text-xs text-gray-400 mt-0.5">ID: {form.employeeId}</p>}
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Pay Period</p>
          {form.payPeriodStart && form.payPeriodEnd && (
            <p className="text-sm text-gray-700">{form.payPeriodStart} – {form.payPeriodEnd}</p>
          )}
          {form.payDate && <p className="text-sm font-bold text-gray-800">Pay Date: {form.payDate}</p>}
          <p className="text-xs text-gray-400 capitalize mt-0.5">{form.frequency} · {form.filingStatus}</p>
        </div>
      </div>

      {/* Earnings */}
      <div className="px-6 py-4 border-b border-gray-200">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Earnings</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {form.payType === 'salary'
                ? `Salary (${form.frequency})`
                : `Regular Pay (${Math.min(parseFloat(form.hoursWorked) || 0, 80)} hrs @ ${fmt(parseFloat(form.hourlyRate) || 0)}/hr)`}
            </span>
            <span className="font-semibold">
              {form.payType === 'hourly' && parseFloat(form.hoursWorked) > 80
                ? fmt((Math.min(parseFloat(form.hoursWorked), 80)) * (parseFloat(form.hourlyRate) || 0))
                : fmt(result.grossPay)}
            </span>
          </div>
          {form.payType === 'hourly' && parseFloat(form.hoursWorked) > 80 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                Overtime ({parseFloat(form.hoursWorked) - 80} hrs @ {fmt((parseFloat(form.hourlyRate) || 0) * 1.5)}/hr)
              </span>
              <span className="font-semibold">
                {fmt((parseFloat(form.hoursWorked) - 80) * (parseFloat(form.hourlyRate) || 0) * 1.5)}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2">
            <span>Gross Pay</span>
            <span>{fmt(result.grossPay)}</span>
          </div>
        </div>
      </div>

      {/* Deductions */}
      <div className="px-6 py-4 border-b border-gray-200">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Deductions</p>
        <div className="space-y-2">
          {deductions.map((d, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600">{d.label}</span>
              <span className="text-red-500">({fmt(d.amount)})</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold border-t border-gray-100 pt-2">
            <span>Total Deductions</span>
            <span className="text-red-500">({fmt(result.totalDeductions)})</span>
          </div>
        </div>
      </div>

      {/* Net Pay */}
      <div className={`px-6 py-4 ${t.netBox} border-b border-gray-200`}>
        <div className="flex justify-between items-center">
          <div>
            <p className={`text-xs ${t.netLabel} uppercase tracking-wide font-bold`}>Net Pay</p>
            <p className={`text-3xl font-black ${t.netValue}`}>{fmt(result.netPay)}</p>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>Gross: {fmt(result.grossPay)}</p>
            <p>Deductions: ({fmt(result.totalDeductions)})</p>
          </div>
        </div>
      </div>

      {/* YTD Summary */}
      <div className="px-6 py-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Year-To-Date Summary</p>
        <div className="grid grid-cols-3 gap-3 text-xs">
          {[
            { label: 'YTD Gross', val: result.ytdGross },
            { label: 'YTD Federal Tax', val: result.ytdFederal },
            { label: 'YTD SS', val: result.ytdSS },
            { label: 'YTD Medicare', val: result.ytdMedicare },
            { label: 'YTD State Tax', val: result.ytdState },
            { label: 'YTD Net Pay', val: result.ytdNet },
          ].map(({ label, val }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-gray-400 text-xs">{label}</p>
              <p className="font-bold text-gray-700 mt-0.5">{fmt(val)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-400 text-center">
          Generated by MyFreePayStub.com · For record-keeping purposes only · Not an official payroll document
        </p>
      </div>
    </div>
  )
}
