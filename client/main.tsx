import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
// ensure API base polyfill runs before app code
import './lib/api-base'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
