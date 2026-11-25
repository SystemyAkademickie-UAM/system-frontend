/**
 * @file badgeTreasuryModel.test.js
 * @description Zestaw testów jednostkowych weryfikujących funkcjonalność badgeTreasuryModel.
 */

// === IMPORTY I ŚRODOWISKO TESTOWE ===
import { describe, expect, it } from 'vitest';
import { BADGE_RARITY } from '../../../components/ui/Badge/badgeRarity.js';
import {
  buildEarnersByBadgeId,
  filterTreasuryBadges,
  getBadgeEarners,
  mapBadgeForTreasury,
  mapStudentForTreasury,
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

// === SCENARIUSZE TESTOWE (SUITE) ===
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

  it('preserves student position when mapping for treasury and earners', async () => {
    const student = { accountId: 5, nickname: 'Tomek', totalEarned: 50 };
    const mapped = mapStudentForTreasury(student, 0);
    expect(mapped.position).toBe(1);

    const earnersMap = await buildEarnersByBadgeId('100001', [student], async () => [{ id: 10, isEarned: true }]);
    expect(earnersMap.get(10)[0].position).toBe(1);
  });

  it('maps an unrevealed secret badge keeping rarity colour and hiding details', () => {
    const mapped = mapBadgeForTreasury(
      {
        id: 77,
        name: null,
        icon: null,
        rarity: BADGE_RARITY.rare,
        storyDescription: null,
        educationalDescription: null,
        rewardAmount: null,
        isPublished: true,
        isSecret: true,
        isRevealed: false,
      },
      0,
      new Set(),
    );

    expect(mapped).toMatchObject({
      dbId: 77,
      name: '',
      icon: null,
      iconFile: null,
      rarity: BADGE_RARITY.rare,
      storyDescription: '',
      didacticDescription: '',
      rewardAmount: null,
      isUnlocked: false,
      isSecret: true,
      isRevealed: false,
      isSecretHidden: true,
    });
  });

  it('keeps unrevealed secret badges filterable by rarity, excluded from text search, and sorted last by reward', () => {
    const secretBadge = mapBadgeForTreasury(
      {
        id: 88,
        name: null,
        icon: null,
        rarity: BADGE_RARITY.epic,
        rewardAmount: null,
        isSecret: true,
        isRevealed: false,
      },
      3,
      new Set(),
    );
    const allBadges = [...sampleBadges, secretBadge];

    expect(filterTreasuryBadges(allBadges, { rarityFilter: BADGE_RARITY.epic }).map((b) => b.dbId)).toEqual([2, 88]);
    expect(filterTreasuryBadges(allBadges, { searchQuery: 'złoto' }).map((b) => b.dbId)).toEqual([2]);
    expect(filterTreasuryBadges(allBadges, { unlockFilter: 'earned' }).map((b) => b.dbId)).toEqual([2, 3]);
    expect(filterTreasuryBadges(allBadges, { unlockFilter: 'unearned' }).map((b) => b.dbId)).toEqual([1, 88]);
    expect(sortTreasuryBadges(allBadges, TREASURY_SORT.nameAsc).at(-1).dbId).toBe(88);
    expect(sortTreasuryBadges(allBadges, TREASURY_SORT.nameDesc).at(-1).dbId).toBe(88);
    expect(sortTreasuryBadges(allBadges, TREASURY_SORT.rewardDesc).at(-1).dbId).toBe(88);
    expect(sortTreasuryBadges(allBadges, TREASURY_SORT.rewardAsc).at(-1).dbId).toBe(88);
  });

  it('fails closed in student view when isRevealed is omitted for an unearned secret badge and reveals once earned', () => {
    const rawSecret = {
      id: 91,
      name: 'Wyciekająca nazwa',
      icon: '🦉',
      rarity: BADGE_RARITY.epic,
      storyDescription: 'Sekret',
      educationalDescription: 'Opis',
      rewardAmount: 100,
      isPublished: true,
      isSecret: true,
    };

    const unearned = mapBadgeForTreasury(rawSecret, 0, new Set());
    expect(unearned).toMatchObject({
      name: '',
      icon: null,
      rewardAmount: null,
      rarity: BADGE_RARITY.epic,
      isUnlocked: false,
      isRevealed: false,
      isSecretHidden: true,
    });

    const earned = mapBadgeForTreasury({ ...rawSecret, isRevealed: true }, 0, new Set([91]));
    expect(earned).toMatchObject({
      name: 'Wyciekająca nazwa',
      icon: '🦉',
      rewardAmount: 100,
      isUnlocked: true,
      isRevealed: true,
      isSecretHidden: false,
    });
  });
});
