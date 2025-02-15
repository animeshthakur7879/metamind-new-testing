import React , { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { UserProvider } from './UserContext'; // Adjust path if needed

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <App/>
    </UserProvider>
  </StrictMode>,
)
