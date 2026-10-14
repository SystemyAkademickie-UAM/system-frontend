import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleSessionExpired, registerClientAuthClearListener } from './clientAuthState.js';
import { isPublicAuthEndpoint } from '../services/api-client.js';
import { SESSION_IDLE_TIMEOUT_MS, STORAGE_KEY_LAST_ACTIVITY } from '../context/SessionContext.jsx';
import * as rememberMeService from '../services/rememberMeService.js';

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

  it('defines 15-minute idle timeout and activity storage key', () => {
    expect(SESSION_IDLE_TIMEOUT_MS).toBe(15 * 60 * 1000);
    expect(STORAGE_KEY_LAST_ACTIVITY).toBe('maq_last_activity');
  });

  it('does not call backend logout if Remember Me is active', () => {
    vi.spyOn(rememberMeService, 'getRememberMe').mockReturnValue(true);
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    handleSessionExpired();

    expect(fetchSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('/auth/saml/logout'),
      expect.anything(),
    );
  });
});
