/**
 * Resource path for starting SAML SSO (relative to API base that ends with `/api`).
 * Full URL: `getApiBaseUrl() + AUTH_SAML_LOGIN_PATH`.
 */
export const AUTH_SAML_LOGIN_PATH = '/auth/saml/login';

/** Query on SAML login URL — backend sets SAML `ForceAuthn` (must match API `SAML_LOGIN_FORCE_AUTHN_*`). */
export const AUTH_SAML_LOGIN_FORCE_AUTHN_QUERY = 'forceAuthn';

export const AUTH_SAML_LOGIN_FORCE_AUTHN_VALUE = '1';

/**
 * After successful app logout, next SAML start should append {@link AUTH_SAML_LOGIN_FORCE_AUTHN_QUERY} so the IdP
 * does not silently SSO. Cleared when the user continues to IdP from the institution picker.
 */
export const AUTH_SAML_FORCE_AUTHN_ONCE_STORAGE_KEY = 'maqSamlForceAuthnOnce';

/** `GET` — session smoke (`{ authenticated, user? }`) from the HTTP-only cookie. */
export const AUTH_SAML_ME_PATH = '/auth/saml/me';

/** `POST` — clears the HTTP-only session cookie (`maqSamlSession`). */
export const AUTH_SAML_LOGOUT_PATH = '/auth/saml/logout';

/** `GET` list for institution picker (relative to API base). */
export const AUTH_SAML_INSTITUTIONS_PATH = '/auth/saml/institutions';

/** Value for `location.state[AUTH_LOGIN_STATE_PROVIDER_KEY]` — PIONIER.id institution picker on `/login`. */
export const AUTH_LOGIN_PROVIDER_PIONIER = 'pionier';

/** Key on `location.state` set when continuing from `/login` into a federated flow (no URL change). */
export const AUTH_LOGIN_STATE_PROVIDER_KEY = 'provider';

/** Legacy query `?provider=` — stripped and copied into `location.state` on `/login`. */
export const AUTH_LOGIN_LEGACY_PROVIDER_QUERY = 'provider';

/**
 * @param {string} provider
 * @returns {Record<string, string>}
 */
export function buildLoginStateForProvider(provider) {
  return { [AUTH_LOGIN_STATE_PROVIDER_KEY]: provider };
}
