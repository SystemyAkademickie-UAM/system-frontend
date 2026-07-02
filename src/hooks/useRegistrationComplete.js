import { useEffect, useMemo, useState } from 'react';
import { registerClientAuthClearListener } from '../auth/clientAuthState.js';
import { getApiBaseUrl } from '../constants/api.constants.js';
import {
  fetchRegistrationStatus,
  isRegistrationComplete,
} from '../services/registrationStatus.api.js';
import { useSession } from '../context/SessionContext.jsx';

/** @type {import('../services/registrationStatus.api.js').RegistrationStatus | null} */
let cachedStatus = null;
/** @type {string | null} */
let cachedUserKey = null;

export function invalidateRegistrationStatusCache() {
  cachedStatus = null;
  cachedUserKey = null;
}

registerClientAuthClearListener(invalidateRegistrationStatusCache);

/**
 * Czy zalogowany użytkownik ukończył kreator rejestracji (profil + EULA).
 * @returns {{ isChecking: boolean, isComplete: boolean }}
 */
export function useRegistrationComplete() {
  const { isAuthenticated, isLoading, user } = useSession();
  const [state, setState] = useState(() => ({
    isChecking: false,
    isComplete: true,
    hasResolved: false,
  }));

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated || getApiBaseUrl().length === 0) {
      setState({ isChecking: false, isComplete: true, hasResolved: true });
      return;
    }

    const userKey = String(user?.id ?? user?.email ?? 'authenticated');
    if (cachedUserKey === userKey && cachedStatus !== null) {
      setState({
        isChecking: false,
        isComplete: isRegistrationComplete(cachedStatus),
        hasResolved: true,
      });
      return;
    }

    let cancelled = false;
    setState({ isChecking: true, isComplete: false, hasResolved: false });

    void fetchRegistrationStatus()
      .then((status) => {
        if (cancelled) {
          return;
        }
        cachedStatus = status;
        cachedUserKey = userKey;
        setState({
          isChecking: false,
          isComplete: isRegistrationComplete(status),
          hasResolved: true,
        });
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        cachedStatus = null;
        cachedUserKey = userKey;
        setState({ isChecking: false, isComplete: false, hasResolved: true });
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading, user?.id, user?.email]);

  const isChecking = useMemo(
    () => state.isChecking || (isAuthenticated && !isLoading && !state.hasResolved),
    [isAuthenticated, isLoading, state.hasResolved, state.isChecking],
  );

  return {
    isChecking,
    isComplete: state.isComplete,
  };
}
