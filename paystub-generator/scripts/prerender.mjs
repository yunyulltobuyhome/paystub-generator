// Build-safe prerenderer.
//
// After `vite build`, this loads each route in a real browser (Playwright) and
// writes the fully-rendered HTML — with the per-page <title>, meta description,
// canonical, and JSON-LD that usePageMeta injects — into dist/<route>/index.html.
// Crawlers then receive complete HTML instead of an empty SPA shell, which is
// what fixes "zero impressions" in Search Console. React still hydrates on load.
//
// It is intentionally defensive: if Playwright or Chromium isn't available
// (e.g. some CI environments), it logs a warning and exits 0 so the normal SPA
// build is never broken.

import http from 'node:http'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { STATE_TAXES } from '../src/data/stateTaxRates.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, '../dist')
const PORT = 4321

const slugify = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const GUIDES = [
  'how-to-read-your-pay-stub', 'what-is-ytd-on-a-paycheck', 'how-many-pay-stubs-for-apartment',
  'what-is-fica-tax', 'federal-vs-state-income-tax', 'pay-stub-vs-w2', 'how-to-calculate-overtime',
]

const ROUTES = [
  '/', '/paycheck-calculator', '/hourly-to-salary-calculator', '/overtime-calculator',
  '/bonus-tax-calculator', '/self-employment-tax-calculator', '/multiple-paystubs',
  '/invoice-generator', '/states', '/guides', '/about', '/contact', '/privacy', '/terms',
  ...GUIDES.map((g) => `/guides/${g}`),
  ...Object.values(STATE_TAXES).map((s) => `/pay-stub/${slugify(s.name)}`),
]

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.ico': 'image/x-icon',
  '.txt': 'text/plain', '.xml': 'application/xml', '.woff2': 'font/woff2',
}

// Static server with SPA fallback to index.html (mirrors Cloudflare Pages behaviour).
function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      try {
        const urlPath = decodeURIComponent(req.url.split('?')[0])
        let filePath = path.join(DIST, urlPath)
        const ext = path.extname(filePath)
        if (!ext) filePath = path.join(DIST, 'index.html') // SPA fallback
        const data = await fs.readFile(filePath)
        res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' })
        res.end(data)
      } catch {
        try {
          res.writeHead(200, { 'Content-Type': 'text/html' })
          res.end(await fs.readFile(path.join(DIST, 'index.html')))
        } catch { res.writeHead(404); res.end('not found') }
      }
    })
    server.listen(PORT, () => resolve(server))
  })
}

async function run() {
  let chromium
  try {
    ({ chromium } = await import('playwright'))
  } catch {
    console.warn('[prerender] Playwright not installed — skipping prerender (SPA build kept).')
    return
  }

  const server = await startServer()
  const launchOpts = {}
  if (process.env.PLAYWRIGHT_EXECUTABLE_PATH) launchOpts.executablePath = process.env.PLAYWRIGHT_EXECUTABLE_PATH

  let browser
  try {
    browser = await chromium.launch(launchOpts)
  } catch (e) {
    console.warn('[prerender] Could not launch Chromium — skipping prerender (SPA build kept).', e.message)
    server.close()
    return
  }

  const page = await browser.newPage()
  let ok = 0
  for (const route of ROUTES) {
    try {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle', timeout: 20000 })
      // Wait until the app has actually rendered into #root and set a title.
      await page.waitForFunction(() => {
        const r = document.getElementById('root')
        return r && r.childElementCount > 0 && !!document.title
      }, { timeout: 10000 }).catch(() => {})
      const html = await page.content()
      const outDir = route === '/' ? DIST : path.join(DIST, route)
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(path.join(outDir, 'index.html'), html)
      ok++
    } catch (e) {
      console.warn(`[prerender] skipped ${route}: ${e.message}`)
    }
  }

  await browser.close()
  server.close()
  console.log(`[prerender] wrote ${ok}/${ROUTES.length} routes to static HTML.`)
}

// Never fail the build because of prerendering.
run().catch((e) => {
  console.warn('[prerender] non-fatal error, keeping SPA build:', e.message)
  process.exit(0)
})
