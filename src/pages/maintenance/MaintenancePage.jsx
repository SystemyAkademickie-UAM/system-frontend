/**
 * @file MaintenancePage.jsx
 * @description Strona informacyjna wyświetlana podczas aktywnej przerwy technicznej systemu.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROLE } from '../../navigation/shellTemplates.config.js';
import { useAppRoleOptional } from '../../context/AppRoleContext.jsx';
import { useSessionOptional } from '../../context/SessionContext.jsx';
import {
  fetchMaintenanceStatus,
  getCachedMaintenanceStatus,
  subscribeMaintenanceStatus,
} from '../../services/maintenance.api.js';
import { homePath, organizationsPath, welcomePath } from '../../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
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
};

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
  const [language] = useState(READLANGUAGECOOKIE);

  const initialStatus = getCachedMaintenanceStatus();
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(!initialStatus);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshFeedback, setRefreshFeedback] = useState(null);

  const role = roleContext?.role || session?.role || null;
  const isSuperAdmin = role === APP_ROLE.SUPERADMIN;

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
  const displayMessage = status?.message && status.message.trim().length > 0
    ? status.message.trim()
    : TEXT.defaultMessage[language];

  return (
    <div className="maintenance-page">
      <header className="maintenance-page__header">
        <div className="maintenance-page__brand">
          <img
            src="/images/maq-logo.png"
            alt="MyAcademyQuest"
            className="maintenance-page__logo"
          />
          <span className="maintenance-page__app-title">MyAcademyQuest</span>
        </div>
        <span className="maintenance-page__status-pill">
          {TEXT.badge[language]}
        </span>
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
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
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

