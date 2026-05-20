import { getApiBaseUrl } from '../constants/api.constants.js';

const LOGOUT_PATH = '/login/logout';

/**
 * Wylogowuje użytkownika — czyści ciastka sesji na backendzie.
 * @returns {Promise<boolean>} true jeśli sukces
 */
export async function logoutUser() {
  try {
    const base = getApiBaseUrl();
    if (!base) {
      return false;
    }
    const response = await fetch(`${base}${LOGOUT_PATH}`, {
      method: 'POST',
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}
