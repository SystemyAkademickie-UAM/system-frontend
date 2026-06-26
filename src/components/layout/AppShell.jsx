import { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { APP_ROLE, ROLE_UI_LABEL } from '../../navigation/shellTemplates.config.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { GroupCurrencySettingsProvider } from '../../context/GroupCurrencyContext.jsx';
import { GroupLivesSettingsProvider } from '../../context/GroupLivesContext.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import { useUserProfile } from '../../context/UserProfileContext.jsx';
import { useAppBreadcrumb } from '../../hooks/useAppBreadcrumb.js';
import { useCompactAppLayout } from '../../hooks/useCompactAppLayout.js';
import { useLeaderDisplayPreferences } from '../../hooks/useLeaderDisplayPreferences.js';
import { useShellGroupContext } from '../../hooks/useShellGroupContext.js';
import { useStudentSuperBarStats } from '../../hooks/useStudentSuperBarStats.js';
import Sidebar from './Sidebar.jsx';
import SuperBar from './superbar/SuperBar.jsx';
import SuperBarBreadcrumbMobile from './superbar/SuperBarBreadcrumbMobile.jsx';
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
  const { rawGroupId } = useShellGroupContext();
  const { user, isLoading: isSessionLoading } = useSession();
  const { profile, avatarUrl, isLoading: isProfileLoading } = useUserProfile();
  const { showNickname: leaderShowsNickname } = useLeaderDisplayPreferences(profile?.showNickname);
  const {
    livesDisplay,
    currencyDisplay,
    totalEarnedDisplay,
    currencyLabel,
    livesLabel,
    livesEnabled,
    livesMax,
    livesShopEnabled,
  } = useStudentSuperBarStats();
  const breadcrumb = useAppBreadcrumb();
  const isCompactLayout = useCompactAppLayout();
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
    <GroupCurrencySettingsProvider groupId={rawGroupId}>
    <GroupLivesSettingsProvider groupId={rawGroupId}>
      <div className={['app-shell', isCompactLayout ? 'app-shell--compact' : ''].filter(Boolean).join(' ')}>
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
          className={[
            'app-shell__sidebar-wrap',
            isCompactLayout ? 'app-shell__sidebar-wrap--hidden' : '',
            isMobileNavOpen ? 'app-shell__sidebar-wrap--open' : '',
          ]
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
            livesLabel={livesLabel}
            livesEnabled={livesEnabled}
            livesMax={livesMax}
            livesShopEnabled={livesShopEnabled}
            currencyDisplay={currencyDisplay}
            totalEarnedDisplay={totalEarnedDisplay}
            currencyLabel={currencyLabel}
            onNavigate={closeMobileNav}
            showMenuButton={!isCompactLayout}
            menuExpanded={isMobileNavOpen}
            onMenuToggle={() => setIsMobileNavOpen((open) => !open)}
            isLoading={isHeaderLoading}
            breadcrumb={breadcrumb}
          />
          <SuperBarBreadcrumbMobile breadcrumb={breadcrumb} />
          <main id="main-content" className="app-shell__main" tabIndex={-1}>
            <div className="app-shell__content">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      </div>
    </GroupLivesSettingsProvider>
    </GroupCurrencySettingsProvider>
  );
}
