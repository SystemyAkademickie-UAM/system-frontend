/**
 * @file MaintenancePage.jsx
 * @description Strona informacyjna wyświetlana podczas aktywnej przerwy technicznej systemu.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { APP_ROLE, ROLE_UI_LABEL } from '../../navigation/shellTemplates.config.js';
import { useAppRoleOptional } from '../../context/AppRoleContext.jsx';
import { useSessionOptional } from '../../context/SessionContext.jsx';
import { useUserProfileOptional } from '../../context/UserProfileContext.jsx';
import {
  fetchMaintenanceStatus,
  getCachedMaintenanceStatus,
  subscribeMaintenanceStatus,
} from '../../services/maintenance.api.js';
import { logoutUser, isLogoutAvailable } from '../../services/authService.js';
import { IconUserPlaceholder } from '../../components/layout/superbar/ShellIcons.jsx';
import SuperBarUserIdentity from '../../components/layout/superbar/SuperBarUserIdentity.jsx';
import { getAvatarImageClassName } from '../../utils/avatarDisplay.js';
import { useFloatingPanelPosition } from '../../hooks/useFloatingPanelPosition.js';
import { positionDropdownMenu } from '../../utils/ui/positionTooltipInViewport.js';
import { homePath, organizationsPath, welcomePath } from '../../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import '../../components/layout/superbar/SuperBar.css';
import './MaintenancePage.css';

// === ETYKIETY JĘZYKOWE ===
const TEXT = {
  badge: {
    polish: 'PRZERWA TECHNICZNA',
    english: 'MAINTENANCE MODE',
  },
  title: {
    polish: 'Prace serwisowe w toku',
    english: 'System maintenance in progress',
  },
  defaultMessage: {
    polish:
      'Platforma MyAcademyQuest przechodzi obecnie zaplanowaną przerwę techniczną. Funkcje dydaktyczne, zaliczanie zadań oraz sklep nagród zostaną przywrócone natychmiast po zakończeniu prac konserwacyjnych.',
    english:
      'The MyAcademyQuest platform is currently undergoing scheduled technical maintenance. Course activities, grading, and the reward shop will be restored as soon as maintenance is completed.',
  },
  estimatedEnd: {
    polish: 'Przewidywany czas zakończenia:',
    english: 'Estimated completion time:',
  },
  checkButton: {
    polish: 'Sprawdź dostępność systemu',
    english: 'Check system status',
  },
  checking: {
    polish: 'Weryfikacja stanu...',
    english: 'Checking status...',
  },
  stillActive: {
    polish: 'Przerwa techniczna jest nadal aktywna.',
    english: 'Maintenance mode is still active.',
  },
  superNoticeTitle: {
    polish: 'Panel osoby nadzorującej',
    english: 'Supervisor Panel Access',
  },
  superNoticeDesc: {
    polish:
      'Twoje konto posiada uprawnienia nadrzędne (Superadmin), które umożliwiają zarządzanie systemem i konfiguracją w trakcie trwania prac serwisowych.',
    english:
      'Your account holds supervisory privileges (Superadmin), allowing full management access while maintenance mode is active.',
  },
  goToSuperPanel: {
    polish: 'Przejdź do panelu organizacji',
    english: 'Go to organization panel',
  },
  goToBroadcasts: {
    polish: 'Zarządzaj przerwą techniczną',
    english: 'Manage maintenance break',
  },
  footerAffiliation: {
    polish: 'Uniwersytet im. Adama Mickiewicza w Poznaniu - Wydział Matematyki i Informatyki',
    english: 'Adam Mickiewicz University in Poznan - Faculty of Mathematics and Computer Science',
  },
  backToWelcome: {
    polish: 'Powrót do strony powitalnej',
    english: 'Back to welcome page',
  },
  logoutBtn: {
    polish: 'Wyloguj',
    english: 'Log out',
  },
  loggingOut: {
    polish: 'Wylogowywanie…',
    english: 'Logging out…',
  },
  logoutError: {
    polish: 'Nie udało się wylogować.',
    english: 'Logout failed.',
  },
  accountMenuLabel: {
    polish: 'Menu konta użytkownika',
    english: 'User account menu',
  },
};

function buildDisplayName(user) {
  if (!user) return null;
  const firstName = user.givenName || user.name || '';
  const lastName = user.surname || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  if (fullName) return fullName;
  if (user.email) return user.email.split('@')[0];
  return null;
}

function formatEstimatedEnd(isoString, language) {
  if (!isoString) return null;
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return null;
    return new Intl.DateTimeFormat(language === 'polish' ? 'pl-PL' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return null;
  }
}

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function MaintenancePage() {
  const navigate = useNavigate();
  const session = useSessionOptional();
  const roleContext = useAppRoleOptional();
  const userProfile = useUserProfileOptional();
  const [language] = useState(READLANGUAGECOOKIE);

  const initialStatus = getCachedMaintenanceStatus();
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(!initialStatus);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshFeedback, setRefreshFeedback] = useState(null);

  // Menu użytkownika
  const menuId = useId();
  const userMenuRootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const role = roleContext?.role || session?.role || null;
  const isSuperAdmin = role === APP_ROLE.SUPERADMIN;
  const roleLabel = role ? (ROLE_UI_LABEL[role] ?? ROLE_UI_LABEL[APP_ROLE.STUDENT]) : '';

  const user = session?.user;
  const profile = userProfile?.profile;
  const avatarUrl = userProfile?.avatarUrl;

  const displayName = useMemo(() => {
    const nickname = profile?.nickname?.trim();
    const legalName = buildDisplayName(user);
    if (nickname && legalName) {
      return `${legalName} (${nickname})`;
    }
    return legalName || nickname || (user?.email ? user.email.split('@')[0] : 'Użytkownik');
  }, [profile, user]);

  const getMenuLayout = useCallback(
    ({ triggerRect, panelRect }) =>
      positionDropdownMenu({
        triggerRect,
        panelRect,
        align: 'end',
      }),
    [],
  );

  const menuLayout = useFloatingPanelPosition({
    open: isUserMenuOpen,
    triggerRef,
    panelRef,
    getLayout: getMenuLayout,
    deps: [logoutError, isLoggingOut],
  });

  useEffect(() => {
    if (!isUserMenuOpen) return undefined;
    const onPointerDown = (event) => {
      const target = event.target;
      if (
        userMenuRootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setIsUserMenuOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isUserMenuOpen]);

  const handleLogout = () => {
    setLogoutError(null);
    if (!isLogoutAvailable()) {
      setLogoutError(TEXT.logoutError[language]);
      return;
    }
    setIsLoggingOut(true);
    setIsUserMenuOpen(false);
    void logoutUser(
      () => {
        setIsLoggingOut(false);
        setLogoutError(TEXT.logoutError[language]);
        setIsUserMenuOpen(true);
      },
      { navigate },
    );
  };

  const checkStatus = async (isManual = false) => {
    if (isManual) {
      setIsRefreshing(true);
      setRefreshFeedback(null);
    }
    try {
      const nextStatus = await fetchMaintenanceStatus();
      setStatus(nextStatus);
      if (nextStatus && !nextStatus.enabled) {
        navigate(homePath(), { replace: true });
        return;
      }
      if (isManual) {
        setRefreshFeedback(TEXT.stillActive[language]);
      }
    } finally {
      setIsLoading(false);
      if (isManual) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    void checkStatus(false);

    const unsubscribe = subscribeMaintenanceStatus((newStatus) => {
      setStatus(newStatus);
      if (newStatus && !newStatus.enabled) {
        navigate(homePath(), { replace: true });
      }
    });

    const interval = window.setInterval(() => {
      void checkStatus(false);
    }, 15000);

    return () => {
      unsubscribe();
      window.clearInterval(interval);
    };
  }, []);

  const formattedEstimatedEnd = formatEstimatedEnd(status?.estimatedEndAt, language);
  const displayMessage =
    status?.message && status.message.trim().length > 0
      ? status.message.trim()
      : TEXT.defaultMessage[language];

  return (
    <div className="maintenance-page">
      <header className="maintenance-page__header super-bar">
        <div className="maintenance-page__brand">
          <img
            src="/images/maq-logo.png"
            alt="MyAcademyQuest"
            className="maintenance-page__logo"
          />
          <span className="maintenance-page__app-title">MyAcademyQuest</span>
        </div>

        <div className="maintenance-page__header-right">
          <span className="maintenance-page__status-pill">
            {TEXT.badge[language]}
          </span>

          {session?.isAuthenticated ? (
            <div className="super-bar-user-menu" ref={userMenuRootRef}>
              <SuperBarUserIdentity
                displayName={displayName}
                roleLabel={roleLabel}
                isLoading={false}
              />
              <button
                ref={triggerRef}
                type="button"
                className="super-bar-user-menu__avatar-btn"
                aria-expanded={isUserMenuOpen}
                aria-controls={menuId}
                aria-haspopup="menu"
                aria-label={TEXT.accountMenuLabel[language]}
                onClick={() => {
                  setLogoutError(null);
                  setIsUserMenuOpen((val) => !val);
                }}
              >
                <span className="super-bar-user-menu__avatar" aria-hidden="true">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className={getAvatarImageClassName(avatarUrl, 'super-bar-user-menu__avatar-img')}
                    />
                  ) : (
                    <IconUserPlaceholder />
                  )}
                </span>
              </button>

              {isUserMenuOpen && typeof document !== 'undefined'
                ? createPortal(
                    <ul
                      ref={panelRef}
                      id={menuId}
                      className="super-bar-user-menu__dropdown super-bar-user-menu__dropdown--portal"
                      role="menu"
                      style={{
                        visibility: menuLayout ? 'visible' : 'hidden',
                        left: menuLayout ? `${menuLayout.left}px` : 0,
                        top: menuLayout ? `${menuLayout.top}px` : 0,
                      }}
                    >
                      {logoutError ? (
                        <li className="super-bar-user-menu__dropdown-error" role="alert">
                          {logoutError}
                        </li>
                      ) : null}
                      <li role="none">
                        <button
                          type="button"
                          className="super-bar-user-menu__dropdown-item"
                          role="menuitem"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                        >
                          {isLoggingOut
                            ? TEXT.loggingOut[language]
                            : TEXT.logoutBtn[language]}
                        </button>
                      </li>
                    </ul>,
                    document.body,
                  )
                : null}
            </div>
          ) : null}
        </div>
      </header>

      <main className="maintenance-page__main">
        <section className="maintenance-card" role="alert" aria-live="polite">
          <div className="maintenance-card__icon-container" aria-hidden="true">
            <svg
              className="maintenance-card__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="10" r="8" />
              <line x1="12" y1="6" x2="12" y2="10" />
              <line x1="12" y1="14" x2="12.01" y2="14" />
            </svg>
          </div>

          <h1 className="maintenance-card__title">{TEXT.title[language]}</h1>

          {isLoading ? (
            <div className="maintenance-card__skeleton" aria-busy="true" />
          ) : (
            <p className="maintenance-card__message">{displayMessage}</p>
          )}

          {formattedEstimatedEnd ? (
            <div className="maintenance-card__estimate">
              <span className="maintenance-card__estimate-label">
                {TEXT.estimatedEnd[language]}
              </span>
              <strong className="maintenance-card__estimate-value">
                {formattedEstimatedEnd}
              </strong>
            </div>
          ) : null}

          <div className="maintenance-card__actions">
            <button
              type="button"
              className="maintenance-card__button maintenance-card__button--primary"
              onClick={() => void checkStatus(true)}
              disabled={isRefreshing}
            >
              {isRefreshing ? TEXT.checking[language] : TEXT.checkButton[language]}
            </button>

            {refreshFeedback ? (
              <span className="maintenance-card__feedback" role="status">
                {refreshFeedback}
              </span>
            ) : null}
          </div>

          {isSuperAdmin ? (
            <div className="maintenance-card__super-box">
              <div className="maintenance-card__super-header">
                <strong>{TEXT.superNoticeTitle[language]}</strong>
              </div>
              <p className="maintenance-card__super-desc">
                {TEXT.superNoticeDesc[language]}
              </p>
              <div className="maintenance-card__super-actions">
                <button
                  type="button"
                  className="maintenance-card__button maintenance-card__button--secondary"
                  onClick={() => navigate(organizationsPath())}
                >
                  {TEXT.goToSuperPanel[language]}
                </button>
                <button
                  type="button"
                  className="maintenance-card__button maintenance-card__button--ghost"
                  onClick={() => navigate('/broadcasts')}
                >
                  {TEXT.goToBroadcasts[language]}
                </button>
              </div>
            </div>
          ) : (
            <div className="maintenance-card__secondary-links">
              <button
                type="button"
                className="maintenance-card__text-link"
                onClick={() => navigate(welcomePath())}
              >
                {TEXT.backToWelcome[language]}
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="maintenance-page__footer">
        <span>{TEXT.footerAffiliation[language]}</span>
      </footer>
    </div>
  );
}

