/**
 * @file nodeEnv.test.js
 * @description Zestaw testów jednostkowych weryfikujących funkcjonalność nodeEnv.
 */

// === IMPORTY I ŚRODOWISKO TESTOWE ===
import { describe, expect, it } from 'vitest';

import { resolveNodeProduction } from './nodeEnv.js';

// === SCENARIUSZE TESTOWE (SUITE) ===
describe('resolveNodeProduction', () => {
  it('returns true only when NODE_ENV is production', () => {
    expect(resolveNodeProduction('production')).toBe(true);
  });

  it('returns false for development and other values', () => {
    expect(resolveNodeProduction('development')).toBe(false);
    expect(resolveNodeProduction('test')).toBe(false);
  });

  it('returns false when NODE_ENV is unset', () => {
    expect(resolveNodeProduction(undefined)).toBe(false);
    expect(resolveNodeProduction('')).toBe(false);
  });
});
