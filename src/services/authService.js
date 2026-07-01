import { clearClientAuthState } from '../auth/clientAuthState.js';
import { getApiBaseUrl, getSamlLogoutUrl } from '../constants/api.constants.js';
import { loginPath } from '../routes/pathRegistry.js';

/** If the page is still active after redirect, treat logout navigation as failed. */
const LOGOUT_NAVIGATION_FALLBACK_MS = 5000;

export const LOGOUT_SUCCESS_QUERY = 'loggedOut=1';

/**
 * @returns {string} Relative SPA path after logout (for backend postLogoutRedirect).
 */
export function buildLoginAfterLogoutPath() {
  return `${loginPath()}?${LOGOUT_SUCCESS_QUERY}`;
}

/**
 * @returns {string} Absolute URL of the login page after logout.
 */
export function buildLoginAfterLogoutUrl() {
  const base = import.meta.env.BASE_URL || '/';
  const normalizedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  return `${window.location.origin}${normalizedBase}${buildLoginAfterLogoutPath()}`;
}

/** @deprecated Use {@link buildLoginAfterLogoutPath}. */
export function buildWelcomeAfterLogoutPath() {
  return buildLoginAfterLogoutPath();
}

/** @deprecated Use {@link buildLoginAfterLogoutUrl}. */
export function buildWelcomeAfterLogoutUrl() {
  return buildLoginAfterLogoutUrl();
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
 * @param {{ navigate?: (to: string, options?: { replace?: boolean }) => void }} [options]
 * @returns {Promise<boolean>} true jeśli zaplanowano przekierowanie
 */
export async function logoutUser(onNavigationFailed, options = {}) {
  clearClientAuthState();

  const loginAfterLogoutPath = buildLoginAfterLogoutPath();
  const loginAfterLogoutUrl = buildLoginAfterLogoutUrl();
  const postLogoutRedirect = encodeURIComponent(loginAfterLogoutPath);
  const samlLogoutBase = getSamlLogoutUrl();
  const { navigate } = options;

  if (samlLogoutBase.length === 0) {
    if (typeof navigate === 'function') {
      navigate(loginAfterLogoutPath, { replace: true });
      return true;
    }

    window.location.replace(loginAfterLogoutUrl);
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
