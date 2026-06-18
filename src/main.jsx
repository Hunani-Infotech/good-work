import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SiteProvider } from './context/SiteContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SiteProvider>
        <App />
      </SiteProvider>
    </BrowserRouter>
  </StrictMode>
);
