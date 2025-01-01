// index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Add a global CSS to remove default body margin and padding
document.body.style.margin = '0';
document.body.style.padding = '0';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    {
      /**
       * in dev, use:
       * <BrowserRouter>
       * 
       * in prod (meaning before building), change to:
       * <BrowserRouter basename="/iz4">
       */
    }
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);


