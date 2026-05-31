import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { APP_ROLE, ROLE_UI_LABEL } from '../../navigation/shellTemplates.config.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import { useUserProfile } from '../../context/UserProfileContext.jsx';
import { useLeaderDisplayPreferences } from '../../hooks/useLeaderDisplayPreferences.js';
import { useStudentSuperBarStats } from '../../hooks/useStudentSuperBarStats.js';
import Sidebar from './Sidebar.jsx';
import SuperBar from './superbar/SuperBar.jsx';
import './AppShell.css';

/**
 * Buduje wyświetlaną nazwę użytkownika z danych sesji.
 * Priorytet: imię + nazwisko > email > placeholder
 */
function buildDisplayName(user) {
  if (!user) {
    return null;
  }
  const firstName = user.givenName || user.name || '';
  const lastName = user.surname || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (fullName) {
    return fullName;
  }
  if (user.email) {
    return user.email.split('@')[0];
  }
  return null;
}

export default function AppShell() {
  const location = useLocation();
  const menuId = useId();
  const { role } = useAppRole();
  const { user, isLoading: isSessionLoading } = useSession();
  const { profile, avatarUrl, isLoading: isProfileLoading } = useUserProfile();
  const { showNickname: leaderShowsNickname } = useLeaderDisplayPreferences();
  const { livesDisplay, currencyDisplay, totalEarnedDisplay, currencyLabel } = useStudentSuperBarStats();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const roleLabel = ROLE_UI_LABEL[role] ?? ROLE_UI_LABEL[APP_ROLE.STUDENT];
  const displayName = useMemo(() => {
    const nickname = profile?.nickname?.trim();
    const legalName = buildDisplayName(user);

    if (role === APP_ROLE.LECTURER && !leaderShowsNickname) {
      return legalName || nickname || 'Użytkownik';
    }

    if (nickname) {
      return nickname;
    }

    return legalName;
  }, [profile, user, role, leaderShowsNickname]);
  const isHeaderLoading = isSessionLoading || isProfileLoading;

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
            displayName={displayName}
            roleLabel={roleLabel}
            avatarUrl={avatarUrl}
            livesDisplay={livesDisplay}
            currencyDisplay={currencyDisplay}
            totalEarnedDisplay={totalEarnedDisplay}
            currencyLabel={currencyLabel}
            onNavigate={closeMobileNav}
            showMenuButton
            menuExpanded={isMobileNavOpen}
            onMenuToggle={() => setIsMobileNavOpen((open) => !open)}
            isLoading={isHeaderLoading}
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
