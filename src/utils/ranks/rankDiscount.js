/** Domyślna zniżka sklepowa nowej rangi (brak zniżki). */
export const DEFAULT_RANK_DISCOUNT = 0;

/**
 * Domyślna zniżka nowej rangi — zawsze 0 (bez automatycznego zwiększania).
 *
 * @param {Array<{ discount?: number | null }>} [_ranks]
 * @returns {number}
 */
export function calculateDefaultRankDiscount(_ranks = []) {
  return DEFAULT_RANK_DISCOUNT;
}

const RANKDISCOUNTLABEL__TEXTLABEL = {
  polish: 'Zniżka w sklepie: {}%',
  english: 'Shop discount: {}%'
};

/**
 * @param {number | null | undefined} discount
 * @param {string} [language]
 * @returns {string}
 */
export function formatRankDiscountLabel(discount, language) {
  const value = Number(discount ?? 0);
  const normalized = Number.isFinite(value) ? value : 0;
  const formatted = Number.isInteger(normalized) ? String(normalized) : normalized.toFixed(2).replace(/\.?0+$/, '');
  const lang = language ?? 'polish';
  return RANKDISCOUNTLABEL__TEXTLABEL[lang].replace('{}', formatted);
}

/**
 * @param {number | null | undefined} discount
 * @returns {boolean}
 */
export function hasRankShopDiscount(discount) {
  const value = Number(discount ?? 0);
  return Number.isFinite(value) && value > 0;
}
