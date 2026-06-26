import { BROWSER_ID_SAML_PENDING_SESSION_KEY } from '../constants/browserId.constants.js';

/** @type {Set<() => void>} */
const clearListeners = new Set();

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
