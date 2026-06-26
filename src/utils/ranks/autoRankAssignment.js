/** Wartość opcji „Automatyczna” w modalu rangi. */
export const AUTO_RANK_OPTION = '__auto__';

/**
 * Domyślnie automatyczne przypisywanie jest włączone, dopóki backend nie zwróci `autoRankEnabled: false`.
 * @param {{ autoRankEnabled?: boolean } | null | undefined} member
 */
export function isAutoRankEnabled(member) {
  if (!member) return true;
  return member.autoRankEnabled !== false;
}

/**
 * Wylicza rangę na podstawie zgromadzonej waluty (totalEarned).
 * @param {Array<{ id: number, requiredPoints?: number }>} ranks
 * @param {number} totalEarned
 * @returns {number | null}
 */
export function resolveRankIdFromTotalEarned(ranks, totalEarned) {
  if (!Array.isArray(ranks) || ranks.length === 0) {
    return null;
  }

  const points = Number(totalEarned) || 0;
  const sorted = [...ranks].sort(
    (a, b) => (b.requiredPoints ?? 0) - (a.requiredPoints ?? 0),
  );

  const match = sorted.find((rank) => points >= (rank.requiredPoints ?? 0));
  return match?.id ?? null;
}

/**
 * @param {Array<{ id: number, requiredPoints?: number, name?: string }>} ranks
 * @param {number} totalEarned
 * @returns {string}
 */
export function resolveRankNameFromTotalEarned(ranks, totalEarned) {
  const rankId = resolveRankIdFromTotalEarned(ranks, totalEarned);
  if (rankId == null) {
    return 'Brak rangi';
  }
  return ranks.find((rank) => rank.id === rankId)?.name || 'Brak rangi';
}
