import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getApiBaseUrl } from '../constants/api.constants.js';
import { AUTH_SAML_ME_PATH } from '../constants/authPaths.constants.js';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';

const SessionContext = createContext(null);

/**
 * Mapuje rolę z backendu na APP_ROLE.
 * Backend zwraca: 'student' | 'lecturer' | 'admin' | 'superadmin'
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
    case 'superadmin':
      return APP_ROLE.SUPERADMIN;
    case 'student':
    default:
      return APP_ROLE.STUDENT;
  }
}

/**
 * Kontekst sesji użytkownika — pobiera dane z backendu (GET /auth/saml/me).
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
      const response = await fetch(`${base}${AUTH_SAML_ME_PATH}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
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
