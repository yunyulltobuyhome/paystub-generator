import Icon from './Icon'
import { useState } from 'react'
import { STATE_TAXES } from '../data/stateTaxRates'
import { calcPayStub, getPayPeriods } from '../utils/taxCalculator'
import PayStubPreview, { TEMPLATES } from './PayStubPreview'
import AdSlot from './AdSlot'
import { AD_SLOTS } from '../config/ads'

export default function PayStubForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    // Employer
    companyName: '',
    companyAddress: '',
    // Employee
    employeeName: '',
    employeeAddress: '',
    employeeId: '',
    // Pay
    payType: 'salary',
    salary: '',
    hourlyRate: '',
    hoursWorked: '80',
    frequency: 'biweekly',
    payPeriodStart: '',
    payPeriodEnd: '',
    payDate: '',
    checkNumber: '',
    // Tax
    filingStatus: 'single',
    stateCode: 'CA',
    // Deductions
    health: '',
    dental: '',
    vision: '',
    retirement401k: '',
    otherDeduction: '',
    otherDeductionLabel: '',
    // YTD
    ytdGross: '',
  })
  const [result, setResult] = useState(null)
  const [template, setTemplate] = useState('classic')
  const [logo, setLogo] = useState(null)

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return
    if (file.size > 2 * 1024 * 1024) {
      alert('Please choose an image under 2MB.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => setLogo(reader.result)
    reader.readAsDataURL(file)
  }

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const fmt = (n) => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const calcGrossPay = () => {
    if (form.payType === 'salary') {
      const annual = parseFloat(form.salary) || 0
      return annual / getPayPeriods(form.frequency)
    } else {
      const rate = parseFloat(form.hourlyRate) || 0
      const hours = parseFloat(form.hoursWorked) || 0
      // Overtime: hours > 80 per period (biweekly) → 1.5x
      const regularHours = Math.min(hours, 80)
      const otHours = Math.max(0, hours - 80)
      return (regularHours * rate) + (otHours * rate * 1.5)
    }
  }

  const calculate = () => {
    const grossPay = calcGrossPay()
    const preDeductions =
      (parseFloat(form.health) || 0) +
      (parseFloat(form.dental) || 0) +
      (parseFloat(form.vision) || 0) +
      (parseFloat(form.retirement401k) || 0) +
      (parseFloat(form.otherDeduction) || 0)

    const res = calcPayStub({
      grossPay,
      frequency: form.frequency,
      filingStatus: form.filingStatus,
      stateCode: form.stateCode,
      ytdGross: parseFloat(form.ytdGross) || 0,
      preDeductions,
    })

    setResult({ ...res, form, grossPay, preDeductions })
    setStep(3)
  }

  const inputClass = "w-full px-3 py-3 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-sm font-semibold text-gray-700 mb-1"

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex items-center mb-8">
        {['Employer & Employee', 'Pay & Tax Details', 'Preview & Download'].map((s, i) => (
          <div key={i} className="contents">
            <div className="flex items-center gap-2 shrink-0">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                step > i + 1 ? 'bg-green-500 text-white' :
                step === i + 1 ? 'bg-blue-600 text-white' :
                'bg-gray-200 text-gray-400'
              }`}>
                {step > i + 1 ? '✓' : i + 1}
              </div>
              <span className={`text-xs hidden sm:block ${step === i + 1 ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}>
                {s}
              </span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-2" />}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200/80 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Employer Information</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input type="text" value={form.companyName} onChange={e => set('companyName', e.target.value)}
                  placeholder="Acme Corporation" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Company Address</label>
                <input type="text" value={form.companyAddress} onChange={e => set('companyAddress', e.target.value)}
                  placeholder="123 Main St, New York, NY 10001" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200/80 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Employee Information</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Employee Name *</label>
                <input type="text" value={form.employeeName} onChange={e => set('employeeName', e.target.value)}
                  placeholder="John Smith" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Employee Address</label>
                <input type="text" value={form.employeeAddress} onChange={e => set('employeeAddress', e.target.value)}
                  placeholder="456 Oak Ave, Los Angeles, CA 90001" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Employee ID <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={form.employeeId} onChange={e => set('employeeId', e.target.value)}
                  placeholder="EMP-001" className={inputClass} />
              </div>
            </div>
          </div>

          <button
            onClick={() => { if (form.companyName && form.employeeName) setStep(2) }}
            disabled={!form.companyName || !form.employeeName}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors">
            Next: Pay & Tax Details →
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Pay Info */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Pay Information</h2>
            <div className="space-y-4">
              {/* Pay type */}
              <div>
                <label className={labelClass}>Pay Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[{ value: 'salary', label: 'Salary' }, { value: 'hourly', label: '⏰ Hourly' }].map(opt => (
                    <button key={opt.value} onClick={() => set('payType', opt.value)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium border transition-all ${
                        form.payType === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.payType === 'salary' ? (
                <div>
                  <label className={labelClass}>Annual Salary</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input type="number" value={form.salary} onChange={e => set('salary', e.target.value)}
                      placeholder="75,000" className={`${inputClass} pl-7`} />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Hourly Rate</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input type="number" step="0.01" value={form.hourlyRate} onChange={e => set('hourlyRate', e.target.value)}
                        placeholder="25.00" className={`${inputClass} pl-7`} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Hours Worked</label>
                    <input type="number" step="0.5" value={form.hoursWorked} onChange={e => set('hoursWorked', e.target.value)}
                      placeholder="80" className={inputClass} />
                  </div>
                </div>
              )}

              {/* Pay frequency */}
              <div>
                <label className={labelClass}>Pay Frequency</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'weekly', label: 'Weekly (52/yr)' },
                    { value: 'biweekly', label: 'Bi-Weekly (26/yr)' },
                    { value: 'semimonthly', label: 'Semi-Monthly (24/yr)' },
                    { value: 'monthly', label: 'Monthly (12/yr)' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => set('frequency', opt.value)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${
                        form.frequency === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={labelClass}>Period Start</label>
                  <input type="date" value={form.payPeriodStart} onChange={e => set('payPeriodStart', e.target.value)}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Period End</label>
                  <input type="date" value={form.payPeriodEnd} onChange={e => set('payPeriodEnd', e.target.value)}
                    className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Pay Date</label>
                  <input type="date" value={form.payDate} onChange={e => set('payDate', e.target.value)}
                    className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Check # <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" value={form.checkNumber} onChange={e => set('checkNumber', e.target.value)}
                  placeholder="1001" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Tax Info */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-4">Tax Information</h2>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Filing Status</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'single', label: 'Single' },
                    { value: 'married', label: 'Married' },
                    { value: 'head', label: 'Head of Household' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => set('filingStatus', opt.value)}
                      className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                        form.filingStatus === opt.value ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={labelClass}>Work State</label>
                <select value={form.stateCode} onChange={e => set('stateCode', e.target.value)}
                  className={inputClass}>
                  {Object.entries(STATE_TAXES).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([code, state]) => (
                    <option key={code} value={code}>
                      {state.name} {state.rate === 0 ? '(No Income Tax)' : `(${(state.rate * 100).toFixed(2)}%)`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>
                  YTD Gross (before this period) <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" value={form.ytdGross} onChange={e => set('ytdGross', e.target.value)}
                    placeholder="0" className={`${inputClass} pl-7`} />
                </div>
              </div>
            </div>
          </div>

          {/* Pre-tax deductions */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-6">
            <h2 className="text-base font-bold text-gray-800 mb-1">Pre-Tax Deductions</h2>
            <p className="text-xs text-gray-400 mb-4">(optional — leave blank if not applicable)</p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'health', label: 'Health Insurance' },
                { key: 'dental', label: 'Dental Insurance' },
                { key: 'vision', label: 'Vision Insurance' },
                { key: 'retirement401k', label: '401(k) Contribution' },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className={labelClass}>{label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input type="number" step="0.01" value={form[key]}
                      onChange={e => set(key, e.target.value)}
                      placeholder="0.00" className={`${inputClass} pl-7`} />
                  </div>
                </div>
              ))}
              <div>
                <label className={labelClass}>Other Deduction Label</label>
                <input type="text" value={form.otherDeductionLabel}
                  onChange={e => set('otherDeductionLabel', e.target.value)}
                  placeholder="e.g. Union Dues" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Other Deduction Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input type="number" step="0.01" value={form.otherDeduction}
                    onChange={e => set('otherDeduction', e.target.value)}
                    placeholder="0.00" className={`${inputClass} pl-7`} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(1)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
              ← Back
            </button>
            <button onClick={calculate}
              disabled={!calcGrossPay()}
              className="flex-2 flex-1 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors">
              Generate Pay Stub →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Preview */}
      {step === 3 && result && (
        <div>
          {/* Template + Logo — free here, premium on most competitor sites */}
          <div className="mb-4 bg-white rounded-xl border border-gray-200/80 p-4 print:hidden">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-bold text-gray-700">Choose a Template</p>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">Free · No Watermark</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              {Object.entries(TEMPLATES).map(([key, tpl]) => (
                <button key={key} onClick={() => setTemplate(key)}
                  className={`py-2 px-2 rounded-lg text-xs font-medium border transition-all ${
                    template === key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}>
                  {tpl.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="cursor-pointer text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors">
                {logo ? '🔄 Change Logo' : '🖼️ Add Company Logo'}
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              </label>
              {logo && (
                <button onClick={() => setLogo(null)} className="text-xs text-gray-400 hover:text-red-500">Remove logo</button>
              )}
              <span className="text-xs text-gray-400">Optional · stays private in your browser</span>
            </div>
          </div>

          <PayStubPreview result={result} template={template} logo={logo} />
          <div className="mt-4 flex gap-3">
            <button onClick={() => setStep(2)}
              className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
              ← Edit
            </button>
            <button onClick={() => window.print()}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors">
              🖨️ Print / Save PDF
            </button>
          </div>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
            ⚠️ <strong>Disclaimer:</strong> This pay stub is generated for record-keeping and estimation
            purposes only. It is not a substitute for official payroll documents issued by a licensed
            payroll provider. Tax calculations are estimates based on 2026 IRS tables and state rates.
            Always consult a qualified payroll professional or CPA for official payroll processing.
            The user is solely responsible for the accuracy of information entered.
          </div>

          <AdSlot slot={AD_SLOTS.result} />
        </div>
      )}
    </div>
  )
}