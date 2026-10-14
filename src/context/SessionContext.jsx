import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { getApiBaseUrl } from '../constants/api.constants.js';
import { AUTH_LOGIN_ME_PATH } from '../constants/authPaths.constants.js';
import { handleSessionExpired, registerClientAuthClearListener } from '../auth/clientAuthState.js';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
import { getJson } from '../services/api-client.js';

const SessionContext = createContext(null);

/** Domyślny czas bezczynności sesji: 15 minut. */
export const SESSION_IDLE_TIMEOUT_MS = 15 * 60 * 1000;

const RESOLVED_IDLE_TIMEOUT_MS = (() => {
  const envVal = Number(import.meta.env.VITE_SESSION_IDLE_TIMEOUT_MS);
  return Number.isFinite(envVal) && envVal > 0 ? envVal : SESSION_IDLE_TIMEOUT_MS;
})();

export const STORAGE_KEY_LAST_ACTIVITY = 'maq_last_activity';

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
    const isInitial = options.initial === true;
    if (sessionCheckInFlightRef.current) {
      if (!force) {
        return;
      }
      while (sessionCheckInFlightRef.current) {
        await delay(25);
      }
    }

    sessionCheckInFlightRef.current = true;
    if (isInitial) {
      setIsLoading(true);
    }
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
    checkSession({ initial: true });
  }, [checkSession]);

  const lastActivityRef = useRef(Date.now());
  const lastStorageWriteRef = useRef(0);

  // Śledzenie bezczynności użytkownika (idle timeout 15 min)
  useEffect(() => {
    if (!user) {
      return;
    }

    const now = Date.now();
    lastActivityRef.current = now;

    try {
      const stored = Number(localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY));
      if (Number.isFinite(stored) && stored > 0 && now - stored < RESOLVED_IDLE_TIMEOUT_MS) {
        lastActivityRef.current = Math.max(now, stored);
      } else {
        localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(now));
      }
    } catch {
      // ignore storage errors
    }

    const recordActivity = () => {
      const currentTime = Date.now();
      lastActivityRef.current = currentTime;
      if (currentTime - lastStorageWriteRef.current > 2000) {
        lastStorageWriteRef.current = currentTime;
        try {
          localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(currentTime));
        } catch {
          // ignore storage errors
        }
      }
    };

    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY_LAST_ACTIVITY && event.newValue) {
        const val = Number(event.newValue);
        if (Number.isFinite(val) && val > lastActivityRef.current) {
          lastActivityRef.current = val;
        }
      }
    };

    const checkIdleStatus = () => {
      let latest = lastActivityRef.current;
      try {
        const stored = Number(localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY));
        if (Number.isFinite(stored) && stored > latest) {
          latest = stored;
          lastActivityRef.current = stored;
        }
      } catch {
        // ignore storage errors
      }

      if (Date.now() - latest >= RESOLVED_IDLE_TIMEOUT_MS) {
        handleSessionExpired();
      }
    };

    const activityEvents = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'mousemove'];
    activityEvents.forEach((ev) => {
      window.addEventListener(ev, recordActivity, { passive: true });
    });
    window.addEventListener('storage', handleStorageChange);

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkIdleStatus();
      }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const intervalId = window.setInterval(checkIdleStatus, 3000);

    return () => {
      activityEvents.forEach((ev) => {
        window.removeEventListener(ev, recordActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.clearInterval(intervalId);
    };
  }, [user]);

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
