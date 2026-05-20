import { useCallback, useEffect, useId, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { APP_ROLE, ROLE_UI_LABEL } from '../../navigation/shellTemplates.config.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import Sidebar from './Sidebar.jsx';
import SuperBar from './superbar/SuperBar.jsx';
import './AppShell.css';

const PLACEHOLDER_DISPLAY_NAME = 'NAZWA_GLOBALNA';

export default function AppShell() {
  const location = useLocation();
  const menuId = useId();
  const { role } = useAppRole();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const roleLabel = ROLE_UI_LABEL[role] ?? ROLE_UI_LABEL[APP_ROLE.STUDENT];

  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  const closeMobileNav = useCallback(() => {
    setIsMobileNavOpen(false);
  }, []);

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

      {isMobileNavOpen ? (
        <button
          type="button"
          className="app-shell__backdrop"
          aria-label="Zamknij menu nawigacji"
          tabIndex={-1}
          onClick={closeMobileNav}
        />
      ) : null}

      <div className="app-shell__layout">
        <div
          className={['app-shell__sidebar-wrap', isMobileNavOpen ? 'app-shell__sidebar-wrap--open' : '']
            .filter(Boolean)
            .join(' ')}
          id={menuId}
        >
          <Sidebar onNavigate={closeMobileNav} />
        </div>

        <div className="app-shell__main-column">
          <SuperBar
            displayName={PLACEHOLDER_DISPLAY_NAME}
            roleLabel={roleLabel}
            onNavigate={closeMobileNav}
            showMenuButton
            menuExpanded={isMobileNavOpen}
            onMenuToggle={() => setIsMobileNavOpen((open) => !open)}
          />
          <main id="main-content" className="app-shell__main" tabIndex={-1}>
            <div className="app-shell__content">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
