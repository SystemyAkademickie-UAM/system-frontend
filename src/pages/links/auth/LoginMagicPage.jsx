import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AUTH_LOGIN_MAGIC_LINK_VERIFY_PATH } from '../../../constants/authPaths.constants.js';
import { useSessionOptional } from '../../../context/SessionContext.jsx';
import { homePath, loginPath } from '../../../routes/pathRegistry.js';
import { postJson } from '../../../services/api-client.js';
import { getMagicLinkErrorMessage } from '../../../services/magicLinkErrors.js';
import {
  fetchRegistrationStatus,
  isRegistrationComplete,
} from '../../../services/registrationStatus.api.js';
import '../../content/auth/AuthCard.css';
import '../../content/auth/LoginMagic.css';

/** @typedef {'loading' | 'error' | 'redirecting'} LoginMagicStatus */

export default function LoginMagicPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session = useSessionOptional();
  const [status, setStatus] = useState(/** @type {LoginMagicStatus} */ ('loading'));
  const [message, setMessage] = useState('Weryfikacja linku logowania…');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('Brak tokenu w linku logowania.');
      setStatus('error');
      return undefined;
    }

    let cancelled = false;

    async function verifyToken() {
      try {
        const result = await postJson(AUTH_LOGIN_MAGIC_LINK_VERIFY_PATH, { token });

        if (cancelled) {
          return;
        }

        if (!result.ok) {
          setStatus('error');
          setMessage(
            getMagicLinkErrorMessage(
              result.data,
              'Nie udało się zweryfikować linku logowania.',
              result.status,
            ),
          );
          return;
        }

        setStatus('redirecting');
        setMessage('Logowanie powiodło się. Przekierowujemy…');

        await session?.refetchSession?.({ force: true });
        const registrationStatus = await fetchRegistrationStatus();

        if (cancelled) {
          return;
        }

        if (isRegistrationComplete(registrationStatus)) {
          navigate(homePath(), { replace: true });
          return;
        }

        navigate(loginPath(), { replace: true });
      } catch {
        if (!cancelled) {
          setStatus('error');
          setMessage('Nie udało się zweryfikować linku logowania.');
        }
      }
    }

    void verifyToken();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams, session]);

  const isError = status === 'error';
  const isLoading = status === 'loading';

  return (
    <section
      className="auth-card auth-card--wizard-panel auth-card--left-aligned login-magic"
      aria-live="polite"
    >
      <img
        src="/images/pionierid-logo.png"
        alt="PIONIER.id"
        className="login-magic__logo auth-logo--pionier"
      />

      <h1 className="login-magic__title">Logowanie przez e-mail</h1>

      {isLoading ? <div className="login-magic__spinner" aria-hidden="true" /> : null}

      <p
        className={`login-magic__status${isError ? ' login-magic__status--error' : ''}`}
        role="status"
      >
        {message}
      </p>

      {isError ? (
        <div className="login-magic__actions">
          <Link className="login-magic__back-link" to={loginPath()}>
            Wróć do logowania
          </Link>
        </div>
      ) : null}
    </section>
  );
}
