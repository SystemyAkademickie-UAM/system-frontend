/** Stałe kategorie produktów sklepowych (docelowo konfigurowane przez prowadzącego). */

export const SHOP_CATEGORIES = [
  { id: 'exam-help', label: 'Pomoc w egzaminie' },
  { id: 'academic-bonus', label: 'Bonus akademicki' },
  { id: 'mood-boost', label: 'Na poprawę humoru' },
  { id: 'oknocraft', label: 'Oknocraft pamiętamy' },
];

export const SHOP_CATEGORY_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  ...SHOP_CATEGORIES,
];

/**
 * @param {string} categoryId
 * @returns {string | undefined}
 */
export function getShopCategoryLabel(categoryId) {
  return SHOP_CATEGORIES.find((category) => category.id === categoryId)?.label;
}

/**
 * @param {string[]} categoryIds
 * @returns {string[]}
 */
export function resolveShopCategoryLabels(categoryIds = []) {
  return categoryIds
    .map((id) => getShopCategoryLabel(id))
    .filter(Boolean);
}

/**
 * @param {number} [maxCount=4]
 * @returns {string[]}
 */
export function pickRandomShopCategoryIds(maxCount = 4) {
  const count = Math.floor(Math.random() * (maxCount + 1));
  const shuffled = [...SHOP_CATEGORIES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((category) => category.id);
}
