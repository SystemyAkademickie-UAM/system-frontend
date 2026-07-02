import { getRankGradientColor, RANK_LOCKED_COLOR } from '../../../utils/rankGradient.js';
import { DEFAULT_RANK_EMOJI, normalizeRankBadgeIcon } from '../../../utils/ranks/rankBadgeIcon.js';

/**
 * @typedef {Object} RankPathRank
 * @property {string} id
 * @property {number} dbId
 * @property {number} position
 * @property {string} name
 * @property {string} iconFile
 * @property {number} costAmount
 * @property {string} costEmoji
 * @property {string} storyDescription
 * @property {string[]} shopItems
 * @property {number} storeDiscount
 * @property {number} discount
 * @property {string} accentColor
 * @property {boolean} isUnlocked
 */

/**
 * @typedef {Object} RankPathStudent
 * @property {string} id
 * @property {number} accountId
 * @property {string} nickname
 * @property {string | null} avatarUrl
 * @property {number} totalEarned
 * @property {number | null} dbRankId
 * @property {string | null} rankId
 */

/**
 * @param {object} rank
 * @returns {number}
 */
export function mapRankDiscountValue(rank) {
  if (rank.globalDiscountType === 'percent') {
    return Number(rank.globalDiscountValue ?? 0);
  }
  if (rank.globalDiscountType === 'fixed') {
    return Number(rank.globalDiscountValue ?? 0);
  }
  return Number(rank.discount ?? 0);
}

/**
 * @param {object} rank
 * @param {number} index
 * @returns {Omit<RankPathRank, 'accentColor' | 'isUnlocked'>}
 */
export function mapRankForPath(rank, index) {
  const icon = normalizeRankBadgeIcon(rank.icon, DEFAULT_RANK_EMOJI);
  return {
    id: `rank-${rank.id}`,
    dbId: rank.id,
    position: index + 1,
    name: rank.name || 'Nieznana ranga',
    icon,
    iconFile: icon,
    costAmount: rank.requiredPoints ?? 0,
    storyDescription: rank.storyDescription || '',
    shopItems: rank.uniqueStoreItems || [],
    storeDiscount: rank.globalDiscountValue ?? rank.storeDiscount ?? 0,
    discount: mapRankDiscountValue(rank),
  };
}

/**
 * @param {Array<{ id: number, requiredPoints?: number }>} ranks
 * @returns {ReturnType<typeof mapRankForPath>[]}
 */
export function sortAndMapRanks(ranks) {
  const sorted = [...ranks].sort((a, b) => (a.requiredPoints ?? 0) - (b.requiredPoints ?? 0));
  return sorted.map(mapRankForPath);
}

/**
 * @param {ReturnType<typeof mapRankForPath>[]} ranks
 * @param {number} totalEarned
 * @returns {ReturnType<typeof mapRankForPath>[]}
 */
export function applyRankPathColors(ranks, totalEarned = Number.POSITIVE_INFINITY) {
  const total = ranks.length;

  return ranks.map((rank, index) => ({
    ...rank,
    accentColor: getRankGradientColor(index, total),
    isUnlocked: totalEarned >= rank.costAmount,
  }));
}

/**
 * @param {ReturnType<typeof mapRankForPath>[]} ranks
 * @param {number} totalEarned
 * @returns {ReturnType<typeof mapRankForPath>[]}
 */
export function applyStudentRankStates(ranks, totalEarned) {
  return applyRankPathColors(ranks, totalEarned).map((rank) => ({
    ...rank,
    accentColor: rank.isUnlocked ? rank.accentColor : RANK_LOCKED_COLOR,
  }));
}

/**
 * @param {ReturnType<typeof mapRankForPath>[]} ranks
 * @param {number | null | undefined} assignedRankDbId
 * @returns {ReturnType<typeof mapRankForPath>[]}
 */
export function applyManualStudentRankStates(ranks, assignedRankDbId) {
  const assignedIndex = ranks.findIndex((rank) => rank.dbId === assignedRankDbId);
  const total = ranks.length;

  return ranks.map((rank, index) => {
    const accentColor = getRankGradientColor(index, total);
    const isUnlocked = assignedIndex >= 0 && index <= assignedIndex;

    return {
      ...rank,
      accentColor: isUnlocked ? accentColor : RANK_LOCKED_COLOR,
      isUnlocked,
    };
  });
}

/**
 * @param {number[]} rowCenters
 * @param {ReturnType<typeof mapRankForPath>[]} ranks
 * @param {number | null | undefined} assignedRankDbId
 * @returns {number}
 */
export function getStudentManualRankProgressPx(rowCenters, ranks, assignedRankDbId) {
  if (rowCenters.length === 0) {
    return 0;
  }

  const assignedIndex = ranks.findIndex((rank) => rank.dbId === assignedRankDbId);
  if (assignedIndex < 0) {
    return rowCenters[0];
  }

  return rowCenters[assignedIndex];
}

/**
 * Pozycja studenta na osi w pikselach (względem górnej krawędzi listy rang).
 * Wartość wyrównana do kropek progów rang — przy koszcie rangi awatar ląduje na kropce.
 *
 * @param {number[]} rowCenters
 * @param {ReturnType<typeof mapRankForPath>[]} ranks
 * @param {number} totalEarned
 * @returns {number}
 */
export function getStudentProgressPx(rowCenters, ranks, totalEarned) {
  if (rowCenters.length === 0) {
    return 0;
  }

  if (rowCenters.length === 1 || ranks.length <= 1) {
    return rowCenters[0];
  }

  const earned = Math.max(0, totalEarned);
  const firstCost = ranks[0]?.costAmount ?? 0;

  if (earned <= firstCost) {
    return rowCenters[0];
  }

  for (let index = 0; index < ranks.length - 1; index += 1) {
    const endCost = ranks[index + 1].costAmount;

    if (earned === endCost) {
      return rowCenters[index + 1];
    }

    if (earned < endCost) {
      const startCost = ranks[index].costAmount;
      const span = endCost - startCost;
      const localRatio = span <= 0 ? 0 : (earned - startCost) / span;
      return rowCenters[index] + localRatio * (rowCenters[index + 1] - rowCenters[index]);
    }
  }

  return rowCenters[rowCenters.length - 1];
}

/**
 * Pozycja studenta na osi (0 = góra, 1 = dół) wg zgromadzonej waluty.
 * @deprecated Preferuj {@link getStudentProgressPx} z pomiarem rowCenters.
 *
 * @param {ReturnType<typeof mapRankForPath>[]} ranks posortowane rosnąco po koszcie
 * @param {number} totalEarned
 * @returns {number}
 */
export function getStudentProgressRatio(ranks, totalEarned) {
  if (ranks.length === 0) {
    return 0;
  }

  if (ranks.length === 1) {
    return 0;
  }

  const earned = Math.max(0, totalEarned);
  const segmentCount = ranks.length - 1;

  for (let index = 0; index < segmentCount; index += 1) {
    const current = ranks[index];
    const next = ranks[index + 1];
    const startCost = current.costAmount;
    const endCost = next.costAmount;

    if (earned < endCost) {
      const span = endCost - startCost;
      const localRatio = span <= 0 ? 0 : (earned - startCost) / span;
      const segmentStart = index / segmentCount;
      const segmentSize = 1 / segmentCount;
      return segmentStart + localRatio * segmentSize;
    }
  }

  return 1;
}

/**
 * @param {ReturnType<typeof mapRankForPath>[]} ranks
 * @param {RankPathStudent[]} students
 * @returns {Map<string, RankPathStudent[]>}
 */
export function groupStudentsByRank(ranks, students) {
  const byRank = new Map(ranks.map((rank) => [rank.id, []]));

  students.forEach((student) => {
    if (!student.rankId || !byRank.has(student.rankId)) {
      return;
    }
    byRank.get(student.rankId).push(student);
  });

  return byRank;
}

/**
 * @param {import('../../../services/students.api.js').StudentListItem} student
 * @param {ReturnType<typeof mapRankForPath>[]} ranks
 * @returns {RankPathStudent}
 */
export function mapStudentForRankPath(student, ranks) {
  const matchedRank = ranks.find((rank) => rank.dbId === student.rankId);
  return {
    id: `student-${student.accountId}`,
    accountId: student.accountId,
    nickname: (student.nickname || `${student.name} ${student.surname}`.trim() || 'Student').trim(),
    avatarUrl: student.avatarUrl ?? null,
    totalEarned: student.totalEarned ?? 0,
    dbRankId: student.rankId ?? null,
    rankId: matchedRank?.id ?? null,
  };
}
