import { useState } from 'react'
import { usePageMeta } from '../hooks/usePageMeta'
import RelatedTools from './RelatedTools'

const CURRENCIES = [
  { code: 'USD', symbol: '$' },
  { code: 'EUR', symbol: '€' },
  { code: 'GBP', symbol: '£' },
  { code: 'CAD', symbol: 'C$' },
  { code: 'AUD', symbol: 'A$' },
  { code: 'INR', symbol: '₹' },
]

export default function InvoiceGenerator() {
  usePageMeta({
    title: 'Free Invoice Generator 2026 — Create & Download Invoices (No Sign-Up) | MyFreePayStub',
    description: 'Free online invoice generator for freelancers, contractors & small businesses. Create professional invoices, add line items and tax, then download as PDF. No sign-up, no watermark, unlimited.',
    canonicalPath: '/invoice-generator',
  })

  const [biz, setBiz] = useState({ name: '', email: '', address: '' })
  const [client, setClient] = useState({ name: '', email: '', address: '' })
  const [meta, setMeta] = useState({
    number: 'INV-0001',
    date: '',
    due: '',
  })
  const [items, setItems] = useState([
    { desc: '', qty: '1', rate: '' },
  ])
  const [taxRate, setTaxRate] = useState('')
  const [notes, setNotes] = useState('')
  const [currency, setCurrency] = useState('USD')

  const sym = CURRENCIES.find(c => c.code === currency)?.symbol || '$'
  const fmt = (n) => sym + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const lineTotal = (it) => (parseFloat(it.qty) || 0) * (parseFloat(it.rate) || 0)
  const subtotal = items.reduce((sum, it) => sum + lineTotal(it), 0)
  const taxAmount = subtotal * ((parseFloat(taxRate) || 0) / 100)
  const total = subtotal + taxAmount

  const setItem = (i, key, val) => setItems(items.map((it, idx) => idx === i ? { ...it, [key]: val } : it))
  const addItem = () => setItems([...items, { desc: '', qty: '1', rate: '' }])
  const removeItem = (i) => setItems(items.length > 1 ? items.filter((_, idx) => idx !== i) : items)

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm"
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1"

  const hasContent = biz.name || client.name || items.some(it => it.desc || it.rate)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Free Invoice Generator 2026",
        "url": "https://myfreepaystub.com/invoice-generator",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Any",
        "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
        "description": "Free online invoice generator for freelancers, contractors and small businesses. Create professional invoices with line items and tax, then download as PDF — no sign-up, no watermark."
      })}} />

      <div className="mb-6 print:hidden">
        <h1 className="text-2xl font-black text-gray-800 mb-1">Free Invoice Generator</h1>
        <p className="text-sm text-gray-500">
          Create a professional invoice in minutes — add line items, tax, and notes, then download as PDF.
          Free, unlimited, no sign-up, no watermark.
        </p>
      </div>

      {/* Editor */}
      <div className="space-y-4 print:hidden">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">From (Your Business)</p>
              <div className="space-y-2">
                <div><label className={labelClass}>Name / Business</label><input value={biz.name} onChange={e => setBiz({ ...biz, name: e.target.value })} className={inputClass} placeholder="Your Business LLC" /></div>
                <div><label className={labelClass}>Email</label><input value={biz.email} onChange={e => setBiz({ ...biz, email: e.target.value })} className={inputClass} placeholder="you@business.com" /></div>
                <div><label className={labelClass}>Address</label><input value={biz.address} onChange={e => setBiz({ ...biz, address: e.target.value })} className={inputClass} placeholder="123 Main St, City, ST" /></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Bill To (Client)</p>
              <div className="space-y-2">
                <div><label className={labelClass}>Name / Company</label><input value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} className={inputClass} placeholder="Client Inc." /></div>
                <div><label className={labelClass}>Email</label><input value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} className={inputClass} placeholder="client@email.com" /></div>
                <div><label className={labelClass}>Address</label><input value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} className={inputClass} placeholder="456 Oak Ave, City, ST" /></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            <div><label className={labelClass}>Invoice #</label><input value={meta.number} onChange={e => setMeta({ ...meta, number: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Date</label><input type="date" value={meta.date} onChange={e => setMeta({ ...meta, date: e.target.value })} className={inputClass} /></div>
            <div><label className={labelClass}>Due Date</label><input type="date" value={meta.due} onChange={e => setMeta({ ...meta, due: e.target.value })} className={inputClass} /></div>
            <div>
              <label className={labelClass}>Currency</label>
              <select value={currency} onChange={e => setCurrency(e.target.value)} className={inputClass}>
                {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Line items */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <p className="text-sm font-bold text-gray-700 mb-3">Line Items</p>
          <div className="space-y-2">
            <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 px-1">
              <span className="col-span-6">Description</span>
              <span className="col-span-2 text-right">Qty</span>
              <span className="col-span-2 text-right">Rate</span>
              <span className="col-span-2 text-right">Amount</span>
            </div>
            {items.map((it, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center">
                <input value={it.desc} onChange={e => setItem(i, 'desc', e.target.value)} placeholder="Service or product" className={`${inputClass} col-span-12 sm:col-span-6`} />
                <input type="number" value={it.qty} onChange={e => setItem(i, 'qty', e.target.value)} placeholder="1" className={`${inputClass} col-span-4 sm:col-span-2 text-right`} />
                <input type="number" value={it.rate} onChange={e => setItem(i, 'rate', e.target.value)} placeholder="0.00" className={`${inputClass} col-span-4 sm:col-span-2 text-right`} />
                <div className="col-span-3 sm:col-span-2 text-right text-sm font-semibold text-gray-700">{fmt(lineTotal(it))}</div>
                <button onClick={() => removeItem(i)} className="col-span-1 text-gray-300 hover:text-red-500 text-lg" title="Remove">×</button>
              </div>
            ))}
          </div>
          <button onClick={addItem} className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-700">+ Add Line Item</button>

          <div className="grid sm:grid-cols-2 gap-4 mt-5 pt-4 border-t border-gray-100">
            <div>
              <label className={labelClass}>Notes / Payment Terms</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={`${inputClass} resize-none`} placeholder="Thank you for your business! Payment due within 30 days." />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-gray-600 shrink-0">Tax Rate (%)</label>
                <input type="number" value={taxRate} onChange={e => setTaxRate(e.target.value)} placeholder="0" className={`${inputClass} text-right`} />
              </div>
              <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>Tax ({parseFloat(taxRate) || 0}%)</span><span>{fmt(taxAmount)}</span></div>
              <div className="flex justify-between text-base font-black text-gray-800 border-t border-gray-200 pt-2"><span>Total</span><span>{fmt(total)}</span></div>
            </div>
          </div>
        </div>

        <button onClick={() => window.print()}
          className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors">
          🖨️ Print / Save PDF
        </button>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed">
          ℹ️ This invoice generator is a free tool for creating your own billing documents. It does not
          provide tax, legal, or accounting advice. You are responsible for applying the correct tax rate
          and complying with the invoicing and tax rules in your jurisdiction. Consult a qualified
          accountant or tax professional for official guidance.
        </div>
      </div>

      {/* Live preview / printable */}
      {hasContent && (
        <div id="invoice-preview" className="mt-8 bg-white border-2 border-gray-300 rounded-2xl overflow-hidden print:border-gray-400 print:mt-0">
          <div className="bg-blue-600 text-white px-6 py-5 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black">{biz.name || 'Your Business'}</h2>
              {biz.email && <p className="text-blue-200 text-sm mt-0.5">{biz.email}</p>}
              {biz.address && <p className="text-blue-200 text-sm">{biz.address}</p>}
            </div>
            <div className="text-right">
              <p className="text-3xl font-black tracking-wide">INVOICE</p>
              <p className="text-blue-200 text-sm mt-1">#{meta.number}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Bill To</p>
              <p className="font-bold text-gray-800">{client.name || 'Client'}</p>
              {client.email && <p className="text-xs text-gray-500 mt-0.5">{client.email}</p>}
              {client.address && <p className="text-xs text-gray-500">{client.address}</p>}
            </div>
            <div className="text-right text-sm text-gray-600">
              {meta.date && <p><span className="text-gray-400">Date: </span>{meta.date}</p>}
              {meta.due && <p><span className="text-gray-400">Due: </span><span className="font-semibold text-gray-800">{meta.due}</span></p>}
            </div>
          </div>

          <div className="px-6 py-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-xs text-gray-400 uppercase tracking-wide border-b border-gray-200">
                  <th className="text-left py-2 font-semibold">Description</th>
                  <th className="text-right py-2 font-semibold w-16">Qty</th>
                  <th className="text-right py-2 font-semibold w-24">Rate</th>
                  <th className="text-right py-2 font-semibold w-28">Amount</th>
                </tr>
              </thead>
              <tbody>
                {items.filter(it => it.desc || it.rate).map((it, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-2.5 text-gray-700">{it.desc || '—'}</td>
                    <td className="py-2.5 text-right text-gray-600">{parseFloat(it.qty) || 0}</td>
                    <td className="py-2.5 text-right text-gray-600">{fmt(it.rate)}</td>
                    <td className="py-2.5 text-right font-semibold text-gray-800">{fmt(lineTotal(it))}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end mt-4">
              <div className="w-full sm:w-64 space-y-1.5 text-sm">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>{fmt(subtotal)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Tax ({parseFloat(taxRate) || 0}%)</span><span>{fmt(taxAmount)}</span></div>
                <div className="flex justify-between text-lg font-black text-blue-700 border-t border-gray-200 pt-2"><span>Total Due</span><span>{fmt(total)}</span></div>
              </div>
            </div>
          </div>

          {notes && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Notes</p>
              <p className="text-sm text-gray-600 whitespace-pre-line">{notes}</p>
            </div>
          )}

          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              Generated by MyFreePayStub.com · Free Invoice Generator
            </p>
          </div>
        </div>
      )}

      {/* SEO content */}
      <div className="mt-10 space-y-6 text-sm text-gray-600 print:hidden">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">How to Create an Invoice for Free</h2>
          <ol className="space-y-2 list-decimal list-inside text-gray-600">
            {[
              'Enter your business details and your client\'s billing information',
              'Add an invoice number, issue date, and due date',
              'List your products or services with quantity and rate — totals calculate automatically',
              'Add a tax rate and any notes or payment terms',
              'Click "Print / Save PDF" to download — completely free, no watermark',
            ].map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="text-base font-bold text-gray-800 mb-3">Who Uses This Invoice Generator?</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '💻', title: 'Freelancers', desc: 'Bill clients for design, writing, dev work' },
              { icon: '🛠️', title: 'Contractors', desc: 'Invoice for trades, projects, and services' },
              { icon: '🏪', title: 'Small Businesses', desc: 'Send professional invoices without software' },
              { icon: '🚗', title: 'Gig Workers', desc: 'Document work for clients and platforms' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-gray-50 rounded-xl p-3">
                <p className="text-lg mb-1">{icon}</p>
                <p className="font-semibold text-gray-800 text-sm">{title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        <RelatedTools current="/invoice-generator" />

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
          ℹ️ Need to estimate the taxes on this income? Try our{' '}
          <a href="/self-employment-tax-calculator" className="underline font-semibold">Self-Employment Tax Calculator</a>.
        </div>
      </div>
    </div>
  )
}
