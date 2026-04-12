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
 * Base URL for API calls: scheme + host + global API prefix (e.g. /api), no trailing slash.
 * Paths in code are resource paths only (e.g. /counter/increment), not /api/... .
 * - Dev: defaults to http://127.0.0.1:8080/api (matches Nest global prefix).
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
    return 'http://127.0.0.1:8080/api';
  }
  if (typeof globalThis.location?.origin === 'string' && globalThis.location.origin.length > 0) {
    return `${globalThis.location.origin}/api`;
  }
  return '';
}
