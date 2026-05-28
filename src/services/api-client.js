import { getApiBaseUrl } from '../constants/api.constants.js';
import { getOrCreateBrowserId } from '../auth/browserIdStorage.js';

/**
 * Lightweight API client using native `fetch`.
 * Resolves the base URL from `VITE_API_BASE_URL` or the Vite proxy fallback.
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
 * @param {{ includeBrowserId?: boolean }} [options]
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function getJson(resourcePath, options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  /** @type {Record<string, string>} */
  const headers = {};
  if (options.includeBrowserId) {
    headers['X-Browser-ID'] = getOrCreateBrowserId();
  }

  const response = await fetch(url, {
    method: 'GET',
    headers,
    credentials: 'include',
  });

  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}

/**
 * Sends a JSON POST request to the given resource path.
 * @param {string} resourcePath - Path relative to the API prefix, e.g. `/groups/1/badges`
 * @param {Record<string, unknown>} body - JSON-serializable payload
 * @param {{ includeBrowserId?: boolean }} [options]
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function postJson(resourcePath, body, options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  /** @type {Record<string, string>} */
  const headers = { 'Content-Type': 'application/json' };
  if (options.includeBrowserId) {
    headers['X-Browser-ID'] = getOrCreateBrowserId();
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
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
 * @param {{ includeBrowserId?: boolean }} [options]
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function patchJson(resourcePath, body, options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  /** @type {Record<string, string>} */
  const headers = { 'Content-Type': 'application/json' };
  if (options.includeBrowserId) {
    headers['X-Browser-ID'] = getOrCreateBrowserId();
  }

  const response = await fetch(url, {
    method: 'PATCH',
    headers,
    credentials: 'include',
    body: JSON.stringify(body),
  });

  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}

/**
 * Sends a DELETE request to the given resource path.
 * @param {string} resourcePath
 * @param {{ includeBrowserId?: boolean }} [options]
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function deleteJson(resourcePath, options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${resourcePath}`;

  /** @type {Record<string, string>} */
  const headers = {};
  if (options.includeBrowserId) {
    headers['X-Browser-ID'] = getOrCreateBrowserId();
  }

  const response = await fetch(url, {
    method: 'DELETE',
    headers,
    credentials: 'include',
  });

  const data = await parseResponseBody(response);
  return { ok: response.ok, status: response.status, data };
}
