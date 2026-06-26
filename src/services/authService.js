import { clearClientAuthState } from '../auth/clientAuthState.js';
import { getApiBaseUrl, getSamlLogoutUrl } from '../constants/api.constants.js';
import { welcomePath } from '../routes/pathRegistry.js';

/** If the page is still active after redirect, treat logout navigation as failed. */
const LOGOUT_NAVIGATION_FALLBACK_MS = 5000;

export const LOGOUT_SUCCESS_QUERY = 'loggedOut=1';

/**
 * @returns {string} Relative SPA path after logout (for backend postLogoutRedirect).
 */
export function buildWelcomeAfterLogoutPath() {
  return `${welcomePath()}?${LOGOUT_SUCCESS_QUERY}`;
}

/**
 * @returns {string} Absolute URL of the welcome page after logout.
 */
export function buildWelcomeAfterLogoutUrl() {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${window.location.origin}${normalizedBase}${buildWelcomeAfterLogoutPath()}`;
}

/**
 * @returns {boolean} whether SAML logout URL is configured for this environment
 */
export function isLogoutAvailable() {
  return getApiBaseUrl().length > 0;
}

/**
 * Wylogowuje użytkownika — czyści lokalny stan SPA, potem przekierowuje na endpoint
 * SAML Single Logout (unieważnia sesję, czyści ciasteczka, opcjonalnie IdP).
 *
 * @param {() => void} [onNavigationFailed] Wywoływane, gdy przekierowanie nie nastąpiło (np. zablokowane).
 * @returns {Promise<boolean>} true jeśli zaplanowano przekierowanie
 */
export async function logoutUser(onNavigationFailed) {
  clearClientAuthState();

  const welcomeUrl = buildWelcomeAfterLogoutUrl();
  const postLogoutRedirect = encodeURIComponent(buildWelcomeAfterLogoutPath());
  const samlLogoutBase = getSamlLogoutUrl();

  if (samlLogoutBase.length === 0) {
    window.location.replace(welcomeUrl);
    return true;
  }

  const separator = samlLogoutBase.includes('?') ? '&' : '?';
  const samlLogoutUrl = `${samlLogoutBase}${separator}postLogoutRedirect=${postLogoutRedirect}`;

  window.location.replace(samlLogoutUrl);

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
