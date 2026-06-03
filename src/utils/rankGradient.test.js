import { describe, expect, it } from 'vitest';
import { getRankGradientColor, interpolateHexColor } from './rankGradient.js';

describe('rankGradient', () => {
  it('returns green for the lowest rank', () => {
    expect(getRankGradientColor(0, 3)).toBe('#42f37d');
  });

  it('returns orange for the highest rank', () => {
    expect(getRankGradientColor(2, 3)).toBe('#ff9142');
  });

  it('interpolates between two colors', () => {
    expect(interpolateHexColor('#000000', '#ffffff', 0.5)).toBe('#808080');
  });
});
