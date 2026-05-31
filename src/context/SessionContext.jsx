import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearPendingSamlBrowserId } from '../auth/browserIdStorage.js';
import { getApiBaseUrl } from '../constants/api.constants.js';
import { AUTH_LOGIN_ME_PATH, AUTH_SAML_ME_PATH } from '../constants/authPaths.constants.js';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
import { getJson } from '../services/api-client.js';
import { exchangeSamlSessionForAuthToken } from '../services/exchangeAuthToken.js';

const SessionContext = createContext(null);

/** Retry delays after SAML redirect — cookies may not be visible to fetch on the first tick. */
const SESSION_CHECK_RETRY_DELAYS_MS = [0, 100, 250, 500, 1000];

/**
 * Mapuje rolę z backendu na APP_ROLE.
 * Backend zwraca: 'student' | 'lecturer' | 'admin' | 'superadmin' (also 'administrator' | 'super' from DB)
 */
function mapBackendRoleToAppRole(backendRole) {
  if (!backendRole || typeof backendRole !== 'string') {
    return APP_ROLE.STUDENT;
  }
  const normalized = backendRole.toLowerCase().trim();
  switch (normalized) {
    case 'lecturer':
      return APP_ROLE.LECTURER;
    case 'admin':
      return APP_ROLE.ADMIN;
    case 'administrator':
      return APP_ROLE.ADMIN;
    case 'superadmin':
      return APP_ROLE.SUPERADMIN;
    case 'super':
      return APP_ROLE.SUPERADMIN;
    case 'student':
    default:
      return APP_ROLE.STUDENT;
  }
}

/**
 * @param {number} ms
 * @returns {Promise<void>}
 */
function delay(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/**
 * @param {string} base
 * @returns {Promise<Record<string, unknown> | null>}
 */
async function loadSamlSessionUser(base) {
  const response = await fetch(`${base}${AUTH_SAML_ME_PATH}`, {
    credentials: 'include',
  });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  if (data.authenticated && data.user) {
    return data.user;
  }
  return null;
}

/**
 * @returns {Promise<Record<string, unknown> | null>}
 */
async function loadApiTokenSessionUser() {
  const result = await getJson(AUTH_LOGIN_ME_PATH, { includeBrowserId: true });
  if (result.ok && result.data?.authenticated && result.data?.user) {
    return result.data.user;
  }
  return null;
}

/**
 * Kontekst sesji użytkownika.
 * Preferuje GET /login/me (`maq_auth`), potem GET /auth/saml/me + POST /login.
 *
 * Dostarcza:
 * - user: obiekt użytkownika z backendu (lub null)
 * - role: APP_ROLE zmapowana z user.role
 * - isAuthenticated: czy sesja jest aktywna
 * - isLoading: czy trwa sprawdzanie sesji
 * - sessionError: błąd sieci (lub null)
 * - refetchSession: funkcja do ręcznego odświeżenia sesji
 */
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    setSessionError(null);
    try {
      const base = getApiBaseUrl();
      if (!base) {
        setUser(null);
        return;
      }

      for (let attempt = 0; attempt < SESSION_CHECK_RETRY_DELAYS_MS.length; attempt += 1) {
        if (attempt > 0) {
          await delay(SESSION_CHECK_RETRY_DELAYS_MS[attempt]);
        }

        const apiUser = await loadApiTokenSessionUser();
        if (apiUser) {
          clearPendingSamlBrowserId();
          setUser(apiUser);
          return;
        }

        const samlUser = await loadSamlSessionUser(base);
        if (!samlUser) {
          continue;
        }

        const apiUserAfterSamlOnly = await loadApiTokenSessionUser();
        if (apiUserAfterSamlOnly) {
          clearPendingSamlBrowserId();
          setUser(apiUserAfterSamlOnly);
          return;
        }

        const tokenExchange = await exchangeSamlSessionForAuthToken();
        if (tokenExchange.ok) {
          clearPendingSamlBrowserId();
          const apiUserAfterExchange = await loadApiTokenSessionUser();
          setUser(apiUserAfterExchange ?? samlUser);
          return;
        }

        const apiUserAfterExchangeFailure = await loadApiTokenSessionUser();
        if (apiUserAfterExchangeFailure) {
          clearPendingSamlBrowserId();
          setUser(apiUserAfterExchangeFailure);
          return;
        }

        if (attempt === SESSION_CHECK_RETRY_DELAYS_MS.length - 1) {
          setUser(null);
          setSessionError(tokenExchange.message);
          return;
        }
      }

      setUser(null);
    } catch (err) {
      setUser(null);
      setSessionError(err instanceof Error ? err.message : 'Błąd sprawdzania sesji');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const role = useMemo(() => mapBackendRoleToAppRole(user?.role), [user]);

  const value = useMemo(
    () => ({
      user,
      role,
      isAuthenticated: !!user,
      isLoading,
      sessionError,
      refetchSession: checkSession,
    }),
    [user, role, isLoading, sessionError, checkSession],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return ctx;
}

/** Bezpieczny odczyt sesji (np. w testach bez providera). */
export function useSessionOptional() {
  return useContext(SessionContext);
}
