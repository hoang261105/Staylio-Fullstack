import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "leaflet/dist/leaflet.css";
import { ThemeProvider } from './components/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="staylio-user-theme">
      <App />
    </ThemeProvider>
  </StrictMode>,
)
