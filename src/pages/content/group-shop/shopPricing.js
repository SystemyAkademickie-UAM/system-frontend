/**
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number }} item
 * @returns {boolean}
 */
export function hasShopItemDiscount(item) {
  const base = item?.priceAmount ?? 0;
  const sale = item?.salePriceAmount;
  return typeof sale === 'number' && sale >= 0 && sale < base;
}

/**
 * Cena efektywna (po zniżce, jeśli aktywna).
 *
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number }} item
 * @returns {number}
 */
export function getShopItemEffectivePrice(item) {
  if (hasShopItemDiscount(item)) {
    return item.salePriceAmount;
  }
  return item?.priceAmount ?? 0;
}

/**
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number }} left
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number }} right
 * @returns {number}
 */
export function compareShopItemsByEffectivePrice(left, right) {
  return getShopItemEffectivePrice(left) - getShopItemEffectivePrice(right);
}
