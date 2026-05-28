import { getOrCreateBrowserId } from '../auth/browserIdStorage.js';
import { getApiBaseUrl } from '../constants/api.constants.js';
import { AUTH_LOGIN_PATH } from '../constants/authPaths.constants.js';

/**
 * @param {Response} response
 * @param {string} fallbackText
 * @returns {Promise<string>}
 */
async function readErrorMessage(response, fallbackText) {
  const text = await response.text();
  if (text.trim().length === 0) {
    return fallbackText;
  }
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed.message === 'string' && parsed.message.trim().length > 0) {
      return parsed.message;
    }
  } catch {
    // use raw text
  }
  return text;
}

/**
 * Exchanges the HTTP-only SAML session cookie for the opaque `maq_auth` API token cookie.
 * Required before registration wizard steps and most authenticated API calls.
 *
 * @returns {Promise<{ ok: true } | { ok: false, status: number, message: string }>}
 */
export async function exchangeSamlSessionForAuthToken() {
  const baseUrl = getApiBaseUrl();
  if (baseUrl.length === 0) {
    return { ok: false, status: 0, message: 'Brak adresu API.' };
  }

  const browserId = getOrCreateBrowserId();
  const response = await fetch(`${baseUrl}${AUTH_LOGIN_PATH}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Browser-ID': browserId,
    },
    body: '{}',
  });

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: await readErrorMessage(response, 'Nie udało się nawiązać sesji API.'),
    };
  }

  return { ok: true };
}
