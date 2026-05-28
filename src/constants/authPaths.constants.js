/**
 * Session / current user (relative to API base that ends with `/api`).
 */
export const AUTH_SAML_ME_PATH = '/auth/saml/me';

/**
 * Resource path for starting SAML SSO (relative to API base that ends with `/api`).
 * Full URL: `getApiBaseUrl() + AUTH_SAML_LOGIN_PATH`.
 */
export const AUTH_SAML_LOGIN_PATH = '/auth/saml/login';

/**
 * Resource path for SAML Single Logout (relative to API base).
 * Navigating here will redirect to IdP logout, then back to app.
 */
export const AUTH_SAML_LOGOUT_PATH = '/auth/saml/logout';

/** Opaque bearer issuance after SAML session cookie + `X-Browser-ID`. */
export const AUTH_LOGIN_PATH = '/login';

/** Registration progress during the `/login` wizard. */
export const AUTH_LOGIN_REGISTRATION_STATUS_PATH = '/login/registration-status';

/** Save nickname and avatar during the `/login` wizard. */
export const AUTH_LOGIN_PROFILE_PATH = '/login/profile';

/** Accept EULA and complete registration during the `/login` wizard. */
export const AUTH_LOGIN_ACCEPT_EULA_PATH = '/login/accept-eula';

/** Dev-only SAML session mint (requires `SAML_BYPASS_ENABLED`). */
export const AUTH_SAML_BYPASS_SESSION_PATH = '/auth/saml/bypass/session';

/** Dev-only bypass status + persona list. */
export const AUTH_SAML_BYPASS_STATUS_PATH = '/auth/saml/bypass/status';
