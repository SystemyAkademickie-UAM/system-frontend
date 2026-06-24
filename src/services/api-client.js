import { getApiBaseUrl } from '../constants/api.constants.js';

/**
 * Lightweight API client using native `fetch`.
 * Resolves the base URL from `VITE_API_BASE_URL` or the Vite proxy fallback.
 * Uses HttpOnly session cookie (maq_session) via credentials: 'include'.
 */

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

  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}
