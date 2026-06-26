/**
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number, rankDiscountedPrice?: number }} item
 * @returns {boolean}
 */
export function hasShopItemDiscount(item) {
  const display = getShopItemPriceDisplay(item);
  return display.mode === 'badge' || display.mode === 'rank';
}

/**
 * Cena efektywna (po wszystkich zniżkach).
 *
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number, rankDiscountedPrice?: number }} item
 * @returns {number}
 */
export function getShopItemEffectivePrice(item) {
  const display = getShopItemPriceDisplay(item);
  return display.displayPrice;
}

/**
 * @typedef {'none' | 'rank' | 'badge'} ShopItemPriceDisplayMode
 */

/**
 * @typedef {Object} ShopItemPriceDisplay
 * @property {ShopItemPriceDisplayMode} mode
 * @property {number} displayPrice — cena widoczna dla studenta
 * @property {number} [strikePrice] — przekreślana cena (przed zniżką odznak)
 * @property {number} [tooltipBasePrice] — katalogowa cena bazowa (tooltip przy zniżce rangi)
 */

/**
 * Zniżka rangi wyświetla się jako zwykła cena (z tooltipem katalogowym).
 * Zniżka odznak — przekreślona cena przed odznaką + złoty kafelek z ceną końcową.
 *
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number, rankDiscountedPrice?: number }} item
 * @returns {ShopItemPriceDisplay}
 */
export function getShopItemPriceDisplay(item) {
  const catalogBase = Number(item?.priceAmount ?? 0);
  const rankPrice = item?.rankDiscountedPrice != null
    ? Number(item.rankDiscountedPrice)
    : catalogBase;
  const finalPrice = item?.salePriceAmount != null
    ? Number(item.salePriceAmount)
    : rankPrice;

  const hasBadgeDiscount = finalPrice < rankPrice;
  const hasRankDiscount = rankPrice < catalogBase;

  if (hasBadgeDiscount) {
    return {
      mode: 'badge',
      displayPrice: finalPrice,
      strikePrice: rankPrice,
      tooltipBasePrice: catalogBase,
    };
  }

  if (hasRankDiscount) {
    return {
      mode: 'rank',
      displayPrice: finalPrice,
      tooltipBasePrice: catalogBase,
    };
  }

  return {
    mode: 'none',
    displayPrice: catalogBase,
  };
}

/**
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number }} left
 * @param {import('./shopItem.types.js').ShopItem | { priceAmount?: number, salePriceAmount?: number }} right
 * @returns {number}
 */
export function compareShopItemsByEffectivePrice(left, right) {
  return getShopItemEffectivePrice(left) - getShopItemEffectivePrice(right);
}
