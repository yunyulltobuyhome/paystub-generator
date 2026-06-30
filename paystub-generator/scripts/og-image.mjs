// Generates public/og-image.png (1200×630) for social sharing.
// Run: node scripts/og-image.mjs  (needs Playwright + Chromium available)

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT = path.resolve(__dirname, '../public/og-image.png')

const HTML = `<!doctype html><html><head><meta charset="utf-8"><style>
  *{margin:0;box-sizing:border-box;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif}
  .card{width:1200px;height:630px;background:linear-gradient(135deg,#2563eb,#1e3a8a);
    color:#fff;display:flex;flex-direction:column;justify-content:center;padding:80px}
  .brand{font-size:40px;font-weight:900;margin-bottom:28px}
  .brand .a{color:#fff}.brand .b{color:#bfdbfe}
  h1{font-size:78px;font-weight:900;line-height:1.05;letter-spacing:-1px;margin-bottom:24px}
  p{font-size:34px;color:#dbeafe;font-weight:500;margin-bottom:40px}
  .pills{display:flex;flex-wrap:wrap;gap:14px}
  .pill{background:rgba(255,255,255,.18);border-radius:999px;padding:12px 24px;font-size:26px;font-weight:600}
</style></head><body>
  <div class="card">
    <div class="brand"><span class="a">MyFree</span><span class="b">PayStub</span></div>
    <h1>Free Pay Stub<br/>Generator 2026</h1>
    <p>Pay stubs · paycheck, 1099 &amp; bonus tax · invoices — all 50 states</p>
    <div class="pills">
      <div class="pill">✅ No Sign-Up</div>
      <div class="pill">✅ No Watermark</div>
      <div class="pill">✅ Instant PDF</div>
    </div>
  </div>
</body></html>`

const { chromium } = await import('playwright')
const launchOpts = {}
if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) launchOpts.executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH
const browser = await chromium.launch(launchOpts)
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(HTML, { waitUntil: 'networkidle' })
await page.screenshot({ path: OUT })
await browser.close()
console.log('wrote', OUT)
