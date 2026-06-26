import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MAGIC_LINK_CLIENT_COOLDOWN_SECONDS,
  MAGIC_LINK_RESEND_BUTTON_LABEL,
  MAGIC_LINK_SEND_BUTTON_LABEL,
  MAGIC_LINK_SENT_SUCCESS_MESSAGE,
} from '../../../constants/magicLink.constants.js';
import { AUTH_LOGIN_MAGIC_LINK_REQUEST_PATH } from '../../../constants/authPaths.constants.js';
import { loginPath } from '../../../routes/pathRegistry.js';
import { postJson } from '../../../services/api-client.js';
import { getMagicLinkErrorMessage } from '../../../services/magicLinkErrors.js';
import './AuthCard.css';
import './LoginInstitution.css';

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LoginEmail({ onBack }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [lastSentEmail, setLastSentEmail] = useState('');
  const [cooldownRemainingSeconds, setCooldownRemainingSeconds] = useState(0);
  const [isBusy, setIsBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (cooldownRemainingSeconds <= 0) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setCooldownRemainingSeconds((previous) => Math.max(0, previous - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cooldownRemainingSeconds]);

  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
      return;
    }
    navigate(loginPath());
  }, [navigate, onBack]);

  const handleEmailChange = useCallback((event) => {
    setEmail(event.target.value);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    setErrorMessage(null);
    setSuccessMessage(null);

    const normalizedEmail = email.trim();

    if (!normalizedEmail.includes('@')) {
      setErrorMessage('Podaj prawidłowy adres e-mail.');
      return;
    }

    setIsBusy(true);
    try {
      const result = await postJson(AUTH_LOGIN_MAGIC_LINK_REQUEST_PATH, {
        email: normalizedEmail,
      });

      if (!result.ok) {
        const cooldownMessage = getMagicLinkErrorMessage(
          result.data,
          'Nie udało się wysłać linku logowania.',
          result.status,
        );
        setErrorMessage(cooldownMessage);

        if (result.status === 429 && result.data && typeof result.data === 'object') {
          const retryAfterSeconds = /** @type {{ retryAfterSeconds?: number }} */ (result.data)
            .retryAfterSeconds;
          if (typeof retryAfterSeconds === 'number' && retryAfterSeconds > 0) {
            setLastSentEmail(normalizedEmail);
            setCooldownRemainingSeconds(retryAfterSeconds);
          }
        }
        return;
      }

      setLastSentEmail(normalizedEmail);
      setCooldownRemainingSeconds(MAGIC_LINK_CLIENT_COOLDOWN_SECONDS);
      setSuccessMessage(MAGIC_LINK_SENT_SUCCESS_MESSAGE);
    } catch {
      setErrorMessage('Nie udało się wysłać linku logowania.');
    } finally {
      setIsBusy(false);
    }
  }, [email]);

  const normalizedEmail = email.trim();
  const isCooldownActive = cooldownRemainingSeconds > 0;
  const isResendLabel =
    !isCooldownActive &&
    lastSentEmail.length > 0 &&
    normalizedEmail === lastSentEmail;
  const submitButtonLabel = isResendLabel
    ? MAGIC_LINK_RESEND_BUTTON_LABEL
    : MAGIC_LINK_SEND_BUTTON_LABEL;
  const isSubmitDisabled = isBusy || isCooldownActive || normalizedEmail.length === 0;

  const submitButtonText = useMemo(() => {
    if (isCooldownActive) {
      return `${MAGIC_LINK_SEND_BUTTON_LABEL} (${cooldownRemainingSeconds}s)`;
    }
    return submitButtonLabel;
  }, [cooldownRemainingSeconds, isCooldownActive, submitButtonLabel]);

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
            onChange={handleEmailChange}
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
        disabled={isSubmitDisabled}
      >
        {submitButtonText}
      </button>
    </div>
  );
}
