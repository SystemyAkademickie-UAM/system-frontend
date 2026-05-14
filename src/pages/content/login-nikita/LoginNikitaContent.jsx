import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApiBaseUrl, getSamlLoginUrl, getSamlLogoutUrl } from '../../../constants/api.constants.js';
import { AUTH_SAML_ME_PATH } from '../../../constants/authPaths.constants.js';
import { loginPath } from '../../../routes/pathRegistry.js';
import './LoginNikitaContent.css';

export default function LoginNikitaContent() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const checkAuth = useCallback(async () => {
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
      // Ignoruj błędy sieci — traktujemy jako brak sesji
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const samlLoginUrl = getSamlLoginUrl();
  const samlLogoutUrl = getSamlLogoutUrl();

  return (
    <section className="login-nikita" aria-labelledby="login-nikita-title">
      <h1 id="login-nikita-title" className="login-nikita__title">
        Logowanie — Nikita
      </h1>
      <p className="login-nikita__brand">Systemy Akademickie UAM</p>
      <p className="login-nikita__hint">Logowanie instytucjonalne (SAML 2.0 / PIONIER.id).</p>

      {!authChecked ? (
        <p className="login-nikita__status">Sprawdzanie sesji...</p>
      ) : user ? (
        <div className="login-nikita__user">
          <h2 className="login-nikita__user-title">Zalogowany użytkownik</h2>
          <pre className="login-nikita__user-json">
            {JSON.stringify(
              {
                email: user.email || null,
                name: user.givenName || null,
                surname: user.surname || null,
                role: user.role || null,
                affiliations: user.affiliations || null,
              },
              null,
              2,
            )}
          </pre>
          <a href={samlLogoutUrl} className="login-nikita__button login-nikita__button--logout">
            Wyloguj (z IdP)
          </a>
        </div>
      ) : (
        <div className="login-nikita__login">
          {samlLoginUrl.length > 0 ? (
            <p className="login-nikita__saml">
              <a className="login-nikita__saml-link" href={samlLoginUrl}>
                Logowanie instytucjonalne (SAML 2.0 / PIONIER.id)
              </a>
            </p>
          ) : (
            <p className="login-nikita__status">Brak skonfigurowanego adresu logowania SAML.</p>
          )}
        </div>
      )}

      <p className="login-nikita__back">
        <Link className="login-nikita__link" to={loginPath()}>
          Wróć do hubu logowania
        </Link>
      </p>
    </section>
  );
}
