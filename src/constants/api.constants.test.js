import { describe, expect, it, vi, afterEach } from 'vitest';

import { AUTH_LOGIN_ME_PATH, AUTH_SAML_LOGIN_PATH, AUTH_SAML_ME_PATH } from './authPaths.constants.js';
import { getAssetUrl } from './api.constants.js';

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

describe('getAssetUrl', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns null for empty paths', () => {
    expect(getAssetUrl(null)).toBeNull();
    expect(getAssetUrl('')).toBeNull();
    expect(getAssetUrl('   ')).toBeNull();
  });

  it('passes through absolute URLs', () => {
    expect(getAssetUrl('https://cdn.example/avatar.png')).toBe('https://cdn.example/avatar.png');
  });

  it('prefixes DB asset paths with VITE_API_BASE_URL', () => {
    vi.stubEnv('VITE_API_BASE_URL', 'https://maq.projektstudencki.pl/api');
    expect(getAssetUrl('/assets/avatars/desert_cactus.png')).toBe(
      'https://maq.projektstudencki.pl/api/assets/avatars/desert_cactus.png',
    );
    expect(getAssetUrl('assets/banners/space.png')).toBe(
      'https://maq.projektstudencki.pl/api/assets/banners/space.png',
    );
  });

  it('uses /api/assets via dev origin when VITE_API_BASE_URL is unset', () => {
    vi.stubEnv('DEV', true);
    vi.stubEnv('VITE_API_BASE_URL', '');
    expect(getAssetUrl('/assets/icons/award.svg')).toBe(
      `${globalThis.location.origin}/api/assets/icons/award.svg`,
    );
  });
});
