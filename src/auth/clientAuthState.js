import { BROWSER_ID_SAML_PENDING_SESSION_KEY } from '../constants/browserId.constants.js';
import { getApiBaseUrl } from '../constants/api.constants.js';
import { getRememberMe } from '../services/rememberMeService.js';

/** @type {Set<() => void>} */
const clearListeners = new Set();

let logoutInProgress = false;

/**
 * @returns {boolean}
 */
export function isClientLogoutInProgress() {
  return logoutInProgress;
}

/**
 * Oznacza rozpoczęcie wylogowania — blokuje pośrednie przekierowania RouteGuard.
 */
export function beginClientLogout() {
  logoutInProgress = true;
}

/**
 * Kończy stan wylogowania po bezpiecznym powrocie na stronę logowania.
 */
export function endClientLogout() {
  logoutInProgress = false;
}

/**
 * Rejestruje callback czyszczący lokalny stan auth (np. SessionContext).
 * @param {() => void} listener
 * @returns {() => void} unsubscribe
 */
export function registerClientAuthClearListener(listener) {
  clearListeners.add(listener);
  return () => {
    clearListeners.delete(listener);
  };
}

/**
 * Czyści lokalny stan sesji w SPA (React) oraz tymczasowe dane auth w storage.
 */
export function clearClientAuthState() {
  clearListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore listener failures during logout
    }
  });

  try {
    sessionStorage.removeItem(BROWSER_ID_SAML_PENDING_SESSION_KEY);
  } catch {
    // ignore storage access errors
  }
}

let sessionExpiredHandling = false;

/**
 * Wywoływane, gdy sesja wygaśnie na backendzie (np. status 401 Unauthorized na chronionym zasobie)
 * lub po upływie limitu bezczynności.
 * Czyści stan sesji w aplikacji oraz przekierowuje na stronę powitalną /welcome.
 */
export function handleSessionExpired() {
  if (isClientLogoutInProgress() || sessionExpiredHandling) {
    return;
  }
  sessionExpiredHandling = true;
  try {
    clearClientAuthState();

    // Jeśli użytkownik nie wybrał "Zapamiętaj mnie", unieważnij sesję również po stronie backendu
    try {
      if (!getRememberMe() && typeof fetch === 'function') {
        const baseUrl = getApiBaseUrl();
        if (baseUrl.length > 0) {
          void fetch(`${baseUrl}/auth/saml/logout`, {
            method: 'POST',
            credentials: 'include',
            keepalive: true,
          }).catch(() => {});
        }
      }
    } catch {
      // ignore network errors
    }

    if (typeof window !== 'undefined' && typeof window.location?.replace === 'function') {
      const pathname = window.location.pathname || '';
      const isAuthPage = pathname.startsWith('/welcome')
        || pathname.startsWith('/login')
        || pathname.startsWith('/auth')
        || pathname.startsWith('/dev');
      if (!isAuthPage) {
        try {
          if (process.env.NODE_ENV !== 'test') {
            window.location.replace('/welcome');
          }
        } catch {
          // ignore navigation errors in test/unsupported environments
        }
      }
    }
  } finally {
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        sessionExpiredHandling = false;
      }, 500);
    } else {
      sessionExpiredHandling = false;
    }
  }
}
