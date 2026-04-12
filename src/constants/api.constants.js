/**
 * Base URL for API calls (no trailing slash).
 * - Dev: defaults to http://127.0.0.1:8080
 * - Production: set VITE_API_BASE_URL to an absolute origin, or '' only if the API is exposed on the same host/path the browser already uses.
 */
export function getApiBaseUrl() {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured !== undefined && configured !== '') {
    return configured;
  }
  if (import.meta.env.DEV) {
    return 'http://127.0.0.1:8080';
  }
  return '';
}
