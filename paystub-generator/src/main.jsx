import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root')
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// Pages prerendered by scripts/ssg.mjs arrive with real HTML inside #root —
// hydrate it so React attaches to the existing markup instead of re-rendering
// a blank shell. Dev server and any non-prerendered fallback still use createRoot.
if (container.hasChildNodes()) {
  hydrateRoot(container, app)
} else {
  createRoot(container).render(app)
}
