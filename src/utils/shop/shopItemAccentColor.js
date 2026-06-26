import { getProductCardColorVars } from './shopCategoryColors.js';

/**
 * @deprecated Użyj getProductCardColorVars — zachowane dla kompatybilności importów.
 * @param {Array<{ color?: string | null }>} categories
 * @returns {Record<string, string>}
 */
export function getShopItemAccentColor(categories = []) {
  return getProductCardColorVars(categories);
}
