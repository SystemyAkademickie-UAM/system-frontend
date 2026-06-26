import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  AUTH_LOGIN_MAGIC_LINK_VERIFY_PATH,
  AUTH_LOGIN_ME_PATH,
} from '../../../constants/authPaths.constants.js';
import { useSessionOptional } from '../../../context/SessionContext.jsx';
import { homePath, loginPath } from '../../../routes/pathRegistry.js';
import { getJson, postJson } from '../../../services/api-client.js';
import { getMagicLinkErrorMessage } from '../../../services/magicLinkErrors.js';
import {
  fetchRegistrationStatus,
  isRegistrationComplete,
} from '../../../services/registrationStatus.api.js';
import '../../content/auth/AuthCard.css';
import '../../content/auth/LoginMagic.css';

/** @typedef {'loading' | 'error' | 'redirecting'} LoginMagicStatus */

/** Tokens that already established a session in this tab. */
const magicLinkVerifyCompleted = new Set();

/** @type {Map<string, Promise<{ ok: boolean, status: number, data: unknown }>>} */
const magicLinkVerifyPromises = new Map();

/**
 * Runs magic-link verify at most once per token (shared across Strict Mode remounts).
 * @param {string} token
 */
function verifyMagicLinkTokenOnce(token) {
  if (magicLinkVerifyCompleted.has(token)) {
    return Promise.resolve({ ok: true, status: 200, data: null });
  }

  const existingPromise = magicLinkVerifyPromises.get(token);
  if (existingPromise) {
    return existingPromise;
  }

  const verifyPromise = postJson(AUTH_LOGIN_MAGIC_LINK_VERIFY_PATH, { token }).then((result) => {
    if (result.ok) {
      magicLinkVerifyCompleted.add(token);
    }
    return result;
  }).finally(() => {
    magicLinkVerifyPromises.delete(token);
  });

  magicLinkVerifyPromises.set(token, verifyPromise);
  return verifyPromise;
}

/**
 * @returns {Promise<boolean>}
 */
async function hasActiveSessionCookie() {
  const result = await getJson(AUTH_LOGIN_ME_PATH);
  return result.ok && result.data?.authenticated === true;
}

export default function LoginMagicPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const session = useSessionOptional();
  const sessionRef = useRef(session);
  sessionRef.current = session;

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

    async function completeLoginRedirect() {
      await sessionRef.current?.refetchSession?.({ force: true });

      if (cancelled) {
        return;
      }

      const registrationStatus = await fetchRegistrationStatus();
      if (cancelled) {
        return;
      }

      if (isRegistrationComplete(registrationStatus)) {
        navigate(homePath(), { replace: true });
        return;
      }

      navigate(loginPath(), { replace: true });
    }

    async function runVerifyFlow() {
      try {
        const result = await verifyMagicLinkTokenOnce(token);

        if (cancelled) {
          return;
        }

        if (!result.ok) {
          if (await hasActiveSessionCookie()) {
            magicLinkVerifyCompleted.add(token);
            setStatus('redirecting');
            setMessage('Logowanie powiodło się. Przekierowujemy…');
            await completeLoginRedirect();
            return;
          }

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
        await completeLoginRedirect();
      } catch {
        if (cancelled) {
          return;
        }

        if (await hasActiveSessionCookie()) {
          magicLinkVerifyCompleted.add(token);
          setStatus('redirecting');
          setMessage('Logowanie powiodło się. Przekierowujemy…');
          await completeLoginRedirect();
          return;
        }

        setStatus('error');
        setMessage('Nie udało się zweryfikować linku logowania.');
      }
    }

    void runVerifyFlow();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  const isError = status === 'error';
  const showSpinner = status === 'loading' || status === 'redirecting';

  return (
    <section
      className="auth-card auth-card--wizard-panel auth-card--left-aligned login-magic"
      aria-live="polite"
    >
      <h1 className="login-magic__title">Logowanie przez e-mail</h1>

      {showSpinner ? <div className="login-magic__spinner" aria-hidden="true" /> : null}

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
