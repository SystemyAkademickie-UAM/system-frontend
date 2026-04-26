import { describe, expect, it } from 'vitest';

import { AUTH_SAML_LOGIN_PATH, AUTH_SAML_LOGOUT_PATH, AUTH_SAML_ME_PATH } from './authPaths.constants.js';

/**
 * Smoke: path segment must stay aligned with `system-backend` `SamlAuthController` (`auth/saml`) and `main` global prefix (`/api`).
 */
describe('SAML auth paths', () => {
  it('uses /auth/saml/login relative to the API base', () => {
    expect(AUTH_SAML_LOGIN_PATH).toBe('/auth/saml/login');
  });

  it('uses /auth/saml/logout relative to the API base', () => {
    expect(AUTH_SAML_LOGOUT_PATH).toBe('/auth/saml/logout');
  });

  it('uses /auth/saml/me relative to the API base', () => {
    expect(AUTH_SAML_ME_PATH).toBe('/auth/saml/me');
  });
});
