/**
 * Domyślna zniżka nowej rangi: 5% + zniżka rangi z najwyższą wartością procentową.
 *
 * @param {Array<{ discount?: number | null }>} ranks
 * @returns {number}
 */
export function calculateDefaultRankDiscount(ranks = []) {
  const highestDiscount = ranks.reduce((max, rank) => {
    const value = Number(rank.discount ?? 0);
    if (!Number.isFinite(value)) {
      return max;
    }
    return Math.max(max, value);
  }, 0);

  return 5 + highestDiscount;
}

/**
 * @param {number | null | undefined} discount
 * @returns {string}
 */
export function formatRankDiscountLabel(discount) {
  const value = Number(discount ?? 0);
  const normalized = Number.isFinite(value) ? value : 0;
  const formatted = Number.isInteger(normalized) ? String(normalized) : normalized.toFixed(2).replace(/\.?0+$/, '');
  return `Zniżka w sklepie: ${formatted}%`;
}
