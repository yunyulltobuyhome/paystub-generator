import { useState } from 'react'

// "Embed this calculator" box. Other sites paste the iframe, which carries a
// visible link back to myfreepaystub.com — free backlinks / domain authority.
// Hidden when the page is itself being shown inside an iframe.
export default function EmbedSnippet({ tool, title, height = 720 }) {
  const [copied, setCopied] = useState(false)

  const inIframe = typeof window !== 'undefined' && window.self !== window.top
  if (inIframe) return null

  const code = `<iframe src="https://myfreepaystub.com/embed/${tool}" width="100%" height="${height}" style="border:1px solid #e5e7eb;border-radius:12px;max-width:680px" title="${title} by MyFreePayStub" loading="lazy"></iframe>`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard unavailable */ }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 print:hidden">
      <h2 className="text-base font-bold text-gray-800 mb-1">Embed This Calculator (Free)</h2>
      <p className="text-xs text-gray-500 mb-3">
        Add this free {title.toLowerCase()} to your own website — just copy and paste the code below.
      </p>
      <textarea
        readOnly
        value={code}
        onFocus={(e) => e.target.select()}
        rows={3}
        className="w-full text-xs font-mono bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-600 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        onClick={copy}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
      >
        {copied ? '✓ Copied!' : 'Copy Embed Code'}
      </button>
    </div>
  )
}
