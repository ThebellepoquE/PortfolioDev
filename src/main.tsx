import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initThemeFromPreferences, activateAsyncFonts } from './bootstrap'
import './styles/main.scss'
import App from './App.tsx'

// Inicializar tema y fuentes async antes de montar React
initThemeFromPreferences()
activateAsyncFonts()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
