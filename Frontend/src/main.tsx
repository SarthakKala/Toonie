import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import DashBoard from './Pages/DashBoard/Dashboard.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashBoard/>
  </StrictMode>,
)
