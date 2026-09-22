import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import App from './App';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Pre-rendered pages (production) are hydrated; in dev we render normally.
if (container.firstElementChild) hydrateRoot(container, app);
else createRoot(container).render(app);
