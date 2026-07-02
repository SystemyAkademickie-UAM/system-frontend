/** Helpers for the built-in "Dodatkowe życie" shop product. */

import { DEFAULT_LIVES_SYMBOL } from '../../constants/lives.constants.js';

export const EXTRA_LIFE_ITEM_NAME = 'Dodatkowe życie';

export const EXTRA_LIFE_ICON_EDIT_TOOLTIP = 'Ikona jest taka sama jak ikona systemu żyć. Aby ją zmienić, przejdź do Ustawienia grupy → System żyć.';

const EXTRA_LIFE_ICON_BACKGROUND = 'rgb(40, 40, 52)';

/**
 * Ikona kafelka „Dodatkowe życie” — zawsze emoji systemu żyć grupy.
 *
 * @param {string | null | undefined} livesSymbol
 * @returns {{ emoji: string, iconBackground: string, imageUrl: null }}
 */
export function resolveExtraLifeItemIcon(livesSymbol) {
  const emoji = typeof livesSymbol === 'string' && livesSymbol.trim().length > 0
    ? livesSymbol.trim()
    : DEFAULT_LIVES_SYMBOL;

  return {
    emoji,
    iconBackground: EXTRA_LIFE_ICON_BACKGROUND,
    imageUrl: null,
  };
}

/**
 * Czy student osiągnął limit żyć ustawiony przez prowadzącego.
 *
 * @param {number | null | undefined} studentLives
 * @param {number | null | undefined} livesMax
 * @returns {boolean}
 */
export function isExtraLifePurchaseAtLimit(studentLives, livesMax) {
  if (studentLives == null || livesMax == null) {
    return false;
  }

  const lives = Number(studentLives);
  const max = Number(livesMax);

  if (Number.isNaN(lives) || Number.isNaN(max)) {
    return false;
  }

  return lives >= max;
}

/**
 * @param {import('./shopItem.types.js').ShopItem} item
 * @param {{
 *   isLecturerView?: boolean,
 *   isShopOpen?: boolean,
 *   isGameOver?: boolean,
 *   isExtraLifeAtLimit?: boolean,
 * }} options
 * @returns {boolean}
 */
export function isShopItemPurchaseDisabled(item, {
  isLecturerView = false,
  isShopOpen = true,
  isGameOver = false,
  isExtraLifeAtLimit = false,
} = {}) {
  if (isLecturerView || !isShopOpen) {
    return true;
  }

  const outOfStock = item.stockQuantity != null && item.stockQuantity <= 0;

  if (item.isExtraLife) {
    return isExtraLifeAtLimit || outOfStock;
  }

  if (isGameOver) {
    return true;
  }

  return outOfStock || item.isLocked;
}

/**
 * @returns {import('./shopItem.types.js').ShopItem | null}
 */
export function findExtraLifeShopItem(items) {
  if (!Array.isArray(items)) {
    return null;
  }

  return items.find((item) => item.isExtraLife) ?? null;
}

/**
 * Usuwa produkt „Dodatkowe życie” z katalogu sklepu, gdy system żyć
 * lub możliwość kupowania w sklepie jest wyłączona.
 *
 * @param {import('./shopItem.types.js').ShopItem[]} items
 * @param {boolean} [showExtraLifeProduct=false]
 * @returns {import('./shopItem.types.js').ShopItem[]}
 */
export function filterCatalogShopItems(items, showExtraLifeProduct = false) {
  if (!Array.isArray(items)) {
    return [];
  }

  if (showExtraLifeProduct) {
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
