import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import { AuthProvider } from './contexts/AuthContext'
import { captureQuickActionFromUrl } from './lib/quickAction'
import './index.css'
import App from './App.tsx'

captureQuickActionFromUrl()
registerSW({ immediate: true })

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
