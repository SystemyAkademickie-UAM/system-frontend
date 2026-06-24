import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { AUTH_LOGIN_MAGIC_LINK_VERIFY_PATH } from '../../../constants/authPaths.constants.js';
import { useSessionOptional } from '../../../context/SessionContext.jsx';
import { homePath, loginPath } from '../../../routes/pathRegistry.js';
import {
  fetchRegistrationStatus,
  isRegistrationComplete,
} from '../../../services/registrationStatus.api.js';
import '../../content/auth/AuthCard.css';

export default function LoginMagicPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session = useSessionOptional();
  const [message, setMessage] = useState('Weryfikacja linku logowania…');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setMessage('Brak tokenu w linku logowania.');
      setIsError(true);
      return undefined;
    }

    let cancelled = false;

    async function verifyToken() {
      const base = getApiBaseUrl();
      if (base.length === 0) {
        if (!cancelled) {
          setMessage('Brak adresu API.');
          setIsError(true);
        }
        return;
      }

      try {
        const response = await fetch(`${base}${AUTH_LOGIN_MAGIC_LINK_VERIFY_PATH}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error('Link wygasł lub jest nieprawidłowy.');
        }

        await session?.refetchSession?.({ force: true });
        const status = await fetchRegistrationStatus();

        if (cancelled) {
          return;
        }

        if (isRegistrationComplete(status)) {
          navigate(homePath(), { replace: true });
          return;
        }

        navigate(loginPath(), { replace: true });
      } catch (error) {
        if (!cancelled) {
          setIsError(true);
          setMessage(error instanceof Error ? error.message : 'Nie udało się zweryfikować linku.');
        }
      }
    }

    void verifyToken();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams, session]);

  return (
    <section className="auth-card auth-card--wizard-panel" aria-live="polite">
      <p className={isError ? 'login-institution__error' : 'auth-card__title'} role="status">
        {message}
      </p>
    </section>
  );
}
