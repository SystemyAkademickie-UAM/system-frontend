import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import {
  AUTH_LOGIN_REGISTRATION_STATUS_PATH,
  AUTH_SAML_BYPASS_SESSION_PATH,
  AUTH_SAML_ME_PATH,
} from '../../../constants/authPaths.constants.js';
import { exchangeSamlSessionForAuthToken } from '../../../services/exchangeAuthToken.js';

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
 * Temporary dev login: bypass SAML session, issue auth cookie, return registration status.
 * @param {string} persona Dev bypass persona id (e.g. `student1`, `admin`).
 * @returns {Promise<{ registrationCompleted: boolean, eulaAccepted: boolean, sessionAuthenticated: boolean }>}
 */
export async function performTemporaryRoleLogin(persona) {
  const baseUrl = getApiBaseUrl();
  if (baseUrl.length === 0) {
    throw new Error('Brak adresu API.');
  }

  const browserId = getOrCreateBrowserId();

  const bypassResponse = await fetch(`${baseUrl}${AUTH_SAML_BYPASS_SESSION_PATH}`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ persona }),
  });
  if (!bypassResponse.ok) {
    throw new Error(await readErrorMessage(bypassResponse, 'Logowanie nie powiodło się.'));
  }

  const tokenExchange = await exchangeSamlSessionForAuthToken();
  if (!tokenExchange.ok) {
    throw new Error(tokenExchange.message);
  }

  const statusResponse = await fetch(`${baseUrl}${AUTH_LOGIN_REGISTRATION_STATUS_PATH}`, {
    credentials: 'include',
    headers: {
      'X-Browser-ID': browserId,
    },
  });
  if (!statusResponse.ok) {
    throw new Error(await readErrorMessage(statusResponse, 'Nie udało się sprawdzić konta.'));
  }

  const status = await statusResponse.json();

  const meResponse = await fetch(`${baseUrl}${AUTH_SAML_ME_PATH}`, {
    credentials: 'include',
  });
  let sessionAuthenticated = false;
  if (meResponse.ok) {
    const me = await meResponse.json();
    sessionAuthenticated = me.authenticated === true;
  }

  return {
    registrationCompleted: status.registrationCompleted === true,
    eulaAccepted: status.eulaAccepted === true,
    sessionAuthenticated,
  };
}
