import { getSamlLogoutUrl } from '../constants/api.constants.js';

/** If the page is still active after redirect, treat logout navigation as failed. */
const LOGOUT_NAVIGATION_FALLBACK_MS = 5000;

/**
 * @returns {boolean} whether SAML logout URL is configured for this environment
 */
export function isLogoutAvailable() {
  return getSamlLogoutUrl().length > 0;
}

/**
 * Wylogowuje użytkownika — przekierowuje na SAML Single Logout (IdP + lokalne ciastka).
 * Nawigacja jest opóźniona o jeden tick, żeby React zdążył narysować stan ładowania.
 * Nie używaj POST /logout przed tym krokiem: backend potrzebuje ciastka sesji SAML w żądaniu GET.
 *
 * @param {() => void} [onNavigationFailed] Wywoływane, gdy przekierowanie nie nastąpiło (np. zablokowane).
 * @returns {boolean} true jeśli zaplanowano przekierowanie
 */
export function logoutUser(onNavigationFailed) {
  const samlLogoutUrl = getSamlLogoutUrl();
  if (samlLogoutUrl.length === 0) {
    return false;
  }

  window.setTimeout(() => {
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
  }, 0);

  return true;
}
