import { getApiBaseUrl } from '../constants/api.constants.js';
import { handleSessionExpired } from '../auth/clientAuthState.js';

/**
 * Lightweight API client using native `fetch`.
 * Resolves the base URL from `VITE_API_BASE_URL` or the Vite proxy fallback.
 * Uses HttpOnly session cookie (maq_session) via credentials: 'include'.
 */

const PUBLIC_AUTH_PATHS = [
  '/login/me',
  '/login/magic-link',
  '/login/organizations',
  '/auth/saml/login',
  '/auth/saml/organizations',
  '/auth/saml/status',
];

export function isPublicAuthEndpoint(pathOrUrl) {
  if (!pathOrUrl || typeof pathOrUrl !== 'string') return false;
  return PUBLIC_AUTH_PATHS.some((path) => pathOrUrl.includes(path));
}

function handleResponseStatus(response, resourcePath) {
  if (response?.status === 401 && !isPublicAuthEndpoint(resourcePath)) {
    handleSessionExpired();
  }
}

/**
 * Global response interceptor to catch any 401 from direct fetch calls.
 */
let interceptorInstalled = false;

export function setupGlobalFetchSessionInterceptor() {
  if (interceptorInstalled || typeof window === 'undefined' || typeof window.fetch !== 'function') {
    return;
  }
  interceptorInstalled = true;
  const originalFetch = window.fetch;

  window.fetch = async function interceptedFetch(...args) {
    const response = await originalFetch.apply(this, args);
    if (response && response.status === 401) {
      const url = typeof args[0] === 'string' ? args[0] : (args[0]?.url || '');
      if (!isPublicAuthEndpoint(url)) {
        handleSessionExpired();
      }
    }
    return response;
  };
}

setupGlobalFetchSessionInterceptor();

/**
 * @param {Response} response
 * @returns {Promise<unknown>}
 */
async function parseResponseBody(response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}

/**
 * Builds the full absolute URL for a given resource path.
 * @param {string} resourcePath
 * @returns {string}
 */
export function buildFullUrl(resourcePath) {
  const base = getApiBaseUrl();
  return `${base}${resourcePath}`;
}

/**
 * Sends a GET request to the given resource path.
 * @param {string} resourcePath - Path relative to the API prefix
 * @param {object} [_options] - Unused, kept for backward compatibility
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function getJson(resourcePath, _options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  handleResponseStatus(response, resourcePath);
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}

/**
 * Sends a JSON POST request to the given resource path.
 * @param {string} resourcePath - Path relative to the API prefix, e.g. `/groups/1/badges`
 * @param {Record<string, unknown>} body - JSON-serializable payload
 * @param {object} [_options] - Unused, kept for backward compatibility
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function postJson(resourcePath, body, _options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  handleResponseStatus(response, resourcePath);
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}

/**
 * Sends a JSON PATCH request to the given resource path.
 * @param {string} resourcePath
 * @param {Record<string, unknown>} body
 * @param {object} [_options] - Unused, kept for backward compatibility
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function patchJson(resourcePath, body, _options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  handleResponseStatus(response, resourcePath);
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}

/**
 * Sends a JSON PUT request to the given resource path.
 * @param {string} resourcePath
 * @param {Record<string, unknown>} body
 * @param {object} [_options] - Unused, kept for backward compatibility
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function putJson(resourcePath, body, _options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  handleResponseStatus(response, resourcePath);
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}

/**
 * Sends a DELETE request to the given resource path.
 * @param {string} resourcePath
 * @param {object} [_options] - Unused, kept for backward compatibility
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function deleteJson(resourcePath, _options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  const response = await fetch(url, {
    method: 'DELETE',
    credentials: 'include',
  });

  handleResponseStatus(response, resourcePath);
  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}
