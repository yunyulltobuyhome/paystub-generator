import { STATE_TAXES } from '../data/stateTaxRates'

// Build SEO-friendly slugs from state names: "Washington D.C." -> "washington-dc"
export const slugify = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

export const STATE_LIST = Object.entries(STATE_TAXES).map(([code, s]) => ({
  code,
  name: s.name,
  rate: s.rate,
  slug: slugify(s.name),
}))

export const getStateBySlug = (slug) => STATE_LIST.find((s) => s.slug === slug) || null

// Nine states with no state income tax (for content + internal cross-linking)
export const NO_INCOME_TAX_CODES = ['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY']

// Approximate 2026 state minimum wage (USD/hour). States at the federal floor
// show 7.25. These are approximate — always verify with the state labor dept.
export const FEDERAL_MIN_WAGE = 7.25
export const STATE_MIN_WAGE = {
  AL: 7.25, AK: 11.91, AZ: 14.70, AR: 11.00, CA: 16.50, CO: 14.81, CT: 16.35, DE: 15.00,
  FL: 14.00, GA: 7.25, HI: 14.00, ID: 7.25, IL: 15.00, IN: 7.25, IA: 7.25, KS: 7.25,
  KY: 7.25, LA: 7.25, ME: 14.65, MD: 15.00, MA: 15.00, MI: 10.56, MN: 11.13, MS: 7.25,
  MO: 13.75, MT: 10.55, NE: 13.50, NV: 12.00, NH: 7.25, NJ: 15.49, NM: 12.00, NY: 16.50,
  NC: 7.25, ND: 7.25, OH: 10.70, OK: 7.25, OR: 14.70, PA: 7.25, RI: 15.00, SC: 7.25,
  SD: 11.50, TN: 7.25, TX: 7.25, UT: 7.25, VT: 14.01, VA: 12.41, WA: 16.66, WV: 8.75,
  WI: 7.25, WY: 7.25, DC: 17.50,
}
