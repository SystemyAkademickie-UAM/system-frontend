import { createContext, useContext, useState, useMemo } from 'react';

/**
 * Auth context for displaying the last returned auth token (for debugging only).
 * Actual authentication uses HTTP-only `maq_auth` cookie sent automatically with requests.
 */
const AuthContext = createContext(null);

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
