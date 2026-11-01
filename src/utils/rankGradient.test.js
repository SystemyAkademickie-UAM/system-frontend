import { describe, expect, it } from 'vitest';
import { getRankGradientColor, interpolateHexColor } from './rankGradient.js';

describe('rankGradient', () => {
  it('interpolates between two colors', () => {
    expect(interpolateHexColor('#000000', '#ffffff', 0.5)).toBe('#808080');
  });
});
