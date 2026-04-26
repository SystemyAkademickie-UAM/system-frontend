import {
  AUTH_SAML_INSTITUTIONS_PATH,
  AUTH_SAML_LOGIN_FORCE_AUTHN_QUERY,
  AUTH_SAML_LOGIN_FORCE_AUTHN_VALUE,
  AUTH_SAML_LOGIN_PATH,
  AUTH_SAML_LOGOUT_PATH,
  AUTH_SAML_ME_PATH,
} from './authPaths.constants.js';

/**
 * If the page is https but the build still has http for the same host (old image), upgrade to https to avoid mixed content.
 */
function upgradeApiBaseToMatchPageScheme(base) {
  if (typeof globalThis.location?.protocol !== 'string' || globalThis.location.protocol !== 'https:') {
    return base;
  }
  try {
    const apiUrl = new URL(base);
    if (apiUrl.protocol !== 'http:') {
      return base;
    }
    const host = apiUrl.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return base;
    }
    if (host !== globalThis.location.hostname) {
      return base;
    }
    apiUrl.protocol = 'https:';
    return apiUrl.toString().replace(/\/+$/, '');
  } catch {
    return base;
  }
}

/**
 * Absolute URL to start SAML login (full browser navigation to API `GET .../auth/saml/login`).
 * @param {string} [institutionId] When set, adds `institution=` for the picker flow (must match API registry).
 * @param {{ forceAuthn?: boolean }} [options] When true, adds `forceAuthn=1` so the IdP performs fresh authentication.
 */
export function getSamlLoginUrl(institutionId, options) {
  const base = getApiBaseUrl();
  if (base.length === 0) {
    return '';
  }
  const url = new URL(`${base.replace(/\/+$/, '')}${AUTH_SAML_LOGIN_PATH}`);
  if (institutionId !== undefined && institutionId.length > 0) {
    url.searchParams.set('institution', institutionId);
  }
  if (options?.forceAuthn === true) {
    url.searchParams.set(AUTH_SAML_LOGIN_FORCE_AUTHN_QUERY, AUTH_SAML_LOGIN_FORCE_AUTHN_VALUE);
  }
  return url.toString();
}

/**
 * `GET` JSON for institution list (`{ samlReady, institutions }`).
 */
export function getSamlInstitutionsUrl() {
  const base = getApiBaseUrl();
  if (base.length === 0) {
    return '';
  }
  return `${base.replace(/\/+$/, '')}${AUTH_SAML_INSTITUTIONS_PATH}`;
}

/**
 * `GET` — reads session from cookie; call with `credentials: 'include'`.
 */
export function getSamlMeUrl() {
  const base = getApiBaseUrl();
  if (base.length === 0) {
    return '';
  }
  return `${base.replace(/\/+$/, '')}${AUTH_SAML_ME_PATH}`;
}

/**
 * `POST` — clears the SAML session cookie; call with `credentials: 'include'`.
 */
export function getSamlLogoutUrl() {
  const base = getApiBaseUrl();
  if (base.length === 0) {
    return '';
  }
  return `${base.replace(/\/+$/, '')}${AUTH_SAML_LOGOUT_PATH}`;
}

/**
 * Base URL for API calls: scheme + host + global API prefix (e.g. /api), no trailing slash.
 * Paths in code are resource paths only (e.g. /counter/increment), not /api/... .
 * - Dev: when the page has an origin (browser), uses `origin + /api` so Vite’s `/api` proxy can share cookies with the API.
 *   Falls back to http://127.0.0.1:8080/api when no `location` (e.g. some tests).
 * - Production: set VITE_API_BASE_URL (must use https if the page is served over https — mixed content otherwise).
 *   If unset in production, uses the current page origin + `/api` (same scheme as the UI).
 */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured !== undefined && configured !== '') {
    const trimmed = configured.replace(/\/+$/, '');
    return upgradeApiBaseToMatchPageScheme(trimmed);
  }
  if (import.meta.env.DEV) {
    if (
      typeof globalThis.location?.origin === 'string' &&
      globalThis.location.origin.length > 0
    ) {
      return `${globalThis.location.origin}/api`;
    }
    return 'http://127.0.0.1:8080/api';
  }
  if (typeof globalThis.location?.origin === 'string' && globalThis.location.origin.length > 0) {
    return `${globalThis.location.origin}/api`;
  }
  return '';
}
