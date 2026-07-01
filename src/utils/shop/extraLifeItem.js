/** Helpers for the built-in "Dodatkowe życie" shop product. */

export const EXTRA_LIFE_ITEM_NAME = 'Dodatkowe życie';

/**
 * @param {import('./shopItem.types.js').ShopItem[]} items
 * @returns {import('./shopItem.types.js').ShopItem | null}
 */
export function findExtraLifeShopItem(items) {
  if (!Array.isArray(items)) {
    return null;
  }

  return items.find((item) => item.isExtraLife) ?? null;
}

/**
 * @param {import('./shopItem.types.js').ShopItem[]} items
 * @param {boolean} [isStudentView=false]
 * @returns {import('./shopItem.types.js').ShopItem[]}
 */
export function filterCatalogShopItems(items, isStudentView = false) {
  if (!Array.isArray(items)) {
    return [];
  }

  if (!isStudentView) {
    return items;
  }

  return items.filter((item) => !item.isExtraLife);
}

/**
 * @param {import('./shopItem.types.js').ShopItem[]} items
 * @returns {import('./shopItem.types.js').ShopItem[]}
 */
export function sortShopItemsWithExtraLifeFirst(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...items].sort((left, right) => {
    if (left.isExtraLife && !right.isExtraLife) {
      return -1;
    }
    if (!left.isExtraLife && right.isExtraLife) {
      return 1;
    }
    return 0;
  });
}
