import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSessionExpired, registerClientAuthClearListener } from './clientAuthState.js';
import { isPublicAuthEndpoint } from '../services/api-client.js';

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
});
