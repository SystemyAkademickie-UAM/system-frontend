import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { AppRoleProvider } from './context/AppRoleContext.jsx';
import { createAppRouter } from './routes/createAppRouter.jsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

const router = createAppRouter();

createRoot(rootElement).render(
  <StrictMode>
    <AppRoleProvider>
      <RouterProvider router={router} />
    </AppRoleProvider>
  </StrictMode>,
);
