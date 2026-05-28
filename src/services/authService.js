import { getSamlLogoutUrl } from '../constants/api.constants.js';

/**
 * Wylogowuje użytkownika — przekierowuje na SAML Single Logout (IdP + lokalne ciastka).
 * Nie używaj POST /logout przed tym krokiem: backend potrzebuje ciastka sesji SAML w żądaniu GET.
 *
 * @returns {boolean} true jeśli rozpoczęto przekierowanie
 */
export function logoutUser() {
  const samlLogoutUrl = getSamlLogoutUrl();
  if (samlLogoutUrl.length === 0) {
    return false;
  }
  window.location.assign(samlLogoutUrl);
  return true;
}
