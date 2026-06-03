import { describe, expect, it } from 'vitest';
import { pickRandom, randomInt } from './temporarySeedGroupData.js';

describe('temporarySeedGroupData helpers', () => {
  it('pickRandom returns an item from the array', () => {
    const items = ['a', 'b', 'c'];
    expect(items).toContain(pickRandom(items));
  });

  it('randomInt stays within bounds', () => {
    for (let index = 0; index < 20; index += 1) {
      const value = randomInt(5, 10);
      expect(value).toBeGreaterThanOrEqual(5);
      expect(value).toBeLessThanOrEqual(10);
    }
  });
});
