/**
 * Session / current user (relative to API base that ends with `/api`).
 */
export const AUTH_SAML_ME_PATH = '/auth/saml/me';

/** Resource path for SAML-ready organizations (institution picker). */
export const AUTH_SAML_ORGANIZATIONS_PATH = '/auth/saml/organizations';

/** Resource path for SAML SP configuration status. */
export const AUTH_SAML_STATUS_PATH = '/auth/saml/status';

/**
 * Resource path for starting SAML SSO (relative to API base that ends with `/api`).
 * Full URL: `getSamlLoginUrl(organizationId)`.
 */
export const AUTH_SAML_LOGIN_PATH = '/auth/saml/login';

/**
 * Resource path for SAML Single Logout (relative to API base).
 * Navigating here will redirect to IdP logout, then back to app.
 */
export const AUTH_SAML_LOGOUT_PATH = '/auth/saml/logout';

/** Opaque bearer issuance after SAML session cookie + `X-Browser-ID`. */
export const AUTH_LOGIN_PATH = '/login';

/** Clears `maq_auth` + SAML session cookies. */
export const AUTH_LOGOUT_PATH = '/logout';

/** Session check from `maq_auth` cookie + `X-Browser-ID` (same shape as `/auth/saml/me`). */
export const AUTH_LOGIN_ME_PATH = '/login/me';

/** Registration progress during the `/login` wizard. */
export const AUTH_LOGIN_REGISTRATION_STATUS_PATH = '/login/registration-status';

/** Save nickname and avatar during the `/login` wizard. */
export const AUTH_LOGIN_PROFILE_PATH = '/login/profile';

/** Accept EULA and complete registration during the `/login` wizard. */
export const AUTH_LOGIN_ACCEPT_EULA_PATH = '/login/accept-eula';
