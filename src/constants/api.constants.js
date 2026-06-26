import { AUTH_SAML_LOGIN_PATH, AUTH_SAML_LOGOUT_PATH } from './authPaths.constants.js';

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
 * Absolute URL to start SAML login for a registered organization.
 * @param {number} organizationId
 */
export function getSamlLoginUrl(organizationId) {
  const base = getApiBaseUrl();
  if (base.length === 0) {
    return '';
  }
  const parsedId = Number(organizationId);
  if (!Number.isFinite(parsedId) || parsedId <= 0) {
    return '';
  }
  return `${base.replace(/\/+$/, '')}${AUTH_SAML_LOGIN_PATH}?organizationId=${parsedId}`;
}

/**
 * Absolute URL for SAML Single Logout (redirects to IdP for full logout).
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

/**
 * Resolves the absolute URL for a backend-hosted asset (avatars, banners, shop images).
 * DB paths stay `/assets/...`; production serves them under `/api/assets/...` via the API proxy.
 * Frontend-owned files (favicon, UI SVGs) use `publicAssetPath()` instead.
 * @param {string | null | undefined} path
 * @returns {string | null}
 */
export function getAssetUrl(path) {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  const trimmed = String(path).trim();
  if (!trimmed) return null;

  let assetPath = trimmed;
  if (assetPath.startsWith('/api/assets/')) {
    assetPath = assetPath.slice('/api'.length);
  } else if (!assetPath.startsWith('/assets/')) {
    assetPath = assetPath.startsWith('assets/')
      ? `/${assetPath}`
      : `/assets/${assetPath.replace(/^\/+/, '')}`;
  }

  const apiBase = getApiBaseUrl();
  if (apiBase) {
    return `${apiBase}${assetPath}`;
  }

  if (import.meta.env.DEV) {
    return `http://127.0.0.1:8080/api${assetPath}`;
  }

  return assetPath;
}
