import { useEffect, useLayoutEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import {
  AUTH_LOGIN_LEGACY_PROVIDER_QUERY,
  AUTH_LOGIN_PROVIDER_PIONIER,
  AUTH_LOGIN_STATE_PROVIDER_KEY,
  buildLoginStateForProvider,
} from '../constants/authPaths.constants.js';
import { getSamlMeUrl } from '../constants/api.constants.js';
import PionierInstitutionPage from './PionierInstitutionPage.jsx';

export default function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fromState =
    location.state?.[AUTH_LOGIN_STATE_PROVIDER_KEY] === AUTH_LOGIN_PROVIDER_PIONIER;
  const fromQuery =
    (searchParams.get(AUTH_LOGIN_LEGACY_PROVIDER_QUERY)?.trim().toLowerCase() ?? '') ===
    AUTH_LOGIN_PROVIDER_PIONIER;

  useLayoutEffect(() => {
    if (!fromQuery) {
      return;
    }
    navigate(
      {
        pathname: '/login',
        search: '',
        hash: '',
        state: buildLoginStateForProvider(AUTH_LOGIN_PROVIDER_PIONIER),
      },
      { replace: true },
    );
  }, [fromQuery, navigate]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const meUrl = getSamlMeUrl();
      if (meUrl.length === 0) {
        return;
      }
      try {
        const response = await fetch(meUrl, { credentials: 'include' });
        if (!response.ok || cancelled) {
          return;
        }
        const data = await response.json();
        if (cancelled || data?.authenticated !== true) {
          return;
        }
        navigate('/home', { replace: true });
      } catch {
        // Stay on login when the API is down or CORS blocks the call.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (fromState || fromQuery) {
    return <PionierInstitutionPage />;
  }

  return (
    <main className="auth">
      <h1 className="auth__title">Logowanie</h1>
      <p className="auth__lead">
        Standardowe logowanie odbywa się przez <strong>PIONIER.id</strong> (wybór uczelni, potem strona logowania
        uczelni). Logowanie e-mailem pojawi się później.
      </p>
      <div className="auth__panel auth__panel--primary">
        <Link
          className="auth__button auth__button--primary"
          to="/login"
          state={buildLoginStateForProvider(AUTH_LOGIN_PROVIDER_PIONIER)}
        >
          Zaloguj przez PIONIER.id
        </Link>
      </div>
      <div className="auth__panel auth__panel--muted">
        <label className="auth__label" htmlFor="email-placeholder">
          E-mail (w przygotowaniu)
        </label>
        <input
          id="email-placeholder"
          className="auth__input"
          type="email"
          autoComplete="username"
          placeholder="nazwa@uczelnia.pl"
          disabled
        />
        <button type="button" className="auth__button" disabled>
          Zaloguj (e-mail)
        </button>
      </div>
    </main>
  );
}
