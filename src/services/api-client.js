import { getApiBaseUrl } from '../constants/api.constants.js';

/**
 * Lightweight API client using native `fetch`.
 * Resolves the base URL from `VITE_API_BASE_URL` or the Vite proxy fallback.
 */

/**
 * Sends a JSON POST request to the given resource path.
 * @param {string} resourcePath - Path relative to the API prefix, e.g. `/groups/1/badges`
 * @param {Record<string, unknown>} body - JSON-serializable payload
 * @returns {Promise<{ ok: boolean, status: number, data: unknown }>}
 */
export async function postJson(resourcePath, body) {
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
 * Builds the full absolute URL for a given resource path (for copy-to-clipboard).
 * @param {string} resourcePath
 * @returns {string}
 */
export function buildFullUrl(resourcePath) {
  const base = getApiBaseUrl();
  return `${base}${resourcePath}`;
}

/** @param {Response} response */
async function parseResponseBody(response) {
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
}
