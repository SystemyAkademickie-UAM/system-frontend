import { clearPendingSamlBrowserId } from '../auth/browserIdStorage.js';
import { getApiBaseUrl, getSamlLogoutUrl } from '../constants/api.constants.js';
import { AUTH_LOGOUT_PATH } from '../constants/authPaths.constants.js';

/** If the page is still active after redirect, treat logout navigation as failed. */
const LOGOUT_NAVIGATION_FALLBACK_MS = 5000;

/**
 * @returns {boolean} whether SAML logout URL is configured for this environment
 */
export function isLogoutAvailable() {
  return getSamlLogoutUrl().length > 0;
}

/**
 * Wylogowuje użytkownika — czyści token API, potem przekierowuje na SAML Single Logout (IdP + lokalne ciastka).
 *
 * @param {() => void} [onNavigationFailed] Wywoływane, gdy przekierowanie nie nastąpiło (np. zablokowane).
 * @returns {boolean} true jeśli zaplanowano przekierowanie
 */
export function logoutUser(onNavigationFailed) {
  const samlLogoutUrl = getSamlLogoutUrl();
  if (samlLogoutUrl.length === 0) {
    return false;
  }

  clearPendingSamlBrowserId();

  const baseUrl = getApiBaseUrl();
  if (baseUrl.length > 0) {
    fetch(`${baseUrl}${AUTH_LOGOUT_PATH}`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => {
      // fire-and-forget; SAML logout still clears browser cookies
    });
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
