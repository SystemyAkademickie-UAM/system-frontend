import { describe, expect, it } from 'vitest';

import { AUTH_SAML_LOGIN_PATH } from './authPaths.constants.js';

/**
 * Smoke: path segment must stay aligned with `system-backend` `SamlAuthController` (`auth/saml`) and `main` global prefix (`/api`).
 */
describe('SAML login path', () => {
  it('uses /auth/saml/login relative to the API base', () => {
    expect(AUTH_SAML_LOGIN_PATH).toBe('/auth/saml/login');
  });
});
