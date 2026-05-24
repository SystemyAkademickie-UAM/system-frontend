import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSamlLoginUrl } from '../../../constants/api.constants.js';
import { DEV_BYPASS_DEFAULT_PERSONA_ID } from '../../../constants/devBypass.constants.js';
import { useSessionOptional } from '../../../context/SessionContext.jsx';
import { useDevBypassStatus } from '../../../hooks/useDevBypassStatus.js';
import { homePath, loginPath } from '../../../routes/pathRegistry.js';
import AuthRolePickerOverlay from './AuthRolePickerOverlay.jsx';
import { performTemporaryRoleLogin } from './performTemporaryRoleLogin.js';
import {
  PIONIER_DEFAULT_INSTITUTION_ID,
  PIONIER_INSTITUTIONS,
} from '../../../constants/authLayout.constants.js';
import './AuthCard.css';
import './LoginInstitution.css';

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LoginInstitution({ onBack }) {
  const navigate = useNavigate();
  const session = useSessionOptional();
  const { devBypassQuery } = useDevBypassStatus();
  const selectedInstitution = PIONIER_INSTITUTIONS.find(
    (item) => item.id === PIONIER_DEFAULT_INSTITUTION_ID,
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState(DEV_BYPASS_DEFAULT_PERSONA_ID);

  useEffect(() => {
    if (devBypassQuery.personas.length === 0) {
      return;
    }
    const stillValid = devBypassQuery.personas.some((persona) => persona.id === selectedPersonaId);
    if (!stillValid) {
      setSelectedPersonaId(devBypassQuery.personas[0].id);
    }
  }, [devBypassQuery.personas, selectedPersonaId]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(loginPath());
  }, [navigate, onBack]);

  const handleContinue = useCallback(() => {
    setErrorMessage(null);
    if (devBypassQuery.enabled) {
      setIsPickerOpen(true);
      return;
    }
    const samlLoginUrl = getSamlLoginUrl();
    if (samlLoginUrl.length === 0) {
      setErrorMessage('Brak adresu logowania SAML.');
      return;
    }
    window.location.assign(samlLoginUrl);
  }, [devBypassQuery.enabled]);

  const handleClosePicker = useCallback(() => {
    if (isBusy) {
      return;
    }
    setIsPickerOpen(false);
    setErrorMessage(null);
  }, [isBusy]);

  const handleConfirmPersona = useCallback(async (personaId) => {
    setIsBusy(true);
    setErrorMessage(null);
    try {
      const status = await performTemporaryRoleLogin(personaId);
      if (!status.sessionAuthenticated) {
        throw new Error('Sesja nie została ustalona. Spróbuj ponownie.');
      }

      await session?.refetchSession?.();
      setIsPickerOpen(false);
      navigate(homePath());
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Logowanie nie powiodło się.';
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }, [navigate, session]);

  return (
    <>
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
              value={selectedInstitution?.id ?? PIONIER_DEFAULT_INSTITUTION_ID}
              disabled
            >
              {PIONIER_INSTITUTIONS.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errorMessage && !isPickerOpen && (
          <p className="login-institution__error" role="alert">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          className="auth-card__primary-btn login-institution__continue"
          onClick={handleContinue}
          disabled={isBusy || devBypassQuery.isLoading}
        >
          Kontynuuj
        </button>
      </div>

      {devBypassQuery.enabled && (
        <AuthRolePickerOverlay
          isOpen={isPickerOpen}
          isBusy={isBusy}
          errorMessage={errorMessage}
          personas={devBypassQuery.personas}
          selectedPersonaId={selectedPersonaId}
          onSelectedPersonaIdChange={setSelectedPersonaId}
          onConfirmPersona={handleConfirmPersona}
          onClose={handleClosePicker}
        />
      )}
    </>
  );
}
