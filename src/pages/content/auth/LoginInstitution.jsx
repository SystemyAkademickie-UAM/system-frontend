import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrCreateBrowserId, pinBrowserIdForSamlFlow } from '../../../auth/browserIdStorage.js';
import { getSamlLoginUrl } from '../../../constants/api.constants.js';
import { AUTH_SAML_ORGANIZATIONS_PATH, AUTH_SAML_STATUS_PATH } from '../../../constants/authPaths.constants.js';
import { loginPath } from '../../../routes/pathRegistry.js';
import { getJson } from '../../../services/api-client.js';
import './AuthCard.css';
import './LoginInstitution.css';

/** @typedef {{ id: number, name: string }} SamlOrganizationOption */

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LoginInstitution({ onBack }) {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState(/** @type {SamlOrganizationOption[]} */ ([]));
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
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
      setErrorMessage('Wybierz uczelnię z listy.');
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
      setErrorMessage('Logowanie SAML nie jest skonfigurowane (brak certyfikatów SP w backendzie).');
      return;
    }
    const browserId = getOrCreateBrowserId();
    pinBrowserIdForSamlFlow(browserId);
    const samlLoginUrl = getSamlLoginUrl(organizationId, browserId);
    if (samlLoginUrl.length === 0) {
      setIsBusy(false);
      setErrorMessage('Brak adresu logowania SAML.');
      return;
    }
    window.location.assign(samlLoginUrl);
  }, [selectedOrganizationId]);

  const isSelectDisabled = isOrganizationsLoading || organizations.length === 0 || isBusy;

  return (
    <div className="auth-card auth-card--wizard-panel auth-card--left-aligned login-institution">
      <button
        type="button"
        className="auth-card__back-button"
        onClick={handleBack}
        aria-label="Wróć"
      >
        <BackIcon className="auth-card__back-icon" />
      </button>

      <img
        src="/images/pionierid-logo.png"
        alt="PIONIER.id"
        className="login-institution__logo auth-logo--pionier"
      />

      <div className="login-institution__field">
        <label className="auth-card__title" htmlFor="institution-select">
          Wybierz uczelnię
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
              <option value="">Ładowanie…</option>
            )}
            {!isOrganizationsLoading && organizations.length === 0 && (
              <option value="">Brak zarejestrowanych uczelni</option>
            )}
            {organizations.map((organization) => (
              <option key={organization.id} value={String(organization.id)}>
                {organization.name}
              </option>
            ))}
          </select>
        </div>
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
        Kontynuuj
      </button>
    </div>
  );
}
