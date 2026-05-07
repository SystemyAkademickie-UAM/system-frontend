import { useEffect, useState } from 'react';
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

export default function App() {
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
