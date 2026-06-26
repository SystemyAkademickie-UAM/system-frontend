import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getApiBaseUrl } from '../constants/api.constants.js';
import { AUTH_LOGIN_ME_PATH } from '../constants/authPaths.constants.js';
import { registerClientAuthClearListener } from '../auth/clientAuthState.js';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
import { getJson } from '../services/api-client.js';

const SessionContext = createContext(null);

/** Retry delays after redirect — cookies may not be visible to fetch on the first tick. */
const SESSION_CHECK_RETRY_DELAYS_MS = [0, 100, 250, 500];

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
 * @returns {Promise<Record<string, unknown> | null>}
 */
async function loadSessionUser() {
  const result = await getJson(AUTH_LOGIN_ME_PATH, {});
  if (result.ok && result.data?.authenticated && result.data?.user) {
    return result.data.user;
  }
  return null;
}

/**
 * Kontekst sesji użytkownika.
 * Sprawdza GET /login/me (session cookie maq_session).
 */
export function SessionProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionError, setSessionError] = useState(null);
  const sessionCheckInFlightRef = useRef(false);

  const clearSession = useCallback(() => {
    setUser(null);
    setSessionError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    return registerClientAuthClearListener(clearSession);
  }, [clearSession]);

  const checkSession = useCallback(async (options = {}) => {
    const force = options.force === true;
    if (sessionCheckInFlightRef.current) {
      if (!force) {
        return;
      }
      while (sessionCheckInFlightRef.current) {
        await delay(25);
      }
    }

    sessionCheckInFlightRef.current = true;
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

        const sessionUser = await loadSessionUser();
        if (sessionUser) {
          setUser(sessionUser);
          return;
        }
      }

      setUser(null);
    } catch (err) {
      setUser(null);
      setSessionError(err instanceof Error ? err.message : 'Błąd sprawdzania sesji');
    } finally {
      sessionCheckInFlightRef.current = false;
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
      clearSession,
    }),
    [user, role, isLoading, sessionError, checkSession, clearSession],
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
