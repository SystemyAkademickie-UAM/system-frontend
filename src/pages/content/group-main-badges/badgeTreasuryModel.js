import { BADGE_RARITY } from '../../../components/ui/Badge/badgeRarity.js';
import { DEFAULT_BADGE_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';

/** Kolejność rzadkości od najniższej do najwyższej. */
export const BADGE_RARITY_ORDER = {
  [BADGE_RARITY.common]: 0,
  [BADGE_RARITY.uncommon]: 1,
  [BADGE_RARITY.rare]: 2,
  [BADGE_RARITY.epic]: 3,
};

export const TREASURY_SORT = {
  unlockFirst: 'unlock-first',
  lockedFirst: 'locked-first',
  qualityDesc: 'quality-desc',
  qualityAsc: 'quality-asc',
  nameAsc: 'name-asc',
  nameDesc: 'name-desc',
  rewardDesc: 'reward-desc',
  rewardAsc: 'reward-asc',
};

export const LECTURER_SORT_OPTIONS = [
  { id: TREASURY_SORT.qualityDesc, label: 'Rzadkość (od najwyższej)' },
  { id: TREASURY_SORT.qualityAsc, label: 'Rzadkość (od najniższej)' },
  { id: TREASURY_SORT.nameAsc, label: 'Nazwa A–Z' },
  { id: TREASURY_SORT.nameDesc, label: 'Nazwa Z–A' },
  { id: TREASURY_SORT.rewardDesc, label: 'Nagroda malejąco' },
  { id: TREASURY_SORT.rewardAsc, label: 'Nagroda rosnąco' },
];

export const STUDENT_SORT_OPTIONS = [
  { id: TREASURY_SORT.unlockFirst, label: 'Odblokowane → zablokowane' },
  { id: TREASURY_SORT.lockedFirst, label: 'Zablokowane → odblokowane' },
  { id: TREASURY_SORT.qualityDesc, label: 'Rzadkość (od najwyższej)' },
  { id: TREASURY_SORT.qualityAsc, label: 'Rzadkość (od najniższej)' },
  { id: TREASURY_SORT.nameAsc, label: 'Nazwa A–Z' },
  { id: TREASURY_SORT.nameDesc, label: 'Nazwa Z–A' },
  { id: TREASURY_SORT.rewardDesc, label: 'Nagroda malejąco' },
  { id: TREASURY_SORT.rewardAsc, label: 'Nagroda rosnąco' },
];

/**
 * @typedef {Object} TreasuryBadge
 * @property {string} id
 * @property {number} dbId
 * @property {number} position
 * @property {string} name
 * @property {string} iconFile
 * @property {string} rarity
 * @property {string} storyDescription
 * @property {string} didacticDescription
 * @property {number} rewardAmount
 * @property {string} rewardEmoji
 * @property {boolean} isUnlocked
 * @property {boolean} isPublished
 */

/**
 * @typedef {Object} TreasuryStudent
 * @property {string} id
 * @property {number} accountId
 * @property {string} nickname
 * @property {string | null} avatarUrl
 * @property {number} totalEarned
 */

/**
 * @param {object} badge
 * @param {number} index
 * @param {Set<number>} [earnedBadgeIds]
 * @returns {TreasuryBadge}
 */
export function mapBadgeForTreasury(badge, index, earnedBadgeIds = null) {
  const dbId = badge.id;
  const isUnlocked = earnedBadgeIds ? earnedBadgeIds.has(dbId) : true;
  const icon = normalizeRankBadgeIcon(badge.icon, DEFAULT_BADGE_EMOJI);

  return {
    id: `badge-${dbId}`,
    dbId,
    position: index + 1,
    name: badge.name || 'Nieznana odznaka',
    icon,
    iconFile: icon,
    rarity: badge.rarity || BADGE_RARITY.common,
    storyDescription: badge.storyDescription || '',
    didacticDescription: badge.educationalDescription || '',
    rewardAmount: badge.rewardAmount ?? 0,
    isUnlocked,
    isPublished: badge.isPublished !== false,
  };
}

/**
 * @param {import('../../../services/students.api.js').StudentListItem} student
 * @returns {TreasuryStudent}
 */
export function mapStudentForTreasury(student) {
  return {
    id: `student-${student.accountId}`,
    accountId: student.accountId,
    nickname: student.nickname || `${student.name} ${student.surname}`.trim() || 'Student',
    avatarUrl: student.avatarUrl ?? null,
    totalEarned: student.totalEarned ?? 0,
  };
}

/**
 * @param {string | number} groupId
 * @param {import('../../../services/students.api.js').StudentListItem[]} students
 * @param {(groupId: string | number, accountId: number) => Promise<Array<{ id: number, isEarned: boolean }>>} fetchStudentBadges
 * @returns {Promise<Map<number, TreasuryStudent[]>>}
 */
export async function buildEarnersByBadgeId(groupId, students, fetchStudentBadges) {
  /** @type {Map<number, TreasuryStudent[]>} */
  const earnersByBadgeId = new Map();

  await Promise.all(students.map(async (student) => {
    const studentBadges = await fetchStudentBadges(groupId, student.accountId);
    const mappedStudent = mapStudentForTreasury(student);

    studentBadges
      .filter((badge) => badge.isEarned)
      .forEach((badge) => {
        const existing = earnersByBadgeId.get(badge.id) ?? [];
        earnersByBadgeId.set(badge.id, [...existing, mappedStudent]);
      });
  }));

  return earnersByBadgeId;
}

/**
 * @param {TreasuryBadge[]} badges
 * @param {{ searchQuery?: string, rarityFilter?: string, unlockFilter?: string }} filters
 * @returns {TreasuryBadge[]}
 */
export function filterTreasuryBadges(badges, {
  searchQuery = '',
  rarityFilter = 'all',
  unlockFilter = 'all',
} = {}) {
  const query = searchQuery.trim().toLowerCase();

  return badges.filter((badge) => {
    if (rarityFilter !== 'all' && badge.rarity !== rarityFilter) {
      return false;
    }

    if (unlockFilter === 'earned' && !badge.isUnlocked) {
      return false;
    }

    if (unlockFilter === 'unearned' && badge.isUnlocked) {
      return false;
    }

    if (query && !badge.name.toLowerCase().includes(query)) {
      return false;
    }

    return true;
  });
}

/**
 * @param {TreasuryBadge[]} badges
 * @param {string} sortBy
 * @returns {TreasuryBadge[]}
 */
export function sortTreasuryBadges(badges, sortBy) {
  const sorted = [...badges];

  switch (sortBy) {
    case TREASURY_SORT.unlockFirst:
      return sorted.sort((a, b) => {
        if (a.isUnlocked !== b.isUnlocked) {
          return a.isUnlocked ? -1 : 1;
        }
        const rarityDiff = (BADGE_RARITY_ORDER[b.rarity] ?? 0) - (BADGE_RARITY_ORDER[a.rarity] ?? 0);
        if (rarityDiff !== 0) {
          return rarityDiff;
        }
        return a.name.localeCompare(b.name, 'pl');
      });
    case TREASURY_SORT.lockedFirst:
      return sorted.sort((a, b) => {
        if (a.isUnlocked !== b.isUnlocked) {
          return a.isUnlocked ? 1 : -1;
        }
        const rarityDiff = (BADGE_RARITY_ORDER[b.rarity] ?? 0) - (BADGE_RARITY_ORDER[a.rarity] ?? 0);
        if (rarityDiff !== 0) {
          return rarityDiff;
        }
        return a.name.localeCompare(b.name, 'pl');
      });
    case TREASURY_SORT.qualityDesc:
      return sorted.sort((a, b) => {
        const diff = (BADGE_RARITY_ORDER[b.rarity] ?? 0) - (BADGE_RARITY_ORDER[a.rarity] ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pl');
      });
    case TREASURY_SORT.qualityAsc:
      return sorted.sort((a, b) => {
        const diff = (BADGE_RARITY_ORDER[a.rarity] ?? 0) - (BADGE_RARITY_ORDER[b.rarity] ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pl');
      });
    case TREASURY_SORT.nameAsc:
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    case TREASURY_SORT.nameDesc:
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'pl'));
    case TREASURY_SORT.rewardDesc:
      return sorted.sort((a, b) => {
        const diff = (b.rewardAmount ?? 0) - (a.rewardAmount ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pl');
      });
    case TREASURY_SORT.rewardAsc:
      return sorted.sort((a, b) => {
        const diff = (a.rewardAmount ?? 0) - (b.rewardAmount ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pl');
      });
    default:
      return sorted;
  }
}

/**
 * @param {Map<number, TreasuryStudent[]>} earnersByBadgeId
 * @param {number} badgeDbId
 * @param {number | null} [excludeAccountId]
 * @returns {TreasuryStudent[]}
 */
export function getBadgeEarners(earnersByBadgeId, badgeDbId, excludeAccountId = null) {
  const earners = earnersByBadgeId.get(badgeDbId) ?? [];

  if (excludeAccountId == null) {
    return earners;
  }

  return earners.filter((student) => student.accountId !== excludeAccountId);
}
