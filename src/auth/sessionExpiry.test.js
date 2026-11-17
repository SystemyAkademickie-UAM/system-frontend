/**
 * @file sessionExpiry.test.js
 * @description Zestaw testów jednostkowych weryfikujących funkcjonalność sessionExpiry.
 */

// === IMPORTY I ŚRODOWISKO TESTOWE ===
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleMaintenanceRedirect, handleSessionExpired, registerClientAuthClearListener } from './clientAuthState.js';

import { isPublicAuthEndpoint, isPublicSystemEndpoint } from '../services/api-client.js';

// === SCENARIUSZE TESTOWE (SUITE) ===
describe('Session expiry handling', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('triggers clear listeners when handleSessionExpired is called', () => {
    const clearCallback = vi.fn();
    const unsubscribe = registerClientAuthClearListener(clearCallback);

    handleSessionExpired();
    expect(clearCallback).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it('identifies public auth endpoints correctly', () => {
    expect(isPublicAuthEndpoint('/login/me')).toBe(true);
    expect(isPublicAuthEndpoint('/login/magic-link/request')).toBe(true);
    expect(isPublicAuthEndpoint('/auth/saml/login')).toBe(true);
    expect(isPublicAuthEndpoint('/auth/saml/organizations')).toBe(true);
    expect(isPublicAuthEndpoint('/auth/saml/status')).toBe(true);

    expect(isPublicAuthEndpoint('/groups')).toBe(false);
    expect(isPublicAuthEndpoint('/groups/123/badges')).toBe(false);
    expect(isPublicAuthEndpoint('/students/1')).toBe(false);
    expect(isPublicAuthEndpoint('/shop')).toBe(false);
  });

  it('identifies public system status endpoints correctly', () => {
    expect(isPublicSystemEndpoint('/system/status')).toBe(true);
    expect(isPublicSystemEndpoint('/api/system/status')).toBe(true);
    expect(isPublicSystemEndpoint('/system/maintenance')).toBe(true);
    expect(isPublicSystemEndpoint('/groups')).toBe(false);
  });

  it('does not crash when calling handleMaintenanceRedirect', () => {
    expect(() => handleMaintenanceRedirect()).not.toThrow();
  });

});
