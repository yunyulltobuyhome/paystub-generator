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
