// Google AdSense configuration.
//
// The publisher (client) ID below matches the AdSense script in index.html.
// To turn on MANUAL ad units at the high-value spots (calculator/generator
// result screens), create display ad units in your AdSense dashboard and paste
// each unit's data-ad-slot ID below. Until a slot ID is filled in, that <AdSlot>
// renders nothing — so the live site stays clean and policy-safe.
//
// (Page-level "Auto ads" already run from the script in index.html regardless.)

export const AD_CLIENT = 'ca-pub-6079116585044991'

export const AD_SLOTS = {
  // Shown right after a result/preview is generated — the golden impression moment.
  result: '', // e.g. '1234567890'
  // In-content unit placed mid-article on long, high-traffic pages (salary pages,
  // long guides). High viewability = higher RPM. Also inert until a slot ID is set.
  article: '', // e.g. '1234567890'
}
