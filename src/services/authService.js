import { getSamlLogoutUrl } from '../constants/api.constants.js';

/** If the page is still active after redirect, treat logout navigation as failed. */
const LOGOUT_NAVIGATION_FALLBACK_MS = 5000;

/**
 * Wylogowuje użytkownika — przekierowuje na SAML Single Logout (IdP + lokalne ciastka).
 * Nie używaj POST /logout przed tym krokiem: backend potrzebuje ciastka sesji SAML w żądaniu GET.
 *
 * @param {() => void} [onNavigationFailed] Wywoływane, gdy przekierowanie nie nastąpiło (np. zablokowane).
 * @returns {boolean} true jeśli rozpoczęto przekierowanie
 */
export function logoutUser(onNavigationFailed) {
  const samlLogoutUrl = getSamlLogoutUrl();
  if (samlLogoutUrl.length === 0) {
    return false;
  }

  window.location.assign(samlLogoutUrl);

  if (typeof onNavigationFailed === 'function') {
    const timeoutId = window.setTimeout(onNavigationFailed, LOGOUT_NAVIGATION_FALLBACK_MS);
    window.addEventListener(
      'pagehide',
      () => {
        window.clearTimeout(timeoutId);
      },
      { once: true },
    );
  }

  return true;
}
