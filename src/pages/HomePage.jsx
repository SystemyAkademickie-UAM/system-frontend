import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AUTH_SAML_FORCE_AUTHN_ONCE_STORAGE_KEY } from '../constants/authPaths.constants.js';
import { getApiBaseUrl, getSamlLogoutUrl, getSamlMeUrl } from '../constants/api.constants.js';

export default function HomePage() {
  const navigate = useNavigate();
  const [meJson, setMeJson] = useState(/** @type {string | null} */ (null));
  const [errorMessage, setErrorMessage] = useState(/** @type {string | null} */ (null));

  const loadMe = useCallback(async () => {
    setErrorMessage(null);
    const base = getApiBaseUrl();
    if (base.length === 0) {
      setErrorMessage('Brak adresu API.');
      return;
    }
    try {
      const meUrl = getSamlMeUrl();
      if (meUrl.length === 0) {
        setErrorMessage('Brak adresu API.');
        return;
      }
      const response = await fetch(meUrl, { credentials: 'include' });
      if (!response.ok) {
        setErrorMessage(`HTTP ${String(response.status)}`);
        return;
      }
      const data = await response.json();
      if (data?.authenticated !== true) {
        navigate('/login', { replace: true });
        return;
      }
      setMeJson(JSON.stringify(data, null, 2));
    } catch (e) {
      setMeJson(null);
      setErrorMessage(e instanceof Error ? e.message : String(e));
    }
  }, [navigate]);

  useEffect(() => {
    void loadMe();
  }, [loadMe]);

  const onLogout = useCallback(async () => {
    setErrorMessage(null);
    const logoutUrl = getSamlLogoutUrl();
    if (logoutUrl.length === 0) {
      setErrorMessage('Brak adresu API — nie można wyczyścić sesji.');
      return;
    }
    try {
      const response = await fetch(logoutUrl, { method: 'POST', credentials: 'include' });
      if (!response.ok) {
        setErrorMessage(
          `Wylogowanie nie powiodło się (HTTP ${String(response.status)}). Sesja może nadal być aktywna.`,
        );
        return;
      }
    } catch (e) {
      const detail = e instanceof Error ? e.message : String(e);
      setErrorMessage(
        `Wylogowanie nie powiodło się: ${detail}. Jeśli to błąd sieci lub CORS, dodaj origin UI do CORS_ORIGIN w API.`,
      );
      return;
    }
    sessionStorage.setItem(AUTH_SAML_FORCE_AUTHN_ONCE_STORAGE_KEY, '1');
    navigate('/login');
  }, [navigate]);

  return (
    <main className="auth">
      <h1 className="auth__title">Strona główna</h1>
      <p className="auth__lead">
        Po poprawnym logowaniu SAML tu wczytujemy tożsamość z ciasteczka sesji (JWT HTTP-only{' '}
        <code>maqSamlSession</code> ustawianego przez API na <code>POST /auth/saml/acs</code>).
      </p>
      {errorMessage !== null ? <p className="auth__error">{errorMessage}</p> : null}
      {meJson !== null ? (
        <pre className="auth__pre" role="region">
          {meJson}
        </pre>
      ) : null}
      <p className="auth__actions">
        <button type="button" className="auth__action-link" onClick={() => void onLogout()}>
          Wyloguj
        </button>
        {' · '}
        <Link to="/demo">Demo licznika</Link>
      </p>
    </main>
  );
}
