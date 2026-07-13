// Real, distinct content per niche for /for/:niche — not thin/duplicated copy.
// `occupationPreset` maps to the matching value in incomePacketPresets.js OCCUPATIONS,
// used to preselect Step 1 of the builder when a visitor clicks through.
export const NICHE_CONTENT = {
  'uber-drivers': {
    label: 'Uber & Lyft Drivers',
    icon: '🚗',
    platforms: 'Uber and Lyft',
    occupationPreset: 'rideshare',
    intro: 'Rideshare income is paid out weekly and can swing a lot from week to week — busy weekends look nothing like a slow Tuesday. That makes a single pay statement a poor way to show a landlord or lender what you actually earn.',
    records: [
      'Both apps have an in-app "Earnings" or "Tax Summary" section showing weekly and year-to-date totals.',
      'You may receive a 1099-K (from the platform) and/or a 1099-NEC (for bonuses, referrals) at year-end.',
      'Weekly direct deposit summaries are downloadable from your driver dashboard.',
    ],
    scenario: 'Most landlords want to see a consistent monthly picture, not individual weekly swings. Averaging 3-6 months of driving income into a single packet makes an up-and-down schedule easy to evaluate.',
    faq: [
      { q: 'How do I find my Uber or Lyft earnings history?', a: 'Open the driver app and go to your Earnings or Account tab — both Uber and Lyft show weekly summaries and let you view or export historical totals.' },
      { q: 'Do I need a 1099 to build an income packet?', a: 'No. You can enter your income directly from your in-app earnings history. A 1099 is useful as backup documentation but isn\'t required to use the builder.' },
    ],
  },
  'doordash': {
    label: 'DoorDash & Delivery Drivers',
    icon: '🛵',
    platforms: 'DoorDash, Grubhub, and Uber Eats',
    occupationPreset: 'delivery',
    intro: 'Delivery pay combines a base fee, promotions, and customer tips, which can make a single statement hard to read at a glance. Seasonal demand also means your income may look different month to month.',
    records: [
      'Delivery apps show weekly payout summaries in-app, including base pay, promotions, and tips.',
      'Most platforms provide a 1099-NEC or 1099-K at year-end once you cross their reporting threshold.',
      'Weekly direct deposits can be exported or screenshotted from your driver dashboard as backup.',
    ],
    scenario: 'Because tips and promotions vary so much, a packet that totals everything into a clean monthly figure is much easier for a landlord or lender to evaluate than a stack of individual weekly payout screenshots.',
    faq: [
      { q: 'Should I include tips in my income packet?', a: 'Yes — enter your total payout for each month, including base pay, promotions, and tips, since that\'s your actual take-home income.' },
      { q: 'What if I deliver for more than one app?', a: 'List each platform as a separate income source in Step 2, and enter your combined monthly totals — the packet will summarize everything together.' },
    ],
  },
  'instacart': {
    label: 'Instacart & Shipt Shoppers',
    icon: '🛒',
    platforms: 'Instacart and Shipt',
    occupationPreset: 'delivery',
    intro: 'Shopper pay is a mix of batch pay and customer tips, and busy holiday weeks can look very different from a quiet month. A landlord reading a raw payment history may not easily see your typical monthly income.',
    records: [
      'The Instacart and Shipt apps both show an earnings or payments history with batch-by-batch detail.',
      'Instacart provides a 1099-K or 1099-NEC once you cross the platform\'s reporting threshold.',
      'You can typically download a CSV or PDF summary of your payment history from your account settings.',
    ],
    scenario: 'Combining several months of batch pay and tips into one monthly summary gives a clearer, steadier income picture than a long list of individual batches.',
    faq: [
      { q: 'How do I total my Instacart or Shipt earnings by month?', a: 'Check your in-app payments history or download your CSV export, then add up all payouts received within each calendar month.' },
      { q: 'Can I list Instacart as an income source in the packet?', a: 'Yes — add it under Income Sources in Step 2 along with the payment type shown on your 1099 (1099-K or 1099-NEC), if you received one.' },
    ],
  },
  'upwork-freelancers': {
    label: 'Upwork & Freelance Platform Workers',
    icon: '💻',
    platforms: 'Upwork, Fiverr, and similar freelance platforms',
    occupationPreset: 'freelance-designer',
    intro: 'Freelancers often juggle several clients at once, each paying on a different schedule. A landlord or lender wants to see your combined monthly income across all of them — not five separate invoices.',
    records: [
      'Upwork and similar platforms let you export a full transaction/earnings history from your reports section.',
      'You may receive a 1099-K (from the platform) or 1099-NEC (from individual clients who paid you directly).',
      'Individual client invoices or contracts can serve as backup documentation for your income sources list.',
    ],
    scenario: 'The builder\'s income source list is especially useful here — list each client or platform separately, then let the packet total everything into one clear monthly figure.',
    faq: [
      { q: 'I have income from Upwork and direct clients — can I combine them?', a: 'Yes. Enter your total monthly income across all sources in Step 2, then list each client or platform individually under Income Sources for reference.' },
      { q: 'Do I need a business entity to use this tool?', a: 'No. Sole proprietors and LLCs can both use the builder — just select your business type in Step 1.' },
    ],
  },
  'etsy-sellers': {
    label: 'Etsy & Online Sellers',
    icon: '🛍️',
    platforms: 'Etsy, eBay, and similar marketplaces',
    occupationPreset: 'online-seller',
    intro: 'Online selling involves both revenue and real costs — materials, packaging, shipping, and platform fees — so gross sales alone can overstate what you actually take home.',
    records: [
      'Your shop\'s Finances or Payment Account tab shows deposits, fees, and a full transaction history.',
      'Etsy and similar marketplaces issue a 1099-K once you cross the platform\'s reporting threshold.',
      'A CSV export of orders and expenses is usually available from your shop\'s settings.',
    ],
    scenario: 'This is where the optional Profit & Loss step matters most: entering your material, shipping, and fee costs alongside your sales shows your real net income, not just gross revenue.',
    faq: [
      { q: 'Should I report gross sales or net profit?', a: 'Enter your gross monthly sales as income, then add your costs (materials, shipping, fees) in the Expenses step — the packet will calculate your net income automatically.' },
      { q: 'What if I sell on more than one platform?', a: 'List each marketplace as a separate income source in Step 2, and combine your totals across all platforms for each month.' },
    ],
  },
}

export const NICHE_LIST = Object.entries(NICHE_CONTENT).map(([slug, c]) => ({ slug, ...c }))
