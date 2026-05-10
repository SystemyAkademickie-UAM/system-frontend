import { useEffect, useState } from 'react';
import { AuthProvider } from './AuthContext.jsx';
import HomePage from './HomePage.jsx';
import TestPage from './TestPage.jsx';
import './App.css';

function readPathname() {
  if (typeof globalThis.location?.pathname !== 'string') {
    return '/';
  }
  const p = globalThis.location.pathname;
  return p === '' ? '/' : p;
}

function AppRouter() {
  const [pathname, setPathname] = useState(readPathname);

  useEffect(() => {
    const onPopState = () => setPathname(readPathname());
    globalThis.addEventListener('popstate', onPopState);
    return () => globalThis.removeEventListener('popstate', onPopState);
  }, []);

  if (pathname === '/test' || pathname.startsWith('/test/')) {
    return <TestPage />;
  }

  return <HomePage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
