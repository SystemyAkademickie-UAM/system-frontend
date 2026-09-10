import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSamlLoginUrl } from '../../../constants/api.constants.js';
import { AUTH_SAML_ORGANIZATIONS_PATH, AUTH_SAML_STATUS_PATH } from '../../../constants/authPaths.constants.js';
import { loginPath } from '../../../routes/pathRegistry.js';
import { getJson } from '../../../services/api-client.js';
import { getRememberMe, setRememberMe } from '../../../services/rememberMeService.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './LoginInstitution.css';

/** @typedef {{ id: number, name: string }} SamlOrganizationOption */

const BACK_ARIALABEL__TEXTLABEL = {
  polish: 'Wróć',
  english: 'Back'
};

const SELECTIONLABEL__TEXTLABEL = {
  polish: 'Wybierz uczelnię',
  english: 'Select institution'
};

const REMEMBER_ME__TEXTLABEL = {
  polish: 'Zapamiętaj mnie',
  english: 'Remember me'
};

const LOADINGOPTION__TEXTLABEL = {
  polish: 'Ładowanie…',
  english: 'Loading…'
};

const NOINSTITUTIONS__TEXTLABEL = {
  polish: 'Brak zarejestrowanych uczelni',
  english: 'No registered institutions'
};

const ERROR_NOSELECTION__TEXTLABEL = {
  polish: 'Wybierz uczelnię z listy.',
  english: 'Select an institution from the list.'
};

const ERROR_SAMLNOTCONFIGURED__TEXTLABEL = {
  polish: 'Logowanie SAML nie jest skonfigurowane (brak certyfikatów SP w backendzie).',
  english: 'SAML login is not configured (missing SP certificates in backend).'
};

const ERROR_NOURL__TEXTLABEL = {
  polish: 'Brak adresu logowania SAML.',
  english: 'No SAML login URL available.'
};

const CONTINUE_BUTTON__TEXTLABEL = {
  polish: 'Kontynuuj',
  english: 'Continue'
};

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LoginInstitution({ onBack }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState(/** @type {SamlOrganizationOption[]} */ ([]));
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
  const [rememberMe, setRememberMeState] = useState(() => getRememberMe());
  const [isOrganizationsLoading, setIsOrganizationsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getJson(AUTH_SAML_ORGANIZATIONS_PATH);
      if (cancelled) {
        return;
      }
      if (result.ok && result.data && typeof result.data === 'object' && Array.isArray(result.data.organizations)) {
        const rows = result.data.organizations;
        setOrganizations(rows);
        if (rows.length > 0) {
          setSelectedOrganizationId(String(rows[0].id));
        }
      }
      setIsOrganizationsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(loginPath());
  }, [navigate, onBack]);

  const handleContinue = useCallback(async () => {
    setErrorMessage(null);
    const organizationId = Number.parseInt(selectedOrganizationId, 10);
    if (!Number.isFinite(organizationId) || organizationId <= 0) {
      setErrorMessage(ERROR_NOSELECTION__TEXTLABEL[LANGUAGE]);
      return;
    }
    setIsBusy(true);
    const statusResult = await getJson(AUTH_SAML_STATUS_PATH);
    if (
      !statusResult.ok ||
      !statusResult.data ||
      typeof statusResult.data !== 'object' ||
      statusResult.data.configured !== true
    ) {
      setIsBusy(false);
      setErrorMessage(ERROR_SAMLNOTCONFIGURED__TEXTLABEL[LANGUAGE]);
      return;
    }
    const samlLoginUrl = getSamlLoginUrl(organizationId);
    if (samlLoginUrl.length === 0) {
      setIsBusy(false);
      setErrorMessage(ERROR_NOURL__TEXTLABEL[LANGUAGE]);
      return;
    }
    window.location.assign(samlLoginUrl);
  }, [selectedOrganizationId, LANGUAGE]);

  const isSelectDisabled = isOrganizationsLoading || organizations.length === 0 || isBusy;

  return (
    <div className="auth-card auth-card--wizard-panel auth-card--left-aligned login-institution">
      <button
        type="button"
        className="auth-card__back-button"
        onClick={handleBack}
        aria-label={BACK_ARIALABEL__TEXTLABEL[LANGUAGE]}
      >
        <BackIcon className="auth-card__back-icon" />
      </button>

      <img
        src="/images/pionierid-logo.png"
        alt="PIONIER.id"
        className="login-institution__logo auth-logo--pionier"
      />

      <div className="login-institution__field">
        <label className="login-institution__field-label" htmlFor="institution-select">
          {SELECTIONLABEL__TEXTLABEL[LANGUAGE]}
        </label>
        <div className="login-institution__select-wrap">
          <select
            id="institution-select"
            className="login-institution__select"
            value={selectedOrganizationId}
            disabled={isSelectDisabled}
            onChange={(event) => setSelectedOrganizationId(event.target.value)}
          >
            {isOrganizationsLoading && (
              <option value="">{LOADINGOPTION__TEXTLABEL[LANGUAGE]}</option>
            )}
            {!isOrganizationsLoading && organizations.length === 0 && (
              <option value="">{NOINSTITUTIONS__TEXTLABEL[LANGUAGE]}</option>
            )}
            {organizations.map((organization) => (
              <option key={organization.id} value={String(organization.id)}>
                {organization.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="login-institution__remember-me">
        <label className="login-institution__checkbox-label" htmlFor="institution-remember-me">
          <input
            id="institution-remember-me"
            type="checkbox"
            checked={rememberMe}
            disabled={isBusy}
            onChange={(e) => {
              const next = e.target.checked;
              setRememberMeState(next);
              setRememberMe(next);
            }}
          />
          <span>{REMEMBER_ME__TEXTLABEL[LANGUAGE]}</span>
        </label>
      </div>

      {errorMessage && (
        <p className="login-institution__error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="button"
        className="auth-card__primary-btn login-institution__continue"
        onClick={handleContinue}
        disabled={isBusy || isOrganizationsLoading || organizations.length === 0}
      >
        {CONTINUE_BUTTON__TEXTLABEL[LANGUAGE]}
      </button>
    </div>
  );
}
