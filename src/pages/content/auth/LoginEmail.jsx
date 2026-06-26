import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AUTH_LOGIN_MAGIC_LINK_REQUEST_PATH,
  AUTH_LOGIN_ORGANIZATIONS_PATH,
} from '../../../constants/authPaths.constants.js';
import { loginPath } from '../../../routes/pathRegistry.js';
import { getJson, postJson } from '../../../services/api-client.js';
import { getMagicLinkErrorMessage } from '../../../services/magicLinkErrors.js';
import './AuthCard.css';
import './LoginInstitution.css';

/** @typedef {{ id: number, name: string }} LoginOrganizationOption */

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LoginEmail({ onBack }) {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState(/** @type {LoginOrganizationOption[]} */ ([]));
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('');
  const [email, setEmail] = useState('');
  const [isOrganizationsLoading, setIsOrganizationsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await getJson(`${AUTH_LOGIN_ORGANIZATIONS_PATH}?loginMethod=email`);
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

  const handleSubmit = useCallback(async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const organizationId = Number.parseInt(selectedOrganizationId, 10);
    const normalizedEmail = email.trim();

    if (!Number.isFinite(organizationId) || organizationId <= 0) {
      setErrorMessage('Wybierz uczelnię z listy.');
      return;
    }
    if (!normalizedEmail.includes('@')) {
      setErrorMessage('Podaj prawidłowy adres e-mail.');
      return;
    }

    setIsBusy(true);
    const result = await postJson(AUTH_LOGIN_MAGIC_LINK_REQUEST_PATH, {
      email: normalizedEmail,
      organizationId,
    });
    setIsBusy(false);

    if (!result.ok) {
      setErrorMessage(
        getMagicLinkErrorMessage(result.data, 'Nie udało się wysłać linku logowania.'),
      );
      return;
    }

    setSuccessMessage('Link logowania został wysłany na podany adres e-mail.');
  }, [email, selectedOrganizationId]);

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

      <h1 className="login-institution__page-title">Zaloguj się przez e-mail</h1>

      <div className="login-institution__field">
        <label className="login-institution__field-label" htmlFor="email-institution-select">
          Wybierz uczelnię
        </label>
        <div className="login-institution__select-wrap">
          <select
            id="email-institution-select"
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

      <div className="login-institution__field">
        <label className="login-institution__field-label" htmlFor="email-login-input">
          Adres e-mail
        </label>
        <div className="login-institution__input-wrap">
          <input
            id="email-login-input"
            type="email"
            className="login-institution__input"
            value={email}
            disabled={isBusy}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="twoj.email@uczelnia.pl"
            autoComplete="email"
          />
        </div>
      </div>

      {(errorMessage || successMessage) ? (
        <div className="login-institution__messages">
          {errorMessage ? (
            <p className="login-institution__error" role="alert">
              {errorMessage}
            </p>
          ) : null}

          {successMessage ? (
            <p className="login-institution__success" role="status">
              {successMessage}
            </p>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className="auth-card__primary-btn login-institution__continue"
        onClick={handleSubmit}
        disabled={isBusy || isOrganizationsLoading || organizations.length === 0}
      >
        Wyślij link logowania
      </button>
    </div>
  );
}
