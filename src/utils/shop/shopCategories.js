/**
 * Buduje filtry kategorii sklepu na podstawie danych z API.
 *
 * @param {import('../../services/itemCategories.api.js').ItemCategory[]} categories
 */
export function buildShopCategoryFilters(categories = []) {
  return [
    { id: 'all', label: 'Wszystkie' },
    ...categories.map((category) => ({
      id: String(category.id),
      label: category.name,
      color: category.color ?? undefined,
    })),
  ];
}

/**
 * @param {string[]} categoryIds
 * @param {Map<string, import('../../services/itemCategories.api.js').ItemCategory>} [categoriesById]
 * @returns {string[]}
 */
export function resolveShopCategoryLabels(categoryIds = [], categoriesById = new Map()) {
  return categoryIds
    .map((id) => categoriesById.get(String(id))?.name ?? null)
    .filter(Boolean);
}

/**
 * @param {string[]} categoryIds
 * @param {Map<string, import('../../services/itemCategories.api.js').ItemCategory>} [categoriesById]
 * @returns {import('../../services/itemCategories.api.js').ItemCategory[]}
 */
export function resolveShopCategoryDetails(categoryIds = [], categoriesById = new Map()) {
  return categoryIds
    .map((id) => categoriesById.get(String(id)) ?? null)
    .filter(Boolean);
}

/**
 * @param {import('../../services/itemCategories.api.js').ItemCategory | undefined} category
 * @returns {string | undefined}
 */
export function getShopCategoryColor(category) {
  return category?.color ?? undefined;
}
