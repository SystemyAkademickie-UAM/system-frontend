/**
 * @file visibilityStatusLabel.test.js
 * @description Testy jednostkowe 3-stanowej widoczności odznak (widoczna, ukryta, sekretna).
 */

import { describe, expect, it } from 'vitest';
import {
  BADGE_VISIBILITY,
  badgeVisibilityModeToFlags,
  getBadgeVisibilityMode,
  getBadgeVisibilityOptions,
  getTileVisibilityLabel,
  getVisibilityStatusLabel,
} from './visibilityStatusLabel.js';

describe('badge visibility helpers', () => {
  it('maps visibility flags to visible, hidden, and secret modes', () => {
    expect(getBadgeVisibilityMode({ isPublished: true, isSecret: false })).toBe(BADGE_VISIBILITY.visible);
    expect(getBadgeVisibilityMode({ isPublished: false, isSecret: false })).toBe(BADGE_VISIBILITY.hidden);
    expect(getBadgeVisibilityMode({ isPublished: false, isSecret: true })).toBe(BADGE_VISIBILITY.hidden);
    expect(getBadgeVisibilityMode({ isPublished: true, isSecret: true })).toBe(BADGE_VISIBILITY.secret);
    expect(getBadgeVisibilityMode(null)).toBe(BADGE_VISIBILITY.hidden);
  });

  it('maps dropdown modes back to API flags', () => {
    expect(badgeVisibilityModeToFlags(BADGE_VISIBILITY.visible)).toEqual({ isPublished: true, isSecret: false });
    expect(badgeVisibilityModeToFlags(BADGE_VISIBILITY.hidden)).toEqual({ isPublished: false, isSecret: false });
    expect(badgeVisibilityModeToFlags(BADGE_VISIBILITY.secret)).toEqual({ isPublished: true, isSecret: true });
  });

  it('returns the three dropdown options in required order in Polish and English', () => {
    expect(getBadgeVisibilityOptions('polish')).toEqual([
      { value: 'visible', label: 'Odznaka widoczna' },
      { value: 'hidden', label: 'Odznaka ukryta' },
      { value: 'secret', label: 'Odznaka sekretna' },
    ]);
    expect(getBadgeVisibilityOptions('english')).toEqual([
      { value: 'visible', label: 'Visible badge' },
      { value: 'hidden', label: 'Hidden badge' },
      { value: 'secret', label: 'Secret badge' },
    ]);
  });

  it('formats status and tile labels for public, hidden, and secret badges', () => {
    expect(getVisibilityStatusLabel(true, 'badge', 'polish', false)).toBe('Publiczna');
    expect(getVisibilityStatusLabel(false, 'badge', 'polish', false)).toBe('Ukryta');
    expect(getVisibilityStatusLabel(true, 'badge', 'polish', true)).toBe('Sekretna');
    expect(getVisibilityStatusLabel(false, 'badge', 'polish', true)).toBe('Ukryta');
    expect(getTileVisibilityLabel(true, 'badge', 'english', true)).toBe('Secret');
    expect(getVisibilityStatusLabel(true, 'item', 'polish')).toBe('Publiczny');
    expect(getVisibilityStatusLabel(false, 'item', 'polish')).toBe('Ukryty');
  });
});
