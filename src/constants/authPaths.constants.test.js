import { describe, expect, it } from 'vitest';

import {
  AUTH_LOGIN_PROVIDER_PIONIER,
  AUTH_LOGIN_STATE_PROVIDER_KEY,
  buildLoginStateForProvider,
} from './authPaths.constants.js';

describe('authPaths.constants', () => {
  it('buildLoginStateForProvider sets the state key used by /login', () => {
    expect(buildLoginStateForProvider(AUTH_LOGIN_PROVIDER_PIONIER)).toEqual({
      [AUTH_LOGIN_STATE_PROVIDER_KEY]: AUTH_LOGIN_PROVIDER_PIONIER,
    });
  });
});
