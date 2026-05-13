import { useEffect, useState, useCallback } from 'react';
import { getApiBaseUrl, getSamlLoginUrl, getSamlLogoutUrl } from './constants/api.constants.js';
import { COUNTER_INCREMENT_PATH } from './constants/apiPaths.constants.js';
import './App.css';

const AUTH_SAML_ME_PATH = '/auth/saml/me';

export default function App() {
  const [count, setCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const base = getApiBaseUrl();
        const response = await fetch(`${base}${AUTH_SAML_ME_PATH}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          if (data.authenticated && data.user) {
            setUser(data.user);
          }
        }
      } catch {
        // Ignore auth check errors
      } finally {
        setAuthChecked(true);
      }
    };
    checkAuth();
  }, []);

  const onAdd = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const base = getApiBaseUrl();
      const url = `${base}${COUNTER_INCREMENT_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCount: count }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
      const data = await response.json();
      if (typeof data?.count !== 'number' || !Number.isFinite(data.count)) {
        throw new Error('Invalid response: expected numeric count');
      }
      setCount(data.count);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [count]);

  const samlLoginUrl = getSamlLoginUrl();
  const samlLogoutUrl = getSamlLogoutUrl();

  return (
    <main className="app">
      <h1>Systemy Akademickie UAM</h1>
      
      {authChecked && user ? (
        <section className="app__user">
          <h2>Zalogowany użytkownik</h2>
          <pre className="app__user-json">
            {JSON.stringify({
              email: user.email || null,
              name: user.givenName || null,
              surname: user.surname || null,
              role: user.role || null,
              affiliations: user.affiliations || null,
            }, null, 2)}
          </pre>
          <a href={samlLogoutUrl} className="app__button app__button--logout">
            Wyloguj (z IdP)
          </a>
        </section>
      ) : authChecked ? (
        <section className="app__login">
          {samlLoginUrl.length > 0 ? (
            <p className="app__saml">
              <a className="app__saml-link" href={samlLoginUrl}>
                Logowanie instytucjonalne (SAML 2.0 / PIONIER.id)
              </a>
            </p>
          ) : null}
        </section>
      ) : (
        <p>Sprawdzanie sesji...</p>
      )}

      <hr />
      
      <section className="app__counter">
        <p className="app__label">Licznik: {count}</p>
        <button type="button" className="app__button" onClick={onAdd} disabled={isLoading}>
          Dodaj
        </button>
      </section>
      
      {errorMessage ? <p className="app__error">{errorMessage}</p> : null}
    </main>
  );
}
