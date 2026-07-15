// SSG entry — used only by scripts/ssg.mjs at build time (never shipped to the
// browser). Renders any route to an HTML string so every page is served as
// real, content-full static HTML instead of an empty SPA shell.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { Shell } from './App'

const LAZY_FALLBACK_MARKER = 'Loading…'

export async function render(url) {
  const app = (
    <StaticRouter location={url}>
      <Shell />
    </StaticRouter>
  )

  // React.lazy routes render their Suspense fallback on the first synchronous
  // pass. Rendering again after the lazy module's import promise settles
  // produces the real content, so retry a few ticks until the fallback is gone.
  let html = renderToString(app)
  for (let i = 0; i < 20 && html.includes(LAZY_FALLBACK_MARKER); i++) {
    await new Promise((resolve) => setTimeout(resolve, 25))
    html = renderToString(
      <StaticRouter location={url}>
        <Shell />
      </StaticRouter>
    )
  }
  return html
}
