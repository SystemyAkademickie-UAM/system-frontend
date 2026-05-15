import { useCallback, useEffect, useId, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import './AppShell.css';

export default function AppShell() {
  const location = useLocation();
  const menuId = useId();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

  const onLogoutClick = useCallback(() => {
    // Integracja z API / SAML — w kolejnych iteracjach
    closeMobileNav();
  }, [closeMobileNav]);

  useEffect(() => {
    if (!isMobileNavOpen) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileNavOpen]);

  return (
    <div className="app-shell">
      <a className="app-shell__skip" href="#main-content">
        Przejdź do treści
      </a>

      <header className="app-shell__topbar">
        <button
          type="button"
          className="app-shell__menu-btn"
          aria-controls={menuId}
          aria-expanded={isMobileNavOpen}
          aria-label={isMobileNavOpen ? 'Zamknij menu nawigacji' : 'Otwórz menu nawigacji'}
          onClick={() => {
            setIsMobileNavOpen((open) => !open);
          }}
        >
          <span className="app-shell__menu-icon" aria-hidden="true" />
        </button>
        <span className="app-shell__topbar-title">MyAcademyQuest</span>
      </header>

      {isMobileNavOpen ? (
        <button
          type="button"
          className="app-shell__backdrop"
          aria-label="Zamknij menu nawigacji"
          tabIndex={-1}
          onClick={closeMobileNav}
        />
      ) : null}

      <div className="app-shell__body">
        <div
          className={['app-shell__sidebar-wrap', isMobileNavOpen ? 'app-shell__sidebar-wrap--open' : '']
            .filter(Boolean)
            .join(' ')}
          id={menuId}
        >
          <Sidebar onNavigate={closeMobileNav} onLogoutClick={onLogoutClick} />
        </div>

        <main id="main-content" className="app-shell__main" tabIndex={-1}>
          <div className="app-shell__content">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
