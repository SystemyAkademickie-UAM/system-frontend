/**
 * @file badgeTreasuryModel.js
 * @description Główny komponent widoku strony dla obszaru badgeTreasuryModel.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { BADGE_RARITY } from '../../../components/ui/Badge/badgeRarity.js';
import { DEFAULT_BADGE_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
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

const SORTQUALITYDESC__TEXTLABEL = {
  polish: 'Rzadkość (od najwyższej)',
  english: 'Quality (highest first)'
};

const SORTQUALITYASC__TEXTLABEL = {
  polish: 'Rzadkość (od najniższej)',
  english: 'Quality (lowest first)'
};

const SORTNAMEASC__TEXTLABEL = {
  polish: 'Nazwa A–Z',
  english: 'Name A–Z'
};

const SORTNAMEDESC__TEXTLABEL = {
  polish: 'Nazwa Z–A',
  english: 'Name Z–A'
};

const SORTREWARDDESC__TEXTLABEL = {
  polish: 'Nagroda malejąco',
  english: 'Reward descending'
};

const SORTREWARDASC__TEXTLABEL = {
  polish: 'Nagroda rosnąco',
  english: 'Reward ascending'
};

const SORTUNLOCKFIRST__TEXTLABEL = {
  polish: 'Odblokowane → zablokowane',
  english: 'Unlocked → locked'
};

const SORTLOCKEDFIRST__TEXTLABEL = {
  polish: 'Zablokowane → odblokowane',
  english: 'Locked → unlocked'
};

/**
 * @param {string} [language]
 * @returns {Array<{id: string, label: string}>}
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export function getLecturerSortOptions(language) {
  const lang = language ?? READLANGUAGECOOKIE();
  return [
    { id: TREASURY_SORT.qualityDesc, label: lang === 'polish' ? SORTQUALITYDESC__TEXTLABEL.polish : SORTQUALITYDESC__TEXTLABEL.english },
    { id: TREASURY_SORT.qualityAsc, label: lang === 'polish' ? SORTQUALITYASC__TEXTLABEL.polish : SORTQUALITYASC__TEXTLABEL.english },
    { id: TREASURY_SORT.nameAsc, label: lang === 'polish' ? SORTNAMEASC__TEXTLABEL.polish : SORTNAMEASC__TEXTLABEL.english },
    { id: TREASURY_SORT.nameDesc, label: lang === 'polish' ? SORTNAMEDESC__TEXTLABEL.polish : SORTNAMEDESC__TEXTLABEL.english },
    { id: TREASURY_SORT.rewardDesc, label: lang === 'polish' ? SORTREWARDDESC__TEXTLABEL.polish : SORTREWARDDESC__TEXTLABEL.english },
    { id: TREASURY_SORT.rewardAsc, label: lang === 'polish' ? SORTREWARDASC__TEXTLABEL.polish : SORTREWARDASC__TEXTLABEL.english },
  ];
}

/**
 * @param {string} [language]
 * @returns {Array<{id: string, label: string}>}
 */
export function getStudentSortOptions(language) {
  const lang = language ?? READLANGUAGECOOKIE();
  return [
    { id: TREASURY_SORT.unlockFirst, label: lang === 'polish' ? SORTUNLOCKFIRST__TEXTLABEL.polish : SORTUNLOCKFIRST__TEXTLABEL.english },
    { id: TREASURY_SORT.lockedFirst, label: lang === 'polish' ? SORTLOCKEDFIRST__TEXTLABEL.polish : SORTLOCKEDFIRST__TEXTLABEL.english },
    { id: TREASURY_SORT.qualityDesc, label: lang === 'polish' ? SORTQUALITYDESC__TEXTLABEL.polish : SORTQUALITYDESC__TEXTLABEL.english },
    { id: TREASURY_SORT.qualityAsc, label: lang === 'polish' ? SORTQUALITYASC__TEXTLABEL.polish : SORTQUALITYASC__TEXTLABEL.english },
    { id: TREASURY_SORT.nameAsc, label: lang === 'polish' ? SORTNAMEASC__TEXTLABEL.polish : SORTNAMEASC__TEXTLABEL.english },
    { id: TREASURY_SORT.nameDesc, label: lang === 'polish' ? SORTNAMEDESC__TEXTLABEL.polish : SORTNAMEDESC__TEXTLABEL.english },
    { id: TREASURY_SORT.rewardDesc, label: lang === 'polish' ? SORTREWARDDESC__TEXTLABEL.polish : SORTREWARDDESC__TEXTLABEL.english },
    { id: TREASURY_SORT.rewardAsc, label: lang === 'polish' ? SORTREWARDASC__TEXTLABEL.polish : SORTREWARDASC__TEXTLABEL.english },
  ];
}

export const LECTURER_SORT_OPTIONS = getLecturerSortOptions();

export const STUDENT_SORT_OPTIONS = getStudentSortOptions();

/**
 * @typedef {Object} TreasuryBadge
 * @property {string} id
 * @property {number} dbId
 * @property {number} position
 * @property {string} name
 * @property {string | null} iconFile
 * @property {string} rarity
 * @property {string} storyDescription
 * @property {string} didacticDescription
 * @property {number | null} rewardAmount
 * @property {string} [rewardEmoji]
 * @property {boolean} isUnlocked
 * @property {boolean} isPublished
 * @property {boolean} isSecret
 * @property {boolean} isRevealed
 * @property {boolean} isSecretHidden
 */

/**
 * @typedef {Object} TreasuryStudent
 * @property {string} id
 * @property {number} accountId
 * @property {number} [position]
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
  const isSecret = badge.isSecret === true;
  const isRevealed = badge.isRevealed === false
    ? false
    : (earnedBadgeIds ? (!isSecret || isUnlocked) : true);
  const isSecretHidden = isSecret && !isRevealed;
  const icon = isSecretHidden ? null : normalizeRankBadgeIcon(badge.icon, DEFAULT_BADGE_EMOJI);

  return {
    id: `badge-${dbId}`,
    dbId,
    position: index + 1,
    name: isSecretHidden ? '' : (badge.name || 'Nieznana odznaka'),
    icon,
    iconFile: icon,
    rarity: badge.rarity || BADGE_RARITY.common,
    storyDescription: isSecretHidden ? '' : (badge.storyDescription || ''),
    didacticDescription: isSecretHidden ? '' : (badge.educationalDescription || ''),
    rewardAmount: isSecretHidden ? null : (badge.rewardAmount ?? 0),
    isUnlocked,
    isPublished: badge.isPublished !== false,
    isSecret,
    isRevealed,
    isSecretHidden,
  };
}

/**
 * @param {import('../../../services/students.api.js').StudentListItem} student
 * @param {number} [index]
 * @returns {TreasuryStudent}
 */
export function mapStudentForTreasury(student, index) {
  const position = student.position ?? (typeof index === 'number' ? index + 1 : undefined);
  return {
    id: `student-${student.accountId}`,
    accountId: student.accountId,
    position,
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

  await Promise.all(students.map(async (student, index) => {
    const studentBadges = await fetchStudentBadges(groupId, student.accountId);
    const mappedStudent = mapStudentForTreasury(student, index);

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

    if (query) {
      if (badge.isSecretHidden) {
        return false;
      }
      if (!(badge.name ?? '').toLowerCase().includes(query)) {
        return false;
      }
    }

    return true;
  });
}

function compareBadgeNames(a, b, direction = 'asc') {
  const aHidden = a.isSecretHidden === true;
  const bHidden = b.isSecretHidden === true;
  if (aHidden !== bHidden) {
    return aHidden ? 1 : -1;
  }
  if (aHidden && bHidden) {
    const rarityDiff = (BADGE_RARITY_ORDER[b.rarity] ?? 0) - (BADGE_RARITY_ORDER[a.rarity] ?? 0);
    return rarityDiff !== 0 ? rarityDiff : (a.dbId ?? 0) - (b.dbId ?? 0);
  }
  return direction === 'desc'
    ? (b.name ?? '').localeCompare(a.name ?? '', 'pl')
    : (a.name ?? '').localeCompare(b.name ?? '', 'pl');
}

function compareRewardValues(a, b, direction) {
  const aHidden = a.isSecretHidden || a.rewardAmount == null;
  const bHidden = b.isSecretHidden || b.rewardAmount == null;
  if (aHidden !== bHidden) {
    return aHidden ? 1 : -1;
  }
  if (aHidden && bHidden) {
    return (BADGE_RARITY_ORDER[b.rarity] ?? 0) - (BADGE_RARITY_ORDER[a.rarity] ?? 0);
  }
  const diff = direction === 'desc'
    ? (b.rewardAmount ?? 0) - (a.rewardAmount ?? 0)
    : (a.rewardAmount ?? 0) - (b.rewardAmount ?? 0);
  return diff !== 0 ? diff : compareBadgeNames(a, b);
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
        return compareBadgeNames(a, b);
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
        return compareBadgeNames(a, b);
      });
    case TREASURY_SORT.qualityDesc:
      return sorted.sort((a, b) => {
        const diff = (BADGE_RARITY_ORDER[b.rarity] ?? 0) - (BADGE_RARITY_ORDER[a.rarity] ?? 0);
        return diff !== 0 ? diff : compareBadgeNames(a, b);
      });
    case TREASURY_SORT.qualityAsc:
      return sorted.sort((a, b) => {
        const diff = (BADGE_RARITY_ORDER[a.rarity] ?? 0) - (BADGE_RARITY_ORDER[b.rarity] ?? 0);
        return diff !== 0 ? diff : compareBadgeNames(a, b);
      });
    case TREASURY_SORT.nameAsc:
      return sorted.sort((a, b) => compareBadgeNames(a, b, 'asc'));
    case TREASURY_SORT.nameDesc:
      return sorted.sort((a, b) => compareBadgeNames(a, b, 'desc'));
    case TREASURY_SORT.rewardDesc:
      return sorted.sort((a, b) => compareRewardValues(a, b, 'desc'));
    case TREASURY_SORT.rewardAsc:
      return sorted.sort((a, b) => compareRewardValues(a, b, 'asc'));
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

// === RENDEROWANIE WIDOKU ===
  return earners.filter((student) => student.accountId !== excludeAccountId);
}
