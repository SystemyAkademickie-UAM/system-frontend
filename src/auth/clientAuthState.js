import { BROWSER_ID_SAML_PENDING_SESSION_KEY } from '../constants/browserId.constants.js';

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
 * Wywoływane, gdy sesja wygaśnie na backendzie (np. status 401 Unauthorized na chronionym zasobie).
 * Czyści stan sesji w aplikacji, umożliwiając RouteGuard natychmiastowe przekierowanie na stronę logowania/powitalną.
 */
export function handleSessionExpired() {
  if (isClientLogoutInProgress() || sessionExpiredHandling) {
    return;
  }
  sessionExpiredHandling = true;
  try {
    clearClientAuthState();
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
