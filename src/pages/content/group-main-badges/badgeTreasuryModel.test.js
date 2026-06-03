import { describe, expect, it } from 'vitest';
import { BADGE_RARITY } from '../../../components/ui/Badge/badgeRarity.js';
import {
  filterTreasuryBadges,
  getBadgeEarners,
  sortTreasuryBadges,
  TREASURY_SORT,
} from './badgeTreasuryModel.js';

const sampleBadges = [
  {
    id: 'badge-1',
    dbId: 1,
    position: 1,
    name: 'Brąz',
    rarity: BADGE_RARITY.common,
    storyDescription: '',
    didacticDescription: '',
    rewardAmount: 10,
    rewardEmoji: '🥕',
    isUnlocked: false,
  },
  {
    id: 'badge-2',
    dbId: 2,
    position: 2,
    name: 'Złoto',
    rarity: BADGE_RARITY.epic,
    storyDescription: '',
    didacticDescription: '',
    rewardAmount: 50,
    rewardEmoji: '🥕',
    isUnlocked: true,
  },
  {
    id: 'badge-3',
    dbId: 3,
    position: 3,
    name: 'Srebro',
    rarity: BADGE_RARITY.rare,
    storyDescription: '',
    didacticDescription: '',
    rewardAmount: 25,
    rewardEmoji: '🥕',
    isUnlocked: true,
  },
];

describe('badgeTreasuryModel', () => {
  it('sorts unlocked badges first and then by quality for students', () => {
    const sorted = sortTreasuryBadges(sampleBadges, TREASURY_SORT.unlockFirst);

    expect(sorted.map((badge) => badge.name)).toEqual(['Złoto', 'Srebro', 'Brąz']);
  });

  it('sorts by quality descending for lecturers', () => {
    const unlockedBadges = sampleBadges.map((badge) => ({ ...badge, isUnlocked: true }));
    const sorted = sortTreasuryBadges(unlockedBadges, TREASURY_SORT.qualityDesc);

    expect(sorted.map((badge) => badge.rarity)).toEqual([
      BADGE_RARITY.epic,
      BADGE_RARITY.rare,
      BADGE_RARITY.common,
    ]);
  });

  it('filters badges by search query and unlock status', () => {
    const filtered = filterTreasuryBadges(sampleBadges, {
      searchQuery: 'zł',
      unlockFilter: 'earned',
    });

    expect(filtered).toHaveLength(1);
    expect(filtered[0].name).toBe('Złoto');
  });

  it('excludes the current student from badge earners', () => {
    const earnersByBadgeId = new Map([
      [1, [
        { id: 'student-1', accountId: 1, nickname: 'Anna', avatarUrl: null, totalEarned: 100 },
        { id: 'student-2', accountId: 2, nickname: 'Bartek', avatarUrl: null, totalEarned: 80 },
      ]],
    ]);

    const earners = getBadgeEarners(earnersByBadgeId, 1, 1);

    expect(earners).toHaveLength(1);
    expect(earners[0].nickname).toBe('Bartek');
  });
});
