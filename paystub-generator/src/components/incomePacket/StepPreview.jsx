import { useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import IncomePacketDocument from './IncomePacketDocument'
import { OCCUPATIONS, EXPENSE_CATEGORIES } from '../../data/incomePacketPresets'
import { formatDateRange } from '../../utils/incomePacketDates'
import { PDF_FOOTER_NOTICE } from '../../config/incomePacket'

const fmt = (n) => '$' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default function StepPreview({ data, onBack, onStartOver }) {
  const [generating, setGenerating] = useState(false)

  const { aboutYou, income, expenses } = data
  const occupationLabel = aboutYou.occupation === 'other'
    ? aboutYou.occupationOther
    : (OCCUPATIONS.find(o => o.value === aboutYou.occupation)?.label || aboutYou.occupation)
  const dateRange = formatDateRange(income.monthly)
  const monthlyTotal = income.monthly.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0)
  const monthlyAverage = income.monthly.length > 0 ? monthlyTotal / income.monthly.length : 0

  const expenseRows = EXPENSE_CATEGORIES
    .map(c => ({ label: c.label, amount: parseFloat(expenses.categories[c.key]) || 0 }))
    .filter(r => r.amount > 0)
  const expensesTotal = expenseRows.reduce((sum, r) => sum + r.amount, 0)
  const includeExpenses = !expenses.skipped && expensesTotal > 0
  const netIncome = monthlyTotal - expensesTotal

  // Generates the PDF entirely client-side (no network request) and downloads
  // it via a temporary object URL.
  const handleDownload = async () => {
    setGenerating(true)
    try {
      const blob = await pdf(<IncomePacketDocument data={data} />).toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const safeName = (aboutYou.name || 'packet').trim().replace(/\s+/g, '-').toLowerCase()
      a.href = url
      a.download = `income-verification-packet-${safeName}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } finally {
      setGenerating(false)
    }
  }

  const sectionClass = "bg-white rounded-2xl border border-gray-200 p-6"

  return (
    <div className="space-y-6">
      <div className={sectionClass}>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Page 1 · Cover Summary</p>
        <h2 className="text-xl font-black text-gray-800">{aboutYou.name || 'Your Name'}</h2>
        <p className="text-sm text-gray-500 mb-4">{dateRange}</p>
        <div className="bg-blue-50 rounded-xl p-4 mb-4">
          <p className="text-xs text-blue-500 font-semibold uppercase">Average Monthly Income</p>
          <p className="text-2xl font-black text-blue-700">{fmt(monthlyAverage)}</p>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Occupation</span><span className="font-semibold">{occupationLabel}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Period Covered</span><span className="font-semibold">{dateRange}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Total Income</span><span className="font-semibold">{fmt(monthlyTotal)}</span></div>
        </div>
      </div>

      <div className={sectionClass}>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Page 2 · Income Summary</p>
        <div className="space-y-1 text-sm">
          {income.monthly.map(m => (
            <div key={m.key} className="flex justify-between border-b border-gray-50 py-1.5">
              <span className="text-gray-600">{m.label}</span>
              <span className="font-semibold">{fmt(m.amount)}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 font-black text-gray-800">
            <span>Total</span><span>{fmt(monthlyTotal)}</span>
          </div>
        </div>
      </div>

      {includeExpenses && (
        <div className={sectionClass}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Page 3 · Profit &amp; Loss Statement</p>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between py-1.5"><span className="text-gray-600">Total Income</span><span className="font-semibold">{fmt(monthlyTotal)}</span></div>
            {expenseRows.map((r, i) => (
              <div key={i} className="flex justify-between border-b border-gray-50 py-1.5">
                <span className="text-gray-600">{r.label}</span>
                <span className="text-red-500">({fmt(r.amount)})</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-black text-gray-800">
              <span>Net Income</span><span>{fmt(netIncome)}</span>
            </div>
          </div>
        </div>
      )}

      <div className={sectionClass}>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
          Page {includeExpenses ? 4 : 3} · Income Source List
        </p>
        {income.sources.length > 0 ? (
          <div className="space-y-1 text-sm">
            {income.sources.map(s => (
              <div key={s.id} className="flex justify-between border-b border-gray-50 py-1.5">
                <span className="text-gray-600">{s.clientName || '—'} <span className="text-gray-300">({s.paymentType})</span></span>
                <span className="font-semibold">{fmt(s.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No income sources were listed for this packet.</p>
        )}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-[11px] text-gray-400 leading-relaxed">
        {PDF_FOOTER_NOTICE}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack}
          className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">
          ← Back
        </button>
        <button onClick={handleDownload} disabled={generating}
          className="flex-[2] py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white font-bold rounded-xl transition-colors">
          {generating ? 'Generating PDF…' : '⬇ Download PDF'}
        </button>
      </div>

      <button onClick={onStartOver} className="w-full text-xs text-gray-400 hover:text-gray-600 py-2">
        Start over
      </button>
    </div>
  )
}
