// Inline icon set.
//
// Replaces the emoji that were standing in for icons. Emoji render differently
// on every platform, cannot inherit colour or weight, and are the loudest
// visual tell of a generated template. These are drawn here rather than pulled
// from a library so there is no dependency and no bundle cost — they are just
// markup.
//
// One geometry for all of them: 24x24 box, 1.6 stroke, round caps, no fills.
// Consistency is what makes a set read as designed.

const P = (...d) => d.map((props, i) =>
  typeof props === 'string'
    ? <path key={i} d={props} />
    : <props.tag key={i} {...props.attrs} />)

const circle = (cx, cy, r) => ({ tag: 'circle', attrs: { cx, cy, r } })
const rect = (x, y, w, h, rx) => ({ tag: 'rect', attrs: { x, y, width: w, height: h, rx } })

const ICONS = {
  // Money & pay
  banknote: P(rect(2, 6, 20, 12, 2), circle(12, 12, 2.5), 'M6 12h.01M18 12h.01'),
  wallet: P('M19 7V5.5A1.5 1.5 0 0 0 17.5 4H5a2 2 0 0 0 0 4h14a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6', 'M17 13h.01'),
  coins: P(circle(8, 8, 5), 'M15.5 4.6a5 5 0 0 1 0 14.8M8 19a5 5 0 0 0 4.9-4'),
  gift: P(rect(3, 8, 18, 4, 1), 'M12 8v13M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7', 'M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8zM12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z'),

  // Time
  clock: P(circle(12, 12, 9), 'M12 7v5l3 2'),
  timer: P(circle(12, 13, 8), 'M12 9v4l2.5 1.5M9 2h6M12 5V2'),
  hourglass: P('M6 2h12M6 22h12', 'M6 2c0 4 4 6 6 10 2-4 6-6 6-10', 'M6 22c0-4 4-6 6-10 2 4 6 6 6 10'),
  calendar: P(rect(3, 5, 18, 16, 2), 'M3 10h18M8 3v4M16 3v4', 'M8 15h.01M12 15h.01M16 15h.01'),

  // Direction & change
  swap: P('M7 4 3 8l4 4', 'M3 8h13a4 4 0 0 1 0 8h-1', 'M17 20l4-4-4-4'),
  reverse: P('M3 12a9 9 0 1 0 3-6.7', 'M3 4v5h5'),
  trendUp: P('M3 17l6-6 4 4 7-7', 'M15 8h6v6'),
  scale: P('M12 4v16M7 8h10', 'M4 8l-2 6h4L4 8zM20 8l-2 6h4l-2-6z', 'M8 20h8'),

  // Documents
  file: P('M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5', 'M9 13h6M9 17h4'),
  files: P('M8 3h6l5 5v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z', 'M14 3v5h5', 'M4 7v12a2 2 0 0 0 2 2h9'),
  receipt: P('M5 3v18l2.5-1.5L10 21l2-1.5L14 21l2.5-1.5L19 21V3z', 'M9 8h6M9 12h6M9 16h3'),
  clipboard: P('M9 4H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2', rect(9, 2, 6, 4, 1), 'M9 12h6M9 16h4'),
  mail: P(rect(2, 5, 20, 14, 2), 'm2 7 10 6 10-6'),

  // Places & things
  bank: P('M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M2 21h20', 'm12 3 9 5H3z'),
  building: P(rect(4, 3, 16, 18, 2), 'M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01', 'M10 21v-3h4v3'),
  car: P('M5 13 6.6 8.4A2 2 0 0 1 8.5 7h7a2 2 0 0 1 1.9 1.4L19 13', 'M3 13h18v5H3z', circle(7.5, 18, 1.5), circle(16.5, 18, 1.5)),
  palm: P('M12 21V10', 'M12 10c0-3-2.5-5-5.5-4.5M12 10c0-3 2.5-5 5.5-4.5M12 10c-2.5-1.5-5-1-6.5 1M12 10c2.5-1.5 5-1 6.5 1', circle(12, 8, 1)),

  // Actions
  search: P(circle(11, 11, 7), 'm20 20-3.5-3.5'),
  chart: P('M3 3v18h18', 'M7 15v3M12 10v8M17 6v12'),
  shield: P('m12 3 8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z', 'm9 12 2 2 4-4'),
  compass: P(circle(12, 12, 9), 'm15.5 8.5-2 5.5-5.5 2 2-5.5z'),
}

export default function Icon({ name, className = 'w-5 h-5', strokeWidth = 1.6 }) {
  const paths = ICONS[name]
  if (!paths) return null
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths}
    </svg>
  )
}

export const ICON_NAMES = Object.keys(ICONS)
