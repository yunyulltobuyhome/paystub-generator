import { useEffect, useRef } from 'react'
import { AD_CLIENT } from '../config/ads'

// Renders a responsive AdSense display unit. Renders nothing until a slot ID is
// provided (see src/config/ads.js), so empty placements never ship broken units.
// Hidden in print.
export default function AdSlot({ slot, format = 'auto', className = '' }) {
  const pushed = useRef(false)

  useEffect(() => {
    if (!slot || pushed.current) return
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      pushed.current = true
    } catch { /* adsbygoogle not ready yet — ignore */ }
  }, [slot])

  if (!slot) return null

  return (
    // min-height reserves space so the ad loading in doesn't shift layout (CLS).
    <div className={`my-6 text-center print:hidden ${className}`} style={{ minHeight: 280 }}>
      <p className="text-[10px] uppercase tracking-wide text-gray-300 mb-1">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: 250 }}
        data-ad-client={AD_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
