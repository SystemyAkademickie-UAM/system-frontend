import { StrictMode } from 'react';
import { RouterProvider } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import { SessionProvider } from './context/SessionContext.jsx';
import { UserProfileProvider } from './context/UserProfileContext.jsx';
import { ToastProvider } from './components/ui/Toast/Toast.jsx';
import { AppRoleProvider } from './context/AppRoleContext.jsx';
import { createAppRouter } from './routes/createAppRouter.jsx';
import './styles/tokens.css';
import './styles/messages.css';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element #root not found');
}

const router = createAppRouter();

createRoot(rootElement).render(
  <StrictMode>
    <SessionProvider>
      <UserProfileProvider>
        <ToastProvider>
          <AppRoleProvider>
            <RouterProvider router={router} />
          </AppRoleProvider>
        </ToastProvider>
      </UserProfileProvider>
    </SessionProvider>
  </StrictMode>,
);
