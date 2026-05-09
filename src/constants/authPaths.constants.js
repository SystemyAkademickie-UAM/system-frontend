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
