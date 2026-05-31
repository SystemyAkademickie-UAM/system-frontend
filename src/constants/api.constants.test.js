import { describe, expect, it } from 'vitest';

import { AUTH_LOGIN_ME_PATH, AUTH_SAML_LOGIN_PATH, AUTH_SAML_ME_PATH } from './authPaths.constants.js';

/**
 * Smoke: path segment must stay aligned with `system-backend` `SamlAuthController` (`auth/saml`) and `main` global prefix (`/api`).
 */
describe('SAML login path', () => {
  it('uses /auth/saml/login relative to the API base', () => {
    expect(AUTH_SAML_LOGIN_PATH).toBe('/auth/saml/login');
  });

  it('uses /auth/saml/me for session check relative to the API base', () => {
    expect(AUTH_SAML_ME_PATH).toBe('/auth/saml/me');
  });

  it('uses /login/me for API token session check relative to the API base', () => {
    expect(AUTH_LOGIN_ME_PATH).toBe('/login/me');
  });
});
