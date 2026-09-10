import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MAGIC_LINK_CLIENT_COOLDOWN_SECONDS } from '../../../constants/magicLink.constants.js';
import { AUTH_LOGIN_MAGIC_LINK_REQUEST_PATH } from '../../../constants/authPaths.constants.js';
import { loginPath } from '../../../routes/pathRegistry.js';
import { postJson } from '../../../services/api-client.js';
import { getMagicLinkErrorMessage } from '../../../services/magicLinkErrors.js';
import { getRememberMe, setRememberMe } from '../../../services/rememberMeService.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthCard.css';
import './LoginInstitution.css';

const BACK_ARIALABEL__TEXTLABEL = {
  polish: 'Wróć',
  english: 'Back'
};

const PAGE_TITLE__TEXTLABEL = {
  polish: 'Zaloguj się przez e-mail',
  english: 'Log in via email'
};

const EMAILLABEL__TEXTLABEL = {
  polish: 'Adres e-mail',
  english: 'Email address'
};

const REMEMBER_ME__TEXTLABEL = {
  polish: 'Zapamiętaj mnie',
  english: 'Remember me'
};

const EMAILPLACEHOLDER__TEXTLABEL = {
  polish: 'twoj.email@uczelnia.pl',
  english: 'your.email@university.pl'
};

const EMAILVALIDATION__TEXTLABEL = {
  polish: 'Podaj prawidłowy adres e-mail.',
  english: 'Enter a valid email address.'
};

const SEND_BUTTON__TEXTLABEL = {
  polish: 'Wyślij link logowania',
  english: 'Send login link'
};

const RESEND_BUTTON__TEXTLABEL = {
  polish: 'Wyślij ponownie',
  english: 'Send again'
};

const SEND_SUCCESS__TEXTLABEL = {
  polish: 'Link logowania został wysłany na podany adres e-mail.',
  english: 'Login link has been sent to the provided email address.'
};

const SEND_ERROR_GENERAL__TEXTLABEL = {
  polish: 'Nie udało się wysłać linku logowania.',
  english: 'Failed to send login link.'
};

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function LoginEmail({ onBack }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [lastSentEmail, setLastSentEmail] = useState('');
  const [rememberMe, setRememberMeState] = useState(() => getRememberMe());
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
      setErrorMessage(EMAILVALIDATION__TEXTLABEL[LANGUAGE]);
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
          SEND_ERROR_GENERAL__TEXTLABEL[LANGUAGE],
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
      setSuccessMessage(SEND_SUCCESS__TEXTLABEL[LANGUAGE]);
    } catch {
      setErrorMessage(SEND_ERROR_GENERAL__TEXTLABEL[LANGUAGE]);
    } finally {
      setIsBusy(false);
    }
  }, [email, LANGUAGE]);

  const normalizedEmail = email.trim();
  const isCooldownActive = cooldownRemainingSeconds > 0;
  const isResendLabel =
    !isCooldownActive &&
    lastSentEmail.length > 0 &&
    normalizedEmail === lastSentEmail;
  const submitButtonLabel = isResendLabel
    ? RESEND_BUTTON__TEXTLABEL[LANGUAGE]
    : SEND_BUTTON__TEXTLABEL[LANGUAGE];
  const isSubmitDisabled = isBusy || isCooldownActive || normalizedEmail.length === 0;

  const submitButtonText = useMemo(() => {
    if (isCooldownActive) {
      return `${SEND_BUTTON__TEXTLABEL[LANGUAGE]} (${cooldownRemainingSeconds}s)`;
    }
    return submitButtonLabel;
  }, [cooldownRemainingSeconds, isCooldownActive, submitButtonLabel]);

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

      <h1 className="login-institution__page-title">{PAGE_TITLE__TEXTLABEL[LANGUAGE]}</h1>

      <div className="login-institution__field">
        <label className="login-institution__field-label" htmlFor="email-login-input">
          {EMAILLABEL__TEXTLABEL[LANGUAGE]}
        </label>
        <div className="login-institution__input-wrap">
          <input
            id="email-login-input"
            type="email"
            className="login-institution__input"
            value={email}
            disabled={isBusy}
            onChange={handleEmailChange}
            placeholder={EMAILPLACEHOLDER__TEXTLABEL[LANGUAGE]}
            autoComplete="email"
          />
        </div>
      </div>

      <div className="login-institution__remember-me">
        <label className="login-institution__checkbox-label" htmlFor="email-remember-me">
          <input
            id="email-remember-me"
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
