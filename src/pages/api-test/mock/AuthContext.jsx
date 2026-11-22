/**
 * @file AuthContext.jsx
 * @description Kontekst globalnego stanu React oraz dostawca danych dla AuthContext.
 */

// === IMPORTY I INICJALIZACJA KONTEKSTU ===
import { createContext, useContext, useState, useMemo } from 'react';

/**
 * Auth context for displaying the last returned auth token (for debugging only).
 * Actual authentication uses HTTP-only `maq_auth` cookie sent automatically with requests.
 */
const AuthContext = createContext(null);

// === DOSTAWCA KONTEKSTU I ZARZĄDZANIE STANEM ===
export function AuthProvider({ children }) {

const [authToken, setAuthToken] = useState('');

  const value = useMemo(
    () => ({
      authToken,
      setAuthToken,
      clearAuthToken: () => setAuthToken(''),
    }),
    [authToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// === HOOKI DOSTĘPOWE DO KONTEKSTU ===
export function useAuth() {

const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
