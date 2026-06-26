import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
import { registerClientAuthClearListener } from '../auth/clientAuthState.js';
import { useSessionOptional } from './SessionContext.jsx';

const AppRoleContext = createContext(null);

/**
 * Provider roli aplikacji.
 *
 * Logika wyboru roli:
 * 1. Jeśli użytkownik ręcznie ustawił rolę (setRole) — używamy tego nadpisania (dev mode)
 * 2. W przeciwnym razie — bierzemy rolę z sesji (SessionContext)
 * 3. Jeśli brak sesji — domyślnie STUDENT
 *
 * Dzięki temu:
 * - W produkcji rola pochodzi z sesji backendowej
 * - W trybie dev (api-test) można ręcznie przełączać role do testów
 */
export function AppRoleProvider({ children }) {
  const session = useSessionOptional();
  const [roleOverride, setRoleOverride] = useState(null);

  useEffect(() => {
    return registerClientAuthClearListener(() => {
      setRoleOverride(null);
    });
  }, []);

  const role = useMemo(() => {
    if (roleOverride) {
      return roleOverride;
    }
    if (session?.role) {
      return session.role;
    }
    return APP_ROLE.STUDENT;
  }, [roleOverride, session?.role]);

  const value = useMemo(
    () => ({
      role,
      setRole: setRoleOverride,
      isRoleOverridden: roleOverride !== null,
      clearRoleOverride: () => setRoleOverride(null),
    }),
    [role, roleOverride],
  );

  return <AppRoleContext.Provider value={value}>{children}</AppRoleContext.Provider>;
}

export function useAppRole() {
  const ctx = useContext(AppRoleContext);
  if (!ctx) {
    throw new Error('useAppRole must be used within AppRoleProvider');
  }
  return ctx;
}

/** Bezpieczny odczyt roli (np. w testach bez providera). */
export function useAppRoleOptional() {
  return useContext(AppRoleContext);
}
