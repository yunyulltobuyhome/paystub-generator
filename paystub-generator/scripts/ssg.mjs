// Static-site generation (SSG) for every route, using pure Node +
// ReactDOMServer — no headless browser, no new dependencies, so it cannot
// break the Cloudflare Pages build the way the old Playwright prerenderer did.
//
// Why: AdSense's "low value content" review (and any non-JS crawler) sees the
// raw HTML. A client-rendered SPA serves an empty <div id="root"> shell, which
// reads as a contentless site. After this script runs, every page is a full
// static HTML document; React hydrates it on load for interactivity.
//
// Defensive: any failure logs a warning and exits 0, leaving the plain SPA
// build (with its _redirects fallback) fully deployable.

import { execSync } from 'node:child_process'
import { promises as fs } from 'node:fs'
import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const SITE = 'https://myfreepaystub.com'

const slugify = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;')

async function buildRoutes() {
  const { STATE_TAXES } = await import(pathToFileURL(path.join(ROOT, 'src/data/stateTaxRates.js')))
  const { NICHE_CONTENT } = await import(pathToFileURL(path.join(ROOT, 'src/data/nicheContent.js')))

  // route -> { title, desc, canonical? } — titles/descriptions mirror what each
  // component sets via usePageMeta so hydration doesn't change anything visible.
  const routes = {
    '/': {
      title: 'Free Pay Stub Generator 2026 — No Sign-Up, Instant PDF | MyFreePayStub',
      desc: 'Generate professional pay stubs instantly for free. Automatic 2026 federal & state tax calculations for all 50 states. No sign-up required. Download PDF in seconds.',
    },
    '/paycheck-calculator': {
      title: 'Free Paycheck Calculator 2026 — Take-Home Pay, All 50 States | MyFreePayStub',
      desc: 'Free paycheck calculator for 2026. Estimate your take-home pay after federal, state, Social Security, and Medicare taxes. Salary or hourly, all 50 states. No sign-up.',
    },
    '/hourly-to-salary-calculator': {
      title: 'Hourly to Salary Calculator — Convert Wage to Annual Income | MyFreePayStub',
      desc: 'Free hourly to salary calculator. Convert your hourly wage to annual, monthly, weekly, and bi-weekly salary — or salary back to hourly. Instant results.',
    },
    '/overtime-calculator': {
      title: 'Overtime Pay Calculator 2026 — Time-and-a-Half & Double Time | MyFreePayStub',
      desc: 'Free overtime pay calculator. Work out time-and-a-half (1.5×) or double-time (2×) pay from your hourly rate and overtime hours, with weekly and annual totals. 2026 FLSA rules.',
    },
    '/bonus-tax-calculator': {
      title: 'Bonus Tax Calculator 2026 — How Much Tax on a Bonus? | MyFreePayStub',
      desc: 'Free bonus tax calculator for 2026. See how much federal tax, Social Security, Medicare, and state tax come out of your bonus using the IRS 22% supplemental method — and your take-home.',
    },
    '/self-employment-tax-calculator': {
      title: 'Self-Employment Tax Calculator 2026 — 1099 & Quarterly Estimated Taxes | MyFreePayStub',
      desc: 'Free 2026 self-employment tax calculator for 1099 contractors, freelancers, and gig workers. Estimate SE tax, federal & state income tax, and your quarterly estimated tax payments. No sign-up.',
    },
    '/1099-tax-calculator': {
      title: 'Self-Employment Tax Calculator 2026 — 1099 & Quarterly Estimated Taxes | MyFreePayStub',
      desc: 'Free 2026 self-employment tax calculator for 1099 contractors, freelancers, and gig workers. Estimate SE tax, federal & state income tax, and your quarterly estimated tax payments. No sign-up.',
      canonical: '/self-employment-tax-calculator',
    },
    '/invoice-generator': {
      title: 'Free Invoice Generator 2026 — Create & Download Invoices (No Sign-Up) | MyFreePayStub',
      desc: 'Free online invoice generator for freelancers, contractors & small businesses. Create professional invoices, add line items and tax, then download as PDF. No sign-up, no watermark, unlimited.',
    },
    '/employment-verification-letter': {
      title: 'Free Employment Verification Letter Generator (2026) | MyFreePayStub',
      desc: 'Create a professional employment verification letter template for free — for rental, loan, or general verification. Fill in the details, preview, and download as PDF. No sign-up.',
    },
    '/income-verification-packet': {
      title: 'Income Verification Packet Builder — Organize Proof of Income (2026) | MyFreePayStub',
      desc: 'Turn your self-reported income into a clean, professional income verification packet — built for freelancers, rideshare and delivery drivers, and gig workers. Free, no sign-up, nothing leaves your browser.',
    },
    '/multiple-paystubs': {
      title: 'Free Paystub Generator with YTD — Create Multiple Pay Stubs at Once (2026)',
      desc: 'Generate multiple pay stubs at once with automatic year-to-date (YTD) totals. Free, no sign-up, no watermark. Weekly, bi-weekly, semi-monthly & monthly pay periods.',
    },
    '/states': {
      title: 'Pay Stub & Paycheck Tax Guides for All 50 States (2026) | MyFreePayStub',
      desc: "State-by-state paycheck tax guides for 2026 — find your state's income tax rate, take-home pay examples, and pay stub requirements, then create a free pay stub.",
    },
    '/guides': {
      title: 'Payroll & Tax Guides (2026) | MyFreePayStub',
      desc: 'Free guides on pay stubs, payroll taxes, FICA, overtime, and proof of income — updated for 2026.',
    },
    '/guides/how-to-read-your-pay-stub': {
      title: 'How to Read Your Pay Stub: A Complete 2026 Guide | MyFreePayStub',
      desc: 'Understand every line on your pay stub — gross pay, federal & state tax, Social Security, Medicare, pre-tax deductions, net pay, and YTD totals — explained for 2026.',
    },
    '/guides/what-is-fica-tax': {
      title: 'What Is FICA Tax? Social Security & Medicare Explained (2026) | MyFreePayStub',
      desc: 'FICA is 7.65% of every paycheck. Learn what Social Security and Medicare taxes fund, the 2026 rates and $184,500 wage base, and how FICA works for the self-employed.',
    },
    '/guides/federal-vs-state-income-tax': {
      title: "Federal vs State Income Tax: What's the Difference? (2026) | MyFreePayStub",
      desc: '2026 federal tax brackets, state income tax rates for all 50 states, and a side-by-side comparison of living in a no-tax vs high-tax state.',
    },
    '/guides/pay-stub-vs-w2': {
      title: "Pay Stub vs W-2: What's the Difference? | MyFreePayStub",
      desc: 'Pay stubs and W-2s both relate to your earnings but serve different purposes. Learn when you need each one and how they differ.',
    },
    '/guides/how-to-calculate-overtime': {
      title: 'How to Calculate Overtime Pay (2026 FLSA Rules) | MyFreePayStub',
      desc: 'Federal overtime rules for 2026: how to calculate time-and-a-half, who is exempt, the FLSA 40-hour rule, and how state overtime laws differ.',
    },
    '/guides/what-is-ytd-on-a-paycheck': {
      title: 'What Is YTD on a Paycheck? Year-to-Date Explained (2026) | MyFreePayStub',
      desc: 'YTD means year-to-date — the running total of your gross pay, taxes, and deductions for the year. Learn what each YTD figure on your pay stub means and why it matters.',
    },
    '/guides/how-many-pay-stubs-for-apartment': {
      title: 'How Many Pay Stubs Do You Need to Rent an Apartment? (2026) | MyFreePayStub',
      desc: "How many pay stubs landlords require for a rental application, the 3× rent income rule, proof-of-income alternatives, and what to do if you're self-employed.",
    },
    '/guides/gross-vs-net-pay': {
      title: "Gross Pay vs Net Pay: What's the Difference? (2026) | MyFreePayStub",
      desc: 'Gross pay is before deductions; net pay is your take-home. Learn how taxes and deductions turn gross into net, with a worked 2026 example.',
    },
    '/guides/pay-stub-abbreviations': {
      title: 'Pay Stub Abbreviations Explained (2026 Cheat Sheet) | MyFreePayStub',
      desc: 'Confused by the codes on your pay stub? A plain-English cheat sheet for YTD, FICA, OASDI, FED, SIT, 401(k), and every common pay stub abbreviation.',
    },
    '/how-to-prove-income': {
      title: 'How to Prove Income as a Freelancer or Gig Worker (2026) | MyFreePayStub',
      desc: 'Guides on proving income without pay stubs — for freelancers, rideshare and delivery drivers, online sellers, and other self-employed workers. Free income verification packet builder included.',
    },
    '/how-to-prove-income/what-is-an-income-verification-packet': {
      title: 'What Is an Income Verification Packet? (2026 Guide) | MyFreePayStub',
      desc: "An income verification packet organizes self-reported income into a professional PDF for rental applications, loans, and more. Here's what's included and who needs one.",
    },
    '/how-to-prove-income/proof-of-income-for-freelancers': {
      title: 'Proof of Income for Freelancers: A Complete Guide (2026) | MyFreePayStub',
      desc: 'How freelancers can document income for rental applications, loans, and other income requests — without traditional pay stubs. What to include, how many months to show, and free tools to help.',
    },
    '/how-to-prove-income/proof-of-income-without-pay-stubs': {
      title: 'How to Show Proof of Income Without Pay Stubs (2026) | MyFreePayStub',
      desc: "Self-employed, freelance, or gig income? Here's how to document your income for rental applications and loans without traditional pay stubs.",
    },
    '/how-to-prove-income/profit-and-loss-statement-for-gig-workers': {
      title: 'Profit and Loss Statement for Gig Workers: What It Is (2026) | MyFreePayStub',
      desc: 'What a profit and loss (P&L) statement is, why gig workers and freelancers use one, common expense categories, and how to prepare one for income verification.',
    },
    '/about': {
      title: 'About MyFreePayStub — Free Pay Stub & Tax Tools',
      desc: 'MyFreePayStub offers free pay stub, invoice, and tax tools for US employees, freelancers, contractors, and small businesses — no sign-up, no watermark. Learn who we are and how the site is funded.',
    },
    '/contact': {
      title: 'Contact Us — MyFreePayStub',
      desc: 'Contact the MyFreePayStub team. Report a tax-rate error, request a feature, ask a privacy/GDPR question, or get help with our free pay stub and tax tools. We reply within 24–48 hours.',
    },
    '/privacy': {
      title: 'Privacy Policy — MyFreePayStub',
      desc: 'How MyFreePayStub handles your data: tool inputs stay in your browser, our use of cookies and Google AdSense, personalised-ads opt-out options, and your GDPR/CCPA privacy rights.',
    },
    '/terms': {
      title: 'Terms of Service — MyFreePayStub',
      desc: "The terms governing use of MyFreePayStub's free pay stub generator, invoice generator, and tax calculators, including acceptable use, disclaimers, and limitation of liability.",
    },
  }

  for (const s of Object.values(STATE_TAXES)) {
    routes[`/pay-stub/${slugify(s.name)}`] = {
      title: `${s.name} Pay Stub & Paycheck Taxes (2026) — Free Generator | MyFreePayStub`,
      desc: `${s.name} paycheck taxes for 2026: state income tax rate, federal & FICA withholding, a sample take-home breakdown, pay stub requirements, and a free ${s.name} pay stub generator.`,
    }
  }

  for (const [slug, n] of Object.entries(NICHE_CONTENT)) {
    routes[`/for/${slug}`] = {
      title: `Proof of Income for ${n.label} (2026) | MyFreePayStub`,
      desc: `How ${n.label.toLowerCase()} can show proof of income for rental applications and loans — where to find your ${n.platforms} earnings records, and how to organize them into a free income verification packet.`,
    }
  }

  // Embed pages must resolve as static files once the SPA fallback is removed.
  // They are noindex + robots-disallowed, so no meta overrides needed.
  for (const t of ['paycheck-calculator', 'hourly-to-salary-calculator', 'overtime-calculator', 'bonus-tax-calculator', 'self-employment-tax-calculator']) {
    routes[`/embed/${t}`] = null
  }

  return routes
}

function applyMeta(template, meta, routePath) {
  let out = template
  if (meta) {
    out = out.replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(meta.title)}</title>`)
    out = out.replace(/(<meta name="description" content=")[^"]*(")/, (_, a, b) => a + esc(meta.desc) + b)
    out = out.replace(/(<meta property="og:title" content=")[^"]*(")/, (_, a, b) => a + esc(meta.title) + b)
    out = out.replace(/(<meta name="twitter:title" content=")[^"]*(")/, (_, a, b) => a + esc(meta.title) + b)
    out = out.replace(/(<meta property="og:description" content=")[^"]*(")/, (_, a, b) => a + esc(meta.desc) + b)
    out = out.replace(/(<meta name="twitter:description" content=")[^"]*(")/, (_, a, b) => a + esc(meta.desc) + b)
  }
  const canonicalPath = meta?.canonical ?? routePath
  out = out.replace(/(<link rel="canonical" href=")[^"]*(")/, (_, a, b) => a + SITE + (canonicalPath === '/' ? '/' : canonicalPath) + b)
  out = out.replace(/(<meta property="og:url" content=")[^"]*(")/, (_, a, b) => a + SITE + (canonicalPath === '/' ? '' : canonicalPath) + b)
  return out
}

async function main() {
  // 1. Build the SSR bundle (pure Node — no browser involved).
  execSync('npx vite build --ssr src/entry-server.jsx --outDir dist/server --emptyOutDir', {
    cwd: ROOT, stdio: 'inherit',
  })
  const { render } = await import(pathToFileURL(path.join(DIST, 'server/entry-server.js')))

  const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8')
  if (!template.includes('<div id="root"></div>')) {
    throw new Error('dist/index.html missing empty #root mount point')
  }

  const routes = await buildRoutes()
  let count = 0

  for (const [route, meta] of Object.entries(routes)) {
    const appHtml = await render(route)
    if (!appHtml || appHtml.length < 500) throw new Error(`suspiciously empty render for ${route}`)
    let html = applyMeta(template, meta, route)
    html = html.replace('<div id="root"></div>', () => `<div id="root">${appHtml}</div>`)
    // Flat <route>.html files: Cloudflare Pages serves /foo directly from
    // foo.html with NO trailing-slash redirect, so the served URL always
    // matches the canonical exactly. (foo/index.html would 308 to /foo/.)
    const outFile = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${route.slice(1)}.html`)
    await fs.mkdir(path.dirname(outFile), { recursive: true })
    await fs.writeFile(outFile, html)
    count++
  }

  // 2. Real 404 page: render the catch-all NotFound route. With 404.html
  // present and no /* redirect, Cloudflare Pages serves unknown URLs with a
  // real 404 status instead of a soft-404 200.
  const nfHtml = await render('/__not_found__')
  let nf = applyMeta(template, { title: 'Page Not Found (404) — MyFreePayStub', desc: 'The page you are looking for does not exist. Try one of our free pay stub and tax tools instead.' }, '/')
  nf = nf.replace(/(<meta name="robots" content=")[^"]*(")/, (_, a, b) => a + 'noindex, follow' + b)
  nf = nf.replace('<div id="root"></div>', () => `<div id="root">${nfHtml}</div>`)
  await fs.writeFile(path.join(DIST, '404.html'), nf)

  // 3. Every real route now exists as a static file, so drop the SPA
  // catch-all rewrite (it would force 200s for garbage URLs) and the
  // server-only bundle (it must not be publicly served).
  rmSync(path.join(DIST, '_redirects'), { force: true })
  rmSync(path.join(DIST, 'server'), { recursive: true, force: true })

  console.log(`[ssg] rendered ${count} routes + 404.html; removed SPA fallback.`)
}

main().catch((e) => {
  console.warn('[ssg] non-fatal failure — keeping plain SPA build:', e.message)
  // Ensure the SPA fallback survives if we bailed mid-way.
  if (!existsSync(path.join(DIST, '_redirects'))) {
    try {
      execSync('cp public/_redirects dist/_redirects', { cwd: ROOT })
    } catch { /* public/_redirects missing — nothing to restore */ }
  }
  rmSync(path.join(DIST, 'server'), { recursive: true, force: true })
  rmSync(path.join(DIST, '404.html'), { force: true })
  process.exit(0)
})
