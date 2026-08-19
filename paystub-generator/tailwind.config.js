/** @type {import('tailwindcss').Config} */

// Design tokens.
//
// The palette deliberately OVERRIDES Tailwind's stock `blue` and `gray` rather
// than adding a new brand colour alongside them. Roughly 230 places in the app
// already say text-blue-600 / bg-blue-50 / border-gray-200, and rerouting those
// names is what lets a single file restyle every page instead of editing 269 of
// them. Anything that reads "blue" in a component is therefore brand navy.
//
// The hues are pulled toward ink and desaturated on purpose: stock blue-600
// (#2563eb) is the single most recognisable "generated with Tailwind" signal,
// and a money tool reads as more credible in a calmer register.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand navy. Occupies the `blue` namespace.
        blue: {
          50:  '#f3f6fc',
          100: '#e5ebf7',
          200: '#c9d6ee',
          300: '#9db3de',
          400: '#6a89c9',
          500: '#4666b0',
          600: '#2f4a8f',  // primary — buttons, links, active nav
          700: '#273c73',
          800: '#1f2f5a',
          900: '#172343',
          950: '#0e162c',
        },
        // Cool ink neutrals, a touch bluer and softer than stock gray.
        gray: {
          50:  '#f8f9fb',
          100: '#f1f3f7',
          200: '#e4e7ee',
          300: '#cdd3de',
          400: '#98a1b2',
          500: '#6c7687',
          600: '#4e5768',
          700: '#3a4351',
          800: '#252c38',
          900: '#161b24',
          950: '#0d1017',
        },
        // Muted so a positive result reads as confident, not celebratory.
        emerald: {
          50:  '#f2f9f5',
          100: '#e2f2e9',
          200: '#c2e3d2',
          300: '#93cbb1',
          400: '#5daa8a',
          500: '#3a8b6b',
          600: '#2b6f55',
          700: '#235845',
          800: '#1d4638',
          900: '#183a2f',
        },
        // Warnings should be legible, not alarming — this sits closer to clay.
        amber: {
          50:  '#fdf8f0',
          100: '#faeedb',
          200: '#f3dab4',
          300: '#e8bd83',
          400: '#db9b53',
          500: '#c87f33',
          600: '#a86228',
          700: '#874c24',
          800: '#6e3e23',
          900: '#5c351f',
        },
      },
      fontFamily: {
        // A distinctive grotesque rather than the system stack. The fallbacks
        // are real faces, so the page is still readable if the webfont fails.
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', '-apple-system',
               '"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        // Large bold headings need negative tracking to stop looking airy.
        tightest: '-0.03em',
      },
      borderRadius: {
        // Slightly squarer than the stock 1rem `2xl`; reads less "app template".
        '2xl': '0.875rem',
      },
    },
  },
  plugins: [],
}
