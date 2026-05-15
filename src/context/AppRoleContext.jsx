import { createContext, useContext, useMemo, useState } from 'react';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';

const AppRoleContext = createContext(null);

export function AppRoleProvider({ children }) {
  const [role, setRole] = useState(APP_ROLE.STUDENT);

  const value = useMemo(
    () => ({
      role,
      setRole,
    }),
    [role],
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
