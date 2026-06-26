/**
 * Wykrywanie awansu rangi po aktualizacji punktów uczestnika.
 * Backend przypisuje rangę; UI tylko porównuje stan przed/po.
 */

/**
 * @param {Array<{ id: number, requiredPoints?: number }>} ranks
 * @param {number | null | undefined} rankId
 */
export function getRankRequiredPoints(ranks, rankId) {
  if (rankId == null) return -1;
  return ranks.find((rank) => rank.id === rankId)?.requiredPoints ?? -1;
}

/**
 * @param {Array<{ id: number, requiredPoints?: number }>} ranks
 * @param {number | null | undefined} previousRankId
 * @param {number | null | undefined} nextRankId
 */
export function isRankPromotion(ranks, previousRankId, nextRankId) {
  if (nextRankId == null) return false;
  return getRankRequiredPoints(ranks, nextRankId) > getRankRequiredPoints(ranks, previousRankId);
}

/**
 * @param {Array<{ id: number, requiredPoints?: number }>} ranks
 * @param {{ rankId?: number | null }} member
 * @param {{ rankId?: number | null, rank?: string } | null | undefined} nextMember
 * @returns {string | null} Nazwa nowej rangi lub null
 */
export function detectRankPromotion(ranks, member, nextMember) {
  if (!nextMember || !isRankPromotion(ranks, member.rankId, nextMember.rankId)) {
    return null;
  }
  return nextMember.rank ?? null;
}
