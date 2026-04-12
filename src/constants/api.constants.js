/**
 * Base URL for API calls: scheme + host + global API prefix (e.g. /api), no trailing slash.
 * Paths in code are resource paths only (e.g. /counter/increment), not /api/... .
 * - Dev: defaults to http://127.0.0.1:8080/api (matches Nest global prefix).
 * - Production: set VITE_API_BASE_URL (e.g. https://example.org/api).
 */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured !== undefined && configured !== '') {
    return configured.replace(/\/+$/, '');
  }
  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8080/api';
  }
  return '';
}
