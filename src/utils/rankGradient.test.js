/**
 * @file rankGradient.test.js
 * @description Zestaw testów jednostkowych weryfikujących funkcjonalność rankGradient.
 */

// === IMPORTY I ŚRODOWISKO TESTOWE ===
import { describe, expect, it } from 'vitest';
import { getRankGradientColor, interpolateHexColor } from './rankGradient.js';

// === SCENARIUSZE TESTOWE (SUITE) ===
describe('rankGradient', () => {
  it('interpolates between two colors', () => {
    expect(interpolateHexColor('#000000', '#ffffff', 0.5)).toBe('#808080');
  });
});
